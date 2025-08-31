const express = require('express');
const multer = require('multer');
const Product = require('../models/Product');
const { auth, adminAuth } = require('../middleware/auth');
const { validateProduct, handleValidationErrors } = require('../utils/validation');
const router = express.Router();

const storage = multer.diskStorage({
  destination: 'pdt-img/',
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// Get all products
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    let products = Product.find({ isActive: true });
    
    if (category) products = products.filter(p => p.category === category);
    if (search) products = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
    
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const product = Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: Create product
router.post('/', auth, adminAuth, upload.array('images', 5), validateProduct, handleValidationErrors, async (req, res) => {
  try {
    const productData = { ...req.body };
    
    // Parse JSON fields
    if (productData.benefits && typeof productData.benefits === 'string') {
      productData.benefits = JSON.parse(productData.benefits);
    }
    if (productData.ingredients && typeof productData.ingredients === 'string') {
      productData.ingredients = JSON.parse(productData.ingredients);
    }
    
    // Add image paths (save to pdt-img)
    if (req.files) productData.images = req.files.map(file => file.path);
    
    const product = Product.create(productData);
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: Update product
router.put('/:id', auth, adminAuth, upload.array('images', 5), async (req, res) => {
  try {
    const updateData = { ...req.body };
    
    // Parse JSON fields
    if (updateData.benefits && typeof updateData.benefits === 'string') {
      updateData.benefits = JSON.parse(updateData.benefits);
    }
    if (updateData.ingredients && typeof updateData.ingredients === 'string') {
      updateData.ingredients = JSON.parse(updateData.ingredients);
    }
    
    // Add new images if uploaded (save to pdt-img)
    if (req.files && req.files.length > 0) {
      updateData.images = req.files.map(file => file.path);
    }
    
    const product = Product.findByIdAndUpdate(req.params.id, updateData);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    
    res.json({ message: 'Product updated successfully', product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: Delete product
router.delete('/:id', auth, adminAuth, async (req, res) => {
  try {
    Product.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;