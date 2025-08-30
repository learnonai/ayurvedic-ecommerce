const axios = require('axios');

class PhonePeService {
  constructor() {
    this.clientId = 'SU2508241910194031786811';
    this.clientSecret = '11d250e2-bd67-43b9-bc80-d45b3253566b';
    this.baseUrl = 'https://api.phonepe.com/apis';
    this.accessToken = null;
  }

  async getAccessToken() {
    try {
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
      console.log('PhonePe token generated successfully');
      return this.accessToken;
    } catch (error) {
      console.error('Token generation error:', error.response?.data || error.message);
      throw error;
    }
  }

  async createPayment(orderData) {
    try {
      // Get fresh token
      await this.getAccessToken();
      
      const merchantOrderId = `TX${Date.now()}`;
      
      const paymentData = {
        merchantOrderId,
        amount: Math.round(orderData.amount * 100), // Convert to paise
        expireAfter: 1200,
        metaInfo: {
          udf1: 'Ayurvedic Store',
          udf2: `User: ${orderData.userId}`,
          udf3: orderData.phone || '9999999999'
        },
        paymentFlow: {
          type: 'PG_CHECKOUT',
          message: 'Payment for Ayurvedic products',
          merchantUrls: {
            redirectUrl: `https://learnonai.com/payment-success?transactionId=${merchantOrderId}&status=success`
          }
        }
      };

      console.log('PhonePe Payment Request:', { merchantOrderId, amount: paymentData.amount });

      const response = await axios.post(
        `${this.baseUrl}/pg/checkout/v2/pay`,
        paymentData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `O-Bearer ${this.accessToken}`
          },
          timeout: 30000
        }
      );

      console.log('PhonePe Response:', response.data);

      if (response.data && response.data.redirectUrl) {
        return {
          success: true,
          transactionId: merchantOrderId,
          paymentUrl: response.data.redirectUrl
        };
      } else {
        return {
          success: false,
          error: 'Payment URL not received from PhonePe'
        };
      }
    } catch (error) {
      console.error('PhonePe Payment Error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  }

  async verifyPayment(transactionId) {
    try {
      // Get fresh token for verification
      if (!this.accessToken) {
        await this.getAccessToken();
      }
      
      // For demo purposes, always return success if transactionId exists
      if (transactionId && transactionId.startsWith('TX')) {
        return {
          success: true,
          status: 'COMPLETED',
          transactionId: transactionId
        };
      }
      
      return {
        success: false,
        status: 'FAILED',
        transactionId: transactionId
      };
    } catch (error) {
      console.error('Payment verification error:', error);
      return { 
        success: false, 
        status: 'ERROR',
        error: error.message 
      };
    }
  }
}

module.exports = new PhonePeService();