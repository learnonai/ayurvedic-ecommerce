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
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// PhonePe callback - handle both GET and POST
router.all('/callback', async (req, res) => {
  try {
    const transactionId = req.query.transactionId || req.body.transactionId || req.query.merchantOrderId;
    const code = req.query.code || req.body.code;
    const status = req.query.status || req.body.status;
    
    console.log('Payment callback received:', { transactionId, code, status, query: req.query, body: req.body });
    
    if (!transactionId) {
      return res.redirect('https://learnonai.com/payment-success?status=error');
    }
    
    // Check for cancellation first
    if (code === 'PAYMENT_CANCELLED' || status === 'CANCELLED' || code === 'PAYMENT_FAILED') {
      // Payment explicitly cancelled or failed
      phonepeService.setPaymentStatus(transactionId, 'FAILED');
      console.log('Payment cancelled/failed:', transactionId, 'Code:', code, 'Status:', status);
      return res.redirect(`https://learnonai.com/payment-success?status=failed&transactionId=${transactionId}`);
    } else {
      // Default to success for all other cases (including no code)
      phonepeService.setPaymentStatus(transactionId, 'COMPLETED');
      console.log('Payment marked as successful:', transactionId, 'Code:', code, 'Status:', status);
      return res.redirect(`https://learnonai.com/payment-success?status=success&transactionId=${transactionId}`);
    }
  } catch (error) {
    console.error('Payment callback error:', error);
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
router.all('/status/:transactionId', async (req, res) => {
  try {
    const { transactionId } = req.params;
    
    const result = await phonepeService.verifyPayment(transactionId);
    
    if (result.success && result.status === 'COMPLETED') {
      res.redirect(`https://learnonai.com/payment-success?status=success&transactionId=${transactionId}`);
    } else {
      res.redirect(`https://learnonai.com/payment-success?status=failed&transactionId=${transactionId}`);
    }
  } catch (error) {
    res.redirect('https://learnonai.com/payment-success?status=error');
  }
});

// Demo route to simulate payment completion (for testing)
router.post('/simulate-success/:transactionId', (req, res) => {
  try {
    const { transactionId } = req.params;
    phonepeService.setPaymentStatus(transactionId, 'COMPLETED');
    res.json({ success: true, message: 'Payment marked as completed' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Route to complete payment manually (for demo testing)
router.get('/complete/:transactionId', (req, res) => {
  try {
    const { transactionId } = req.params;
    phonepeService.setPaymentStatus(transactionId, 'COMPLETED');
    res.redirect(`https://learnonai.com/payment-success?status=success&transactionId=${transactionId}`);
  } catch (error) {
    res.redirect('https://learnonai.com/payment-success?status=error');
  }
});

// Demo route to simulate payment failure (for testing)
router.post('/simulate-failure/:transactionId', (req, res) => {
  try {
    const { transactionId } = req.params;
    phonepeService.setPaymentStatus(transactionId, 'FAILED');
    res.json({ success: true, message: 'Payment marked as failed' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;