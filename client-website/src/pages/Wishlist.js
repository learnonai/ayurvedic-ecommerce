import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { wishlist, products, BASE_URL } from '../utils/api';

const Wishlist = ({ onAddToCart, user }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchWishlist();
    }
  }, [user]);

  const fetchWishlist = async () => {
    try {
      const wishlistRes = await wishlist.get();
      const productPromises = wishlistRes.data.map(item => 
        products.getById(item.product)
      );
      const productResponses = await Promise.all(productPromises);
      const productsData = productResponses.map(res => res.data);
      setWishlistItems(productsData);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    }
    setLoading(false);
  };

  const removeFromWishlist = async (productId) => {
    try {
      await wishlist.remove(productId);
      setWishlistItems(wishlistItems.filter(item => item._id !== productId));
    } catch (error) {
      alert('Error removing from wishlist');
    }
  };

  if (!user) {
    return (
      <div className="container my-5 text-center">
        <h2>Please Login to View Wishlist</h2>
        <Link to="/login" className="btn btn-success">Login</Link>
      </div>
    );
  }

  if (loading) {
    return <div className="container my-5 text-center">Loading...</div>;
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="container my-5 text-center">
        <h2>Your Wishlist is Empty</h2>
        <Link to="/products" className="btn btn-success">Browse Products</Link>
      </div>
    );
  }

  return (
    <div className="container my-4">
      <h2>My Wishlist</h2>
      <div className="row">
        {wishlistItems.map(product => (
          <div key={product._id} className="col-md-4 mb-4">
            <div className="card h-100">
              {product.images && product.images.length > 0 ? (
                <img 
                  src={`${BASE_URL}/api/images/${product.images[0].replace('uploads/', '')}`}
                  className="card-img-top" 
                  alt={product.name}
                  style={{height: '200px', objectFit: 'cover'}}
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjZjhmOWZhIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iMTEwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iNDAiIGZpbGw9IiM2Yzc1N2QiIHRleHQtYW5jaG9yPSJtaWRkbGUiPvCfjL88L3RleHQ+Cjwvc3ZnPgo=';
                  }}
                />
              ) : (
                <div 
                  className="card-img-top d-flex align-items-center justify-content-center bg-light"
                  style={{height: '200px'}}
                >
                  <span style={{fontSize: '60px'}}>🌿</span>
                </div>
              )}
              <div className="card-body">
                <h5 className="card-title">{product.name}</h5>
                <p className="card-text">{product.description}</p>
                <p className="text-success fw-bold">₹{product.price}</p>
                <div className="d-flex gap-2">
                  <button 
                    className="btn btn-success flex-fill"
                    onClick={() => onAddToCart(product)}
                  >
                    Add to Cart
                  </button>
                  <button 
                    className="btn btn-outline-danger"
                    onClick={() => removeFromWishlist(product._id)}
                  >
                    ❤️
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;