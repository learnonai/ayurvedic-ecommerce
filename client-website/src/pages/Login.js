import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../utils/api';
import PhoneLogin from '../components/PhoneLogin';
import { useFormValidation, validateEmail, validatePassword, FormError } from '../components/FormValidation';
import { sanitizeEmail, sanitizeInput, rateLimiter, sessionManager } from '../utils/security';

const Login = ({ onLogin }) => {
  const [loading, setLoading] = useState(false);
  const [loginMethod, setLoginMethod] = useState('email');
  const navigate = useNavigate();
  
  const validationRules = {
    email: { required: true, validator: validateEmail, message: 'Please enter a valid email' },
    password: { required: true, validator: validatePassword, message: 'Password must be at least 6 characters' }
  };
  
  const { values: credentials, errors, touched, handleChange, handleBlur, validateAll } = useFormValidation(
    { email: '', password: '' },
    validationRules
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateAll()) {
      return;
    }

    // Rate limiting check
    const clientId = 'login_' + (credentials.email || 'anonymous');
    if (!rateLimiter.isAllowed(clientId, 5, 300000)) { // 5 attempts per 5 minutes
      const remainingTime = Math.ceil(rateLimiter.getRemainingTime(clientId, 300000) / 1000);
      alert(`Too many login attempts. Please try again in ${remainingTime} seconds.`);
      return;
    }
    
    setLoading(true);
    
    // Sanitize credentials (backend handles password hashing)
    const sanitizedCredentials = {
      email: sanitizeEmail(credentials.email),
      password: sanitizeInput(credentials.password)
    };
    
    if (!sanitizedCredentials.email) {
      alert('Please enter a valid email address');
      setLoading(false);
      return;
    }
    
    try {
      const response = await auth.login(sanitizedCredentials);
      
      // Use secure session management
      sessionManager.set('userToken', response.data.token, 24); // 24 hours
      sessionManager.set('user', response.data.user, 24);
      
      onLogin(response.data.user);
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed: ' + (error.response?.data?.message || 'Invalid credentials'));
    }
    setLoading(false);
  };

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h3 className="text-center mb-4">Login</h3>
              
              <div className="btn-group w-100 mb-3" role="group">
                <button 
                  type="button" 
                  className={`btn ${loginMethod === 'email' ? 'btn-success' : 'btn-outline-success'}`}
                  onClick={() => setLoginMethod('email')}
                >
                  📧 Email
                </button>
                <button 
                  type="button" 
                  className={`btn ${loginMethod === 'phone' ? 'btn-success' : 'btn-outline-success'}`}
                  onClick={() => setLoginMethod('phone')}
                >
                  📱 Phone
                </button>
              </div>
              
              {loginMethod === 'email' ? (
                <>
                  <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <input
                    type="email"
                    className={`form-control form-control-lg ${errors.email && touched.email ? 'is-invalid' : ''}`}
                    placeholder="Email"
                    value={credentials.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    onBlur={() => handleBlur('email')}
                    required
                  />
                  <FormError message={touched.email ? errors.email : ''} />
                </div>
                <div className="mb-3">
                  <input
                    type="password"
                    className={`form-control form-control-lg ${errors.password && touched.password ? 'is-invalid' : ''}`}
                    placeholder="Password"
                    value={credentials.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    onBlur={() => handleBlur('password')}
                    required
                  />
                  <FormError message={touched.password ? errors.password : ''} />
                </div>
                  <button type="submit" className="btn btn-success btn-lg w-100" disabled={loading}>
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Logging in...
                      </>
                    ) : 'Login'}
                  </button>
                </form>
                </>
              ) : (
                <PhoneLogin onLogin={onLogin} />
              )}
              <div className="text-center mt-3">
                <div className="mb-2">
                  <button 
                    type="button" 
                    className="btn btn-link p-0 text-decoration-none"
                    onClick={() => {
                      const email = prompt('Enter your email address:');
                      if (email && email.includes('@')) {
                        alert('For demo purposes: Use password "password123" for test@example.com or "admin123" for admin@ayurveda.com');
                      } else if (email) {
                        alert('Please enter a valid email address.');
                      }
                    }}
                  >
                    Forgot Password?
                  </button>
                </div>
                <Link to="/register">Don't have an account? Register</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;