import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const DebugInfo = () => {
  const [debugInfo, setDebugInfo] = useState({
    apiUrl: '',
    environment: '',
    connectivity: 'checking...',
    timestamp: new Date().toISOString()
  });

  useEffect(() => {
    checkConnectivity();
  }, []);

  const checkConnectivity = async () => {
    const apiUrl = process.env.NODE_ENV === 'development' 
      ? 'http://localhost:5000/api' 
      : 'https://learnonai.com/api';

    setDebugInfo(prev => ({
      ...prev,
      apiUrl,
      environment: process.env.NODE_ENV || 'production'
    }));

    try {
      const response = await api.get('/orders');
      setDebugInfo(prev => ({
        ...prev,
        connectivity: `✅ Connected (${response.data.length} orders)`,
        lastCheck: new Date().toISOString()
      }));
    } catch (error) {
      setDebugInfo(prev => ({
        ...prev,
        connectivity: `❌ Failed: ${error.message}`,
        error: error.response?.data || error.message,
        lastCheck: new Date().toISOString()
      }));
    }
  };

  if (process.env.NODE_ENV === 'production') {
    return null; // Hide in production
  }

  return (
    <div className="card mt-3" style={{ fontSize: '12px' }}>
      <div className="card-header">
        <h6 className="mb-0">🔍 Debug Info</h6>
      </div>
      <div className="card-body">
        <div><strong>Environment:</strong> {debugInfo.environment}</div>
        <div><strong>API URL:</strong> {debugInfo.apiUrl}</div>
        <div><strong>Connectivity:</strong> {debugInfo.connectivity}</div>
        <div><strong>Last Check:</strong> {debugInfo.lastCheck}</div>
        {debugInfo.error && (
          <div className="text-danger">
            <strong>Error:</strong> {JSON.stringify(debugInfo.error, null, 2)}
          </div>
        )}
        <button 
          className="btn btn-sm btn-outline-primary mt-2"
          onClick={checkConnectivity}
        >
          Recheck Connection
        </button>
      </div>
    </div>
  );
};

export default DebugInfo;