const crypto = require('crypto');
const axios = require('axios');

class PhonePeService {
  constructor() {
    this.merchantId = process.env.PHONEPE_MERCHANT_ID || 'PGTESTPAYUAT';
    this.saltKey = process.env.PHONEPE_SALT_KEY || '099eb0cd-02cf-4e2a-8aca-3e6c6aff0399';
    this.keyIndex = 1;
    this.baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://api.phonepe.com/apis/hermes' 
      : 'https://api-preprod.phonepe.com/apis/pg-sandbox';
  }

  async createPayment(orderData) {
    try {
      const transactionId = `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const payload = {
        merchantId: this.merchantId,
        merchantTransactionId: transactionId,
        merchantUserId: orderData.userId || 'USER_' + Date.now(),
        amount: orderData.amount * 100,
        redirectUrl: process.env.NODE_ENV === 'production' 
          ? 'https://learnonai.com/payment-success' 
          : 'http://localhost:3000/payment-success',
        redirectMode: 'REDIRECT',
        callbackUrl: process.env.NODE_ENV === 'production' 
          ? 'https://learnonai.com/api/payment/callback' 
          : 'http://localhost:5000/api/payment/callback',
        mobileNumber: orderData.phone || '9999999999',
        paymentInstrument: {
          type: 'PAY_PAGE'
        }
      };

      const base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64');
      const string = base64Payload + '/pg/v1/pay' + this.saltKey;
      const checksum = crypto.createHash('sha256').update(string).digest('hex') + '###' + this.keyIndex;

      const response = await axios.post(
        `${this.baseUrl}/pg/v1/pay`,
        { request: base64Payload },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-VERIFY': checksum,
            'accept': 'application/json'
          }
        }
      );

      if (response.data.success) {
        return {
          success: true,
          transactionId,
          paymentUrl: response.data.data.instrumentResponse.redirectInfo.url
        };
      } else {
        throw new Error(response.data.message || 'Payment failed');
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  }

  async verifyPayment(transactionId) {
    try {
      const string = `/pg/v1/status/${this.merchantId}/${transactionId}` + this.saltKey;
      const checksum = crypto.createHash('sha256').update(string).digest('hex') + '###' + this.keyIndex;

      const response = await axios.get(
        `${this.baseUrl}/pg/v1/status/${this.merchantId}/${transactionId}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'X-VERIFY': checksum,
            'X-MERCHANT-ID': this.merchantId
          }
        }
      );

      return {
        success: response.data.success,
        status: response.data.data?.state,
        transactionId: response.data.data?.merchantTransactionId
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

module.exports = new PhonePeService();