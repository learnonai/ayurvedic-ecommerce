const express = require('express');
const { auth } = require('../middleware/auth');
const router = express.Router();

// Mock payment for demo
router.post('/create-order', auth, async (req, res) => {
  try {
    const { amount } = req.body;
    
    // Mock order creation
    const order = {
      id: 'order_' + Date.now(),
      amount: amount * 100,
      currency: 'INR',
      status: 'created'
    };
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Mock payment verification
router.post('/verify', auth, async (req, res) => {
  try {
    const { orderId, paymentId, signature } = req.body;
    
    res.json({ 
      success: true, 
      message: 'Payment verified successfully',
      paymentId 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;