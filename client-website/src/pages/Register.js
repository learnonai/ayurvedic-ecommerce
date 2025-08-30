import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../utils/api';
import { useFormValidation, validateEmail, validatePhone, validatePassword, validateName, FormError } from '../components/FormValidation';
import { sanitizeEmail, sanitizeInput, rateLimiter, sessionManager } from '../utils/security';

const Register = ({ onLogin }) => {
  const [loading, setLoading] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const navigate = useNavigate();
  
  const validationRules = {
    name: { required: true, validator: validateName, message: 'Name must be at least 2 characters' },
    email: { required: true, validator: validateEmail, message: 'Please enter a valid email' },
    phone: { required: true, validator: validatePhone, message: 'Please enter a valid phone number' },
    password: { required: true, validator: validatePassword, message: 'Password must be at least 6 characters' }
  };
  
  const { values: formData, errors, touched, handleChange, handleBlur, validateAll } = useFormValidation(
    { name: '', email: '', phone: '', password: '' },
    validationRules
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateAll()) {
      return;
    }

    // Rate limiting check
    const clientId = 'register_' + (formData.email || 'anonymous');
    if (!rateLimiter.isAllowed(clientId, 3, 600000)) { // 3 attempts per 10 minutes
      const remainingTime = Math.ceil(rateLimiter.getRemainingTime(clientId, 600000) / 1000);
      alert(`Too many registration attempts. Please try again in ${remainingTime} seconds.`);
      return;
    }
    
    setLoading(true);
    
    // Sanitize form data (backend handles password hashing)
    const sanitizedData = {
      name: sanitizeInput(formData.name),
      email: sanitizeEmail(formData.email),
      phone: sanitizeInput(formData.phone),
      password: sanitizeInput(formData.password)
    };
    
    if (!sanitizedData.email) {
      alert('Please enter a valid email address');
      setLoading(false);
      return;
    }
    
    if (!sanitizedData.phone || sanitizedData.phone.length < 10) {
      alert('Please enter a valid phone number');
      setLoading(false);
      return;
    }
    
    try {
      const response = await auth.register(sanitizedData);
      if (response.data.user.isVerified) {
        sessionManager.set('userToken', response.data.token, 24);
        sessionManager.set('user', response.data.user, 24);
        onLogin(response.data.user);
        navigate('/');
      } else {
        setUserEmail(sanitizedData.email);
        setShowVerification(true);
        alert(response.data.message);
      }
    } catch (error) {
      alert('Registration failed: ' + (error.response?.data?.message || 'Please try again'));
    }
    setLoading(false);
  };

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h3 className="text-center mb-4">Register</h3>
              
              {showVerification ? (
                <div className="alert alert-success">
                  <h4>Registration Successful!</h4>
                  <p>Please check your email for verification code.</p>
                  <button className="btn btn-primary" onClick={() => {
                    setShowVerification(false);
                    navigate('/login');
                  }}>
                    Continue to Login
                  </button>
                </div>
              ) : (
                <>
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <input
                        type="text"
                        className={`form-control form-control-lg ${errors.name && touched.name ? 'is-invalid' : ''}`}
                        placeholder="Full Name"
                        value={formData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        onBlur={() => handleBlur('name')}
                        required
                      />
                      <FormError message={touched.name ? errors.name : ''} />
                    </div>
                    <div className="mb-3">
                      <input
                        type="email"
                        className={`form-control form-control-lg ${errors.email && touched.email ? 'is-invalid' : ''}`}
                        placeholder="Email"
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        onBlur={() => handleBlur('email')}
                        required
                      />
                      <FormError message={touched.email ? errors.email : ''} />
                    </div>
                    <div className="mb-3">
                      <input
                        type="tel"
                        className={`form-control form-control-lg ${errors.phone && touched.phone ? 'is-invalid' : ''}`}
                        placeholder="Phone Number"
                        value={formData.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                        onBlur={() => handleBlur('phone')}
                        required
                      />
                      <FormError message={touched.phone ? errors.phone : ''} />
                    </div>

                    <div className="mb-3">
                      <input
                        type="password"
                        className={`form-control form-control-lg ${errors.password && touched.password ? 'is-invalid' : ''}`}
                        placeholder="Password (min 6 characters)"
                        value={formData.password}
                        onChange={(e) => handleChange('password', e.target.value)}
                        onBlur={() => handleBlur('password')}
                        required
                        minLength="6"
                      />
                      <FormError message={touched.password ? errors.password : ''} />
                    </div>
                    <button type="submit" className="btn btn-success btn-lg w-100" disabled={loading}>
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Registering...
                        </>
                      ) : 'Register'}
                    </button>
                  </form>
                </>
              )}
              {!showVerification && (
                <div className="text-center mt-3">
                  <Link to="/login">Already have an account? Login</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;