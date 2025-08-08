import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { orders, payment } from '../utils/api';

const Checkout = ({ cart, user, onOrderComplete }) => {
  const [shippingAddress, setShippingAddress] = useState({
    name: user?.name || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create payment order
      const paymentOrder = await payment.createOrder(totalAmount);
      
      // Mock payment success
      const paymentResult = await payment.verify({
        orderId: paymentOrder.data.id,
        paymentId: 'pay_' + Date.now(),
        signature: 'mock_signature'
      });
      
      if (paymentResult.data.success) {
        // Create order after successful payment
        const orderData = {
          items: cart.map(item => ({
            product: item._id,
            quantity: item.quantity,
            price: item.price
          })),
          totalAmount,
          paymentStatus: 'paid',
          shippingAddress
        };
        
        await orders.create(orderData);
        onOrderComplete();
        alert('Order placed successfully!');
        navigate('/orders');
      }
    } catch (error) {
      alert('Order failed. Please try again.');
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
                      className="form-control"
                      placeholder="Full Name"
                      value={shippingAddress.name}
                      onChange={(e) => setShippingAddress({...shippingAddress, name: e.target.value})}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <input
                      type="tel"
                      className="form-control"
                      placeholder="Phone Number"
                      value={shippingAddress.phone}
                      onChange={(e) => setShippingAddress({...shippingAddress, phone: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <textarea
                    className="form-control"
                    placeholder="Address"
                    value={shippingAddress.address}
                    onChange={(e) => setShippingAddress({...shippingAddress, address: e.target.value})}
                    required
                  ></textarea>
                </div>
                <div className="row">
                  <div className="col-md-4 mb-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="City"
                      value={shippingAddress.city}
                      onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})}
                      required
                    />
                  </div>
                  <div className="col-md-4 mb-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="State"
                      value={shippingAddress.state}
                      onChange={(e) => setShippingAddress({...shippingAddress, state: e.target.value})}
                      required
                    />
                  </div>
                  <div className="col-md-4 mb-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Pincode"
                      value={shippingAddress.pincode}
                      onChange={(e) => setShippingAddress({...shippingAddress, pincode: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <button type="submit" className="btn btn-success" disabled={loading}>
                  {loading ? 'Processing...' : `Pay ₹${totalAmount}`}
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