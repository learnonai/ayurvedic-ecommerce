import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { wishlist, products } from '../utils/api';

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