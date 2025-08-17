// Enhanced API wrapper with security measures
import { sessionManager, rateLimiter } from './security';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Secure API request wrapper
const secureRequest = async (url, options = {}) => {
  // Rate limiting for API calls
  const endpoint = url.split('/').pop();
  if (!rateLimiter.isAllowed(`api_${endpoint}`, 30, 60000)) { // 30 requests per minute per endpoint
    throw new Error('Rate limit exceeded. Please try again later.');
  }

  const token = sessionManager.get('userToken');
  
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
      ...(token && { 'Authorization': `Bearer ${token}` })
    }
  };

  // Add CSRF protection for state-changing operations
  if (['POST', 'PUT', 'DELETE'].includes(options.method)) {
    config.headers['X-Requested-With'] = 'XMLHttpRequest';
  }

  const response = await fetch(`${BASE_URL}${url}`, config);
  
  // Handle token expiry
  if (response.status === 401) {
    sessionManager.remove('userToken');
    sessionManager.remove('user');
    window.location.href = '/login';
    throw new Error('Session expired. Please login again.');
  }

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// Enhanced API methods with security
export const secureApi = {
  get: (url) => secureRequest(url, { method: 'GET' }),
  
  post: (url, data) => secureRequest(url, {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  
  put: (url, data) => secureRequest(url, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  
  delete: (url) => secureRequest(url, { method: 'DELETE' })
};

export { BASE_URL };