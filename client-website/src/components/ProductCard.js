import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { wishlist, BASE_URL } from '../utils/api';
import { addToRecentlyViewed } from './RecentlyViewed';

const ProductCard = ({ product, onAddToCart, user }) => {
  const [loading, setLoading] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
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

  const hasImage = product.images && product.images.length > 0;
  const imageUrl = hasImage ? `${BASE_URL}/api/images/${product.images[0].replace('uploads/', '').replace('pdt-img/', '')}` : null;

  return (
    <div className="card h-100" style={{cursor: 'pointer'}}>
      <div className="position-relative" style={{height: '200px'}} onClick={() => navigate(`/product/${product._id}`)}>
        {hasImage && !imageError ? (
          <>
            {!imageLoaded && (
              <div className="position-absolute w-100 h-100 d-flex align-items-center justify-content-center bg-light">
                <div className="spinner-border text-success" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            )}
            <img 
              src={imageUrl}
              className="card-img-top" 
              alt={product.name}
              style={{
                height: '200px', 
                width: '100%',
                objectFit: 'cover',
                display: imageLoaded ? 'block' : 'none'
              }}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />
          </>
        ) : (
          <div className="d-flex align-items-center justify-content-center bg-light h-100">
            <span style={{fontSize: '60px'}}>🌿</span>
          </div>
        )}
      </div>

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