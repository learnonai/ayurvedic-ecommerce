import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MobileMenu from './MobileMenu';

const Header = ({ user, onLogout, cartCount }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-success">
      <div className="container">
        <Link className="navbar-brand" to="/">🌿 Ayurvedic Store</Link>
        
        {/* Amazon-style Search Bar with Filters */}
        <div className="d-flex flex-grow-1 mx-3 d-none d-md-flex position-relative">
          <form className="d-flex w-100" onSubmit={handleSearch}>
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Search for Ayurvedic products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ borderRadius: '4px 0 0 0' }}
              />
              <button 
                className="btn btn-outline-secondary dropdown-toggle"
                type="button"
                data-bs-toggle="dropdown"
                style={{ borderRadius: '0', borderLeft: 'none', borderRight: 'none' }}
                title="Filters"
              >
                🔧
              </button>
              <ul className="dropdown-menu p-3" style={{ minWidth: '300px' }}>
                <li>
                  <div className="mb-2">
                    <label className="form-label small">Category</label>
                    <select className="form-select form-select-sm">
                      <option value="">All Categories</option>
                      <option value="medicines">Medicines</option>
                      <option value="jadi-buti">Jadi Buti</option>
                      <option value="oils">Oils</option>
                      <option value="powders">Powders</option>
                      <option value="tablets">Tablets</option>
                    </select>
                  </div>
                </li>
                <li>
                  <div className="row mb-2">
                    <div className="col-6">
                      <label className="form-label small">Min Price</label>
                      <input type="number" className="form-control form-control-sm" placeholder="₹0" />
                    </div>
                    <div className="col-6">
                      <label className="form-label small">Max Price</label>
                      <input type="number" className="form-control form-control-sm" placeholder="₹999" />
                    </div>
                  </div>
                </li>
                <li>
                  <div className="mb-2">
                    <label className="form-label small">Sort By</label>
                    <select className="form-select form-select-sm">
                      <option value="name">Name A-Z</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                    </select>
                  </div>
                </li>
                <li>
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" id="stockFilter" />
                    <label className="form-check-label small" htmlFor="stockFilter">
                      In Stock Only
                    </label>
                  </div>
                </li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <div className="d-flex gap-2">
                    <button className="btn btn-primary btn-sm flex-fill">Apply</button>
                    <button className="btn btn-outline-secondary btn-sm">Clear</button>
                  </div>
                </li>
              </ul>
              <button 
                className="btn btn-warning" 
                type="submit"
                style={{ borderRadius: '0 4px 4px 0', minWidth: '50px' }}
              >
                🔍
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
              onChange={(e) => setSearchQuery(e.target.value)}
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
                <select className="form-select form-select-sm">
                  <option>All Categories</option>
                  <option>Medicines</option>
                  <option>Oils</option>
                  <option>Powders</option>
                </select>
              </div>
              <div className="col-6">
                <select className="form-select form-select-sm">
                  <option>Sort by Name</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                </select>
              </div>
              <div className="col-6">
                <input type="number" className="form-control form-control-sm" placeholder="Min ₹" />
              </div>
              <div className="col-6">
                <input type="number" className="form-control form-control-sm" placeholder="Max ₹" />
              </div>
              <div className="col-12">
                <div className="form-check">
                  <input className="form-check-input" type="checkbox" id="mobileStockFilter" />
                  <label className="form-check-label small" htmlFor="mobileStockFilter">
                    In Stock Only
                  </label>
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