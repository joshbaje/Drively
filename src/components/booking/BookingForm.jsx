import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './BookingForm.css';

const BookingForm = ({ vehicleId, dailyRate, securityDeposit, vehicle }) => {
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [selectedInsurance, setSelectedInsurance] = useState('basic');
  const [totalDays, setTotalDays] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  const insuranceOptions = {
    basic: { name: 'Basic Coverage', rate: 10 },
    standard: { name: 'Standard Coverage', rate: 20 },
    premium: { name: 'Premium Coverage', rate: 35 }
  };

  // Calculate total days when dates change
  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = end - start;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setTotalDays(diffDays > 0 ? diffDays : 0);
    } else {
      setTotalDays(0);
    }
  }, [startDate, endDate]);

  // Calculate total amount when relevant factors change
  useEffect(() => {
    if (dailyRate && totalDays > 0) {
      const baseCost = dailyRate * totalDays;
      const insuranceCost = insuranceOptions[selectedInsurance].rate * totalDays;
      const serviceFee = Math.round(baseCost * 0.10); // 10% service fee
      const tax = Math.round((baseCost + insuranceCost + serviceFee) * 0.12); // 12% tax
      const total = baseCost + insuranceCost + serviceFee + tax;
      setTotalAmount(total);
    } else {
      setTotalAmount(0);
    }
  }, [dailyRate, totalDays, selectedInsurance]);

  const handleStartDateChange = (e) => {
    const newStartDate = e.target.value;
    setStartDate(newStartDate);
    
    // If end date is before new start date, reset it
    if (endDate && new Date(endDate) < new Date(newStartDate)) {
      setEndDate('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!startDate || !endDate) {
      alert('Please select both pickup and return dates');
      return;
    }
    
    if (totalDays <= 0) {
      alert('Please select valid date range');
      return;
    }
    
    // Prepare booking data
    const bookingData = {
      vehicleId: vehicleId,
      startDate,
      endDate,
      totalDays,
      dailyRate: dailyRate,
      insuranceType: selectedInsurance,
      insuranceRate: insuranceOptions[selectedInsurance].rate,
      totalAmount,
      specialRequests,
      securityDeposit: securityDeposit
    };
    
    console.log('Booking submitted:', bookingData);
    
    // Create a full booking details object to pass to the payment page
    const bookingDetails = {
      vehicleId: vehicleId,
      vehicleName: vehicle ? `${vehicle.year} ${vehicle.make} ${vehicle.model}` : 'Vehicle',
      startDate,
      endDate,
      daysCount: totalDays,
      dailyRate,
      subtotal: dailyRate * totalDays,
      serviceFee: Math.round(dailyRate * totalDays * 0.10),
      insuranceType: selectedInsurance,
      insuranceFee: insuranceOptions[selectedInsurance].rate * totalDays,
      taxAmount: Math.round(totalAmount - (totalAmount / 1.12)),
      totalAmount,
      securityDeposit,
      specialRequests
    };
    
    // Generate a fake booking ID
    const bookingId = 'BK-' + Math.floor(100000 + Math.random() * 900000);
    
    // Navigate to payment page with booking details
    navigate(`/payment/${bookingId}`, { state: { bookingDetails } });
  };

  // Get today's date in YYYY-MM-DD format for min attribute
  const today = new Date().toISOString().split('T')[0];
  
  // Calculate min end date based on selected start date
  const minEndDate = startDate || today;

  if (!vehicleId || !dailyRate) {
    return <div className="booking-form-container">Loading vehicle details...</div>;
  }

  return (
    <div className="booking-form-container">
      <div className="booking-price">
        <span className="price">₱{dailyRate.toLocaleString()}</span> / day
      </div>
      
      <form className="booking-form" onSubmit={handleSubmit}>
        <div className="form-dates">
          <div className="form-group">
            <label htmlFor="start-date">Pickup Date</label>
            <input 
              type="date" 
              id="start-date" 
              value={startDate} 
              onChange={handleStartDateChange}
              min={today}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="end-date">Return Date</label>
            <input 
              type="date" 
              id="end-date" 
              value={endDate} 
              onChange={(e) => setEndDate(e.target.value)}
              min={minEndDate}
              disabled={!startDate}
              required
            />
          </div>
        </div>
        
        <div className="form-group">
          <label>Insurance Coverage</label>
          <div className="insurance-options">
            {Object.entries(insuranceOptions).map(([key, option]) => (
              <div 
                key={key} 
                className={`insurance-option ${selectedInsurance === key ? 'selected' : ''}`}
                onClick={() => setSelectedInsurance(key)}
              >
                <div className="option-header">
                  <span className="option-name">{option.name}</span>
                  <span className="option-price">${option.rate}/day</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="special-requests">Special Requests (Optional)</label>
          <textarea 
            id="special-requests" 
            value={specialRequests}
            onChange={(e) => setSpecialRequests(e.target.value)}
            placeholder="Any special requests for the car owner?"
            rows="3"
          ></textarea>
        </div>
        
        {totalDays > 0 && (
          <div className="booking-summary">
            <h3>Price Details</h3>
            <div className="summary-line">
              <span>₱{dailyRate.toLocaleString()} x {totalDays} days</span>
              <span>₱{(dailyRate * totalDays).toLocaleString()}</span>
            </div>
            <div className="summary-line">
              <span>Insurance ({insuranceOptions[selectedInsurance].name})</span>
              <span>₱{(insuranceOptions[selectedInsurance].rate * totalDays).toLocaleString()}</span>
            </div>
            <div className="summary-line">
              <span>Service Fee</span>
              <span>₱{Math.round(dailyRate * totalDays * 0.10).toLocaleString()}</span>
            </div>
            <div className="summary-line">
              <span>Tax</span>
              <span>₱{Math.round(totalAmount - (totalAmount / 1.12)).toLocaleString()}</span>
            </div>
            <div className="summary-line total">
              <span>Total</span>
              <span>₱{totalAmount.toLocaleString()}</span>
            </div>
            <div className="security-deposit-note">
              <i className="fas fa-info-circle"></i>
              <span>Security deposit of ₱{securityDeposit.toLocaleString()} will be held and returned after successful drop-off.</span>
            </div>
          </div>
        )}
        
        <button type="submit" className="booking-submit-btn">
          Request to Book
        </button>
        
        <p className="booking-policy-note">
          You won't be charged yet. The owner will respond to your request within 24 hours.
        </p>
      </form>
    </div>
  );
};

export default BookingForm;