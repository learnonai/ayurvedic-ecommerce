const crypto = require('crypto');
const axios = require('axios');

class PhonePeService {
  constructor() {
    this.merchantId = process.env.PHONEPE_MERCHANT_ID || 'TEST-M23KZ1MPAQX3P_25081';
    this.saltKey = process.env.PHONEPE_SALT_KEY || 'OTI3Y2VlOWEtMGE5Zi00Y2IwLWFmMDAtYzdmODQ1NGU1MGE1';
    this.saltIndex = '1';
    this.apiUrl = process.env.PHONEPE_API_URL || 'https://api-preprod.phonepe.com/apis/pg-sandbox';
  }

  generateChecksum(payload) {
    const string = payload + '/pg/v1/pay' + this.saltKey;
    const sha256 = crypto.createHash('sha256').update(string).digest('hex');
    return sha256 + '###' + this.saltIndex;
  }

  async createPayment(orderData) {
    try {
      const transactionId = `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const payload = {
        merchantId: this.merchantId,
        merchantTransactionId: transactionId,
        merchantUserId: orderData.userId || 'USER_' + Date.now(),
        amount: Math.round(orderData.amount * 100),
        redirectUrl: `${process.env.NODE_ENV === 'production' ? 'https://learnonai.com' : 'http://localhost:3001'}/payment/success?transactionId=${transactionId}`,
        redirectMode: 'REDIRECT',
        callbackUrl: `${process.env.NODE_ENV === 'production' ? 'https://learnonai.com' : 'http://localhost:5000'}/api/payment/callback`,
        mobileNumber: orderData.phone || '9999999999',
        paymentInstrument: {
          type: 'PAY_PAGE'
        }
      };

      const base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64');
      const checksum = this.generateChecksum(base64Payload);

      const response = await axios.post(
        `${this.apiUrl}/pg/v1/pay`,
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
        error: error.message
      };
    }
  }

  async verifyPayment(transactionId) {
    try {
      const string = `/pg/v1/status/${this.merchantId}/${transactionId}` + this.saltKey;
      const checksum = crypto.createHash('sha256').update(string).digest('hex') + '###' + this.saltIndex;

      const response = await axios.get(
        `${this.apiUrl}/pg/v1/status/${this.merchantId}/${transactionId}`,
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