import axios from 'axios';

// Environment-based URL configuration
const getBaseUrl = () => {
  // More reliable detection using hostname
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:5000';
  }
  
  // Production URL
  return 'https://learnonai.com';
};

const getApiUrl = () => {
  return `${getBaseUrl()}/api`;
};

const BASE_URL = getBaseUrl();
const API_URL = getApiUrl();

// Export for use in components
export { BASE_URL };

const api = axios.create({
  baseURL: API_URL,
});

// Mask sensitive data for logging
const maskSensitiveData = (data) => {
  if (!data || typeof data !== 'object') return data;
  
  const masked = { ...data };
  const sensitiveFields = ['password', 'token', 'email', 'phone'];
  
  sensitiveFields.forEach(field => {
    if (masked[field]) {
      masked[field] = '***MASKED***';
    }
  });
  
  return masked;
};

api.interceptors.request.use(
  (config) => {
    // Only log in development, mask sensitive data
    if (process.env.NODE_ENV === 'development') {
      console.log('API Request:', config.method?.toUpperCase(), config.url, maskSensitiveData(config.data));
    }
    
    const token = localStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => {
    // Only log in development, mask sensitive data
    if (process.env.NODE_ENV === 'development') {
      console.log('API Response:', response.status, maskSensitiveData(response.data));
    }
    return response;
  },
  (error) => {
    // Only log errors, no sensitive data
    if (process.env.NODE_ENV === 'development') {
      console.error('API Error:', error.response?.status, error.response?.data?.message || 'Request failed');
    }
    
    if (error.response?.status === 401) {
      localStorage.removeItem('userToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const auth = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  verifyEmail: (data) => api.post('/auth/verify-email', data),
};

export const products = {
  getAll: (params) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
};

export const orders = {
  create: (orderData) => api.post('/orders', orderData),
  getMyOrders: () => api.get('/orders/my-orders'),
};

export const wishlist = {
  get: () => api.get('/wishlist'),
  add: (productId) => api.post('/wishlist', { productId }),
  remove: (productId) => api.delete(`/wishlist/${productId}`),
};

export const payment = {
  createOrder: (amount) => api.post('/payment/create-order', { amount }),
  verify: (data) => api.post('/payment/verify', data),
};

export default api;