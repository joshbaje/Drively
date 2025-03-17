import React, { useState } from 'react';
import './VehicleGallery.css';

const VehicleGallery = ({ images }) => {
  const [mainImage, setMainImage] = useState(images && images.length > 0 ? images[0] : '');
  const [showLightbox, setShowLightbox] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  if (!images || images.length === 0) {
    return <div className="vehicle-gallery-empty">No images available</div>;
  }

  const handleThumbnailClick = (image, index) => {
    setMainImage(image);
    setLightboxIndex(index);
  };

  const openLightbox = (index) => {
    setLightboxIndex(index);
    setShowLightbox(true);
    document.body.style.overflow = 'hidden'; // Prevent scrolling when lightbox is open
  };

  const closeLightbox = () => {
    setShowLightbox(false);
    document.body.style.overflow = 'auto'; // Re-enable scrolling
  };

  const navigateLightbox = (direction) => {
    let newIndex = lightboxIndex + direction;
    
    // Handle wrapping around the gallery
    if (newIndex < 0) {
      newIndex = images.length - 1;
    } else if (newIndex >= images.length) {
      newIndex = 0;
    }
    
    setLightboxIndex(newIndex);
  };

  return (
    <div className="vehicle-gallery">
      <div className="main-image-container">
        <img 
          src={mainImage} 
          alt="Vehicle" 
          className="main-image" 
          onClick={() => openLightbox(lightboxIndex)}
        />
        <div className="main-image-overlay">
          <i className="fas fa-expand-alt"></i> Click to expand
        </div>
      </div>

      <div className="thumbnails-container">
        {images.map((image, index) => (
          <div 
            key={index} 
            className={`thumbnail ${mainImage === image ? 'active' : ''}`}
            onClick={() => handleThumbnailClick(image, index)}
          >
            <img src={image} alt={`Vehicle thumbnail ${index + 1}`} />
          </div>
        ))}
      </div>

      {showLightbox && (
        <div className="lightbox">
          <div className="lightbox-overlay" onClick={closeLightbox}></div>
          <div className="lightbox-content">
            <button className="lightbox-close" onClick={closeLightbox}>
              <i className="fas fa-times"></i>
            </button>
            <button 
              className="lightbox-nav prev" 
              onClick={(e) => {
                e.stopPropagation();
                navigateLightbox(-1);
              }}
            >
              <i className="fas fa-chevron-left"></i>
            </button>
            <div className="lightbox-image-container">
              <img src={images[lightboxIndex]} alt="Vehicle lightbox" />
            </div>
            <button 
              className="lightbox-nav next" 
              onClick={(e) => {
                e.stopPropagation();
                navigateLightbox(1);
              }}
            >
              <i className="fas fa-chevron-right"></i>
            </button>
            <div className="lightbox-caption">
              {lightboxIndex + 1} / {images.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleGallery;