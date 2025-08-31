import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { products } from '../utils/api';
import ProductCard from '../components/ProductCard';
import RecentlyViewed from '../components/RecentlyViewed';

const Home = ({ onAddToCart, user }) => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const categories = [
    { name: 'oils', title: 'Herbal Oils' },
    { name: 'capsules', title: 'Capsules' },
    { name: 'skincare', title: 'Skincare' },
    { name: 'powders', title: 'Powders' },
    { name: 'teas', title: 'Herbal Teas' }
  ];

  const getAyurvedicSymbol = (category) => {
    const symbols = {
      oils: '⚜️', // Fleur-de-lis (represents purity and healing)
      capsules: '⚕️', // Medical symbol (represents health and medicine)
      skincare: '🌿', // Herb (represents natural beauty)
      powders: '⚰️', // Coffin/mortar (represents grinding/powder making)
      teas: '🌱' // Seedling (represents growth and wellness)
    };
    return symbols[category] || 'ॐ'; // Om symbol as fallback
  };

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
      {/* Special Offers Banner */}
      <div className="bg-warning py-4">
        <div className="container text-center">
          <h3 className="mb-0 fw-bold">🎉 Special Launch Offer: All Products Under ₹199 | Free Shipping Above ₹299 🚚</h3>
        </div>
      </div>

      {/* Categories */}
      <div className="container my-5">
        <div className="text-center mb-4">
          <h2 className="fw-bold">Shop by Category</h2>
        </div>
        <div className="row g-3 justify-content-center">
          {categories.map(category => (
            <div key={category.name} className="col-lg-2 col-md-3 col-4">
              <Link to={`/products?category=${category.name}`} className="text-decoration-none">
                <div className="card h-100 border-0 shadow-sm text-center p-3" style={{transition: 'transform 0.2s'}} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-3px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                  <div className="mb-2" style={{fontSize: '2.5rem', color: '#2d5016'}}>{getAyurvedicSymbol(category.name)}</div>
                  <h6 className="fw-bold mb-0">{category.title}</h6>
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


    </div>
  );
};

export default Home;