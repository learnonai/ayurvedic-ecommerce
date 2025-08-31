const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const categoriesFile = path.join(__dirname, '../data/categories.json');

// Initialize categories file if it doesn't exist
const initCategories = () => {
  if (!fs.existsSync(categoriesFile)) {
    const defaultCategories = [
      { id: 'oils', name: 'Herbal Oils', icon: '⚜️', description: 'Natural herbal oils for health and wellness' },
      { id: 'capsules', name: 'Capsules', icon: '⚕️', description: 'Health supplements in capsule form' },
      { id: 'skincare', name: 'Skincare', icon: '🌿', description: 'Natural skincare products' },
      { id: 'powders', name: 'Powders', icon: '🥄', description: 'Herbal powders and supplements' },
      { id: 'teas', name: 'Herbal Teas', icon: '🌱', description: 'Wellness teas and beverages' }
    ];
    fs.writeFileSync(categoriesFile, JSON.stringify(defaultCategories, null, 2));
  }
};

// Get all categories
router.get('/', (req, res) => {
  try {
    initCategories();
    const categories = JSON.parse(fs.readFileSync(categoriesFile, 'utf8'));
    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching categories' });
  }
});

// Add new category
router.post('/', (req, res) => {
  try {
    initCategories();
    const categories = JSON.parse(fs.readFileSync(categoriesFile, 'utf8'));
    const newCategory = req.body;
    
    // Check if category ID already exists
    if (categories.find(cat => cat.id === newCategory.id)) {
      return res.status(400).json({ success: false, message: 'Category ID already exists' });
    }
    
    categories.push(newCategory);
    fs.writeFileSync(categoriesFile, JSON.stringify(categories, null, 2));
    res.json({ success: true, data: newCategory });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error adding category' });
  }
});

// Update category
router.put('/:id', (req, res) => {
  try {
    initCategories();
    const categories = JSON.parse(fs.readFileSync(categoriesFile, 'utf8'));
    const categoryId = req.params.id;
    const updatedCategory = req.body;
    
    const index = categories.findIndex(cat => cat.id === categoryId);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    
    categories[index] = updatedCategory;
    fs.writeFileSync(categoriesFile, JSON.stringify(categories, null, 2));
    res.json({ success: true, data: updatedCategory });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating category' });
  }
});

// Delete category
router.delete('/:id', (req, res) => {
  try {
    initCategories();
    const categories = JSON.parse(fs.readFileSync(categoriesFile, 'utf8'));
    const categoryId = req.params.id;
    
    const filteredCategories = categories.filter(cat => cat.id !== categoryId);
    fs.writeFileSync(categoriesFile, JSON.stringify(filteredCategories, null, 2));
    res.json({ success: true, message: 'Category deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting category' });
  }
});

module.exports = router;