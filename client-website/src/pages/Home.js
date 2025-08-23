import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { products } from '../utils/api';
import ProductCard from '../components/ProductCard';
import RecentlyViewed from '../components/RecentlyViewed';

const Home = ({ onAddToCart, user }) => {
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await products.getAll();
        const featured = response.data.slice(0, 4);
        setFeaturedProducts(featured);
        
        // Preload first 2 images for faster display
        featured.slice(0, 2).forEach(product => {
          if (product.images && product.images.length > 0) {
            const img = new Image();
            img.src = `${process.env.REACT_APP_API_URL || 'https://learnonai.com'}/api/images/${product.images[0].replace('uploads/', '')}`;
          }
        });
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
          <h1 className="display-4">👕 Welcome to Fashion Store</h1>
          <p className="lead">Discover the latest trends with our premium clothing collection</p>
          <Link to="/products" className="btn btn-light btn-lg">Shop Now</Link>
        </div>
      </div>

      {/* Categories */}
      <div className="container my-5">
        <h2 className="text-center mb-4">Shop by Category</h2>
        <div className="row">
          {['shirts', 'pants', 'kurtis', 'dresses'].map(category => (
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

      {/* Recently Viewed */}
      <RecentlyViewed />

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