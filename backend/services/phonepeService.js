const crypto = require('crypto');
const axios = require('axios');

class PhonePeService {
  constructor() {
    // Production credentials
    this.clientId = 'SU2508241910194031786811';
    this.clientSecret = '11d250e2-bd67-43b9-bc80-d45b3253566b';
    this.clientVersion = 1;
    this.baseUrl = 'https://api.phonepe.com/apis/hermes';
  }

  generateChecksum(payload, endpoint) {
    const string = payload + endpoint + this.clientSecret;
    return crypto.createHash('sha256').update(string).digest('hex') + '###' + this.clientVersion;
  }

  async initiatePayment(orderData) {
    try {
      const merchantTransactionId = `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const paymentPayload = {
        merchantId: this.clientId,
        merchantTransactionId: merchantTransactionId,
        merchantUserId: orderData.userId || 'USER_' + Date.now(),
        amount: orderData.amount * 100, // Convert to paise
        redirectUrl: `${process.env.NODE_ENV === 'production' ? 'https://learnonai.com' : 'http://localhost:5000'}/api/payment/callback/${merchantTransactionId}`,
        redirectMode: 'POST',
        callbackUrl: `${process.env.NODE_ENV === 'production' ? 'https://learnonai.com' : 'http://localhost:5000'}/api/payment/callback/${merchantTransactionId}`,
        mobileNumber: orderData.phone || '9999999999',
        paymentInstrument: {
          type: 'PAY_PAGE'
        }
      };

      const base64Payload = Buffer.from(JSON.stringify(paymentPayload)).toString('base64');
      const endpoint = '/pg/v1/pay';
      const checksum = this.generateChecksum(base64Payload, endpoint);

      const response = await axios.post(
        `${this.baseUrl}${endpoint}`,
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
          transactionId: merchantTransactionId,
          paymentUrl: response.data.data.instrumentResponse.redirectInfo.url
        };
      } else {
        throw new Error(response.data.message || 'Payment initiation failed');
      }

    } catch (error) {
      console.error('PhonePe Payment Error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  }

  async checkPaymentStatus(merchantTransactionId) {
    try {
      const endpoint = `/pg/v1/status/${this.clientId}/${merchantTransactionId}`;
      const checksum = this.generateChecksum('', endpoint);

      const response = await axios.get(
        `${this.baseUrl}${endpoint}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'X-VERIFY': checksum,
            'X-MERCHANT-ID': this.clientId,
            'accept': 'application/json'
          }
        }
      );

      return {
        success: response.data.success,
        status: response.data.data?.state,
        transactionId: response.data.data?.merchantTransactionId,
        amount: response.data.data?.amount
      };

    } catch (error) {
      console.error('Status Check Error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = new PhonePeService();