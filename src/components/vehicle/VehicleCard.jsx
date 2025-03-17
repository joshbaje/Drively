import React from 'react';
import { Link } from 'react-router-dom';
import './VehicleCard.css';

const VehicleCard = ({ vehicle }) => {
  const { 
    id, 
    make, 
    model, 
    year, 
    dailyRate, 
    transmission, 
    fuelType, 
    seats, 
    location, 
    rating, 
    reviewCount, 
    imageUrl 
  } = vehicle;

  // Function to render stars based on rating
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={`full-${i}`} className="fas fa-star"></i>);
    }
    
    // Add half star if needed
    if (hasHalfStar) {
      stars.push(<i key="half" className="fas fa-star-half-alt"></i>);
    }
    
    // Add empty stars to complete 5 stars
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<i key={`empty-${i}`} className="far fa-star"></i>);
    }
    
    return stars;
  };

  return (
    <div className="vehicle-card">
      <div className="vehicle-card-image">
        <img src={imageUrl} alt={`${year} ${make} ${model}`} />
        <div className="vehicle-card-badge">₱{dailyRate.toLocaleString()}/day</div>
      </div>
      
      <div className="vehicle-card-content">
        <h3 className="vehicle-card-title">{year} {make} {model}</h3>
        
        <div className="vehicle-card-features">
          <div className="vehicle-feature">
            <i className="fas fa-cog"></i>
            <span>{transmission}</span>
          </div>
          
          <div className="vehicle-feature">
            <i className="fas fa-gas-pump"></i>
            <span>{fuelType}</span>
          </div>
          
          <div className="vehicle-feature">
            <i className="fas fa-users"></i>
            <span>{seats} Seats</span>
          </div>
        </div>
        
        <div className="vehicle-card-location">
          <i className="fas fa-map-marker-alt"></i>
          <span>{location}</span>
        </div>
        
        <div className="vehicle-card-rating">
          <div className="stars">
            {renderStars(rating)}
          </div>
          <span className="rating-text">
            {rating.toFixed(1)} ({reviewCount} {reviewCount === 1 ? 'review' : 'reviews'})
          </span>
        </div>
        
        <Link to={`/vehicles/${id}`} className="vehicle-card-button">
          View Details
        </Link>
      </div>
    </div>
  );
};

export default VehicleCard;