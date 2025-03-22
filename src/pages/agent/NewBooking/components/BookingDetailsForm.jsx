import React from 'react';
import useBooking from '../hooks/useBooking';
import { locationOptions, timeOptions } from '../data/mockData';

const BookingDetailsForm = () => {
  const { 
    selectedVehicle,
    bookingData,
    insuranceOptions,
    handleInputChange,
    setCurrentStep,
    formatCurrency
  } = useBooking();

  return (
    <div className="booking-details-step">
      <div className="selected-vehicle-summary">
        <h3>Selected Vehicle</h3>
        <div className="vehicle-card">
          <div className="vehicle-image">
            <img 
              src={selectedVehicle.image_url || "/assets/images/default-car.png"} 
              alt={`${selectedVehicle.year} ${selectedVehicle.make} ${selectedVehicle.model}`} 
            />
          </div>
          <div className="vehicle-info">
            <div className="vehicle-name">
              {selectedVehicle.year} {selectedVehicle.make} {selectedVehicle.model}
            </div>
            <div className="vehicle-specs">
              <span><i className="fas fa-cog"></i> {selectedVehicle.transmission}</span>
              <span><i className="fas fa-gas-pump"></i> {selectedVehicle.fuel_type}</span>
              <span><i className="fas fa-user"></i> {selectedVehicle.seats} seats</span>
            </div>
            <div className="vehicle-price">
              <span className="price">{formatCurrency(selectedVehicle.daily_rate)}</span> 
              <span className="per-day">per day</span>
            </div>
          </div>
          <button 
            className="change-vehicle-btn"
            onClick={() => setCurrentStep(1)}
          >
            Change
          </button>
        </div>
      </div>
      
      <div className="booking-details-form">
        <h3>Booking Details</h3>
        
        <form>
          <div className="form-row">
            <div className="form-group">
              <label>Pickup Date</label>
              <input 
                type="date" 
                name="startDate"
                value={bookingData.startDate}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Pickup Time</label>
              <select 
                name="pickupTime"
                value={bookingData.pickupTime}
                onChange={handleInputChange}
              >
                {timeOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Return Date</label>
              <input 
                type="date" 
                name="endDate"
                value={bookingData.endDate}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Return Time</label>
              <select 
                name="returnTime"
                value={bookingData.returnTime}
                onChange={handleInputChange}
              >
                {timeOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Pickup Location</label>
              <select 
                name="pickupLocation"
                value={bookingData.pickupLocation}
                onChange={handleInputChange}
              >
                <option value="">Select location</option>
                {locationOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Return Location</label>
              <select 
                name="returnLocation"
                value={bookingData.returnLocation}
                onChange={handleInputChange}
              >
                <option value="">Select location</option>
                {locationOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="form-group">
            <label>Insurance Option</label>
            <div className="insurance-options">
              {insuranceOptions.map(option => (
                <div key={option.id} className="insurance-option">
                  <input 
                    type="radio"
                    id={`insurance-${option.id}`}
                    name="insuranceOption"
                    value={option.id}
                    checked={bookingData.insuranceOption === option.id}
                    onChange={handleInputChange}
                  />
                  <label htmlFor={`insurance-${option.id}`}>
                    <div className="option-name">{option.name}</div>
                    <div className="option-description">{option.description}</div>
                    <div className="option-price">{formatCurrency(option.daily_rate)} / day</div>
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          <div className="form-group">
            <label>Special Requests</label>
            <textarea 
              name="specialRequests"
              value={bookingData.specialRequests}
              onChange={handleInputChange}
              placeholder="Enter any special requests or notes"
            ></textarea>
          </div>
          
          <div className="form-group">
            <label>Promo Code</label>
            <div className="promo-code-input">
              <input 
                type="text"
                name="promoCode"
                value={bookingData.promoCode}
                onChange={handleInputChange}
                placeholder="Enter promo code if available"
              />
              <button type="button" className="apply-btn">Apply</button>
            </div>
          </div>
          
          <div className="form-actions">
            <button 
              type="button" 
              className="back-btn"
              onClick={() => setCurrentStep(1)}
            >
              Back
            </button>
            <button 
              type="button" 
              className="continue-btn"
              onClick={() => setCurrentStep(3)}
            >
              Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingDetailsForm;
