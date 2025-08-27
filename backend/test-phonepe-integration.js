const axios = require('axios');

const testPhonePeIntegration = async () => {
  try {
    console.log('Testing PhonePe OAuth Integration...\n');
    
    const clientId = 'SU2508241910194031786811';
    const clientSecret = '11d250e2-bd67-43b9-bc80-d45b3253566b';
    
    // Step 1: Get OAuth Token
    console.log('1. Getting OAuth Token...');
    const tokenResponse = await axios.post(
      'https://api.phonepe.com/apis/identity-manager/v1/oauth/token',
      new URLSearchParams({
        client_id: clientId,
        client_version: '1',
        client_secret: clientSecret,
        grant_type: 'client_credentials'
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );
    
    console.log('✅ Token generated successfully');
    console.log('Token:', tokenResponse.data.access_token.substring(0, 50) + '...');
    
    // Step 2: Create Payment
    console.log('\n2. Creating Payment...');
    const merchantOrderId = `TX${Date.now()}`;
    
    const paymentPayload = {
      merchantOrderId,
      amount: 100, // ₹1.00
      expireAfter: 1200,
      metaInfo: {
        udf1: 'Test Order',
        udf2: 'Ayurvedic Ecommerce',
        udf3: '9999999999'
      },
      paymentFlow: {
        type: 'PG_CHECKOUT',
        message: 'Test payment for Ayurvedic products',
        merchantUrls: {
          redirectUrl: 'https://learnonai.com/payment-success'
        }
      }
    };
    
    const paymentResponse = await axios.post(
      'https://api.phonepe.com/apis/pg/checkout/v2/pay',
      paymentPayload,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `O-Bearer ${tokenResponse.data.access_token}`
        }
      }
    );
    
    console.log('✅ Payment created successfully');
    console.log('Full Response:', JSON.stringify(paymentResponse.data, null, 2));
    console.log('Transaction ID:', merchantOrderId);
    
    console.log('\n🎉 PhonePe integration is working correctly!');
    console.log('\nNext steps:');
    console.log('1. Restart your backend server');
    console.log('2. Test the payment flow from your website');
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
};

testPhonePeIntegration();