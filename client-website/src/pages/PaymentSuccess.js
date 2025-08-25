import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { orders, payment } from '../utils/api';

const PaymentSuccess = ({ onOrderComplete }) => {
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('verifying');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const verificationDone = useRef(false);

  useEffect(() => {
    const verifyPayment = async () => {
      if (verificationDone.current) return;
      verificationDone.current = true;
      
      try {
        const transactionId = searchParams.get('transactionId');
        
        if (!transactionId) {
          setStatus('failed');
          setLoading(false);
          return;
        }

        // Verify payment with PhonePe
        const verificationResult = await payment.verify({ transactionId });
        
        if (verificationResult.data.success && (verificationResult.data.status === 'COMPLETED' || verificationResult.data.status === 'PAYMENT_SUCCESS')) {
          // Get pending order from localStorage
          const pendingOrder = JSON.parse(localStorage.getItem('pendingOrder') || '{}');
          
          if (pendingOrder.transactionId === transactionId) {
            // Create order in database
            const orderData = {
              ...pendingOrder,
              paymentStatus: 'paid',
              paymentId: transactionId
            };
            
            await orders.create(orderData);
            
            // Clear pending order
            localStorage.removeItem('pendingOrder');
            
            if (onOrderComplete) {
              onOrderComplete();
            }
            
            setStatus('success');
          } else {
            setStatus('failed');
          }
        } else {
          setStatus('failed');
        }
      } catch (error) {
        console.error('Payment verification error:', error);
        setStatus('failed');
      }
      
      setLoading(false);
    };

    verifyPayment();
  }, [searchParams, onOrderComplete]);

  if (loading) {
    return (
      <div className="container my-5 text-center">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Verifying payment...</span>
        </div>
        <p className="mt-3">Verifying your payment...</p>
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
          <p className="text-muted">There was an issue with your payment. Please try again.</p>
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

export default PaymentSuccess;