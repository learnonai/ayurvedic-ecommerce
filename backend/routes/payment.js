const express = require('express');
const { auth } = require('../middleware/auth');
const router = express.Router();

// Create mock payment (PhonePe integration disabled for now)
router.post('/create-order', auth, async (req, res) => {
  try {
    const { amount } = req.body;
    const userId = req.user._id;
    
    console.log('Payment request:', { amount, userId, user: req.user });
    
    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid amount'
      });
    }
    
    // Mock payment for testing
    const mockTransactionId = `MOCK_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Determine the correct base URL
    const host = req.get('host');
    const protocol = req.get('x-forwarded-proto') || req.protocol;
    const baseUrl = host.includes('localhost') ? 'http://localhost:3001' : 'https://learnonai.com';
    
    console.log('Payment URL generated:', `${baseUrl}/payment/success?transactionId=${mockTransactionId}&status=success`);
    
    res.json({
      success: true,
      paymentUrl: `${baseUrl}/payment/success?transactionId=${mockTransactionId}&status=success`,
      transactionId: mockTransactionId
    });
    
  } catch (error) {
    console.error('Payment route error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating payment order'
    });
  }
});

// Mock payment verification
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