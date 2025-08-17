import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Products from './pages/Products';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import Wishlist from './pages/Wishlist';
import Orders from './pages/Orders';
import Checkout from './pages/Checkout';
import Policies from './pages/Policies';
import { orders, payment } from './utils/api';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/mobile.css';
import { useToast } from './components/Toast';

function App() {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const { showToast, ToastContainer } = useToast();
  
  useEffect(() => {
    const token = localStorage.getItem('userToken');
    const savedUser = localStorage.getItem('user');
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);
  
  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleAddToCart = (product) => {
    const existingItem = cart.find(item => item._id === product._id);
    if (existingItem) {
      setCart(cart.map(item => 
        item._id === product._id 
          ? {...item, quantity: item.quantity + 1}
          : item
      ));
      showToast(`${product.name} quantity updated in cart!`);
    } else {
      setCart([...cart, {...product, quantity: 1}]);
      showToast(`${product.name} added to cart!`);
    }
  };

  const handleUpdateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    setCart(cart.map(item => 
      item._id === productId 
        ? {...item, quantity: newQuantity}
        : item
    ));
  };

  const handleRemoveFromCart = (productId) => {
    setCart(cart.filter(item => item._id !== productId));
  };



  const handleLogout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('user');
    setUser(null);
    setCart([]);
  };

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Header 
        user={user} 
        onLogout={handleLogout} 
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)} 
      />
      
      <Routes>
        <Route path="/" element={<Home onAddToCart={handleAddToCart} user={user} />} />
        <Route path="/products" element={<Products onAddToCart={handleAddToCart} user={user} />} />
        <Route path="/cart" element={
          <Cart 
            cart={cart}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveFromCart={handleRemoveFromCart}
            user={user}
          />
        } />
        <Route path="/checkout" element={
          <Checkout 
            cart={cart}
            user={user}
            onOrderComplete={() => setCart([])}
          />
        } />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register onLogin={handleLogin} />} />
        <Route path="/wishlist" element={<Wishlist onAddToCart={handleAddToCart} user={user} />} />
        <Route path="/orders" element={<Orders user={user} />} />
        <Route path="/policies" element={<Policies />} />
      </Routes>
      <ToastContainer />
    </Router>
  );
}

export default App;