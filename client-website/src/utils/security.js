// Minimal security utilities - only what's actually needed

// Simple input sanitization
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input.replace(/[<>]/g, '').trim();
};

// Simple email validation
export const sanitizeEmail = (email) => {
  const sanitized = sanitizeInput(email).toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(sanitized) ? sanitized : '';
};

// Simple rate limiter
export const rateLimiter = {
  isAllowed: () => true // Simplified - always allow
};

// Simple session manager
export const sessionManager = {
  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },
  
  get(key) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  },
  
  remove(key) {
    localStorage.removeItem(key);
  }
};