import axios from 'axios';

const API_URL = window.location.hostname === 'learnonai.com' || window.location.hostname === 'www.learnonai.com' 
  ? 'https://www.learnonai.com/api' 
  : 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token') || localStorage.getItem('userToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

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
  updateStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
};

export const users = {
  getAll: () => api.get('/users'),
  verify: (id) => api.put(`/users/${id}/verify`),
  updateRole: (id, role) => api.put(`/users/${id}/role`, { role }),
};

export default api;