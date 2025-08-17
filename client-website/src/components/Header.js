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
        
        {/* Amazon-style Search Bar */}
        <div className="d-flex flex-grow-1 mx-3 d-none d-md-flex">
          <form className="d-flex w-100" onSubmit={handleSearch}>
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Search for Ayurvedic products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ borderRadius: '4px 0 0 4px' }}
              />
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
      
      {/* Mobile Search Bar */}
      <div className="container d-md-none mt-2">
        <form className="d-flex" onSubmit={handleSearch}>
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="btn btn-warning" type="submit">
              🔍
            </button>
          </div>
        </form>
      </div>
    </nav>
  );
};

export default Header;