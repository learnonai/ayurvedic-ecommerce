const express = require('express');
const axios = require('axios');
const { auth } = require('../middleware/auth');
const router = express.Router();

// PhonePe credentials
const PHONEPE_MERCHANT_ID = 'SU2508241910194031786811';
const PHONEPE_CLIENT_SECRET = '11d250e2-bd67-43b9-bc80-d45b3253566b';

// Create PhonePe payment
router.post('/create-order', auth, async (req, res) => {
  try {
    const { amount } = req.body;
    const transactionId = `ORDER_${Date.now()}`;
    
    // Step 1: Get OAuth token
    const tokenResponse = await axios({
      method: 'POST',
      url: 'https://api-preprod.phonepe.com/apis/pg-sandbox/v1/oauth/token',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      data: {
        clientId: PHONEPE_MERCHANT_ID,
        clientSecret: PHONEPE_CLIENT_SECRET,
        clientVersion: '1'
      }
    });
    
    const token = tokenResponse.data.accessToken;
    
    // Step 2: Create payment
    const paymentResponse = await axios({
      method: 'POST',
      url: 'https://api-preprod.phonepe.com/apis/pg-sandbox/checkout/v2/pay',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `O-Bearer ${token}`
      },
      data: {
        merchantOrderId: transactionId,
        amount: amount * 100,
        currency: 'INR',
        redirectUrl: 'https://learnonai.com/payment/success?transactionId=' + transactionId,
        callbackUrl: 'https://learnonai.com/api/payment/callback',
        paymentInstrument: {
          type: 'PAY_PAGE'
        }
      }
    });
    
    res.json({
      success: true,
      paymentUrl: paymentResponse.data.paymentUrl,
      transactionId: transactionId
    });
    
  } catch (error) {
    console.error('PhonePe Error:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: 'Payment failed: ' + (error.response?.data?.message || error.message)
    });
  }
});

// Payment verification
router.post('/verify', auth, async (req, res) => {
  res.json({
    success: true,
    status: 'COMPLETED',
    transactionId: req.body.transactionId
  });
});

// Callback endpoint
router.post('/callback', async (req, res) => {
  console.log('PhonePe callback:', req.body);
  res.json({ success: true });
});

module.exports = router;