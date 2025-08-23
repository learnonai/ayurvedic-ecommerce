import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { wishlist, BASE_URL } from '../utils/api';
import { addToRecentlyViewed } from './RecentlyViewed';

const ProductCard = ({ product, onAddToCart, user }) => {
  const [loading, setLoading] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (product) {
      addToRecentlyViewed(product);
    }
  }, [product]);
  
  const addToWishlist = async () => {
    if (!user) {
      navigate('/register');
      return;
    }
    setWishlistLoading(true);
    try {
      await wishlist.add(product._id);
      alert('Added to wishlist!');
    } catch (error) {
      alert('Error adding to wishlist');
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if ((product.stock || 0) === 0) {
      alert('Sorry, this product is out of stock!');
      return;
    }
    setLoading(true);
    try {
      await onAddToCart(product);
    } finally {
      setLoading(false);
    }
  };

  const nextImage = () => {
    if (product.images && product.images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
    }
  };

  const prevImage = () => {
    if (product.images && product.images.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
    }
  };

  return (
    <div className="card h-100" style={{cursor: 'pointer'}}>
      {product.images && product.images.length > 0 ? (
        <div className="position-relative" style={{height: '200px'}} onClick={() => navigate(`/product/${product._id}`)}>
          {imageLoading && (
            <div className="position-absolute w-100 h-100 d-flex align-items-center justify-content-center bg-light">
              <div className="spinner-border text-success" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}
          <img 
            src={`${BASE_URL}/api/images/${product.images[currentImageIndex].replace('uploads/', '')}`}
            className="card-img-top" 
            alt={product.name}
            style={{
              height: '200px', 
              objectFit: 'cover',
              backgroundColor: '#f8f9fa',
              transition: 'opacity 0.3s ease'
            }}
            onLoad={() => setImageLoading(false)}
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentElement.querySelector('.fallback-image').style.display = 'flex';
            }}
            loading="lazy"
            decoding="async"
          />
          {!imageLoading && (
            <div 
              className="card-img-top d-flex align-items-center justify-content-center bg-light fallback-image"
              style={{height: '200px', display: 'none', position: 'absolute', top: 0, left: 0, right: 0}}
            >
              <span style={{fontSize: '60px'}}>🌿</span>
            </div>
          )}
          
          {product.images && product.images.length > 1 && (
            <>
              <button 
                className="btn btn-sm btn-dark position-absolute top-50 start-0 translate-middle-y ms-2"
                onClick={prevImage}
                style={{opacity: 0.7, zIndex: 1}}
              >
                ‹
              </button>
              <button 
                className="btn btn-sm btn-dark position-absolute top-50 end-0 translate-middle-y me-2"
                onClick={nextImage}
                style={{opacity: 0.7, zIndex: 1}}
              >
                ›
              </button>
              <div className="position-absolute bottom-0 start-50 translate-middle-x mb-2">
                <small className="badge bg-dark">{currentImageIndex + 1}/{product.images.length}</small>
              </div>
            </>
          )}
        </div>
      ) : (
        <div 
          className="card-img-top d-flex align-items-center justify-content-center bg-light"
          style={{height: '200px'}}
          onClick={() => navigate(`/product/${product._id}`)}
        >
          <span style={{fontSize: '60px'}}>🌿</span>
        </div>
      )}
      <div className="card-body" onClick={() => navigate(`/product/${product._id}`)}>
        <h5 className="card-title">{product.name}</h5>
        <p className="card-text">{product.description}</p>
        <p className="text-success fw-bold">₹{product.price}</p>
        <p className="text-muted small">Category: {product.category}</p>
        
        <div className="mb-2">
          {(product.stock || 0) > 0 ? (
            <span className="badge bg-success">
              ✓ In Stock ({product.stock || 0} available)
            </span>
          ) : (
            <span className="badge bg-danger">
              ✗ Out of Stock
            </span>
          )}
        </div>
        
        {product.benefits && (
          <div className="mb-2">
            <small className="text-muted">Benefits:</small>
            <ul className="small">
              {product.benefits.map((benefit, index) => (
                <li key={index}>{benefit}</li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="d-flex gap-2" onClick={(e) => e.stopPropagation()}>
          <button 
            className="btn btn-success flex-fill" 
            onClick={handleAddToCart}
            disabled={(product.stock || 0) === 0 || loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                Adding...
              </>
            ) : (product.stock || 0) === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
          <button 
            className="btn btn-outline-danger"
            onClick={addToWishlist}
            disabled={wishlistLoading}
            title="Add to Wishlist"
          >
            {wishlistLoading ? (
              <span className="spinner-border spinner-border-sm" role="status"></span>
            ) : '❤️'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;