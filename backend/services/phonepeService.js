const axios = require('axios');

class PhonePeService {
  constructor() {
    this.clientId = process.env.PHONEPE_MERCHANT_ID || 'SU2508241910194031786811';
    this.clientSecret = process.env.PHONEPE_SALT_KEY || '11d250e2-bd67-43b9-bc80-d45b3253566b';
    this.baseUrl = 'https://api.phonepe.com/apis';
    this.accessToken = null;
    this.tokenExpiry = null;
  }

  async getAccessToken() {
    try {
      if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
        return this.accessToken;
      }

      const response = await axios.post(
        `${this.baseUrl}/identity-manager/v1/oauth/token`,
        new URLSearchParams({
          client_id: this.clientId,
          client_version: '1',
          client_secret: this.clientSecret,
          grant_type: 'client_credentials'
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      this.accessToken = response.data.access_token;
      this.tokenExpiry = Date.now() + (response.data.expires_in * 1000) - 60000; // 1 min buffer
      
      return this.accessToken;
    } catch (error) {
      console.error('Token generation error:', error.response?.data || error.message);
      throw new Error('Failed to generate access token');
    }
  }

  async createPayment(orderData) {
    try {
      const token = await this.getAccessToken();
      const merchantOrderId = `TX${Date.now()}`;
      
      const payload = {
        merchantOrderId,
        amount: Math.round(orderData.amount * 100),
        expireAfter: 1200,
        metaInfo: {
          udf1: `Order for user ${orderData.userId}`,
          udf2: 'Ayurvedic Ecommerce',
          udf3: orderData.phone || '9999999999'
        },
        paymentFlow: {
          type: 'PG_CHECKOUT',
          message: 'Payment for Ayurvedic products',
          merchantUrls: {
            redirectUrl: 'https://learnonai.com/payment-success'
          }
        }
      };

      const response = await axios.post(
        `${this.baseUrl}/pg/checkout/v2/pay`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `O-Bearer ${token}`
          }
        }
      );

      if (response.data.orderId) {
        return {
          success: true,
          transactionId: merchantOrderId,
          paymentUrl: response.data.redirectUrl,
          orderId: response.data.orderId
        };
      } else {
        throw new Error('Payment creation failed - no order ID received');
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
      const token = await this.getAccessToken();
      
      const response = await axios.get(
        `${this.baseUrl}/pg/checkout/v2/status/${transactionId}`,
        {
          headers: {
            'Authorization': `O-Bearer ${token}`
          }
        }
      );

      return {
        success: response.data.success,
        status: response.data.data?.status,
        transactionId: response.data.data?.merchantOrderId
      };
    } catch (error) {
      console.error('Payment verification error:', error.response?.data || error.message);
      return { success: false, error: error.message };
    }
  }
}

module.exports = new PhonePeService();