import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BASE_URL, products } from '../utils/api';

const RecentlyViewed = () => {
  const [recentProducts, setRecentProducts] = useState([]);

  useEffect(() => {
    const loadRecentProducts = async () => {
      try {
        const recent = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
        if (recent.length === 0) return;
        
        // Get fresh product data to get updated images
        const response = await products.getAll();
        const allProducts = response.data;
        
        // Update recent products with fresh image data
        const updatedRecent = recent.map(recentProduct => {
          const freshProduct = allProducts.find(p => p._id === recentProduct._id);
          if (freshProduct) {
            // Use fresh product data with updated images
            return freshProduct;
          }
          return recentProduct;
        });
        
        setRecentProducts(updatedRecent.slice(0, 4));
        
        // Update localStorage with fresh data
        localStorage.setItem('recentlyViewed', JSON.stringify(updatedRecent));
      } catch (error) {
        // Fallback to localStorage data
        const recent = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
        setRecentProducts(recent.slice(0, 4));
      }
    };
    
    loadRecentProducts();
    
    // Refresh every 5 seconds to get updated images
    const interval = setInterval(loadRecentProducts, 5000);
    
    return () => clearInterval(interval);
  }, []);

  if (recentProducts.length === 0) return null;

  return (
    <div className="container my-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">👁️ Recently Viewed</h5>
        <div className="d-flex gap-2">
          <button 
            className="btn btn-sm btn-outline-primary"
            onClick={async () => {
              try {
                const response = await products.getAll();
                const allProducts = response.data;
                const recent = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
                
                const updatedRecent = recent.map(recentProduct => {
                  const freshProduct = allProducts.find(p => p._id === recentProduct._id);
                  return freshProduct || recentProduct;
                });
                
                setRecentProducts(updatedRecent.slice(0, 4));
                localStorage.setItem('recentlyViewed', JSON.stringify(updatedRecent));
              } catch (error) {
                // Silent error
              }
            }}
          >
            Refresh
          </button>
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
      </div>
      <div className="row">
        {recentProducts.map((product, index) => {
          const hasImage = product.images && product.images.length > 0;
          const imagePath = hasImage ? product.images[0].replace('uploads/', '').replace('pdt-img/', '') : null;
          const imageUrl = hasImage ? `${BASE_URL}/api/images/${imagePath}` : null;
          
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