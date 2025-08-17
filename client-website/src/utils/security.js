// Input sanitization and XSS protection utilities

// Sanitize HTML input to prevent XSS
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim();
};

// Validate and sanitize email
export const sanitizeEmail = (email) => {
  const sanitized = sanitizeInput(email).toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(sanitized) ? sanitized : '';
};

// Validate and sanitize phone number
export const sanitizePhone = (phone) => {
  const sanitized = sanitizeInput(phone).replace(/\D/g, '');
  return sanitized.length >= 10 ? sanitized : '';
};

// Rate limiting utility
class RateLimiter {
  constructor() {
    this.requests = new Map();
  }

  isAllowed(key, maxRequests = 5, windowMs = 60000) {
    const now = Date.now();
    const windowStart = now - windowMs;
    
    if (!this.requests.has(key)) {
      this.requests.set(key, []);
    }
    
    const userRequests = this.requests.get(key);
    
    // Remove old requests outside the window
    const validRequests = userRequests.filter(time => time > windowStart);
    
    if (validRequests.length >= maxRequests) {
      return false;
    }
    
    validRequests.push(now);
    this.requests.set(key, validRequests);
    return true;
  }

  getRemainingTime(key, windowMs = 60000) {
    if (!this.requests.has(key)) return 0;
    
    const userRequests = this.requests.get(key);
    if (userRequests.length === 0) return 0;
    
    const oldestRequest = Math.min(...userRequests);
    const remaining = windowMs - (Date.now() - oldestRequest);
    return Math.max(0, remaining);
  }
}

export const rateLimiter = new RateLimiter();

// Session management with expiry
export const sessionManager = {
  set(key, value, expiryHours = 24) {
    const item = {
      value,
      expiry: Date.now() + (expiryHours * 60 * 60 * 1000)
    };
    localStorage.setItem(key, JSON.stringify(item));
  },

  get(key) {
    const itemStr = localStorage.getItem(key);
    if (!itemStr) return null;

    try {
      const item = JSON.parse(itemStr);
      if (Date.now() > item.expiry) {
        localStorage.removeItem(key);
        return null;
      }
      return item.value;
    } catch {
      localStorage.removeItem(key);
      return null;
    }
  },

  remove(key) {
    localStorage.removeItem(key);
  },

  isValid(key) {
    return this.get(key) !== null;
  }
};

// Secure form data preparation
export const prepareFormData = (data) => {
  const sanitized = {};
  
  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeInput(value);
    } else {
      sanitized[key] = value;
    }
  }
  
  return sanitized;
};