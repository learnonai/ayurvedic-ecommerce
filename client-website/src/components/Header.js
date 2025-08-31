import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MobileMenu from './MobileMenu';
import { sanitizeInput, rateLimiter } from '../utils/security';

const Header = ({ user, onLogout, cartCount }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'name',
    inStock: false
  });
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowFilters(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    
    // Rate limiting for search
    if (!rateLimiter.isAllowed('search', 10, 60000)) { // 10 searches per minute
      alert('Too many searches. Please wait a moment.');
      return;
    }
    
    const sanitizedQuery = sanitizeInput(searchQuery.trim());
    const params = new URLSearchParams();
    
    if (sanitizedQuery) {
      params.set('search', sanitizedQuery);
    }
    if (filters.category) {
      params.set('category', filters.category);
    }
    navigate(`/products?${params.toString()}`);
  };
  
  // Real-time search function
  const handleSearchChange = (value) => {
    setSearchQuery(value);
    
    // Debounced real-time search
    clearTimeout(window.searchTimeout);
    window.searchTimeout = setTimeout(() => {
      if (value.trim().length >= 2 || value.trim().length === 0) {
        const sanitizedQuery = sanitizeInput(value.trim());
        const params = new URLSearchParams();
        
        if (sanitizedQuery) {
          params.set('search', sanitizedQuery);
        }
        if (filters.category) {
          params.set('category', filters.category);
        }
        navigate(`/products?${params.toString()}`);
      }
    }, 500); // 500ms delay for real-time search
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set('search', searchQuery.trim());
    if (filters.category) params.set('category', filters.category);
    if (filters.minPrice) params.set('minPrice', filters.minPrice);
    if (filters.maxPrice) params.set('maxPrice', filters.maxPrice);
    if (filters.sortBy !== 'name') params.set('sortBy', filters.sortBy);
    if (filters.inStock) params.set('inStock', 'true');
    navigate(`/products?${params.toString()}`);
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      minPrice: '',
      maxPrice: '',
      sortBy: 'name',
      inStock: false
    });
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-success">
      <div className="container">
        <Link className="navbar-brand" to="/">🌿 Herbal Store</Link>
        
        {/* Amazon-style Search Bar with Filters */}
        <div className="d-flex flex-grow-1 mx-3 d-none d-md-flex position-relative" ref={dropdownRef}>
          <form className="d-flex w-100" onSubmit={handleSearch}>
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Search for herbal products..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(sanitizeInput(e.target.value))}
                style={{ borderRadius: '4px 0 0 0' }}
              />
              <button 
                className="btn btn-light border d-flex align-items-center"
                type="button"
                onClick={toggleFilters}
                style={{ 
                  borderRadius: '0', 
                  borderLeft: 'none', 
                  borderRight: 'none', 
                  padding: '0.375rem 0.75rem',
                  backgroundColor: '#f8f9fa',
                  borderColor: '#ced4da'
                }}
                title="Advanced Filters & Sort"
              >
                <svg width="18" height="18" fill="#495057" viewBox="0 0 16 16" style={{marginRight: '4px'}}>
                  <path d="M1.5 1.5A.5.5 0 0 1 2 1h12a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.128.334L10 8.692V13.5a.5.5 0 0 1-.342.474l-3 1A.5.5 0 0 1 6 14.5V8.692L1.628 3.834A.5.5 0 0 1 1.5 3.5v-2zm1 .5v1.308l4.372 4.858A.5.5 0 0 1 7 8.5v5.306l2-.666V8.5a.5.5 0 0 1 .128-.334L13.5 3.308V2h-11z"/>
                </svg>
                <small style={{fontSize: '11px', color: '#495057'}}>Filter</small>
              </button>
              {showFilters && (
                <div 
                  className="position-absolute bg-white border rounded shadow p-3" 
                  style={{ 
                    top: '100%', 
                    left: '0', 
                    right: '50px', 
                    zIndex: 1000,
                    minWidth: '300px'
                  }}
                >
                  <div className="mb-2">
                    <label className="form-label small">Category</label>
                    <select 
                      className="form-select form-select-sm"
                      value={filters.category}
                      onChange={(e) => handleFilterChange('category', e.target.value)}
                    >
                      <option value="">All Categories</option>
                      {(() => {
                        try {
                          const savedCategories = localStorage.getItem('categories');
                          if (savedCategories) {
                            const categories = JSON.parse(savedCategories);
                            return categories.map(cat => (
                              <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ));
                          }
                        } catch (error) {
                          console.error('Error loading categories in header:', error);
                        }
                        return [
                          <option key="oils" value="oils">Herbal Oils</option>,
                          <option key="capsules" value="capsules">Capsules</option>,
                          <option key="skincare" value="skincare">Skincare</option>,
                          <option key="powders" value="powders">Powders</option>,
                          <option key="teas" value="teas">Herbal Teas</option>
                        ];
                      })()}
                    </select>
                  </div>
                  
                  <div className="row mb-2">
                    <div className="col-6">
                      <label className="form-label small">Min Price</label>
                      <input 
                        type="number" 
                        className="form-control form-control-sm" 
                        placeholder="₹0"
                        value={filters.minPrice}
                        onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label small">Max Price</label>
                      <input 
                        type="number" 
                        className="form-control form-control-sm" 
                        placeholder="₹999"
                        value={filters.maxPrice}
                        onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="mb-2">
                    <label className="form-label small">Sort By</label>
                    <select 
                      className="form-select form-select-sm"
                      value={filters.sortBy}
                      onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                    >
                      <option value="name">Name A-Z</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                    </select>
                  </div>
                  
                  <div className="form-check mb-3">
                    <input 
                      className="form-check-input" 
                      type="checkbox" 
                      id="stockFilter"
                      checked={filters.inStock}
                      onChange={(e) => handleFilterChange('inStock', e.target.checked)}
                    />
                    <label className="form-check-label small" htmlFor="stockFilter">
                      In Stock Only
                    </label>
                  </div>
                  
                  <div className="d-flex gap-2">
                    <button 
                      className="btn btn-primary btn-sm flex-fill"
                      onClick={() => {
                        applyFilters();
                        setShowFilters(false);
                      }}
                    >
                      Apply
                    </button>
                    <button 
                      className="btn btn-outline-secondary btn-sm"
                      onClick={clearFilters}
                    >
                      Clear
                    </button>
                  </div>
                </div>
              )}
              <button 
                className="btn btn-primary d-flex align-items-center justify-content-center" 
                type="submit"
                style={{ borderRadius: '0 4px 4px 0', minWidth: '60px', backgroundColor: '#0d6efd' }}
                title="Search Products"
              >
                <svg width="18" height="18" fill="white" viewBox="0 0 16 16">
                  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                </svg>
              </button>
            </div>
          </form>
        </div>
        
        {/* Desktop Menu */}
        <div className="navbar-nav ms-auto d-none d-lg-flex">
          <Link className="nav-link" to="/">Home</Link>
          <Link className="nav-link" to="/products">Products</Link>
          <Link className="nav-link" to="/policies">📋 Policies</Link>
          
          {user ? (
            <>
              <Link className="nav-link" to="/wishlist">❤️ Wishlist</Link>
              <Link className="nav-link" to="/cart">🛒 Cart ({cartCount})</Link>
              <Link className="nav-link" to="/orders">📦 My Orders</Link>
              <Link className="nav-link" to="/profile">👤 Profile</Link>
              <button className="btn btn-outline-light btn-sm ms-2" onClick={onLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link className="nav-link" to="/login">Login</Link>
              <Link className="nav-link" to="/register">Register</Link>
            </>
          )}
        </div>
        
        {/* Mobile Menu */}
        <MobileMenu user={user} onLogout={onLogout} cartCount={cartCount} />
      </div>
      
      {/* Mobile Search Bar with Filters */}
      <div className="container d-md-none mt-2">
        <form className="d-flex mb-2" onSubmit={handleSearch}>
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(sanitizeInput(e.target.value))}
            />
            <button 
              className="btn btn-light border d-flex align-items-center justify-content-center"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#mobileFilters"
              title="Filters & Sort"
              style={{backgroundColor: '#f8f9fa', borderColor: '#ced4da'}}
            >
              <svg width="18" height="18" fill="#495057" viewBox="0 0 16 16">
                <path d="M1.5 1.5A.5.5 0 0 1 2 1h12a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.128.334L10 8.692V13.5a.5.5 0 0 1-.342.474l-3 1A.5.5 0 0 1 6 14.5V8.692L1.628 3.834A.5.5 0 0 1 1.5 3.5v-2zm1 .5v1.308l4.372 4.858A.5.5 0 0 1 7 8.5v5.306l2-.666V8.5a.5.5 0 0 1 .128-.334L13.5 3.308V2h-11z"/>
              </svg>
            </button>
            <button className="btn btn-primary d-flex align-items-center justify-content-center" type="submit" title="Search Products" style={{backgroundColor: '#0d6efd'}}>
              <svg width="18" height="18" fill="white" viewBox="0 0 16 16">
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
              </svg>
            </button>
          </div>
        </form>
        
        {/* Mobile Filters Collapse */}
        <div className="collapse" id="mobileFilters">
          <div className="card card-body p-2">
            <div className="row g-2">
              <div className="col-6">
                <select 
                  className="form-select form-select-sm"
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                >
                  <option value="">All Categories</option>
                  {(() => {
                    try {
                      const savedCategories = localStorage.getItem('categories');
                      if (savedCategories) {
                        const categories = JSON.parse(savedCategories);
                        return categories.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ));
                      }
                    } catch (error) {
                      console.error('Error loading categories in mobile header:', error);
                    }
                    return [
                      <option key="oils" value="oils">Herbal Oils</option>,
                      <option key="capsules" value="capsules">Capsules</option>,
                      <option key="skincare" value="skincare">Skincare</option>,
                      <option key="powders" value="powders">Powders</option>,
                      <option key="teas" value="teas">Herbal Teas</option>
                    ];
                  })()}
                </select>
              </div>
              <div className="col-6">
                <select 
                  className="form-select form-select-sm"
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                >
                  <option value="name">Sort by Name</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
              <div className="col-6">
                <input 
                  type="number" 
                  className="form-control form-control-sm" 
                  placeholder="Min ₹"
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                />
              </div>
              <div className="col-6">
                <input 
                  type="number" 
                  className="form-control form-control-sm" 
                  placeholder="Max ₹"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                />
              </div>
              <div className="col-12">
                <div className="form-check d-flex justify-content-between align-items-center">
                  <div>
                    <input 
                      className="form-check-input" 
                      type="checkbox" 
                      id="mobileStockFilter"
                      checked={filters.inStock}
                      onChange={(e) => handleFilterChange('inStock', e.target.checked)}
                    />
                    <label className="form-check-label small" htmlFor="mobileStockFilter">
                      In Stock Only
                    </label>
                  </div>
                  <div className="d-flex gap-1">
                    <button 
                      className="btn btn-primary btn-sm"
                      onClick={applyFilters}
                    >
                      Apply
                    </button>
                    <button 
                      className="btn btn-outline-secondary btn-sm"
                      onClick={clearFilters}
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;