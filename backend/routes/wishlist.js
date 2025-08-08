const express = require('express');
const { auth } = require('../middleware/auth');
const db = require('../db');
const router = express.Router();

// Get user wishlist
router.get('/', auth, async (req, res) => {
  try {
    const wishlist = db.find('wishlist', { user: req.user._id });
    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add to wishlist
router.post('/', auth, async (req, res) => {
  try {
    const { productId } = req.body;
    const existing = db.find('wishlist', { user: req.user._id, product: productId });
    
    if (existing.length > 0) {
      return res.status(400).json({ message: 'Product already in wishlist' });
    }
    
    const wishlistItem = db.create('wishlist', {
      user: req.user._id,
      product: productId
    });
    
    res.status(201).json(wishlistItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Remove from wishlist
router.delete('/:productId', auth, async (req, res) => {
  try {
    const wishlistItems = db.find('wishlist', { user: req.user._id, product: req.params.productId });
    if (wishlistItems.length > 0) {
      db.delete('wishlist', wishlistItems[0]._id);
    }
    res.json({ message: 'Removed from wishlist' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;