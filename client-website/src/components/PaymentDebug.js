import React, { useState } from 'react';
import { payment } from '../utils/api';
import { sessionManager } from '../utils/security';

const PaymentDebug = () => {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testPayment = async () => {
    setLoading(true);
    setResult('Testing payment...');
    
    try {
      // Check if user is logged in
      const token = sessionManager.get('userToken');
      const user = sessionManager.get('user');
      
      setResult(prev => prev + `\nToken: ${token ? 'Present' : 'Missing'}`);
      setResult(prev => prev + `\nUser: ${user ? JSON.stringify(user) : 'Missing'}`);
      
      if (!token) {
        setResult(prev => prev + '\nERROR: User not logged in');
        return;
      }
      
      // Test payment API
      const response = await payment.createOrder(100);
      setResult(prev => prev + `\nPayment Response: ${JSON.stringify(response.data, null, 2)}`);
      
    } catch (error) {
      setResult(prev => prev + `\nERROR: ${error.message}`);
      if (error.response) {
        setResult(prev => prev + `\nResponse: ${JSON.stringify(error.response.data, null, 2)}`);
      }
    }
    
    setLoading(false);
  };

  return (
    <div className="card m-3">
      <div className="card-header">
        <h5>Payment Debug Tool</h5>
      </div>
      <div className="card-body">
        <button 
          className="btn btn-primary" 
          onClick={testPayment}
          disabled={loading}
        >
          {loading ? 'Testing...' : 'Test Payment'}
        </button>
        <pre className="mt-3 p-3 bg-light" style={{fontSize: '12px'}}>
          {result}
        </pre>
      </div>
    </div>
  );
};

export default PaymentDebug;