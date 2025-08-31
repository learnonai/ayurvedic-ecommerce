import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Orders from './pages/Orders';
import Users from './pages/Users';
import Categories from './pages/Categories';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userToken');
    localStorage.removeItem('user');
    setUser(null);
  };

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  return (
    <Router>
      <div className="d-flex">
        <nav className="bg-dark text-white p-3" style={{width: '250px', minHeight: '100vh'}}>
          <h4>Herbal Admin</h4>
          <ul className="nav flex-column">
            <li className="nav-item">
              <Link to="/dashboard" className="nav-link text-white">Dashboard</Link>
            </li>
            <li className="nav-item">
              <Link to="/products" className="nav-link text-white">Products</Link>
            </li>
            <li className="nav-item">
              <Link to="/categories" className="nav-link text-white">Categories</Link>
            </li>
            <li className="nav-item">
              <Link to="/orders" className="nav-link text-white">Orders</Link>
            </li>
            <li className="nav-item">
              <Link to="/users" className="nav-link text-white">Users</Link>
            </li>
            <li className="nav-item mt-3">
              <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>Logout</button>
            </li>
          </ul>
        </nav>
        
        <main className="flex-grow-1 p-4">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/users" element={<Users />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;