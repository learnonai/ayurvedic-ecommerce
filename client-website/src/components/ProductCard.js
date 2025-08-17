import React from 'react';
import { wishlist, BASE_URL } from '../utils/api';

const ProductCard = ({ product, onAddToCart, user }) => {
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
    try {
      await wishlist.add(product._id);
      alert('Added to wishlist!');
    } catch (error) {
      alert('Error adding to wishlist');
    }
  };
  return (
    <div className="card h-100">
      {product.images && product.images.length > 0 ? (
        <img 
          src={imageUrl} 
          className="card-img-top" 
          alt={product.name}
          style={{height: '200px', objectFit: 'cover'}}
          onError={(e) => {
            console.log('Image failed to load:', e.target.src);
            // Try fallback URL
            if (!e.target.src.includes('/uploads/')) {
              e.target.src = `${BASE_URL}/${product.images[0]}`;
            } else {
              // Final fallback to placeholder
              e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjZjhmOWZhIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iMTEwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iNDAiIGZpbGw9IiM2Yzc1N2QiIHRleHQtYW5jaG9yPSJtaWRkbGUiPvCfjL88L3RleHQ+Cjwvc3ZnPgo=';
            }
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
            onClick={() => {
              if ((product.stock || 0) > 0) {
                onAddToCart(product);
              } else {
                alert('Sorry, this product is out of stock!');
              }
            }}
            disabled={(product.stock || 0) === 0}
          >
            {(product.stock || 0) === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
          <button 
            className="btn btn-outline-danger"
            onClick={addToWishlist}
            title="Add to Wishlist"
          >
            ❤️
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;