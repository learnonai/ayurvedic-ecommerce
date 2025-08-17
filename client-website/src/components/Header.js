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
    e.preventDefault();
    
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
    <nav className="navbar navbar-expand-lg navbar-dark bg-success" role="navigation" aria-label="Main navigation">
      <div className="container">
        <Link className="navbar-brand" to="/" aria-label="Ayurvedic Store - Go to homepage">🌿 Ayurvedic Store</Link>
        
        {/* Amazon-style Search Bar with Filters */}
        <div className="d-flex flex-grow-1 mx-3 d-none d-md-flex position-relative" ref={dropdownRef}>
          <form className="d-flex w-100" onSubmit={handleSearch}>
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Search for Ayurvedic products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(sanitizeInput(e.target.value))}
                style={{ borderRadius: '4px 0 0 0' }}
                aria-label="Search for products"
                role="searchbox"
              />
              <button 
                className="btn btn-outline-secondary"
                type="button"
                onClick={toggleFilters}
                style={{ borderRadius: '0', borderLeft: 'none', borderRight: 'none' }}
                title="Open search filters"
                aria-label="Open search filters"
                aria-expanded={showFilters}
                aria-haspopup="true"
              >
                🔧
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
                  role="dialog"
                  aria-label="Search filters"
                  aria-modal="false"
                >
                  <div className="mb-2">
                    <label className="form-label small" htmlFor="category-filter">Category</label>
                    <select 
                      id="category-filter"
                      className="form-select form-select-sm"
                      value={filters.category}
                      onChange={(e) => handleFilterChange('category', e.target.value)}
                      aria-describedby="category-help"
                    >
                      <option value="">All Categories</option>
                      <option value="medicines">Medicines</option>
                      <option value="jadi-buti">Jadi Buti</option>
                      <option value="oils">Oils</option>
                      <option value="powders">Powders</option>
                      <option value="tablets">Tablets</option>
                    </select>
                  </div>
                  
                  <div className="row mb-2">
                    <div className="col-6">
                      <label className="form-label small" htmlFor="min-price-filter">Min Price</label>
                      <input 
                        id="min-price-filter"
                        type="number" 
                        className="form-control form-control-sm" 
                        placeholder="₹0"
                        value={filters.minPrice}
                        onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                        aria-label="Minimum price filter"
                        min="0"
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label small" htmlFor="max-price-filter">Max Price</label>
                      <input 
                        id="max-price-filter"
                        type="number" 
                        className="form-control form-control-sm" 
                        placeholder="₹999"
                        value={filters.maxPrice}
                        onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                        aria-label="Maximum price filter"
                        min="0"
                      />
                    </div>
                  </div>
                  
                  <div className="mb-2">
                    <label className="form-label small" htmlFor="sort-filter">Sort By</label>
                    <select 
                      id="sort-filter"
                      className="form-select form-select-sm"
                      value={filters.sortBy}
                      onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                      aria-label="Sort products by"
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
                      aria-describedby="stock-help"
                    />
                    <label className="form-check-label small" htmlFor="stockFilter">
                      In Stock Only
                    </label>
                    <div id="stock-help" className="visually-hidden">Filter to show only products that are currently in stock</div>
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
                className="btn btn-warning" 
                type="submit"
                style={{ borderRadius: '0 4px 4px 0', minWidth: '50px' }}
                aria-label="Search products"
                title="Search"
              >
                🔍
              </button>
            </div>
          </form>
        </div>
        
        {/* Desktop Menu */}
        <div className="navbar-nav ms-auto d-none d-lg-flex" role="menubar">
          <Link className="nav-link" to="/" role="menuitem">Home</Link>
          <Link className="nav-link" to="/products" role="menuitem">Products</Link>
          <Link className="nav-link" to="/policies" role="menuitem" aria-label="Policies and Terms">📋 Policies</Link>
          
          {user ? (
            <>
              <Link className="nav-link" to="/wishlist" role="menuitem" aria-label="Wishlist">❤️ Wishlist</Link>
              <Link className="nav-link" to="/cart" role="menuitem" aria-label={`Shopping cart with ${cartCount} items`}>🛒 Cart ({cartCount})</Link>
              <Link className="nav-link" to="/orders" role="menuitem" aria-label="My Orders">📦 My Orders</Link>
              <Link className="nav-link" to="/profile" role="menuitem" aria-label="User Profile">👤 Profile</Link>
              <button className="btn btn-outline-light btn-sm ms-2" onClick={onLogout} aria-label="Logout from account">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link className="nav-link" to="/login" role="menuitem">Login</Link>
              <Link className="nav-link" to="/register" role="menuitem">Register</Link>
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
              onChange={(e) => setSearchQuery(sanitizeInput(e.target.value))}
            />
            <button 
              className="btn btn-outline-secondary"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#mobileFilters"
            >
              🔧
            </button>
            <button className="btn btn-warning" type="submit">
              🔍
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
                  <option value="medicines">Medicines</option>
                  <option value="jadi-buti">Jadi Buti</option>
                  <option value="oils">Oils</option>
                  <option value="powders">Powders</option>
                  <option value="tablets">Tablets</option>
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