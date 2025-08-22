import React, { useState, useEffect } from 'react';
import { products } from '../utils/api';

const Products = () => {
  // Force rebuild for production - v2.0
  const [productList, setProductList] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '', description: '', price: '', category: 'medicines', stock: '', benefits: '', ingredients: '', usage: ''
  });
  const [selectedFiles, setSelectedFiles] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await products.getAll();
      console.log('DEBUG: Products data:', response.data);
      console.log('DEBUG: First product images:', response.data[0]?.images);
      setProductList(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
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
      setFormData({ name: '', description: '', price: '', category: 'medicines', stock: '', benefits: '', ingredients: '', usage: '' });
      setSelectedFiles([]);
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
        <h2>Products <span className="badge bg-warning">v2.1 - Image Indicators Active</span></h2>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Add Product'}
        </button>
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
                    <option value="medicines">Medicines</option>
                    <option value="jadi-buti">Jadi Buti</option>
                    <option value="oils">Oils</option>
                    <option value="powders">Powders</option>
                    <option value="tablets">Tablets</option>
                    <option value="other">Other</option>
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
                  onChange={(e) => setSelectedFiles(Array.from(e.target.files))}
                />
              </div>
              <button type="submit" className="btn btn-success">
                {editingProduct ? 'Update Product' : 'Add Product'}
              </button>
              {editingProduct && (
                <button 
                  type="button" 
                  className="btn btn-secondary ms-2"
                  onClick={() => {
                    setEditingProduct(null);
                    setShowForm(false);
                    setFormData({ name: '', description: '', price: '', category: 'medicines', stock: '', benefits: '', ingredients: '', usage: '' });
                  }}
                >
                  Cancel
                </button>
              )}
            </form>
          </div>
        </div>
      )}

      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {productList.map(product => {
              const hasImages = product.images && product.images.length > 0 && product.images[0] !== '';
              return (
              <tr key={product._id}>
                <td>
                  {!hasImages ? (
                    <span className="badge bg-danger">❌ No Image</span>
                  ) : (
                    <div>
                      <img 
                        src={`https://learnonai.com/api/images/${product.images[0].replace('uploads/', '')}`}
                        alt={product.name}
                        style={{width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px'}}
                        onError={(e) => e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjZjhmOWZhIi8+Cjx0ZXh0IHg9IjIwIiB5PSIyNSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE2IiBmaWxsPSIjNmM3NTdkIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7wn4y/PC90ZXh0Pgo8L3N2Zz4K'}
                      />
                    </div>
                  )}
                </td>
                <td>
                  {!hasImages && <span className="text-danger me-2">🔴</span>}
                  {product.name}
                  {hasImages && (
                    <div><small className="text-muted">📁 {product.images[0].split('/').pop()}</small></div>
                  )}
                </td>
                <td>{product.category}</td>
                <td>₹{product.price}</td>
                <td>{product.stock}</td>
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
                      try {
                        await products.delete(product._id);
                        fetchProducts();
                      } catch (error) {
                        alert('Error deleting product');
                      }
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            )})}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Products;