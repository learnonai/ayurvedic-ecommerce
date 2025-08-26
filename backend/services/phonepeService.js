const crypto = require('crypto');
const axios = require('axios');

class PhonePeService {
  constructor() {
    this.merchantId = 'TEST-M23KZ1MPAQX3P_25081';
    this.saltKey = 'OTI3Y2VlOWEtMGE5Zi00Y2IwLWFmMDAtYzdmODQ1NGU1MGE1';
    this.keyIndex = 1;
    this.apiUrl = 'https://api-preprod.phonepe.com/apis/pg-sandbox';
  }

  async createPayment(orderData) {
    try {
      const merchantTransactionId = `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const data = {
        merchantId: this.merchantId,
        merchantTransactionId: merchantTransactionId,
        merchantUserId: orderData.userId || 'USER_' + Date.now(),
        name: orderData.name || 'Customer',
        amount: orderData.amount * 100, // Convert to paise
        redirectUrl: `${process.env.NODE_ENV === 'production' ? 'https://learnonai.com' : 'http://localhost:5000'}/api/payment/status/${merchantTransactionId}`,
        redirectMode: 'POST',
        mobileNumber: orderData.phone || '9999999999',
        paymentInstrument: {
          type: 'PAY_PAGE'
        }
      };

      const payload = JSON.stringify(data);
      const payloadMain = Buffer.from(payload).toString('base64');
      const string = payloadMain + '/pg/v1/pay' + this.saltKey;
      const sha256 = crypto.createHash('sha256').update(string).digest('hex');
      const checksum = sha256 + '###' + this.keyIndex;

      const options = {
        method: 'POST',
        url: `${this.apiUrl}/pg/v1/pay`,
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json',
          'X-VERIFY': checksum
        },
        data: {
          request: payloadMain
        }
      };

      const response = await axios.request(options);
      
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
      console.error('PhonePe Error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  }

  async checkStatus(merchantTransactionId) {
    try {
      const string = `/pg/v1/status/${this.merchantId}/${merchantTransactionId}` + this.saltKey;
      const sha256 = crypto.createHash('sha256').update(string).digest('hex');
      const checksum = sha256 + '###' + this.keyIndex;

      const options = {
        method: 'GET',
        url: `${this.apiUrl}/pg/v1/status/${this.merchantId}/${merchantTransactionId}`,
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json',
          'X-VERIFY': checksum,
          'X-MERCHANT-ID': this.merchantId
        }
      };

      const response = await axios.request(options);
      
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