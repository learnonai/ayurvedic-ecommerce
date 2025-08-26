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
    const name = req.user.name || 'Customer';
    
    console.log('Payment Request:', { amount, userId, phone, name });
    
    const paymentResult = await phonepeService.createPayment({
      amount,
      userId,
      phone,
      name
    });
    
    if (paymentResult.success) {
      res.json({
        success: true,
        paymentUrl: paymentResult.paymentUrl,
        transactionId: paymentResult.transactionId
      });
    } else {
      res.status(400).json({
        success: false,
        message: paymentResult.error
      });
    }
  } catch (error) {
    console.error('Payment Route Error:', error);
    res.status(500).json({
      success: false,
      message: 'Payment creation failed'
    });
  }
});

// PhonePe status callback
router.post('/status/:txnId', async (req, res) => {
  try {
    const merchantTransactionId = req.params.txnId;
    console.log('Status Check for:', merchantTransactionId);
    
    const statusResult = await phonepeService.checkStatus(merchantTransactionId);
    
    if (statusResult.success && statusResult.status === 'COMPLETED') {
      // Redirect to success page
      const successUrl = process.env.NODE_ENV === 'production' 
        ? 'https://learnonai.com/payment/success' 
        : 'http://localhost:3001/payment/success';
      return res.redirect(`${successUrl}?transactionId=${merchantTransactionId}&status=success`);
    } else {
      // Redirect to failure page
      const failureUrl = process.env.NODE_ENV === 'production' 
        ? 'https://learnonai.com/payment/failure' 
        : 'http://localhost:3001/payment/failure';
      return res.redirect(`${failureUrl}?transactionId=${merchantTransactionId}&status=failed`);
    }
  } catch (error) {
    console.error('Status Check Error:', error);
    const failureUrl = process.env.NODE_ENV === 'production' 
      ? 'https://learnonai.com/payment/failure' 
      : 'http://localhost:3001/payment/failure';
    return res.redirect(failureUrl);
  }
});

// Verify payment (for frontend)
router.post('/verify', auth, async (req, res) => {
  try {
    const { transactionId } = req.body;
    
    const result = await phonepeService.checkStatus(transactionId);
    
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