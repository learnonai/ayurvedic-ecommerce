import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const MobileMenu = ({ user, onLogout, cartCount }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        className="navbar-toggler d-lg-none" 
        type="button"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      
      {isOpen && (
        <div className="mobile-menu d-lg-none">
          <div className="mobile-menu-overlay" onClick={() => setIsOpen(false)}></div>
          <div className="mobile-menu-content">
            <div className="mobile-menu-header">
              <h5>🌿 Menu</h5>
              <button className="btn-close" onClick={() => setIsOpen(false)}></button>
            </div>
            
            <div className="mobile-menu-body">
              <Link className="mobile-menu-item" to="/" onClick={() => setIsOpen(false)}>
                🏠 Home
              </Link>
              <Link className="mobile-menu-item" to="/products" onClick={() => setIsOpen(false)}>
                🛍️ Products
              </Link>
              <Link className="mobile-menu-item" to="/policies" onClick={() => setIsOpen(false)}>
                📋 Policies
              </Link>
              
              {user ? (
                <>
                  <Link className="mobile-menu-item" to="/wishlist" onClick={() => setIsOpen(false)}>
                    ❤️ Wishlist
                  </Link>
                  <Link className="mobile-menu-item" to="/cart" onClick={() => setIsOpen(false)}>
                    🛒 Cart ({cartCount})
                  </Link>
                  <Link className="mobile-menu-item" to="/orders" onClick={() => setIsOpen(false)}>
                    📦 My Orders
                  </Link>
                  <Link className="mobile-menu-item" to="/profile" onClick={() => setIsOpen(false)}>
                    👤 Profile
                  </Link>
                  <button 
                    className="mobile-menu-item btn-logout" 
                    onClick={() => {
                      onLogout();
                      setIsOpen(false);
                    }}
                  >
                    🚪 Logout
                  </button>
                </>
              ) : (
                <>
                  <Link className="mobile-menu-item" to="/login" onClick={() => setIsOpen(false)}>
                    🔐 Login
                  </Link>
                  <Link className="mobile-menu-item" to="/register" onClick={() => setIsOpen(false)}>
                    📝 Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
      

    </>
  );
};

export default MobileMenu;