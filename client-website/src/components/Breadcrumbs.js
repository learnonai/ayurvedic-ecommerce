import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);

  const breadcrumbNameMap = {
    '': 'Home',
    'products': 'Products',
    'cart': 'Shopping Cart',
    'checkout': 'Checkout',
    'orders': 'My Orders',
    'wishlist': 'Wishlist',
    'profile': 'Profile',
    'login': 'Login',
    'register': 'Register',
    'policies': 'Policies'
  };

  if (pathnames.length === 0) return null;

  return (
    <nav aria-label="breadcrumb" className="container mt-3">
      <ol className="breadcrumb">
        <li className="breadcrumb-item">
          <Link to="/" className="text-decoration-none">🏠 Home</Link>
        </li>
        {pathnames.map((name, index) => {
          const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
          const isLast = index === pathnames.length - 1;
          const displayName = breadcrumbNameMap[name] || name.charAt(0).toUpperCase() + name.slice(1);

          return (
            <li key={name} className={`breadcrumb-item ${isLast ? 'active' : ''}`}>
              {isLast ? (
                displayName
              ) : (
                <Link to={routeTo} className="text-decoration-none">
                  {displayName}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;