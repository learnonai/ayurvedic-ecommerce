import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BASE_URL } from '../utils/api';

const RecentlyViewed = () => {
  const [recentProducts, setRecentProducts] = useState([]);

  useEffect(() => {
    const recent = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
    setRecentProducts(recent.slice(0, 4));
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
        {recentProducts.map((product, index) => {
          const hasImage = product.images && product.images.length > 0;
          const imageUrl = hasImage ? `${BASE_URL}/api/images/${product.images[0].replace('uploads/', '')}` : null;
          
          return (
            <div key={`${product._id}-${index}`} className="col-6 col-md-3 mb-3">
              <Link to={`/product/${product._id}`} className="text-decoration-none">
                <div className="card h-100 border-0 shadow-sm">
                  <div style={{height: '100px', position: 'relative'}}>
                    {hasImage ? (
                      <img 
                        src={imageUrl}
                        className="card-img-top" 
                        alt={product.name}
                        style={{
                          height: '100px', 
                          width: '100%',
                          objectFit: 'cover'
                        }}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div 
                      className="d-flex align-items-center justify-content-center bg-light"
                      style={{
                        height: '100px',
                        width: '100%',
                        position: hasImage ? 'absolute' : 'static',
                        top: 0,
                        display: hasImage ? 'none' : 'flex'
                      }}
                    >
                      <span style={{fontSize: '40px'}}>🌿</span>
                    </div>
                  </div>
                  <div className="card-body p-2">
                    <h6 className="card-title small mb-1" style={{fontSize: '0.8rem'}}>
                      {product.name.length > 20 ? product.name.substring(0, 20) + '...' : product.name}
                    </h6>
                    <p className="text-success fw-bold small mb-0">₹{product.price}</p>
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
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