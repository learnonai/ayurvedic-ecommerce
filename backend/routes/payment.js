const express = require('express');
const { auth } = require('../middleware/auth');
const phonepeService = require('../services/phonepeService');
const router = express.Router();

// Create PhonePe payment
router.post('/create-order', auth, async (req, res) => {
  try {
    const { amount } = req.body;
    const userId = req.user.id;
    const phone = req.user.phone || '9999999999';
    
    const result = await phonepeService.createPayment({
      amount,
      userId,
      phone
    });
    
    if (result.success) {
      res.json({
        success: true,
        paymentUrl: result.paymentUrl,
        transactionId: result.transactionId
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.error
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Payment creation failed'
    });
  }
});

// PhonePe callback
router.post('/callback', async (req, res) => {
  console.log('PhonePe Callback:', req.body);
  res.json({ success: true });
});

// Verify payment
router.post('/verify', auth, async (req, res) => {
  try {
    const { transactionId } = req.body;
    
    const result = await phonepeService.verifyPayment(transactionId);
    
    res.json({
      success: result.success,
      status: result.status,
      transactionId: result.transactionId
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Verification failed'
    });
  }
});

module.exports = router;