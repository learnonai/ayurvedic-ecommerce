import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../utils/api';
import PhoneLogin from '../components/PhoneLogin';

const Login = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [loginMethod, setLoginMethod] = useState('email');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log('Attempting login with:', credentials);
    try {
      const response = await auth.login(credentials);
      localStorage.setItem('userToken', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      onLogin(response.data.user);
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      console.error('Error response:', error.response);
      alert('Login failed: ' + (error.response?.data?.message || 'Unknown error'));
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
                    className="form-control form-control-lg"
                    placeholder="Email"
                    value={credentials.email}
                    onChange={(e) => setCredentials({...credentials, email: e.target.value})}
                    required
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="password"
                    className="form-control form-control-lg"
                    placeholder="Password"
                    value={credentials.password}
                    onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                    required
                  />
                </div>
                  <button type="submit" className="btn btn-success btn-lg w-100" disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
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