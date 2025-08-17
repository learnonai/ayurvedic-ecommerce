import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BASE_URL } from '../utils/api';

const Cart = ({ cart, onUpdateQuantity, onRemoveFromCart, user }) => {
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const navigate = useNavigate();
  
  const handleCheckout = () => {
    if (!user) {
      alert('Please login to checkout');
      navigate('/login');
      return;
    }
    navigate('/checkout');
  };

  if (cart.length === 0) {
    return (
      <div className="container my-5 text-center">
        <h2>Your Cart is Empty</h2>
        <Link to="/products" className="btn btn-success">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="container my-4">
      <h2>Shopping Cart</h2>
      
      <div className="row">
        <div className="col-md-8">
          {cart.map(item => (
            <div key={item._id} className="card mb-3">
              <div className="card-body">
                <div className="row align-items-center">
                  <div className="col-md-2">
                    {item.images && item.images.length > 0 ? (
                      <img 
                        src={`${BASE_URL}/api/images/${item.images[0].replace('uploads/', '')}`}
                        alt={item.name}
                        className="img-fluid rounded"
                        style={{height: '60px', width: '60px', objectFit: 'cover'}}
                        onError={(e) => {
                          e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjZjhmOWZhIi8+Cjx0ZXh0IHg9IjMwIiB5PSIzNSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjI0IiBmaWxsPSIjNmM3NTdkIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7wn42/PC90ZXh0Pgo8L3N2Zz4K';
                        }}
                      />
                    ) : (
                      <div 
                        className="d-flex align-items-center justify-content-center bg-light rounded"
                        style={{height: '60px', width: '60px'}}
                      >
                        <span style={{fontSize: '24px'}}>🌿</span>
                      </div>
                    )}
                  </div>
                  <div className="col-md-4">
                    <h5>{item.name}</h5>
                    <p className="text-muted small">{item.description}</p>
                  </div>
                  <div className="col-md-2">
                    <strong>₹{item.price}</strong>
                  </div>
                  <div className="col-md-2">
                    <div className="input-group">
                      <button 
                        className="btn btn-outline-secondary"
                        onClick={() => onUpdateQuantity(item._id, item.quantity - 1)}
                      >-</button>
                      <input 
                        type="text" 
                        className="form-control text-center" 
                        value={item.quantity} 
                        readOnly 
                      />
                      <button 
                        className="btn btn-outline-secondary"
                        onClick={() => onUpdateQuantity(item._id, item.quantity + 1)}
                      >+</button>
                    </div>
                  </div>
                  <div className="col-md-2">
                    <button 
                      className="btn btn-danger btn-sm"
                      onClick={() => onRemoveFromCart(item._id)}
                    >Remove</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5>Order Summary</h5>
              <hr />
              <div className="d-flex justify-content-between">
                <span>Total:</span>
                <strong>₹{total}</strong>
              </div>
              <button 
                className="btn btn-success w-100 mt-3"
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;