import React from 'react';
import { useNavigate } from 'react-router-dom';

const PaymentFailure = () => {
  const navigate = useNavigate();

  return (
    <div className="container my-5 text-center">
      <div className="card mx-auto" style={{maxWidth: '500px'}}>
        <div className="card-body">
          <div className="text-danger mb-3">
            <i className="fas fa-times-circle" style={{fontSize: '4rem'}}></i>
          </div>
          <h2 className="text-danger">Payment Failed</h2>
          <p className="text-muted">Your payment could not be processed. Please try again.</p>
          <div className="d-flex gap-2 justify-content-center">
            <button 
              className="btn btn-danger"
              onClick={() => navigate('/checkout')}
            >
              Try Again
            </button>
            <button 
              className="btn btn-outline-secondary"
              onClick={() => navigate('/cart')}
            >
              Back to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailure;