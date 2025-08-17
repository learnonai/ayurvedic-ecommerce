import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { products } from '../utils/api';
import ProductCard from '../components/ProductCard';

const Products = ({ onAddToCart, user }) => {
  const [productList, setProductList] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(9);
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    search: searchParams.get('search') || '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'name',
    inStock: false
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
    setCurrentPage(1);
  }, [filters, productList]);

  useEffect(() => {
    setFilters({
      category: searchParams.get('category') || '',
      search: searchParams.get('search') || ''
    });
  }, [searchParams]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await products.getAll();
      setProductList(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
    setLoading(false);
  };

  const filterProducts = () => {
    let filtered = productList.filter(product => product.isActive);
    
    // Category filter
    if (filters.category) {
      filtered = filtered.filter(product => 
        product.category === filters.category
      );
    }
    
    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        (product.benefits && product.benefits.some(benefit => benefit.toLowerCase().includes(searchTerm))) ||
        (product.ingredients && product.ingredients.some(ingredient => ingredient.toLowerCase().includes(searchTerm)))
      );
    }
    
    // Price range filter
    if (filters.minPrice) {
      filtered = filtered.filter(product => product.price >= parseFloat(filters.minPrice));
    }
    if (filters.maxPrice) {
      filtered = filtered.filter(product => product.price <= parseFloat(filters.maxPrice));
    }
    
    // Stock filter
    if (filters.inStock) {
      filtered = filtered.filter(product => (product.stock || 0) > 0);
    }
    
    // Sorting
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });
    
    setFilteredProducts(filtered);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    const params = new URLSearchParams();
    if (newFilters.category) params.set('category', newFilters.category);
    if (newFilters.search) params.set('search', newFilters.search);
    setSearchParams(params);
  };

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const Pagination = () => {
    if (totalPages <= 1) return null;
    
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    
    return (
      <nav className="d-flex justify-content-center mt-4">
        <ul className="pagination">
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <button 
              className="page-link" 
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
          </li>
          
          {startPage > 1 && (
            <>
              <li className="page-item">
                <button className="page-link" onClick={() => paginate(1)}>1</button>
              </li>
              {startPage > 2 && <li className="page-item disabled"><span className="page-link">...</span></li>}
            </>
          )}
          
          {pageNumbers.map(number => (
            <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
              <button 
                className="page-link" 
                onClick={() => paginate(number)}
              >
                {number}
              </button>
            </li>
          ))}
          
          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && <li className="page-item disabled"><span className="page-link">...</span></li>}
              <li className="page-item">
                <button className="page-link" onClick={() => paginate(totalPages)}>{totalPages}</button>
              </li>
            </>
          )}
          
          <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
            <button 
              className="page-link" 
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </li>
        </ul>
      </nav>
    );
  };

  return (
    <div className="container my-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Our Products</h2>
        <div className="text-muted">
          Showing {indexOfFirstProduct + 1}-{Math.min(indexOfLastProduct, filteredProducts.length)} of {filteredProducts.length} products
        </div>
      </div>
      
      {/* Active Filters Display */}
      {(filters.category || filters.search || filters.minPrice || filters.maxPrice || filters.inStock) && (
        <div className="mb-3">
          <div className="d-flex flex-wrap gap-2 align-items-center">
            <span className="text-muted small">Active filters:</span>
            {filters.search && (
              <span className="badge bg-primary">
                Search: "{filters.search}"
                <button 
                  className="btn-close btn-close-white ms-1" 
                  style={{fontSize: '0.6em'}}
                  onClick={() => handleFilterChange({...filters, search: ''})}
                ></button>
              </span>
            )}
            {filters.category && (
              <span className="badge bg-success">
                {filters.category}
                <button 
                  className="btn-close btn-close-white ms-1" 
                  style={{fontSize: '0.6em'}}
                  onClick={() => handleFilterChange({...filters, category: ''})}
                ></button>
              </span>
            )}
            {(filters.minPrice || filters.maxPrice) && (
              <span className="badge bg-info">
                Price: ₹{filters.minPrice || 0} - ₹{filters.maxPrice || '∞'}
                <button 
                  className="btn-close btn-close-white ms-1" 
                  style={{fontSize: '0.6em'}}
                  onClick={() => handleFilterChange({...filters, minPrice: '', maxPrice: ''})}
                ></button>
              </span>
            )}
            {filters.inStock && (
              <span className="badge bg-warning text-dark">
                In Stock Only
                <button 
                  className="btn-close ms-1" 
                  style={{fontSize: '0.6em'}}
                  onClick={() => handleFilterChange({...filters, inStock: false})}
                ></button>
              </span>
            )}
            <button 
              className="btn btn-outline-secondary btn-sm"
              onClick={() => handleFilterChange({
                category: '',
                search: '',
                minPrice: '',
                maxPrice: '',
                sortBy: 'name',
                inStock: false
              })}
            >
              Clear All
            </button>
          </div>
        </div>
      )}

      {/* Products Grid */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-5">
          <h4>No products found</h4>
          <p className="text-muted">Try adjusting your search or filter criteria</p>
        </div>
      ) : (
        <>
          <div className="row">
            {currentProducts.map(product => (
              <div key={product._id} className="col-lg-4 col-md-6 mb-4">
                <ProductCard product={product} onAddToCart={onAddToCart} user={user} />
              </div>
            ))}
          </div>
          
          <Pagination />
        </>
      )}
    </div>
  );
};

export default Products;