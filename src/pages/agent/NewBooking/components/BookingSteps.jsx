import React from 'react';
import useBooking from '../hooks/useBooking';

const BookingSteps = () => {
  const { currentStep } = useBooking();

  return (
    <div className="booking-steps">
      <div className={`step ${currentStep === 1 ? 'active' : currentStep > 1 ? 'completed' : ''}`}>
        <div className="step-number">1</div>
        <div className="step-title">Select Vehicle</div>
      </div>
      <div className="step-connector"></div>
      <div className={`step ${currentStep === 2 ? 'active' : currentStep > 2 ? 'completed' : ''}`}>
        <div className="step-number">2</div>
        <div className="step-title">Booking Details</div>
      </div>
      <div className="step-connector"></div>
      <div className={`step ${currentStep === 3 ? 'active' : ''}`}>
        <div className="step-number">3</div>
        <div className="step-title">Review & Confirm</div>
      </div>
    </div>
  );
};

export default BookingSteps;
