import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BASE_URL } from '../utils/api';

const RecentlyViewed = () => {
  const [recentProducts, setRecentProducts] = useState([]);

  useEffect(() => {
    const recent = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
    setRecentProducts(recent.slice(0, 4)); // Show last 4 items
  }, []);

  if (recentProducts.length === 0) return null;

  return (
    <div className="container my-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">👁️ Recently Viewed</h5>
        <button 
          className="btn btn-sm btn-outline-secondary"
          onClick={() => {
            localStorage.removeItem('recentlyViewed');
            setRecentProducts([]);
          }}
        >
          Clear
        </button>
      </div>
      <div className="row">
        {recentProducts.map((product, index) => (
          <div key={`${product._id}-${index}`} className="col-6 col-md-3 mb-3">
            <Link to="/products" className="text-decoration-none">
              <div className="card h-100 border-0 shadow-sm">
                <img 
                  src={product.images && product.images.length > 0 
                    ? `${BASE_URL}/api/images/${product.images[0].replace('uploads/', '')}` 
                    : 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjZjhmOWZhIi8+Cjx0ZXh0IHg9IjUwIiB5PSI2MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjMwIiBmaWxsPSIjNmM3NTdkIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7wn5CVPC90ZXh0Pgo8L3N2Zz4K' 
                  className="card-img-top" 
                  alt={product.name}
                  style={{height: '100px', objectFit: 'cover'}}
                />
                <div className="card-body p-2">
                  <h6 className="card-title small mb-1" style={{fontSize: '0.8rem'}}>
                    {product.name.length > 20 ? product.name.substring(0, 20) + '...' : product.name}
                  </h6>
                  <p className="text-success fw-bold small mb-0">₹{product.price}</p>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

// Helper function to add product to recently viewed
export const addToRecentlyViewed = (product) => {
  const recent = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
  
  // Remove if already exists
  const filtered = recent.filter(item => item._id !== product._id);
  
  // Add to beginning
  const updated = [product, ...filtered].slice(0, 10); // Keep max 10 items
  
  localStorage.setItem('recentlyViewed', JSON.stringify(updated));
};

export default RecentlyViewed;