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

  const handleBuyNow = async () => {
    if (!user) {
      navigate('/register');
      return;
    }
    if ((product.stock || 0) === 0) {
      alert('Sorry, this product is out of stock!');
      return;
    }
    setLoading(true);
    try {
      await onAddToCart(product);
      navigate('/cart');
    } finally {
      setLoading(false);
    }
  };

  const hasImage = product.images && product.images.length > 0;
  const imageUrl = hasImage ? `${BASE_URL}/api/images/${product.images[0].replace('uploads/', '').replace('pdt-img/', '')}` : null;

  return (
    <div className="card h-100 shadow-sm d-flex flex-column" style={{cursor: 'pointer', transition: 'transform 0.2s'}} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
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

      <div className="card-body d-flex flex-column" onClick={() => navigate(`/product/${product._id}`)}>
        <div className="flex-grow-1">
          <h6 className="card-title fw-bold">{product.name}</h6>
          <p className="card-text small text-muted" style={{display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'}}>
            {product.description}
          </p>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span className="text-success fw-bold h6 mb-0">₹{product.price}</span>
            {(product.stock || 0) > 0 ? (
              <span className="badge bg-success small">In Stock</span>
            ) : (
              <span className="badge bg-danger small">Out of Stock</span>
            )}
          </div>
        </div>
        
        <div className="mt-auto">
          <div className="d-grid gap-1" onClick={(e) => e.stopPropagation()}>
            <button 
              className="btn btn-warning btn-sm fw-bold" 
              onClick={handleBuyNow}
              disabled={(product.stock || 0) === 0 || loading}
            >
              {loading ? 'Processing...' : (product.stock || 0) === 0 ? 'Out of Stock' : 'Buy Now'}
            </button>
            <div className="d-flex gap-1">
              <button 
                className="btn btn-success btn-sm flex-fill" 
                onClick={handleAddToCart}
                disabled={(product.stock || 0) === 0 || loading}
              >
                {loading ? 'Adding...' : 'Add to Cart'}
              </button>
              <button 
                className="btn btn-outline-danger btn-sm"
                onClick={addToWishlist}
                disabled={wishlistLoading}
                title="Wishlist"
                style={{minWidth: '45px'}}
              >
                {wishlistLoading ? (
                  <span className="spinner-border spinner-border-sm" role="status"></span>
                ) : '❤️'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;