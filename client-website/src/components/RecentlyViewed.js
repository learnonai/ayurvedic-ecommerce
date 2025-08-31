import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BASE_URL, products } from '../utils/api';

const RecentlyViewed = () => {
  const [recentProducts, setRecentProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadFreshRecentProducts = async () => {
    try {
      // Get recent product IDs from localStorage
      const recentIds = JSON.parse(localStorage.getItem('recentlyViewed') || '[]').map(p => p._id);
      
      if (recentIds.length === 0) {
        setLoading(false);
        return;
      }

      // ALWAYS fetch ALL products from API to get fresh data
      const response = await products.getAll();
      const allProducts = response.data;
      
      // Filter products that are in recently viewed
      const freshRecentProducts = recentIds.map(id => 
        allProducts.find(p => p._id === id)
      ).filter(Boolean).slice(0, 4);
      
      setRecentProducts(freshRecentProducts);
      
      // Update localStorage with fresh product data
      const updatedRecent = recentIds.map(id => 
        allProducts.find(p => p._id === id)
      ).filter(Boolean);
      
      localStorage.setItem('recentlyViewed', JSON.stringify(updatedRecent));
      
    } catch (error) {
      console.error('Error loading recent products:', error);
      setRecentProducts([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadFreshRecentProducts();
    
    // Refresh every 2 seconds to get updated images
    const interval = setInterval(loadFreshRecentProducts, 2000);
    
    return () => clearInterval(interval);
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
            className="btn btn-sm btn-outline-primary"
            onClick={() => {
              setLoading(true);
              loadFreshRecentProducts();
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
            <div key={`${product._id}-${index}-${Date.now()}`} className="col-6 col-md-3 mb-3">
              <Link to={`/product/${product._id}`} className="text-decoration-none">
                <div className="card h-100 border-0 shadow-sm">
                  <div style={{height: '100px', position: 'relative'}}>
                    {hasImage ? (
                      <img 
                        src={`${imageUrl}?t=${Date.now()}`}
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

// Helper function to add product to recently viewed - ALWAYS GET FRESH DATA
export const addToRecentlyViewed = async (product) => {
  try {
    // Get fresh product data from API first
    const response = await products.getAll();
    const allProducts = response.data;
    const freshProduct = allProducts.find(p => p._id === product._id) || product;
    
    // Get existing recent products (just IDs)
    const existingRecent = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
    const existingIds = existingRecent.map(p => p._id);
    
    // Remove if already exists
    const filteredIds = existingIds.filter(id => id !== freshProduct._id);
    
    // Add fresh product ID to beginning and get fresh data for all
    const updatedIds = [freshProduct._id, ...filteredIds].slice(0, 10);
    const updatedProducts = updatedIds.map(id => 
      allProducts.find(p => p._id === id)
    ).filter(Boolean);
    
    localStorage.setItem('recentlyViewed', JSON.stringify(updatedProducts));
  } catch (error) {
    console.error('Error updating recently viewed:', error);
    // Fallback to original method
    const recent = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
    const filtered = recent.filter(item => item._id !== product._id);
    const updated = [product, ...filtered].slice(0, 10);
    localStorage.setItem('recentlyViewed', JSON.stringify(updated));
  }
};

export default RecentlyViewed;