const express = require('express');
const { auth } = require('../middleware/auth');
const router = express.Router();

// For production - add Razorpay:
/*
const Razorpay = require('razorpay');
const crypto = require('crypto');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});
*/

// Create payment order (Mock Razorpay)
router.post('/create-order', auth, async (req, res) => {
  try {
    const { amount } = req.body;
    
    // For demo - mock order
    const order = {
      id: 'order_' + Date.now(),
      amount: amount * 100,
      currency: 'INR',
      status: 'created'
    };
    
    // For production - real Razorpay:
    /*
    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: 'INR',
      receipt: 'order_' + Date.now()
    });
    */
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Verify payment (Mock)
router.post('/verify', auth, async (req, res) => {
  try {
    const { orderId, paymentId, signature } = req.body;
    
    // For demo - mock verification
    res.json({ 
      success: true, 
      message: 'Payment verified successfully',
      paymentId 
    });
    
    // For production - real verification:
    /*
    const body = orderId + '|' + paymentId;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');
    
    if (expectedSignature === signature) {
      res.json({ success: true, message: 'Payment verified' });
    } else {
      res.status(400).json({ success: false, message: 'Invalid signature' });
    }
    */
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;