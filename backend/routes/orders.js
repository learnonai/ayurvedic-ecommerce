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
    console.log('Updating order:', req.params.id, 'with:', req.body);
    
    const updates = {};
    if (req.body.status) updates.status = req.body.status;
    if (req.body.archived !== undefined) updates.archived = req.body.archived;
    
    console.log('Updates to apply:', updates);
    
    const order = Order.findByIdAndUpdate(req.params.id, updates);
    console.log('Updated order:', order);
    
    res.json({ success: true, order });
  } catch (error) {
    console.error('Order update error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;