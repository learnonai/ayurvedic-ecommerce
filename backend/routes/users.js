const express = require('express');
const User = require('../models/User');
const { auth, adminAuth } = require('../middleware/auth');
const router = express.Router();

// Get all users (admin only)
router.get('/', auth, adminAuth, async (req, res) => {
  try {
    const users = User.find({});
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Verify user (admin only)
router.put('/:id/verify', auth, adminAuth, async (req, res) => {
  try {
    const user = User.verifyUser(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User verified successfully', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update user role (admin only)
router.put('/:id/role', auth, adminAuth, async (req, res) => {
  try {
    const { role } = req.body;
    const user = User.findByIdAndUpdate(req.params.id, { role });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User role updated', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;