import React, { useState } from 'react';
import './RatingStyles.css';

const RatingForm = ({ 
  bookingId, 
  vehicleId, 
  vehicleName, 
  ownerId, 
  ownerName,
  onSubmit,
  onCancel
}) => {
  const [vehicleRating, setVehicleRating] = useState(0);
  const [ownerRating, setOwnerRating] = useState(0);
  const [vehicleComment, setVehicleComment] = useState('');
  const [ownerComment, setOwnerComment] = useState('');
  const [activeTab, setActiveTab] = useState('vehicle');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle star rating click for vehicle
  const handleVehicleRatingClick = (rating) => {
    setVehicleRating(rating);
  };

  // Handle star rating click for owner
  const handleOwnerRatingClick = (rating) => {
    setOwnerRating(rating);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate inputs
    if (activeTab === 'vehicle' && vehicleRating === 0) {
      setErrorMessage('Please select a rating for the vehicle');
      return;
    }
    
    if (activeTab === 'owner' && ownerRating === 0) {
      setErrorMessage('Please select a rating for the owner');
      return;
    }
    
    setIsSubmitting(true);
    setErrorMessage('');
    
    // Prepare review data
    const reviewData = {
      bookingId,
      vehicle: {
        vehicleId,
        rating: vehicleRating,
        comment: vehicleComment
      },
      owner: {
        ownerId,
        rating: ownerRating,
        comment: ownerComment
      }
    };
    
    // Call the onSubmit callback with the review data
    if (onSubmit) {
      onSubmit(reviewData);
    }
  };

  // Render stars for selection
  const renderStars = (rating, onRatingClick) => {
    const stars = [];
    
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span 
          key={i}
          className={`star ${i <= rating ? 'selected' : ''}`}
          onClick={() => onRatingClick(i)}
        >
          <i className={`${i <= rating ? 'fas' : 'far'} fa-star`}></i>
        </span>
      );
    }
    
    return stars;
  };
  
  // Function to continue to the next tab
  const handleContinue = (e) => {
    e.preventDefault();
    
    if (vehicleRating === 0) {
      setErrorMessage('Please select a rating for the vehicle');
      return;
    }
    
    setErrorMessage('');
    setActiveTab('owner');
  };
  
  // Function to go back to the previous tab
  const handleBack = () => {
    setActiveTab('vehicle');
  };

  return (
    <div className="rating-form-container">
      <div className="rating-form-header">
        <div className="rating-tabs">
          <button 
            className={`rating-tab ${activeTab === 'vehicle' ? 'active' : ''}`} 
            onClick={() => setActiveTab('vehicle')}
            disabled={isSubmitting}
          >
            Rate Vehicle
          </button>
          <button 
            className={`rating-tab ${activeTab === 'owner' ? 'active' : ''}`} 
            onClick={() => activeTab === 'owner' && setActiveTab('owner')}
            disabled={vehicleRating === 0 || isSubmitting}
          >
            Rate Owner
          </button>
        </div>
      </div>
      
      <form className="rating-form" onSubmit={handleSubmit}>
        {activeTab === 'vehicle' && (
          <div className="rating-tab-content">
            <h3 className="rating-title">How was your experience with the {vehicleName}?</h3>
            
            <div className="rating-stars-container">
              <div className="rating-stars">
                {renderStars(vehicleRating, handleVehicleRatingClick)}
              </div>
              <div className="rating-value">{vehicleRating > 0 ? vehicleRating : ''}</div>
            </div>
            
            <div className="form-group">
              <label htmlFor="vehicle-comment">Comment (Optional)</label>
              <textarea 
                id="vehicle-comment"
                value={vehicleComment}
                onChange={(e) => setVehicleComment(e.target.value)}
                placeholder="Share your experience with the vehicle. Was it clean? Did it drive well? Would you recommend it?"
                rows={5}
              ></textarea>
            </div>
            
            {errorMessage && <div className="rating-error">{errorMessage}</div>}
            
            <div className="rating-actions">
              <button 
                type="button" 
                className="cancel-btn"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button 
                type="button" 
                className="continue-btn"
                onClick={handleContinue}
                disabled={isSubmitting}
              >
                Continue
              </button>
            </div>
          </div>
        )}
        
        {activeTab === 'owner' && (
          <div className="rating-tab-content">
            <h3 className="rating-title">How was your experience with {ownerName}?</h3>
            
            <div className="rating-stars-container">
              <div className="rating-stars">
                {renderStars(ownerRating, handleOwnerRatingClick)}
              </div>
              <div className="rating-value">{ownerRating > 0 ? ownerRating : ''}</div>
            </div>
            
            <div className="form-group">
              <label htmlFor="owner-comment">Comment (Optional)</label>
              <textarea 
                id="owner-comment"
                value={ownerComment}
                onChange={(e) => setOwnerComment(e.target.value)}
                placeholder="Share your experience with the owner. Were they responsive? Helpful? Would you rent from them again?"
                rows={5}
              ></textarea>
            </div>
            
            {errorMessage && <div className="rating-error">{errorMessage}</div>}
            
            <div className="rating-actions">
              <button 
                type="button" 
                className="back-btn"
                onClick={handleBack}
                disabled={isSubmitting}
              >
                Back
              </button>
              <button 
                type="submit" 
                className="submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default RatingForm;