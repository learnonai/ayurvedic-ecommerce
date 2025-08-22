import React from 'react';

const LoadingSpinner = ({ size = 'md', text = 'Loading...' }) => {
  const sizeClass = size === 'sm' ? 'spinner-border-sm' : size === 'lg' ? 'spinner-border-lg' : '';
  
  return (
    <div className="d-flex justify-content-center align-items-center p-4">
      <div className={`spinner-border text-success ${sizeClass}`} role="status">
        <span className="visually-hidden">{text}</span>
      </div>
      {text && <span className="ms-2">{text}</span>}
    </div>
  );
};

export const PageLoader = () => (
  <div className="d-flex justify-content-center align-items-center" style={{minHeight: '50vh'}}>
    <div className="text-center">
      <div className="spinner-border text-success mb-3" style={{width: '3rem', height: '3rem'}} role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="text-muted">Loading your Herbal store...</p>
    </div>
  </div>
);

export default LoadingSpinner;