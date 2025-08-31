import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { products } from '../utils/api';
import ProductCard from '../components/ProductCard';
import RecentlyViewed from '../components/RecentlyViewed';

const Home = ({ onAddToCart, user }) => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const categories = [
    { name: 'oils', icon: '🛢️', title: 'Herbal Oils', desc: 'Pure & Natural' },
    { name: 'capsules', icon: '💊', title: 'Capsules', desc: 'Health Supplements' },
    { name: 'skincare', icon: '✨', title: 'Skincare', desc: 'Natural Beauty' },
    { name: 'powders', icon: '🥄', title: 'Powders', desc: 'Superfood Blends' },
    { name: 'teas', icon: '🍵', title: 'Herbal Teas', desc: 'Wellness Drinks' }
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await products.getAll();
        const featured = response.data.slice(0, 8);
        setFeaturedProducts(featured);
        setLoading(false);
        
        // Preload images for faster display
        featured.slice(0, 4).forEach(product => {
          if (product.images && product.images.length > 0) {
            const img = new Image();
            img.src = `${process.env.REACT_APP_API_URL || 'https://learnonai.com'}/api/images/${product.images[0].replace('uploads/', '').replace('pdt-img/', '')}`;
          }
        });
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-gradient" style={{background: 'linear-gradient(135deg, #2d5016 0%, #4a7c59 100%)'}}>
        <div className="container text-white py-5">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h1 className="display-4 fw-bold mb-3">🌿 Pure Ayurvedic Wellness</h1>
              <p className="lead mb-4">Discover nature's healing power with our premium collection of authentic Ayurvedic products. All items under ₹199!</p>
              <div className="d-flex gap-3">
                <Link to="/products" className="btn btn-light btn-lg px-4">Shop Now</Link>
                <Link to="/products?category=oils" className="btn btn-outline-light btn-lg px-4">Best Sellers</Link>
              </div>
            </div>
            <div className="col-lg-6 text-center">
              <div className="bg-white bg-opacity-10 rounded-circle p-5 d-inline-block">
                <span style={{fontSize: '120px'}}>🌿</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Special Offers Banner */}
      <div className="bg-warning py-3">
        <div className="container text-center">
          <h5 className="mb-0">🎉 Special Launch Offer: All Products Under ₹199 | Free Shipping Above ₹299 🚚</h5>
        </div>
      </div>

      {/* Categories */}
      <div className="container my-5">
        <div className="text-center mb-5">
          <h2 className="fw-bold">Shop by Category</h2>
          <p className="text-muted">Explore our complete range of natural wellness products</p>
        </div>
        <div className="row g-4">
          {categories.map(category => (
            <div key={category.name} className="col-lg-2 col-md-4 col-6">
              <Link to={`/products?category=${category.name}`} className="text-decoration-none">
                <div className="card h-100 border-0 shadow-sm hover-card" style={{transition: 'transform 0.2s'}}>
                  <div className="card-body text-center p-4">
                    <div className="mb-3" style={{fontSize: '3rem'}}>{category.icon}</div>
                    <h6 className="card-title fw-bold">{category.title}</h6>
                    <small className="text-muted">{category.desc}</small>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="bg-light py-5">
        <div className="container">
          <div className="row text-center">
            <div className="col-md-3 mb-4">
              <div className="mb-3" style={{fontSize: '3rem'}}>✅</div>
              <h5>100% Natural</h5>
              <p className="text-muted">Pure herbal ingredients</p>
            </div>
            <div className="col-md-3 mb-4">
              <div className="mb-3" style={{fontSize: '3rem'}}>🚚</div>
              <h5>Free Shipping</h5>
              <p className="text-muted">On orders above ₹299</p>
            </div>
            <div className="col-md-3 mb-4">
              <div className="mb-3" style={{fontSize: '3rem'}}>💰</div>
              <h5>Best Prices</h5>
              <p className="text-muted">All under ₹199</p>
            </div>
            <div className="col-md-3 mb-4">
              <div className="mb-3" style={{fontSize: '3rem'}}>⭐</div>
              <h5>Quality Assured</h5>
              <p className="text-muted">Lab tested products</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recently Viewed */}
      <RecentlyViewed />

      {/* Featured Products */}
      <div className="container my-5">
        <div className="text-center mb-5">
          <h2 className="fw-bold">Must-Have Products</h2>
          <p className="text-muted">Handpicked bestsellers loved by our customers</p>
        </div>
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-success" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <div className="row g-4">
            {featuredProducts.map(product => (
              <div key={product._id} className="col-lg-3 col-md-4 col-sm-6">
                <ProductCard product={product} onAddToCart={onAddToCart} user={user} />
              </div>
            ))}
          </div>
        )}
        <div className="text-center mt-4">
          <Link to="/products" className="btn btn-success btn-lg px-5">View All Products</Link>
        </div>
      </div>

      <style jsx>{`
        .hover-card:hover {
          transform: translateY(-5px);
        }
      `}</style>
    </div>
  );
};

export default Home;