import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { payment, orders } from '../utils/api';

const PaymentSuccess = () => {
  const [status, setStatus] = useState('verifying');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  useEffect(() => {
    const verifyPaymentAndCreateOrder = async () => {
      try {
        const transactionId = searchParams.get('transactionId');
        const paymentStatus = searchParams.get('status');
        
        if (!transactionId) {
          setStatus('error');
          return;
        }
        
        // Check URL status parameter first
        if (paymentStatus === 'failed' || paymentStatus === 'error') {
          setStatus('failed');
          return;
        }
        
        // Only proceed if status is explicitly success
        if (paymentStatus === 'success') {
          try {
            // Always verify with backend before creating order
            const verifyResponse = await payment.verify({ transactionId });
            
            if (verifyResponse.data.success && verifyResponse.data.status === 'COMPLETED') {
              // Get pending order from localStorage
              const pendingOrderStr = localStorage.getItem('pendingOrder');
              
              if (pendingOrderStr) {
                const orderData = JSON.parse(pendingOrderStr);
                
                // Create order in database only after successful verification
                const orderResponse = await orders.create({
                  ...orderData,
                  paymentStatus: 'completed',
                  paymentId: transactionId
                });
                
                if (orderResponse.data.success) {
                  localStorage.removeItem('pendingOrder');
                  localStorage.removeItem('cart'); // Clear cart after successful order
                  setStatus('success');
                } else {
                  setStatus('error');
                }
              } else {
                setStatus('error');
              }
            } else {
              // Verification failed - payment not actually completed
              console.log('Payment verification failed:', verifyResponse.data);
              setStatus('failed');
            }
          } catch (verifyError) {
            console.error('Payment verification error:', verifyError);
            setStatus('failed');
          }
        } else {
          // Any other status (failed, cancelled, error) - no order creation
          console.log('Payment not successful, status:', paymentStatus);
          setStatus('failed');
        }
      } catch (error) {
        console.error('Payment verification error:', error);
        setStatus('error');
      }
    };
    
    verifyPaymentAndCreateOrder();
  }, [searchParams]);
  
  const handleContinue = () => {
    if (status === 'success') {
      navigate('/orders');
    } else {
      navigate('/cart');
    }
  };
  
  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card text-center">
            <div className="card-body">
              {status === 'verifying' && (
                <>
                  <div className="spinner-border text-primary mb-3" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <h4>Verifying Payment...</h4>
                  <p>Please wait while we confirm your payment.</p>
                </>
              )}
              
              {status === 'success' && (
                <>
                  <i className="fas fa-check-circle text-success mb-3" style={{ fontSize: '3rem' }}></i>
                  <h4 className="text-success">Payment Successful!</h4>
                  <p>Your order has been placed successfully.</p>
                  <button className="btn btn-success" onClick={handleContinue}>
                    View Orders
                  </button>
                </>
              )}
              
              {status === 'failed' && (
                <>
                  <i className="fas fa-times-circle text-warning mb-3" style={{ fontSize: '3rem' }}></i>
                  <h4 className="text-warning">Payment Failed</h4>
                  <p>Your payment was not completed. Please try again.</p>
                  <button className="btn btn-primary" onClick={handleContinue}>
                    Return to Cart
                  </button>
                </>
              )}
              
              {status === 'error' && (
                <>
                  <i className="fas fa-exclamation-triangle text-danger mb-3" style={{ fontSize: '3rem' }}></i>
                  <h4 className="text-danger">Something Went Wrong</h4>
                  <p>There was an error processing your payment. Please contact support.</p>
                  <button className="btn btn-secondary" onClick={handleContinue}>
                    Return to Cart
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
