import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../utils/api';

const EmailVerification = ({ email, onVerified }) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await axios.post(`${BASE_URL}/api/auth/verify-email`, {
        email,
        code
      });
      
      alert('Email verified successfully!');
      onVerified();
      navigate('/');
    } catch (error) {
      alert(error.response?.data?.message || 'Verification failed');
    }
    setLoading(false);
  };

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body text-center">
              <h3 className="mb-4">📧 Verify Your Email</h3>
              <p>We've sent a 6-digit verification code to:</p>
              <p className="fw-bold text-success">{email}</p>
              
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control text-center"
                    placeholder="Enter 6-digit code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    maxLength="6"
                    required
                    style={{fontSize: '24px', letterSpacing: '5px'}}
                  />
                </div>
                <button 
                  type="submit" 
                  className="btn btn-success w-100" 
                  disabled={loading || code.length !== 6}
                >
                  {loading ? 'Verifying...' : 'Verify Email'}
                </button>
              </form>
              
              <div className="mt-3">
                <small className="text-muted">
                  Didn't receive the code? Check your spam folder or contact support.
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;