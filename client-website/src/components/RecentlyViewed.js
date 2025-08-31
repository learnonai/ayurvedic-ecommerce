import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BASE_URL, products } from '../utils/api';

const RecentlyViewed = () => {
  const [recentProducts, setRecentProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentProducts = async () => {
      try {
        const recent = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
        if (recent.length === 0) {
          setLoading(false);
          return;
        }

        // Fetch fresh product data to get updated images
        const productIds = recent.slice(0, 4).map(p => p._id);
        const allProductsResponse = await products.getAll();
        const allProducts = allProductsResponse.data;
        
        // Match recent products with fresh data
        const freshRecentProducts = productIds.map(id => 
          allProducts.find(p => p._id === id)
        ).filter(Boolean);
        
        setRecentProducts(freshRecentProducts);
      } catch (error) {
        console.error('Error fetching recent products:', error);
        // Fallback to localStorage data
        const recent = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
        setRecentProducts(recent.slice(0, 4));
      }
      setLoading(false);
    };
    
    fetchRecentProducts();
  }, []);

  if (loading) {
    return (
      <div className="container my-4">
        <div className="d-flex justify-content-center">
          <div className="spinner-border spinner-border-sm text-success" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }
  
  if (recentProducts.length === 0) return null;

  return (
    <div className="container my-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">👁️ Recently Viewed</h5>
        <div className="d-flex gap-2">
          <button 
            className="btn btn-sm btn-outline-secondary"
            onClick={() => {
              localStorage.removeItem('recentlyViewed');
              setRecentProducts([]);
            }}
          >
            Clear
          </button>
          <button 
            className="btn btn-sm btn-outline-primary"
            onClick={() => {
              setLoading(true);
              // Force refresh by re-running the effect
              const fetchRecentProducts = async () => {
                try {
                  const recent = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
                  if (recent.length === 0) {
                    setLoading(false);
                    return;
                  }
          
                  const productIds = recent.slice(0, 4).map(p => p._id);
                  const allProductsResponse = await products.getAll();
                  const allProducts = allProductsResponse.data;
                  
                  const freshRecentProducts = productIds.map(id => 
                    allProducts.find(p => p._id === id)
                  ).filter(Boolean);
                  
                  setRecentProducts(freshRecentProducts);
                } catch (error) {
                  console.error('Error refreshing recent products:', error);
                }
                setLoading(false);
              };
              fetchRecentProducts();
            }}
          >
            Refresh
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
                          console.log('Image failed to load:', imageUrl);
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