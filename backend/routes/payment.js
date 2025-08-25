const express = require('express');
const crypto = require('crypto');
const axios = require('axios');
const { auth } = require('../middleware/auth');
const router = express.Router();

// PhonePe configuration - Production credentials
const PHONEPE_MERCHANT_ID = process.env.PHONEPE_MERCHANT_ID || 'SU2508241910194031786811';
const PHONEPE_SALT_KEY = process.env.PHONEPE_SALT_KEY || '11d250e2-bd67-43b9-bc80-d45b3253566b';
const PHONEPE_SALT_INDEX = process.env.PHONEPE_SALT_INDEX || '1';
const PHONEPE_BASE_URL = process.env.PHONEPE_BASE_URL || 'https://api-preprod.phonepe.com/apis/pg-sandbox';

// Get PhonePe OAuth token
const getPhonePeToken = async () => {
  const tokenOptions = {
    method: 'POST',
    url: `${PHONEPE_BASE_URL}/v1/oauth/token`,
    headers: {
      'Content-Type': 'application/json'
    },
    data: {
      clientId: PHONEPE_MERCHANT_ID,
      clientSecret: PHONEPE_SALT_KEY,
      clientVersion: '1'
    },
    timeout: 10000
  };
  
  console.log('Getting PhonePe token...');
  console.log('Token URL:', tokenOptions.url);
  console.log('Credentials:', { clientId: PHONEPE_MERCHANT_ID, clientSecret: PHONEPE_SALT_KEY ? 'Present' : 'Missing' });
  
  const response = await axios.request(tokenOptions);
  console.log('Token response:', response.data);
  return response.data.accessToken;
};

// Create PhonePe payment - Simplified for debugging
router.post('/create-order', auth, async (req, res) => {
  console.log('Payment route hit - starting...');
  
  try {
    const { amount } = req.body;
    console.log('Amount received:', amount);
    
    // Simple mock payment for now to test the flow
    const mockTransactionId = `MOCK_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const host = req.get('host');
    const isProduction = host && host.includes('learnonai.com');
    const baseUrl = isProduction ? 'https://learnonai.com' : 'http://localhost:3001';
    
    console.log('Returning mock payment response');
    res.json({
      success: true,
      paymentUrl: `${baseUrl}/payment/success?transactionId=${mockTransactionId}&status=success`,
      transactionId: mockTransactionId,
      isMock: true
    });
    
  } catch (error) {
    console.error('Payment route error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Payment verification - Simplified
router.post('/verify', auth, async (req, res) => {
  try {
    const { transactionId } = req.body;
    console.log('Verifying payment:', transactionId);
    
    res.json({
      success: true,
      status: 'COMPLETED',
      transactionId: transactionId
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Payment verification failed'
    });
  }
});

// Test PhonePe OAuth token
router.get('/test-phonepe', async (req, res) => {
  try {
    console.log('Testing PhonePe OAuth...');
    
    const tokenOptions = {
      method: 'POST',
      url: `${PHONEPE_BASE_URL}/v1/oauth/token`,
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        clientId: PHONEPE_MERCHANT_ID,
        clientSecret: PHONEPE_SALT_KEY,
        clientVersion: '1'
      },
      timeout: 10000
    };
    
    console.log('Token request:', tokenOptions);
    const response = await axios.request(tokenOptions);
    
    res.json({
      success: true,
      tokenResponse: response.data,
      config: {
        merchantId: PHONEPE_MERCHANT_ID,
        baseUrl: PHONEPE_BASE_URL
      }
    });
  } catch (error) {
    console.error('Token test failed:', error.message);
    res.json({ 
      success: false, 
      error: error.message,
      details: error.response?.data || 'No response data'
    });
  }
});

// PhonePe callback endpoint
router.post('/callback', async (req, res) => {
  try {
    console.log('PhonePe callback received:', req.body);
    res.json({ success: true });
  } catch (error) {
    console.error('Callback error:', error);
    res.status(500).json({ success: false });
  }
});

module.exports = router;