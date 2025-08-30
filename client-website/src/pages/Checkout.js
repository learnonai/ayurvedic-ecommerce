import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { orders, payment } from '../utils/api';
import { useFormValidation, validateName, validatePhone, validateAddress, validateCity, validateState, validatePincode, FormError } from '../components/FormValidation';

const Checkout = ({ cart, user, onOrderComplete }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const validationRules = {
    name: { required: true, validator: validateName, message: 'Name must be at least 2 characters' },
    phone: { required: true, validator: validatePhone, message: 'Please enter a valid 10-digit phone number' },
    address: { required: true, validator: validateAddress, message: 'Address must be at least 10 characters' },
    city: { required: true, validator: validateCity, message: 'City name is required' },
    state: { required: true, validator: validateState, message: 'State name is required' },
    pincode: { required: true, validator: validatePincode, message: 'Please enter a valid 6-digit pincode' }
  };
  
  const { values: shippingAddress, errors, touched, handleChange, handleBlur, validateAll } = useFormValidation(
    {
      name: user?.name || '',
      phone: user?.phone || '',
      address: '',
      city: '',
      state: '',
      pincode: ''
    },
    validationRules
  );

  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateAll()) {
      return;
    }
    
    setLoading(true);

    try {
      // Create PhonePe payment
      const paymentResponse = await payment.createOrder(totalAmount);
      
      if (paymentResponse.data.success) {
        // Store order data for after payment
        const orderData = {
          items: cart.map(item => ({
            product: item._id,
            quantity: item.quantity,
            price: item.price
          })),
          totalAmount,
          shippingAddress,
          transactionId: paymentResponse.data.transactionId
        };
        
        localStorage.setItem('pendingOrder', JSON.stringify(orderData));
        
        // Redirect to PhonePe
        window.location.href = paymentResponse.data.paymentUrl;
      } else {
        throw new Error(paymentResponse.data.message || 'Payment failed');
      }
    } catch (error) {
      alert('Payment failed. Please try again.');
    }
    setLoading(false);
  };

  if (cart.length === 0) {
    return (
      <div className="container my-5 text-center">
        <h2>Your cart is empty</h2>
        <button className="btn btn-success" onClick={() => navigate('/products')}>
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="container my-4">
      <h2>Checkout</h2>
      <div className="row">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h5>Shipping Address</h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <input
                      type="text"
                      className={`form-control ${errors.name && touched.name ? 'is-invalid' : ''}`}
                      placeholder="Full Name"
                      value={shippingAddress.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      onBlur={() => handleBlur('name')}
                      required
                    />
                    <FormError message={touched.name ? errors.name : ''} />
                  </div>
                  <div className="col-md-6 mb-3">
                    <input
                      type="tel"
                      className={`form-control ${errors.phone && touched.phone ? 'is-invalid' : ''}`}
                      placeholder="Phone Number (10 digits)"
                      value={shippingAddress.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      onBlur={() => handleBlur('phone')}
                      required
                    />
                    <FormError message={touched.phone ? errors.phone : ''} />
                  </div>
                </div>
                <div className="mb-3">
                  <textarea
                    className={`form-control ${errors.address && touched.address ? 'is-invalid' : ''}`}
                    placeholder="Full Address (minimum 10 characters)"
                    value={shippingAddress.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                    onBlur={() => handleBlur('address')}
                    required
                  ></textarea>
                  <FormError message={touched.address ? errors.address : ''} />
                </div>
                <div className="row">
                  <div className="col-md-4 mb-3">
                    <input
                      type="text"
                      className={`form-control ${errors.city && touched.city ? 'is-invalid' : ''}`}
                      placeholder="City"
                      value={shippingAddress.city}
                      onChange={(e) => handleChange('city', e.target.value)}
                      onBlur={() => handleBlur('city')}
                      required
                    />
                    <FormError message={touched.city ? errors.city : ''} />
                  </div>
                  <div className="col-md-4 mb-3">
                    <input
                      type="text"
                      className={`form-control ${errors.state && touched.state ? 'is-invalid' : ''}`}
                      placeholder="State"
                      value={shippingAddress.state}
                      onChange={(e) => handleChange('state', e.target.value)}
                      onBlur={() => handleBlur('state')}
                      required
                    />
                    <FormError message={touched.state ? errors.state : ''} />
                  </div>
                  <div className="col-md-4 mb-3">
                    <input
                      type="text"
                      className={`form-control ${errors.pincode && touched.pincode ? 'is-invalid' : ''}`}
                      placeholder="Pincode (6 digits)"
                      value={shippingAddress.pincode}
                      onChange={(e) => handleChange('pincode', e.target.value)}
                      onBlur={() => handleBlur('pincode')}
                      required
                      maxLength="6"
                    />
                    <FormError message={touched.pincode ? errors.pincode : ''} />
                  </div>
                </div>
                <button type="submit" className="btn btn-success" disabled={loading}>
                  {loading ? 'Processing...' : `Pay ₹${totalAmount} with PhonePe`}
                </button>
              </form>
            </div>
          </div>
        </div>
        
        <div className="col-md-4">
          <div className="card">
            <div className="card-header">
              <h5>Order Summary</h5>
            </div>
            <div className="card-body">
              {cart.map(item => (
                <div key={item._id} className="d-flex justify-content-between mb-2">
                  <span>{item.name} x{item.quantity}</span>
                  <span>₹{item.price * item.quantity}</span>
                </div>
              ))}
              <hr />
              <div className="d-flex justify-content-between">
                <strong>Total: ₹{totalAmount}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;