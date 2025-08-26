import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { orders } from '../utils/api';

const PaymentSuccess = ({ onOrderComplete }) => {
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('processing');
  const navigate = useNavigate();

  useEffect(() => {
    const processOrder = async () => {
      try {
        // Get pending order from localStorage
        const pendingOrder = JSON.parse(localStorage.getItem('pendingOrder') || '{}');
        
        if (pendingOrder.items) {
          // Create order in database
          const orderData = {
            ...pendingOrder,
            paymentStatus: 'paid'
          };
          
          await orders.create(orderData);
          
          // Clear pending order
          localStorage.removeItem('pendingOrder');
          
          if (onOrderComplete) {
            onOrderComplete();
          }
          
          setStatus('success');
        } else {
          setStatus('error');
        }
      } catch (error) {
        setStatus('error');
      }
      
      setLoading(false);
    };

    processOrder();
  }, [onOrderComplete]);

  if (loading) {
    return (
      <div className="container my-5 text-center">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Processing...</span>
        </div>
        <p className="mt-3">Processing your order...</p>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="container my-5 text-center">
        <div className="card mx-auto" style={{maxWidth: '500px'}}>
          <div className="card-body">
            <div className="text-success mb-3">
              <i className="fas fa-check-circle" style={{fontSize: '4rem'}}></i>
            </div>
            <h2 className="text-success">Payment Successful!</h2>
            <p className="text-muted">Your order has been placed successfully.</p>
            <div className="d-flex gap-2 justify-content-center">
              <button 
                className="btn btn-success"
                onClick={() => navigate('/orders')}
              >
                View Orders
              </button>
              <button 
                className="btn btn-outline-success"
                onClick={() => navigate('/products')}
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container my-5 text-center">
      <div className="card mx-auto" style={{maxWidth: '500px'}}>
        <div className="card-body">
          <div className="text-danger mb-3">
            <i className="fas fa-times-circle" style={{fontSize: '4rem'}}></i>
          </div>
          <h2 className="text-danger">Payment Failed</h2>
          <p className="text-muted">There was an issue processing your order.</p>
          <button 
            className="btn btn-danger"
            onClick={() => navigate('/checkout')}
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;