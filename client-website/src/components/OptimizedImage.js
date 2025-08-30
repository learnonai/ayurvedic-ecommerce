import React, { useState } from 'react';

const OptimizedImage = ({ 
  src, 
  alt, 
  className = '', 
  size = 'medium',
  lazy = true 
}) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkxvYWRpbmcuLi48L3RleHQ+PC9zdmc+';
  
  const defaultImage = '/api/images/default-product.jpg';

  const getImageUrl = () => {
    if (!src) return defaultImage;
    if (src.startsWith('http') || src.startsWith('data:')) return src;
    return `/api/images/${src}`;
  };

  const handleLoad = () => {
    setLoaded(true);
  };

  const handleError = () => {
    setError(true);
    setLoaded(true);
  };

  return (
    <div className={`position-relative ${className}`}>
      {!loaded && (
        <img
          src={placeholder}
          alt="Loading..."
          className={`${className} position-absolute`}
          style={{ filter: 'blur(2px)' }}
        />
      )}
      <img
        src={error ? defaultImage : getImageUrl()}
        alt={alt}
        className={`${className} ${loaded ? 'opacity-100' : 'opacity-0'}`}
        style={{ transition: 'opacity 0.3s ease' }}
        loading={lazy ? 'lazy' : 'eager'}
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  );
};

export default OptimizedImage;