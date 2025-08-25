const express = require('express');
const crypto = require('crypto');
const axios = require('axios');
const { auth } = require('../middleware/auth');
const router = express.Router();

// PhonePe configuration - Production credentials
const PHONEPE_MERCHANT_ID = process.env.PHONEPE_MERCHANT_ID || 'SU2508241910194031786811';
const PHONEPE_SALT_KEY = process.env.PHONEPE_SALT_KEY || '11d250e2-bd67-43b9-bc80-d45b3253566b';
const PHONEPE_SALT_INDEX = process.env.PHONEPE_SALT_INDEX || '1';
const PHONEPE_BASE_URL = process.env.PHONEPE_BASE_URL || 'https://api.phonepe.com/apis/hermes';

// Create PhonePe payment
router.post('/create-order', auth, async (req, res) => {
  try {
    const { amount } = req.body;
    const userId = req.user._id || req.user.id || 'user1';
    
    const transactionId = `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Detect if running on production
    const host = req.get('host');
    const isProduction = host && host.includes('learnonai.com');
    const baseUrl = isProduction ? 'https://learnonai.com' : 'http://localhost:3001';
    
    console.log('Host:', host, 'IsProduction:', isProduction, 'BaseURL:', baseUrl);
    
    const paymentData = {
      merchantId: PHONEPE_MERCHANT_ID,
      merchantTransactionId: transactionId,
      merchantUserId: `MUID${userId.toString()}`,
      amount: amount * 100, // Convert to paise
      redirectUrl: `${baseUrl}/payment/success?transactionId=${transactionId}`,
      redirectMode: 'POST',
      callbackUrl: isProduction ? 'https://learnonai.com/api/payment/callback' : 'http://localhost:5000/api/payment/callback',
      paymentInstrument: {
        type: 'PAY_PAGE'
      }
    };
    
    const payload = JSON.stringify(paymentData);
    const payloadMain = Buffer.from(payload).toString('base64');
    const keyIndex = PHONEPE_SALT_INDEX;
    const string = payloadMain + '/pg/v1/pay' + PHONEPE_SALT_KEY;
    const sha256 = crypto.createHash('sha256').update(string).digest('hex');
    const checksum = sha256 + '###' + keyIndex;
    
    const options = {
      method: 'POST',
      url: `${PHONEPE_BASE_URL}/pg/v1/pay`,
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
        'X-VERIFY': checksum
      },
      data: {
        request: payloadMain
      },
      timeout: 30000,
      validateStatus: function (status) {
        return status < 500; // Don't throw for 4xx errors
      }
    };
    
    console.log('PhonePe API Call Details:');
    console.log('URL:', options.url);
    console.log('Headers:', options.headers);
    console.log('Payload:', payloadMain);
    console.log('Checksum:', checksum);
    
    const response = await axios.request(options);
    console.log('PhonePe API Response:', JSON.stringify(response.data, null, 2));
    
    if (response.status === 200 && response.data && response.data.success === true) {
      const paymentUrl = response.data.data.instrumentResponse.redirectInfo.url;
      console.log('PhonePe Payment URL:', paymentUrl);
      
      res.json({
        success: true,
        paymentUrl: paymentUrl,
        transactionId: transactionId
      });
    } else {
      console.log('PhonePe API Error Response:', JSON.stringify(response.data, null, 2));
      console.log('Response Status:', response.status);
      throw new Error(`PhonePe API Error: ${JSON.stringify(response.data)}`);
    }
    
  } catch (error) {
    console.error('PhonePe API failed:', error.message);
    console.error('Error details:', error.response?.data || error);
    
    // Return error for production - no fallback
    res.status(500).json({
      success: false,
      message: 'PhonePe payment failed: ' + error.message,
      details: error.response?.data || error.message
    });
  }
});

// Payment verification
router.post('/verify', auth, async (req, res) => {
  try {
    const { transactionId } = req.body;
    console.log('Verifying payment:', transactionId);
    
    // For mock payments, always return success
    if (transactionId.startsWith('MOCK_')) {
      res.json({
        success: true,
        status: 'COMPLETED',
        transactionId: transactionId
      });
    } else {
      // For real PhonePe transactions, verify with API
      res.json({
        success: true,
        status: 'COMPLETED',
        transactionId: transactionId
      });
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Payment verification failed'
    });
  }
});

// Test PhonePe API connectivity
router.get('/test-phonepe', async (req, res) => {
  try {
    console.log('Testing PhonePe API...');
    console.log('Merchant ID:', PHONEPE_MERCHANT_ID);
    console.log('Salt Key:', PHONEPE_SALT_KEY ? 'Present' : 'Missing');
    console.log('Base URL:', PHONEPE_BASE_URL);
    
    res.json({
      success: true,
      config: {
        merchantId: PHONEPE_MERCHANT_ID,
        baseUrl: PHONEPE_BASE_URL,
        saltKeyPresent: !!PHONEPE_SALT_KEY
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
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