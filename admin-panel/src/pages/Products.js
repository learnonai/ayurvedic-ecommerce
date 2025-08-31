import React, { useState, useEffect } from 'react';
import { products } from '../utils/api';

const Products = () => {
  const [productList, setProductList] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '', description: '', price: '', category: 'oils', stock: '', benefits: '', ingredients: '', usage: ''
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priceFilter, setPriceFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  useEffect(() => {
    fetchProducts();
  }, []);
  
  useEffect(() => {
    filterProducts();
  }, [productList, searchTerm, categoryFilter, priceFilter, stockFilter, sortBy]);

  const fetchProducts = async () => {
    try {
      const response = await products.getAll();
      setProductList(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };
  
  const filterProducts = () => {
    let filtered = [...productList];
    
    // Search by name
    if (searchTerm) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by category
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(product => product.category === categoryFilter);
    }
    
    // Filter by price range
    if (priceFilter !== 'all') {
      switch(priceFilter) {
        case 'low': // Under 300
          filtered = filtered.filter(product => product.price < 300);
          break;
        case 'medium': // 300-500
          filtered = filtered.filter(product => product.price >= 300 && product.price <= 500);
          break;
        case 'high': // Above 500
          filtered = filtered.filter(product => product.price > 500);
          break;
      }
    }
    
    // Filter by stock status
    if (stockFilter !== 'all') {
      switch(stockFilter) {
        case 'instock':
          filtered = filtered.filter(product => product.stock > 0);
          break;
        case 'lowstock':
          filtered = filtered.filter(product => product.stock > 0 && product.stock <= 10);
          break;
        case 'outofstock':
          filtered = filtered.filter(product => product.stock === 0);
          break;
      }
    }
    
    // Sort products
    switch(sortBy) {
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'price_low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price_high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'stock_low':
        filtered.sort((a, b) => a.stock - b.stock);
        break;
      case 'stock_high':
        filtered.sort((a, b) => b.stock - a.stock);
        break;
    }
    
    setFilteredProducts(filtered);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
    
    // Create preview URLs
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreview(previews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'benefits' || key === 'ingredients') {
          formDataToSend.append(key, JSON.stringify(formData[key].split(',').map(item => item.trim())));
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });
      
      selectedFiles.forEach(file => {
        formDataToSend.append('images', file);
      });
      
      if (editingProduct) {
        await products.update(editingProduct._id, formDataToSend);
        setEditingProduct(null);
      } else {
        await products.create(formDataToSend);
      }
      
      setShowForm(false);
      setFormData({ name: '', description: '', price: '', category: 'oils', stock: '', benefits: '', ingredients: '', usage: '' });
      setSelectedFiles([]);
      setImagePreview([]);
      fetchProducts();
    } catch (error) {
      alert(editingProduct ? 'Error updating product' : 'Error creating product');
    }
  };
  
  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      stock: product.stock,
      benefits: product.benefits?.join(', ') || '',
      ingredients: product.ingredients?.join(', ') || '',
      usage: product.usage || ''
    });
    setShowForm(true);
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Products Management</h2>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Add Product'}
        </button>
      </div>
      
      {/* Search and Filter Controls */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-3">
              <label className="form-label fw-bold">Search Products:</label>
              <input 
                type="text"
                className="form-control"
                placeholder="Search by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="col-md-2">
              <label className="form-label fw-bold">Category:</label>
              <select 
                className="form-select"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="all">All Categories</option>
                <option value="oils">Herbal Oils</option>
                <option value="capsules">Capsules</option>
                <option value="skincare">Skincare</option>
                <option value="powders">Powders</option>
                <option value="teas">Herbal Teas</option>
              </select>
            </div>
            <div className="col-md-2">
              <label className="form-label fw-bold">Price Range:</label>
              <select 
                className="form-select"
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value)}
              >
                <option value="all">All Prices</option>
                <option value="low">Under ₹300</option>
                <option value="medium">₹300 - ₹500</option>
                <option value="high">Above ₹500</option>
              </select>
            </div>
            <div className="col-md-2">
              <label className="form-label fw-bold">Stock Status:</label>
              <select 
                className="form-select"
                value={stockFilter}
                onChange={(e) => setStockFilter(e.target.value)}
              >
                <option value="all">All Stock</option>
                <option value="instock">In Stock</option>
                <option value="lowstock">Low Stock (≤10)</option>
                <option value="outofstock">Out of Stock</option>
              </select>
            </div>
            <div className="col-md-2">
              <label className="form-label fw-bold">Sort By:</label>
              <select 
                className="form-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="name">Name (A-Z)</option>
                <option value="price_low">Price (Low to High)</option>
                <option value="price_high">Price (High to Low)</option>
                <option value="stock_low">Stock (Low to High)</option>
                <option value="stock_high">Stock (High to Low)</option>
              </select>
            </div>
            <div className="col-md-1">
              <label className="form-label fw-bold">Results:</label>
              <div>
                <span className="badge bg-primary fs-6" style={{padding: '8px 12px'}}>
                  {filteredProducts.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showForm && (
        <div className="card mb-4">
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <input type="text" className="form-control" placeholder="Product Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                </div>
                <div className="col-md-6 mb-3">
                  <select className="form-control" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                    <option value="oils">Herbal Oils</option>
                    <option value="capsules">Capsules</option>
                    <option value="skincare">Skincare</option>
                    <option value="powders">Powders</option>
                    <option value="teas">Herbal Teas</option>
                  </select>
                </div>
              </div>
              <div className="mb-3">
                <textarea className="form-control" placeholder="Description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} required></textarea>
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <input type="number" className="form-control" placeholder="Price" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} required />
                </div>
                <div className="col-md-6 mb-3">
                  <input type="number" className="form-control" placeholder="Stock" value={formData.stock} onChange={(e) => setFormData({...formData, stock: e.target.value})} required />
                </div>
              </div>
              <div className="mb-3">
                <input type="text" className="form-control" placeholder="Benefits (comma separated)" value={formData.benefits} onChange={(e) => setFormData({...formData, benefits: e.target.value})} />
              </div>
              <div className="mb-3">
                <input type="text" className="form-control" placeholder="Ingredients (comma separated)" value={formData.ingredients} onChange={(e) => setFormData({...formData, ingredients: e.target.value})} />
              </div>
              <div className="mb-3">
                <textarea className="form-control" placeholder="Usage Instructions" value={formData.usage} onChange={(e) => setFormData({...formData, usage: e.target.value})}></textarea>
              </div>
              <div className="mb-3">
                <label className="form-label">Product Images</label>
                <input 
                  type="file" 
                  className="form-control" 
                  multiple 
                  accept="image/*"
                  onChange={handleFileChange}
                />
                {imagePreview.length > 0 && (
                  <div className="mt-2">
                    <small className="text-muted">Preview:</small>
                    <div className="d-flex gap-2 mt-1">
                      {imagePreview.map((preview, index) => (
                        <img 
                          key={index}
                          src={preview} 
                          alt={`Preview ${index + 1}`}
                          style={{width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #ddd'}}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <button type="submit" className="btn btn-success">
                {editingProduct ? 'Update Product' : 'Add Product'}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Image Status</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map(product => (
              <tr key={product._id}>
                <td>
                  {(!product.images || product.images.length === 0 || 
                    product.images.some(img => img.includes('herbal-leaf-default') || img.includes('sample'))) ? (
                    <span className="badge bg-danger">❌ NO IMAGE</span>
                  ) : (
                    <span className="badge bg-success">✅ HAS IMAGE</span>
                  )}
                </td>
                <td>
                  <strong>{product.name}</strong>
                  {product.images && product.images.length > 0 && (
                    <div style={{fontSize: '11px', color: '#6c757d', marginTop: '2px'}}>
                      📁 {product.images.length} image(s)
                    </div>
                  )}
                </td>
                <td><span className="badge bg-info">{product.category}</span></td>
                <td><strong>₹{product.price}</strong></td>
                <td>
                  <span className={`badge ${product.stock > 10 ? 'bg-success' : product.stock > 0 ? 'bg-warning' : 'bg-danger'}`}>
                    {product.stock} units
                  </span>
                </td>
                <td>
                  <button 
                    className="btn btn-sm btn-primary me-2"
                    onClick={() => handleEdit(product)}
                  >
                    Edit
                  </button>
                  <button 
                    className="btn btn-sm btn-danger" 
                    onClick={async () => {
                      if (window.confirm('Are you sure you want to delete this product?')) {
                        try {
                          await products.delete(product._id);
                          fetchProducts();
                        } catch (error) {
                          alert('Error deleting product');
                        }
                      }
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Products;