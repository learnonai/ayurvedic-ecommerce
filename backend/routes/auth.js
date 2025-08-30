const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendVerificationEmail } = require('../utils/email');
const { validateRegistration, validateLogin, handleValidationErrors } = require('../utils/validation');
const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password required' });
    }
    
    const existingUser = User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const user = await User.create({ name, email, password, phone, role: 'user' });
    
    // Send verification email
    await sendVerificationEmail(email, user.verificationCode, name);

    const token = jwt.sign({ id: user._id }, 'secret');
    res.status(201).json({ 
      token, 
      user: { id: user._id, name, email, phone, role: user.role, isVerified: user.isVerified },
      message: `Registration successful! For demo purposes, your verification code is: ${user.verificationCode}. In production, this would be sent to your email.`
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Verify Email
router.post('/verify-email', async (req, res) => {
  try {
    const { email, code } = req.body;
    const user = User.findOne({ email });
    
    if (!user || user.verificationCode !== code) {
      return res.status(400).json({ message: 'Invalid verification code' });
    }
    
    if (new Date() > new Date(user.verificationExpiry)) {
      return res.status(400).json({ message: 'Verification code expired' });
    }
    
    User.verifyUser(user._id);
    res.json({ message: 'Email verified successfully!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    console.log('Login request body:', req.body);
    const { email, password } = req.body;
    
    if (!email || !password) {
      console.log('Missing email or password');
      return res.status(400).json({ message: 'Email and password are required' });
    }
    
    // Hardcoded admin check
    if (email === 'admin@ayurveda.com' && password === 'admin123') {
      const token = jwt.sign({ id: 'admin1' }, 'secret');
      return res.json({ 
        token, 
        user: { id: 'admin1', name: 'Admin User', email, phone: '9876543210', role: 'admin', isVerified: true }
      });
    }
    
    // Hardcoded test user check
    if (email === 'test@example.com' && password === 'password123') {
      const token = jwt.sign({ id: 'user1' }, 'secret');
      return res.json({ 
        token, 
        user: { id: 'user1', name: 'Test User', email, phone: '9999999999', role: 'user', isVerified: true }
      });
    }
    
    // Check database users
    console.log('Checking database for user:', email);
    const user = User.findOne({ email });
    if (!user) {
      console.log('User not found in database');
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    const isValidPassword = await User.comparePassword(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ id: user._id }, 'secret');
    res.json({ 
      token, 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        phone: user.phone,
        role: user.role, 
        isVerified: user.isVerified,
        originalPassword: user.originalPassword // Include original password for sharing
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;