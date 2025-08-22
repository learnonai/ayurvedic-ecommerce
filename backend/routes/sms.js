const express = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Send OTP to phone
router.post('/send-otp', async (req, res) => {
  try {
    const { phone } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // For demo - log to console
    console.log('\n=================================');
    console.log('📱 SMS OTP VERIFICATION');
    console.log('=================================');
    console.log(`Phone: ${phone}`);
    console.log(`OTP: ${otp}`);
    console.log('=================================\n');
    
    // For production - use Twilio:
    /*
    const twilio = require('twilio');
    const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);
    
    await client.messages.create({
      body: `Your Herbal Store OTP: ${otp}`,
      from: process.env.TWILIO_PHONE,
      to: `+91${phone}`
    });
    */
    
    // Store OTP temporarily
    global.phoneOTPs = global.phoneOTPs || {};
    global.phoneOTPs[phone] = {
      otp,
      expiry: new Date(Date.now() + 5 * 60 * 1000)
    };
    
    res.json({ message: 'OTP sent successfully', phone });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Verify OTP and login
router.post('/verify-otp', async (req, res) => {
  try {
    const { phone, otp } = req.body;
    
    const storedOTP = global.phoneOTPs?.[phone];
    if (!storedOTP || storedOTP.otp !== otp || new Date() > storedOTP.expiry) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }
    
    // Find or create user
    let user = User.findOne({ phone });
    if (!user) {
      user = await User.create({
        name: `User ${phone.slice(-4)}`,
        phone,
        email: `${phone}@phone.user`,
        password: 'phone_login',
        role: 'user',
        isVerified: true
      });
    }
    
    delete global.phoneOTPs[phone];
    
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret');
    res.json({ 
      token, 
      user: { id: user._id, name: user.name, phone, role: user.role, isVerified: true }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;