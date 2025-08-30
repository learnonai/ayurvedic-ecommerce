const express = require('express');
const { auth } = require('../middleware/auth');
const phonepeService = require('../services/phonepeService');
const router = express.Router();

// Create PhonePe payment
router.post('/create-order', auth, async (req, res) => {
  try {
    const { amount } = req.body;
    const userId = req.user._id || req.user.id || 'user1';
    const phone = '9999999999';
    
    console.log('Payment request:', { amount, userId, phone, user: req.user });
    
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
        message: result.error || 'Payment creation failed'
      });
    }
  } catch (error) {
    console.error('Payment route error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
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
        return res.redirect('https://learnonai.com/payment-success?status=success&txnId=' + transactionId);
      }
    }
    
    // Payment failed or pending
    res.redirect('https://learnonai.com/payment-success?status=failed&txnId=' + (transactionId || 'unknown'));
  } catch (error) {
    console.error('Callback processing error:', error);
    res.redirect('https://learnonai.com/payment-success?status=error');
  }
});

// Verify payment
router.post('/verify', auth, async (req, res) => {
  try {
    const { transactionId } = req.body;
    
    const result = await phonepeService.verifyPayment(transactionId);
    
    res.json({
      success: result.success,
      status: result.status === 'COMPLETED' ? 'COMPLETED' : result.status,
      transactionId: result.transactionId
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Verification failed'
    });
  }
});

// Status check route for PhonePe redirect
router.post('/status/:transactionId', async (req, res) => {
  try {
    const { transactionId } = req.params;
    console.log('Status check for:', transactionId);
    
    const result = await phonepeService.verifyPayment(transactionId);
    
    if (result.success && result.status === 'COMPLETED') {
      res.redirect('https://learnonai.com/payment-success?status=success&txnId=' + transactionId);
    } else {
      res.redirect('https://learnonai.com/payment-success?status=failed&txnId=' + transactionId);
    }
  } catch (error) {
    console.error('Status check error:', error);
    res.redirect('https://learnonai.com/payment-success?status=error');
  }
});

module.exports = router;