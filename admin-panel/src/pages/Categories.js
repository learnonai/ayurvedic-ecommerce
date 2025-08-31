import React, { useState, useEffect } from 'react';

const Categories = () => {
  const [categories, setCategories] = useState([
    { id: 'oils', name: 'Herbal Oils', icon: '⚜️', description: 'Natural herbal oils for health and wellness' },
    { id: 'capsules', name: 'Capsules', icon: '⚕️', description: 'Health supplements in capsule form' },
    { id: 'skincare', name: 'Skincare', icon: '🌿', description: 'Natural skincare products' },
    { id: 'powders', name: 'Powders', icon: '⚰️', description: 'Herbal powders and supplements' },
    { id: 'teas', name: 'Herbal Teas', icon: '🌱', description: 'Wellness teas and beverages' }
  ]);
  
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ id: '', name: '', icon: '', description: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingCategory) {
      setCategories(categories.map(cat => 
        cat.id === editingCategory.id ? { ...formData } : cat
      ));
      setEditingCategory(null);
    } else {
      if (categories.find(cat => cat.id === formData.id)) {
        alert('Category ID already exists!');
        return;
      }
      setCategories([...categories, { ...formData }]);
    }
    
    setShowForm(false);
    setFormData({ id: '', name: '', icon: '', description: '' });
    
    // Save to localStorage for persistence
    localStorage.setItem('categories', JSON.stringify(categories));
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({ ...category });
    setShowForm(true);
  };

  const handleDelete = (categoryId) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      const updatedCategories = categories.filter(cat => cat.id !== categoryId);
      setCategories(updatedCategories);
      localStorage.setItem('categories', JSON.stringify(updatedCategories));
    }
  };

  useEffect(() => {
    const savedCategories = localStorage.getItem('categories');
    if (savedCategories) {
      setCategories(JSON.parse(savedCategories));
    }
  }, []);

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
                <div style={{fontSize: '3rem', marginBottom: '1rem'}}>{category.icon}</div>
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

      <div className="alert alert-info mt-4">
        <strong>Note:</strong> Categories are stored locally and will be used across the application. 
        Make sure to backup your categories before making major changes.
      </div>
    </div>
  );
};

export default Categories;