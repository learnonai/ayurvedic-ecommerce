const crypto = require('crypto');
const axios = require('axios');

const merchantId = 'SU2508241910194031786811';
const saltKey = '11d250e2-bd67-43b9-bc80-d45b3253566b';
const baseUrl = 'https://api.phonepe.com/apis/hermes';

const payload = {
  merchantId: merchantId,
  merchantTransactionId: 'TXN_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
  merchantUserId: 'test123',
  amount: 10000,
  redirectUrl: 'https://learnonai.com/payment-success',
  redirectMode: 'REDIRECT', 
  callbackUrl: 'https://learnonai.com/api/payment/callback',
  mobileNumber: '9999999999',
  paymentInstrument: { type: 'PAY_PAGE' }
};

console.log('Testing PRODUCTION PhonePe API...');
console.log('URL:', baseUrl + '/pg/v1/pay');
console.log('Merchant ID:', merchantId);

const base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64');
const string = base64Payload + '/pg/v1/pay' + saltKey;
const checksum = crypto.createHash('sha256').update(string).digest('hex') + '###1';

axios.post(baseUrl + '/pg/v1/pay', 
  { request: base64Payload },
  {
    headers: {
      'Content-Type': 'application/json',
      'X-VERIFY': checksum,
      'accept': 'application/json'
    },
    timeout: 10000
  }
)
.then(response => {
  console.log('🎉 SUCCESS! Production PhonePe working!');
  console.log('Payment URL:', response.data?.data?.instrumentResponse?.redirectInfo?.url);
  process.exit(0);
})
.catch(error => {
  console.log('❌ Error:', {
    status: error.response?.status,
    code: error.response?.data?.code,
    message: error.response?.data?.message
  });
  process.exit(1);
});
