const express = require('express');
const path = require('path');
const fs = require('fs');
const router = express.Router();

// Serve images through API - check both pdt-img and uploads
router.get('/:filename', (req, res) => {
  const filename = req.params.filename;
  
  // First check pdt-img folder (permanent images)
  const pdtImagePath = path.join(__dirname, '../pdt-img', filename);
  
  // Then check uploads folder (uploaded images)
  const uploadImagePath = path.join(__dirname, '../uploads', filename);
  
  let imagePath;
  if (fs.existsSync(pdtImagePath)) {
    imagePath = pdtImagePath;
  } else if (fs.existsSync(uploadImagePath)) {
    imagePath = uploadImagePath;
  } else {
    return res.status(404).json({ error: 'Image not found' });
  }
  
  // Set CORS headers
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Cross-Origin-Resource-Policy', 'cross-origin');
  
  // Send the file
  res.sendFile(imagePath);
});

module.exports = router;