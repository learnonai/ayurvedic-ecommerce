import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BASE_URL, products } from '../utils/api';

const RecentlyViewed = () => {
  const [recentProducts, setRecentProducts] = useState([]);

  useEffect(() => {
    const loadRecent = async () => {
      try {
        // Get recent product IDs only
        const recentData = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
        const recentIds = recentData.map(item => item._id || item.id).filter(Boolean);
        
        if (recentIds.length === 0) return;

        // Fetch ALL current products from API
        const response = await products.getAll();
        const currentProducts = response.data;
        
        // Get fresh data for recent products in LIFO order
        const freshRecent = recentIds.slice(0, 4).map(id => 
          currentProducts.find(p => p._id === id)
        ).filter(Boolean);
        
        setRecentProducts(freshRecent);
      } catch (error) {
        setRecentProducts([]);
      }
    };

    loadRecent();
    const interval = setInterval(loadRecent, 3000);
    return () => clearInterval(interval);
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
          // Use exact same image logic as ProductCard
          const imageUrl = product.images && product.images.length > 0 
            ? `${BASE_URL}/api/images/${product.images[0].replace('pdt-img/', '').replace('uploads/', '')}`
            : null;
          
          return (
            <div key={product._id} className="col-6 col-md-3 mb-3">
              <Link to={`/product/${product._id}`} className="text-decoration-none">
                <div className="card h-100 border-0 shadow-sm">
                  <div style={{height: '100px', overflow: 'hidden'}}>
                    {imageUrl ? (
                      <img 
                        src={imageUrl}
                        alt={product.name}
                        style={{
                          width: '100%',
                          height: '100px',
                          objectFit: 'cover'
                        }}
                        onError={(e) => {
                          e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2Y4ZjlmYSIvPjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1zaXplPSIzMCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+🌿</dGV4dD48L3N2Zz4=';
                        }}
                      />
                    ) : (
                      <div className="d-flex align-items-center justify-content-center bg-light h-100">
                        <span style={{fontSize: '40px'}}>🌿</span>
                      </div>
                    )}
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

// Add to recently viewed - only add if not already present
export const addToRecentlyViewed = (product) => {
  const recent = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
  
  // Check if product already exists
  const exists = recent.some(item => (item._id || item.id) === product._id);
  
  // If already exists, don't change anything
  if (exists) {
    return;
  }
  
  // Add new product to beginning and keep only 4 items
  const updated = [product, ...recent].slice(0, 4);
  localStorage.setItem('recentlyViewed', JSON.stringify(updated));
};

export default RecentlyViewed;