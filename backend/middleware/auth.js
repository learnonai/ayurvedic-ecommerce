const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'Access denied' });

    const decoded = jwt.verify(token, 'secret');
    // For demo - create mock user
    req.user = {
      _id: decoded.id,
      role: decoded.id === 'admin1' ? 'admin' : 'user'
    };
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

const adminAuth = (req, res, next) => {
  // For demo - allow all authenticated users as admin
  next();
};

module.exports = { auth, adminAuth };