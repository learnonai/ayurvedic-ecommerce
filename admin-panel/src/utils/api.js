import axios from 'axios';

// Environment-based API URL configuration
const getApiUrl = () => {
  // Check if we're in development mode
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:5000/api';
  }
  
  // Production URL - try different approaches
  const hostname = window.location.hostname;
  if (hostname === 'learnonai.com') {
    return 'https://learnonai.com/api';
  }
  
  // Fallback for production
  return '/api';
};

const API_URL = getApiUrl();

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token') || localStorage.getItem('userToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Add cache busting for production
  if (process.env.NODE_ENV !== 'development') {
    config.headers['Cache-Control'] = 'no-cache';
    config.headers['Pragma'] = 'no-cache';
  }
  

  return config;
});

api.interceptors.response.use(
  (response) => {

    return response;
  },
  (error) => {
    console.error('API Error:', error.config?.url, error.response?.status, error.message);
    
    // Handle network errors in production
    if (!error.response && error.code === 'ERR_NETWORK') {
      console.error('Network error - check if backend is running');
    }
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('userToken');
      localStorage.removeItem('user');
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

export const auth = {
  login: (credentials) => api.post('/auth/login', credentials),
};

export const products = {
  getAll: () => api.get('/products'),
  create: (data) => api.post('/products', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (id, data) => api.put(`/products/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  delete: (id) => api.delete(`/products/${id}`),
};

export const orders = {
  getAll: () => {

    return api.get('/orders');
  },
  updateStatus: (id, status, extraData = {}) => {
    const payload = {};
    if (status) payload.status = status;
    if (extraData.archived !== undefined) payload.archived = extraData.archived;

    return api.put(`/orders/${id}/status`, payload);
  },
};

export const users = {
  getAll: () => api.get('/users'),
  verify: (id) => api.put(`/users/${id}/verify`),
  updateRole: (id, role) => api.put(`/users/${id}/role`, { role }),
};

export default api;