import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { products } from '../utils/api';
import ProductCard from '../components/ProductCard';

const Home = ({ onAddToCart, user }) => {
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await products.getAll();
        setFeaturedProducts(response.data.slice(0, 4));
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-success text-white py-5">
        <div className="container text-center">
          <h1 className="display-4">🌿 Welcome to Herbal Store</h1>
          <p className="lead">Discover the power of natural healing with our authentic Ayurvedic products</p>
          <Link to="/products" className="btn btn-light btn-lg">Shop Now</Link>
        </div>
      </div>

      {/* Categories */}
      <div className="container my-5">
        <h2 className="text-center mb-4">Shop by Category</h2>
        <div className="row">
          {['medicines', 'jadi-buti', 'oils', 'powders'].map(category => (
            <div key={category} className="col-md-3 mb-3">
              <Link to={`/products?category=${category}`} className="text-decoration-none">
                <div className="card text-center">
                  <div className="card-body">
                    <h5 className="card-title text-capitalize">{category.replace('-', ' ')}</h5>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Products */}
      <div className="container my-5">
        <h2 className="text-center mb-4">Featured Products</h2>
        <div className="row">
          {featuredProducts.map(product => (
            <div key={product._id} className="col-md-3 mb-4">
              <ProductCard product={product} onAddToCart={onAddToCart} user={user} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;