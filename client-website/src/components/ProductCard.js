import React, { useState, useEffect } from 'react';
import { wishlist, BASE_URL } from '../utils/api';
import { addToRecentlyViewed } from './RecentlyViewed';

const ProductCard = ({ product, onAddToCart, user }) => {
  const [loading, setLoading] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Track product view
  useEffect(() => {
    if (product) {
      addToRecentlyViewed(product);
    }
  }, [product]);
  // Debug: Log the image URL being generated
  const imageUrl = product.images && product.images.length > 0 
    ? `${BASE_URL}/api/images/${product.images[0].replace('uploads/', '')}` 
    : null;
  
  if (imageUrl) {
    console.log('Image URL:', imageUrl);
    console.log('BASE_URL:', BASE_URL);
    console.log('Original image path:', product.images[0]);
  }
  
  const addToWishlist = async () => {
    if (!user) {
      alert('Please login to add to wishlist');
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
    <div className="card h-100">
      {product.images && product.images.length > 0 ? (
        <div className="position-relative" style={{height: '200px'}}>
          {imageLoading && (
            <div className="position-absolute w-100 h-100 d-flex align-items-center justify-content-center bg-light">
              <div className="spinner-border text-success" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}
          <img 
            src={product.images && product.images.length > 0 
              ? `${BASE_URL}/api/images/${product.images[currentImageIndex].replace('uploads/', '')}` 
              : null} 
            className="card-img-top" 
            alt={product.name}
            style={{height: '200px', objectFit: 'cover', display: imageLoading ? 'none' : 'block'}}
            onLoad={() => setImageLoading(false)}
            onError={(e) => {
              setImageLoading(false);
              e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjZjhmOWZhIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iMTEwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iNDAiIGZpbGw9IiM2Yzc1N2QiIHRleHQtYW5jaG9yPSJtaWRkbGUiPvCfjL88L3RleHQ+Cjwvc3ZnPgo=';
            }}
          />
          
          {/* Image Gallery Navigation */}
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
        >
          <span style={{fontSize: '60px'}}>🌿</span>
        </div>
      )}
      <div className="card-body">
        <h5 className="card-title">{product.name}</h5>
        <p className="card-text">{product.description}</p>
        <p className="text-success fw-bold">₹{product.price}</p>
        <p className="text-muted small">Category: {product.category}</p>
        
        {/* Stock Status */}
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
        
        <div className="d-flex gap-2">
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