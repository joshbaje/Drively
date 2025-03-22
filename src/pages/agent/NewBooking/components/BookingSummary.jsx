import React from 'react';
import { useNavigate } from 'react-router-dom';
import useBooking from '../hooks/useBooking';

const BookingSummary = () => {
  const navigate = useNavigate();
  const { 
    selectedCustomer,
    selectedVehicle,
    bookingData,
    pricingSummary,
    formatDate,
    formatCurrency,
    setCurrentStep,
    setIsLoading
  } = useBooking();

  const handleSubmit = () => {
    // Validate booking data
    if (!selectedCustomer) {
      alert('Please select a customer');
      return;
    }
    
    if (!selectedVehicle) {
      alert('Please select a vehicle');
      return;
    }
    
    if (!bookingData.startDate || !bookingData.endDate) {
      alert('Please select rental dates');
      return;
    }
    
    // In a real app, this would be an API call to create the booking
    setIsLoading(true);
    
    setTimeout(() => {
      const newBookingId = 'bk' + Math.floor(Math.random() * 100000);
      
      // Redirect to booking details or confirmation page
      navigate(`/agent/bookings/${newBookingId}`);
    }, 1000);
  };

  return (
    <div className="booking-review-step">
      <div className="booking-summary">
        <h3>Booking Summary</h3>
        
        <div className="summary-section">
          <h4>Customer</h4>
          <div className="customer-summary">
            <div className="customer-name">{selectedCustomer.first_name} {selectedCustomer.last_name}</div>
            <div className="customer-contact">
              <div>{selectedCustomer.email}</div>
              <div>{selectedCustomer.phone_number}</div>
            </div>
          </div>
        </div>
        
        <div className="summary-section">
          <h4>Vehicle</h4>
          <div className="vehicle-summary">
            <div className="vehicle-name">{selectedVehicle.year} {selectedVehicle.make} {selectedVehicle.model}</div>
            <div className="vehicle-specs">
              <span>{selectedVehicle.transmission}</span> • 
              <span>{selectedVehicle.fuel_type}</span> • 
              <span>{selectedVehicle.seats} seats</span>
            </div>
          </div>
        </div>
        
        <div className="summary-section">
          <h4>Rental Period</h4>
          <div className="dates-summary">
            <div className="pickup">
              <div className="label">Pickup:</div>
              <div className="value">
                {formatDate(bookingData.startDate)} {bookingData.pickupTime}
              </div>
            </div>
            <div className="return">
              <div className="label">Return:</div>
              <div className="value">
                {formatDate(bookingData.endDate)} {bookingData.returnTime}
              </div>
            </div>
          </div>
        </div>
        
        <div className="summary-section">
          <h4>Location</h4>
          <div className="location-summary">
            <div className="pickup">
              <div className="label">Pickup:</div>
              <div className="value">{bookingData.pickupLocation || 'Not specified'}</div>
            </div>
            <div className="return">
              <div className="label">Return:</div>
              <div className="value">{bookingData.returnLocation || 'Not specified'}</div>
            </div>
          </div>
        </div>
        
        {bookingData.specialRequests && (
          <div className="summary-section">
            <h4>Special Requests</h4>
            <div className="special-requests">{bookingData.specialRequests}</div>
          </div>
        )}
      </div>
      
      <div className="pricing-summary">
        <h3>Price Breakdown</h3>
        
        <div className="price-table">
          <div className="price-row">
            <div className="price-label">Daily Rate</div>
            <div className="price-value">{formatCurrency(pricingSummary.dailyRate)} × {pricingSummary.days} days</div>
          </div>
          <div className="price-row">
            <div className="price-label">Subtotal</div>
            <div className="price-value">{formatCurrency(pricingSummary.subtotal)}</div>
          </div>
          
          {bookingData.insuranceOption && (
            <div className="price-row">
              <div className="price-label">Insurance</div>
              <div className="price-value">{formatCurrency(pricingSummary.insuranceFee)}</div>
            </div>
          )}
          
          <div className="price-row">
            <div className="price-label">Service Fee</div>
            <div className="price-value">{formatCurrency(pricingSummary.serviceFee)}</div>
          </div>
          <div className="price-row">
            <div className="price-label">Taxes</div>
            <div className="price-value">{formatCurrency(pricingSummary.taxes)}</div>
          </div>
          
          <div className="price-row total">
            <div className="price-label">Total</div>
            <div className="price-value">{formatCurrency(pricingSummary.total)}</div>
          </div>
          
          <div className="price-row security-deposit">
            <div className="price-label">Security Deposit</div>
            <div className="price-value">{formatCurrency(pricingSummary.securityDeposit)}</div>
          </div>
        </div>
        
        <div className="payment-method">
          <h4>Payment Method</h4>
          <select>
            <option value="">Select payment method</option>
            <option value="cash">Cash</option>
            <option value="credit_card">Credit Card</option>
            <option value="bank_transfer">Bank Transfer</option>
          </select>
        </div>
        
        <div className="form-actions">
          <button 
            type="button" 
            className="back-btn"
            onClick={() => setCurrentStep(2)}
          >
            Back
          </button>
          <button 
            type="button" 
            className="confirm-btn"
            onClick={handleSubmit}
          >
            Confirm Booking
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingSummary;
