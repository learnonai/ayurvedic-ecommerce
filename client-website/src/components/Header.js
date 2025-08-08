import React from 'react';
import { Link } from 'react-router-dom';
import MobileMenu from './MobileMenu';

const Header = ({ user, onLogout, cartCount }) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-success">
      <div className="container">
        <Link className="navbar-brand" to="/">🌿 Ayurvedic Store</Link>
        
        {/* Desktop Menu */}
        <div className="navbar-nav ms-auto d-none d-lg-flex">
          <Link className="nav-link" to="/">Home</Link>
          <Link className="nav-link" to="/products">Products</Link>
          
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
    </nav>
  );
};

export default Header;