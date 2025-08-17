import React, { useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../utils/api';

const PhoneLogin = ({ onLogin }) => {
  const [step, setStep] = useState(1); // 1: phone, 2: otp
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const sendOTP = async (e) => {
    e.preventDefault();
    if (phone.length !== 10) {
      alert('Please enter a valid 10-digit phone number');
      return;
    }
    
    setLoading(true);
    try {
      await axios.post(`${BASE_URL}/api/sms/send-otp`, { phone });
      setStep(2);
      alert('OTP sent to your phone! Check console for demo OTP.');
    } catch (error) {
      alert('Failed to send OTP');
    }
    setLoading(false);
  };

  const verifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}/api/sms/verify-otp`, { phone, otp });
      localStorage.setItem('userToken', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      onLogin(response.data.user);
      alert('Phone login successful!');
    } catch (error) {
      alert('Invalid OTP');
    }
    setLoading(false);
  };

  return (
    <div className="card">
      <div className="card-body">
        <h5 className="text-center mb-3">📱 Login with Phone</h5>
        
        {step === 1 ? (
          <form onSubmit={sendOTP}>
            <div className="mb-3">
              <input
                type="tel"
                className="form-control form-control-lg"
                placeholder="Enter 10-digit phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                maxLength="10"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100" disabled={loading}>
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={verifyOTP}>
            <p className="text-center">OTP sent to: <strong>+91 {phone}</strong></p>
            <div className="mb-3">
              <input
                type="text"
                className="form-control form-control-lg text-center"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength="6"
                style={{fontSize: '24px', letterSpacing: '5px'}}
                required
              />
            </div>
            <button type="submit" className="btn btn-success w-100 mb-2" disabled={loading}>
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
            <button 
              type="button" 
              className="btn btn-outline-secondary w-100"
              onClick={() => setStep(1)}
            >
              Change Phone Number
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default PhoneLogin;