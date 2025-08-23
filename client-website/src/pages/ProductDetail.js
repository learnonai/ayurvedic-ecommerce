import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { products, wishlist, BASE_URL } from '../utils/api';
import { addToRecentlyViewed } from '../components/RecentlyViewed';

const ProductDetail = ({ onAddToCart, user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await products.getById(id);
      setProduct(response.data);
      addToRecentlyViewed(response.data);
    } catch (error) {
      console.error('Error fetching product:', error);
    }
    setLoading(false);
  };

  const handleAddToCart = async () => {
    if (!product || product.stock === 0) return;
    
    setAddingToCart(true);
    try {
      for (let i = 0; i < quantity; i++) {
        await onAddToCart(product);
      }
    } finally {
      setAddingToCart(false);
    }
  };

  const addToWishlist = async () => {
    if (!user) {
      navigate('/register');
      return;
    }
    
    try {
      await wishlist.add(product._id);
      alert('Added to wishlist!');
    } catch (error) {
      alert('Error adding to wishlist');
    }
  };

  if (loading) {
    return (
      <div className="container my-5 text-center">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container my-5 text-center">
        <h3>Product not found</h3>
        <button className="btn btn-success" onClick={() => navigate('/products')}>
          Back to Products
        </button>
      </div>
    );
  }

  return (
    <div className="container my-4">
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><a href="/">Home</a></li>
          <li className="breadcrumb-item"><a href="/products">Products</a></li>
          <li className="breadcrumb-item active">{product.name}</li>
        </ol>
      </nav>

      <div className="row">
        <div className="col-md-6">
          <div className="product-image-container">
            <div 
              className="d-flex align-items-center justify-content-center bg-light rounded"
              style={{height: '400px'}}
            >
              <span style={{fontSize: '120px'}}>🌿</span>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <h1 className="h2 mb-3">{product.name}</h1>
          
          <div className="mb-3">
            <span className="h3 text-success fw-bold">₹{product.price}</span>
            {product.volume && (
              <span className="text-muted ms-2">({product.volume})</span>
            )}
          </div>

          <div className="mb-3">
            {product.stock > 0 ? (
              <span className="badge bg-success fs-6">✓ In Stock ({product.stock} available)</span>
            ) : (
              <span className="badge bg-danger fs-6">✗ Out of Stock</span>
            )}
          </div>

          <p className="lead mb-4">{product.description}</p>

          {product.benefits && (
            <div className="mb-4">
              <h5>Key Benefits:</h5>
              <ul className="list-unstyled">
                {product.benefits.map((benefit, index) => (
                  <li key={index} className="mb-2">
                    <i className="text-success me-2">✓</i>
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {product.ingredients && (
            <div className="mb-4">
              <h5>Ingredients:</h5>
              <ul className="list-unstyled">
                {product.ingredients.map((ingredient, index) => (
                  <li key={index} className="mb-1">
                    <i className="text-muted me-2">•</i>
                    {ingredient}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {product.usage && (
            <div className="mb-4">
              <h5>How to Use:</h5>
              <p className="text-muted">{product.usage}</p>
            </div>
          )}

          <div className="row mb-4">
            <div className="col-4">
              <label className="form-label">Quantity:</label>
              <select 
                className="form-select"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                disabled={product.stock === 0}
              >
                {[...Array(Math.min(10, product.stock))].map((_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="d-flex gap-3 mb-4">
            <button 
              className="btn btn-success btn-lg flex-fill"
              onClick={handleAddToCart}
              disabled={product.stock === 0 || addingToCart}
            >
              {addingToCart ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Adding...
                </>
              ) : product.stock === 0 ? 'Out of Stock' : `Add to Cart - ₹${product.price * quantity}`}
            </button>
            
            <button 
              className="btn btn-outline-danger btn-lg"
              onClick={addToWishlist}
              title="Add to Wishlist"
            >
              ❤️
            </button>
          </div>

          <div className="border-top pt-3">
            <small className="text-muted">
              <strong>Category:</strong> {product.category} <br/>
              <strong>Product ID:</strong> {product._id}
            </small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;