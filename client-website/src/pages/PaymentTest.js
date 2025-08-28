import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const PaymentTest = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Log all URL parameters for debugging
    console.log('Payment redirect params:', Object.fromEntries(searchParams));
    
    // Check for transaction ID in various parameter names
    const transactionId = searchParams.get('transactionId') || 
                         searchParams.get('merchantOrderId') || 
                         searchParams.get('id') ||
                         searchParams.get('txnId');
    
    if (transactionId) {
      // Redirect to payment success with transaction ID
      navigate(`/payment-success?transactionId=${transactionId}`);
    } else {
      // No transaction ID found, redirect to cart
      navigate('/cart');
    }
  }, [searchParams, navigate]);

  return (
    <div className="container my-5 text-center">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Processing...</span>
      </div>
      <p className="mt-3">Processing payment response...</p>
    </div>
  );
};

export default PaymentTest;