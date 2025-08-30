const path = require('path');
const fs = require('fs');

class ImageOptimizer {
  constructor() {
    this.supportedFormats = ['.jpg', '.jpeg', '.png', '.webp'];
    this.maxWidth = 800;
    this.maxHeight = 600;
    this.quality = 80;
  }

  // Generate multiple sizes for responsive images
  generateImageSizes(filename) {
    const ext = path.extname(filename);
    const name = path.basename(filename, ext);
    
    return {
      original: filename,
      large: `${name}_800x600${ext}`,
      medium: `${name}_400x300${ext}`,
      small: `${name}_200x150${ext}`,
      thumbnail: `${name}_100x75${ext}`
    };
  }

  // Get optimized image URL based on size needed
  getOptimizedImageUrl(filename, size = 'medium') {
    if (!filename) return '/api/images/placeholder.jpg';
    
    const sizes = this.generateImageSizes(filename);
    return `/api/images/${sizes[size] || sizes.medium}`;
  }

  // Check if image exists, fallback to original
  getAvailableImage(filename, size = 'medium') {
    const sizes = this.generateImageSizes(filename);
    const requestedImage = sizes[size];
    
    // In a real implementation, you'd check if the optimized version exists
    // For now, return the original filename
    return filename;
  }

  // Lazy loading placeholder (base64 tiny image)
  getPlaceholder() {
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkxvYWRpbmcuLi48L3RleHQ+PC9zdmc+';
  }
}

module.exports = new ImageOptimizer();