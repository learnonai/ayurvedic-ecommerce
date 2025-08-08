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
      user: { id: user._id, name, email, role: user.role, isVerified: user.isVerified },
      message: 'Registration successful! Check console for verification code.'
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
    const { email, password } = req.body;
    
    // Simple hardcoded check for demo
    if (email === 'admin@ayurveda.com' && password === 'admin123') {
      const token = jwt.sign({ id: 'admin1' }, 'secret');
      return res.json({ 
        token, 
        user: { id: 'admin1', name: 'Admin User', email, role: 'admin', isVerified: true }
      });
    }
    
    if (email === 'test@example.com' && password === 'password123') {
      const token = jwt.sign({ id: 'user1' }, 'secret');
      return res.json({ 
        token, 
        user: { id: 'user1', name: 'Test User', email, role: 'user', isVerified: true }
      });
    }
    
    res.status(400).json({ message: 'Invalid credentials' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;