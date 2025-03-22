import React, { useState } from 'react';
import RatingForm from './RatingForm';
import './RatingStyles.css';

const ReviewModal = ({ 
  isOpen, 
  onClose, 
  booking,
  onSubmitReview 
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  if (!isOpen) return null;
  
  // Format date range
  const formatDateRange = (startDate, endDate) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    const start = new Date(startDate).toLocaleDateString('en-US', options);
    const end = new Date(endDate).toLocaleDateString('en-US', options);
    return `${start} - ${end}`;
  };
  
  // Handle review submission
  const handleSubmit = async (reviewData) => {
    setIsSubmitting(true);
    
    try {
      // In a real app, this would be an API call
      // await apiService.submitReview(reviewData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Call the parent component's onSubmitReview function if provided
      if (onSubmitReview) {
        onSubmitReview(reviewData);
      }
      
      // Show success message
      setIsSuccess(true);
    } catch (error) {
      console.error('Error submitting review:', error);
      // Would handle error here
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle closing the modal
  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  return (
    <div className="review-modal-overlay">
      <div className="review-modal">
        <div className="review-modal-header">
          <h3 className="review-modal-title">
            {isSuccess ? 'Review Submitted' : 'Write a Review'}
          </h3>
          <button className="review-modal-close" onClick={handleClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <div className="review-modal-content">
          {isSuccess ? (
            <div className="review-success">
              <div className="success-icon">
                <i className="fas fa-check-circle"></i>
              </div>
              <h3 className="success-title">Thank you for your review!</h3>
              <p className="success-message">
                Your feedback helps the Drively community make better decisions.
              </p>
              <button className="done-btn" onClick={onClose}>Done</button>
            </div>
          ) : (
            <>
              <div className="booking-summary">
                <div className="booking-image">
                  <img 
                    src={booking.vehicle.image || '/assets/images/car-placeholder.jpg'} 
                    alt={`${booking.vehicle.make} ${booking.vehicle.model}`} 
                  />
                </div>
                <div className="booking-details">
                  <div className="booking-vehicle-name">
                    {booking.vehicle.year} {booking.vehicle.make} {booking.vehicle.model}
                  </div>
                  <div className="booking-date">
                    {formatDateRange(booking.start_date, booking.end_date)}
                  </div>
                  <div className="booking-owner">
                    Owner: {booking.owner.name}
                  </div>
                </div>
              </div>
              
              <RatingForm
                bookingId={booking.id}
                vehicleId={booking.vehicle.id}
                vehicleName={`${booking.vehicle.year} ${booking.vehicle.make} ${booking.vehicle.model}`}
                ownerId={booking.owner.id}
                ownerName={booking.owner.name}
                onSubmit={handleSubmit}
                onCancel={handleClose}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;