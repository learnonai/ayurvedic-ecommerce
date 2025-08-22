import React from 'react';

const ImageIndicator = ({ product }) => {
  const hasImages = product.images && Array.isArray(product.images) && product.images.length > 0 && product.images[0] && product.images[0].trim() !== '';
  
  if (!hasImages) {
    return <span className="badge bg-danger">❌ No Image</span>;
  }
  
  const imageUrl = process.env.NODE_ENV === 'development' 
    ? `http://localhost:5000/api/images/${product.images[0].replace('uploads/', '')}`
    : `https://learnonai.com/api/images/${product.images[0].replace('uploads/', '')}`;
  
  return (
    <img 
      src={imageUrl}
      alt={product.name}
      style={{
        width: '50px', 
        height: '50px', 
        objectFit: 'cover', 
        borderRadius: '4px',
        border: '1px solid #ddd'
      }}
      onError={(e) => {
        e.target.style.display = 'none';
        e.target.nextSibling.style.display = 'inline-block';
      }}
    />
  );
};

export default ImageIndicator;