const express = require('express');
const Order = require('../models/Order');
const { auth, adminAuth } = require('../middleware/auth');
const router = express.Router();

// Create order
router.post('/', auth, async (req, res) => {
  try {
    const order = Order.create({ ...req.body, user: req.user._id });
    res.status(201).json({
      success: true,
      order: order,
      message: 'Order created successfully'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
});

// Get user orders
router.get('/my-orders', auth, async (req, res) => {
  try {
    const orders = Order.find({ user: req.user._id });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: Get all orders
router.get('/', auth, adminAuth, async (req, res) => {
  try {
    const orders = Order.find();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: Update order status
router.put('/:id/status', auth, adminAuth, async (req, res) => {
  try {
    const order = Order.findByIdAndUpdate(req.params.id, { status: req.body.status });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;