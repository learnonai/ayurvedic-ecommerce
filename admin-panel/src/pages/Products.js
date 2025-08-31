import React, { useState, useEffect } from 'react';
import { products } from '../utils/api';

const Products = () => {
  const [productList, setProductList] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '', description: '', price: '', category: 'oils', stock: '', benefits: '', ingredients: '', usage: ''
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await products.getAll();
      setProductList(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
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
            {productList.map(product => (
              <tr key={product._id}>
                <td>
                  {(!product.images || product.images.length === 0) ? (
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