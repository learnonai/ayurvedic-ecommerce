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
    
    console.log('Payment request:', { amount, userId, phone });
    
    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid amount'
      });
    }
    
    if (amount < 1) {
      return res.status(400).json({
        success: false,
        message: 'Minimum amount is ₹1'
      });
    }
    
    const result = await phonepeService.createPayment({
      amount,
      userId,
      phone
    });
    
    console.log('PhonePe result:', result);
    
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
    console.error('Payment route error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Payment creation failed'
    });
  }
});

// PhonePe callback
router.post('/callback', async (req, res) => {
  try {
    console.log('PhonePe Callback:', req.body);
    
    const { transactionId, code, merchantId } = req.body;
    
    if (code === 'PAYMENT_SUCCESS') {
      // Verify payment status
      const verifyResult = await phonepeService.verifyPayment(transactionId);
      
      if (verifyResult.success && verifyResult.status === 'COMPLETED') {
        console.log('Payment verified successfully:', transactionId);
      }
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Callback processing error:', error);
    res.json({ success: false });
  }
});

// Verify payment
router.post('/verify', auth, async (req, res) => {
  try {
    const { transactionId } = req.body;
    
    const result = await phonepeService.verifyPayment(transactionId);
    
    res.json({
      success: result.success,
      status: result.status === 'SUCCESS' ? 'COMPLETED' : result.status,
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