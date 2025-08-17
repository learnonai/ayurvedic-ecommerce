const express = require('express');
const path = require('path');
const fs = require('fs');
const router = express.Router();

// Serve images through API
router.get('/:filename', (req, res) => {
  const filename = req.params.filename;
  const imagePath = path.join(__dirname, '../uploads', filename);
  
  // Check if file exists
  if (!fs.existsSync(imagePath)) {
    return res.status(404).json({ error: 'Image not found' });
  }
  
  // Set CORS headers
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Cross-Origin-Resource-Policy', 'cross-origin');
  
  // Send the file
  res.sendFile(imagePath);
});

module.exports = router;