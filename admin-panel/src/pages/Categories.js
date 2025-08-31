import React, { useState, useEffect } from 'react';
import { BASE_URL } from '../utils/api';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ id: '', name: '', icon: '', description: '', image: '' });
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/categories`);
      const data = await response.json();
      if (data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
        setFormData({...formData, image: e.target.result});
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      let response;
      if (editingCategory) {
        response = await fetch(`${BASE_URL}/api/categories/${editingCategory.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      } else {
        response = await fetch(`${BASE_URL}/api/categories`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      }
      
      const data = await response.json();
      if (data.success) {
        fetchCategories();
        setShowForm(false);
        setFormData({ id: '', name: '', icon: '', description: '', image: '' });
        setSelectedFile(null);
        setImagePreview('');
        setEditingCategory(null);
        alert(editingCategory ? 'Category updated successfully!' : 'Category added successfully!');
      } else {
        alert(data.message || 'Error saving category');
      }
    } catch (error) {
      alert('Error saving category');
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({ ...category });
    setImagePreview(category.image || '');
    setShowForm(true);
  };

  const handleDelete = async (categoryId) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        const response = await fetch(`${BASE_URL}/api/categories/${categoryId}`, {
          method: 'DELETE'
        });
        const data = await response.json();
        if (data.success) {
          fetchCategories();
          alert('Category deleted successfully!');
        } else {
          alert('Error deleting category');
        }
      } catch (error) {
        alert('Error deleting category');
      }
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Categories Management</h2>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Add Category'}
        </button>
      </div>

      {showForm && (
        <div className="card mb-4">
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Category ID</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="e.g., oils, capsules" 
                    value={formData.id} 
                    onChange={(e) => setFormData({...formData, id: e.target.value})} 
                    required 
                    disabled={editingCategory}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Category Name</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="e.g., Herbal Oils" 
                    value={formData.name} 
                    onChange={(e) => setFormData({...formData, name: e.target.value})} 
                    required 
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Icon (Emoji or Symbol)</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="e.g., ⚜️, 🌿, ⚕️" 
                    value={formData.icon} 
                    onChange={(e) => setFormData({...formData, icon: e.target.value})} 
                    required 
                  />
                  <small className="text-muted">You can use any emoji or symbol</small>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Description</label>
                  <textarea 
                    className="form-control" 
                    placeholder="Brief description of the category" 
                    value={formData.description} 
                    onChange={(e) => setFormData({...formData, description: e.target.value})} 
                    required
                  ></textarea>
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">Category Image</label>
                <input 
                  type="file" 
                  className="form-control" 
                  accept="image/*"
                  onChange={handleFileChange}
                  required={!editingCategory}
                />
                {imagePreview && (
                  <div className="mt-2">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      style={{width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px'}}
                    />
                  </div>
                )}
              </div>
              <button type="submit" className="btn btn-success">
                {editingCategory ? 'Update Category' : 'Add Category'}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="row">
        {categories.map(category => (
          <div key={category.id} className="col-md-4 mb-4">
            <div className="card h-100">
              <div className="card-body text-center">
                {category.image ? (
                  <img 
                    src={category.image} 
                    alt={category.name}
                    style={{width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px', marginBottom: '1rem'}}
                  />
                ) : (
                  <div style={{fontSize: '3rem', marginBottom: '1rem'}}>{category.icon}</div>
                )}
                <h5 className="card-title">{category.name}</h5>
                <p className="card-text text-muted">{category.description}</p>
                <small className="text-muted">ID: {category.id}</small>
              </div>
              <div className="card-footer d-flex gap-2">
                <button 
                  className="btn btn-sm btn-primary flex-fill"
                  onClick={() => handleEdit(category)}
                >
                  Edit
                </button>
                <button 
                  className="btn btn-sm btn-danger flex-fill"
                  onClick={() => handleDelete(category.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;