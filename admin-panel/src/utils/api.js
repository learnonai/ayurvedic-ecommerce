import axios from 'axios';

// Environment-based API URL configuration
const getApiUrl = () => {
  // Check if we're in development mode
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:5000/api';
  }
  
  // Production URL
  return 'https://learnonai.com/api';
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
  console.log('API Request:', config.method?.toUpperCase(), config.url, 'Base:', config.baseURL);
  return config;
});

api.interceptors.response.use(
  (response) => {
    console.log('API Success:', response.config.url, response.status);
    return response;
  },
  (error) => {
    console.error('API Error:', error.config?.url, error.response?.status, error.message);
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
  getAll: () => api.get('/orders'),
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