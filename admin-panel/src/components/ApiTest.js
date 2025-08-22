import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ApiTest = () => {
  const [apiStatus, setApiStatus] = useState('Testing...');
  const [apiUrl, setApiUrl] = useState('');

  useEffect(() => {
    const testApi = async () => {
      const baseUrl = process.env.NODE_ENV === 'development' 
        ? 'http://localhost:5000' 
        : 'http://learnonai.com:8080';
      
      setApiUrl(baseUrl);
      
      try {
        const response = await axios.get(`${baseUrl}/`);
        setApiStatus(`✅ API Connected: ${response.data.message}`);
      } catch (error) {
        setApiStatus(`❌ API Error: ${error.message}`);
      }
    };
    
    testApi();
  }, []);

  return (
    <div className="alert alert-info">
      <h5>API Connection Test</h5>
      <p><strong>Environment:</strong> {process.env.NODE_ENV}</p>
      <p><strong>API URL:</strong> {apiUrl}</p>
      <p><strong>Status:</strong> {apiStatus}</p>
    </div>
  );
};

export default ApiTest;