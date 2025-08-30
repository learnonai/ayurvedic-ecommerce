const axios = require('axios');
const crypto = require('crypto');

class PhonePeService {
  constructor() {
    // Working PhonePe Production credentials
    this.merchantId = 'M23KZ1MPAQX3P';
    this.saltKey = '11d250e2-bd67-43b9-bc80-d45b3253566b';
    this.baseUrl = 'https://api.phonepe.com/apis/hermes';
    this.keyIndex = 1;
  }

  generateChecksum(payload, endpoint) {
    const string = payload + endpoint + this.saltKey;
    const sha256 = crypto.createHash('sha256').update(string).digest('hex');
    return sha256 + '###' + this.keyIndex;
  }

  async createPayment(orderData) {
    try {
      const merchantTransactionId = `TX${Date.now()}`;
      
      const data = {
        merchantId: this.merchantId,
        merchantTransactionId: merchantTransactionId,
        merchantUserId: `USER_${orderData.userId}`,
        amount: Math.round(orderData.amount * 100),
        redirectUrl: `https://learnonai.com/payment-success?transactionId=${merchantTransactionId}`,
        redirectMode: 'GET',
        callbackUrl: `https://learnonai.com/api/payment/callback`,
        mobileNumber: orderData.phone || '9999999999',
        paymentInstrument: {
          type: 'PAY_PAGE'
        }
      };

      const payload = JSON.stringify(data);
      const payloadMain = Buffer.from(payload).toString('base64');
      const checksum = this.generateChecksum(payloadMain, '/pg/v1/pay');

      console.log('PhonePe Production Request:', { merchantTransactionId, amount: data.amount });

      const response = await axios.post(
        `${this.baseUrl}/pg/v1/pay`,
        {
          request: payloadMain
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-VERIFY': checksum
          },
          timeout: 30000
        }
      );

      if (response.data.success && response.data.data?.instrumentResponse?.redirectInfo?.url) {
        return {
          success: true,
          transactionId: merchantTransactionId,
          paymentUrl: response.data.data.instrumentResponse.redirectInfo.url
        };
      } else {
        throw new Error('Payment URL not received from PhonePe');
      }
    } catch (error) {
      console.error('PhonePe Payment Error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  }

  async verifyPayment(transactionId) {
    try {
      const endpoint = `/pg/v1/status/${this.merchantId}/${transactionId}`;
      const checksum = this.generateChecksum('', endpoint);
      
      const response = await axios.get(
        `${this.baseUrl}${endpoint}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'X-VERIFY': checksum,
            'X-MERCHANT-ID': this.merchantId
          },
          timeout: 30000
        }
      );

      return {
        success: response.data.success,
        status: response.data.data?.state,
        transactionId: response.data.data?.merchantTransactionId
      };
    } catch (error) {
      console.error('Payment verification error:', error.response?.data || error.message);
      return { success: false, error: error.message };
    }
  }
}

module.exports = new PhonePeService();