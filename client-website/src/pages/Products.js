import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { products } from '../utils/api';
import ProductCard from '../components/ProductCard';

const Products = ({ onAddToCart, user }) => {
  const [productList, setProductList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    search: ''
  });

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await products.getAll(filters);
      setProductList(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
    setLoading(false);
  };

  return (
    <div className="container my-4">
      <h2>Our Products</h2>
      
      {/* Filters */}
      <div className="row mb-4">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Search products..."
            value={filters.search}
            onChange={(e) => setFilters({...filters, search: e.target.value})}
          />
        </div>
        <div className="col-md-6">
          <select
            className="form-control"
            value={filters.category}
            onChange={(e) => setFilters({...filters, category: e.target.value})}
          >
            <option value="">All Categories</option>
            <option value="medicines">Medicines</option>
            <option value="jadi-buti">Jadi Buti</option>
            <option value="oils">Oils</option>
            <option value="powders">Powders</option>
            <option value="tablets">Tablets</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div className="row">
          {productList.map(product => (
            <div key={product._id} className="col-md-4 mb-4">
              <ProductCard product={product} onAddToCart={onAddToCart} user={user} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;