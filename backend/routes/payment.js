const express = require('express');
const { auth } = require('../middleware/auth');
const router = express.Router();

// Simple payment route for testing
router.post('/create-order', auth, async (req, res) => {
  try {
    const { amount } = req.body;
    
    const mockTransactionId = `MOCK_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const host = req.get('host');
    const isProduction = host && host.includes('learnonai.com');
    const baseUrl = isProduction ? 'https://learnonai.com' : 'http://localhost:3001';
    
    res.json({
      success: true,
      paymentUrl: `${baseUrl}/payment/success?transactionId=${mockTransactionId}&status=success`,
      transactionId: mockTransactionId,
      isMock: true
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Payment verification
router.post('/verify', auth, async (req, res) => {
  try {
    const { transactionId } = req.body;
    
    res.json({
      success: true,
      status: 'COMPLETED',
      transactionId: transactionId
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Payment verification failed'
    });
  }
});

// Callback endpoint
router.post('/callback', async (req, res) => {
  res.json({ success: true });
});

module.exports = router;