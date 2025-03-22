import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

const AgentBookingCard = ({ booking, onClick }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick(booking);
    } else {
      navigate(`/agent/bookings/${booking.booking_id}`);
    }
  };

  // Function to format the date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleString('en-US', options);
  };

  // Function to get the status badge class
  const getStatusBadgeClass = (status) => {
    const statusClasses = {
      'pending': 'status-pending',
      'confirmed': 'status-confirmed',
      'in_progress': 'status-in-progress',
      'completed': 'status-completed',
      'cancelled': 'status-cancelled',
      'declined': 'status-declined'
    };
    
    return statusClasses[status] || '';
  };

  // Format price with currency
  const formatPrice = (amount) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'PHP' 
    }).format(amount);
  };

  return (
    <div className="booking-card" onClick={handleClick}>
      <div className="booking-header">
        <div className="booking-id">#{booking.booking_id}</div>
        <div className={`booking-status ${getStatusBadgeClass(booking.booking_status)}`}>
          {booking.booking_status.replace('_', ' ')}
        </div>
      </div>
      
      <div className="booking-body">
        <div className="vehicle-info">
          <div className="vehicle-image">
            <img 
              src={booking.vehicle.image_url || "/assets/images/default-car.png"} 
              alt={`${booking.vehicle.year} ${booking.vehicle.make} ${booking.vehicle.model}`} 
            />
          </div>
          <div className="vehicle-details">
            <h3 className="vehicle-name">{booking.vehicle.year} {booking.vehicle.make} {booking.vehicle.model}</h3>
            <div className="vehicle-specs">
              <span className="spec-item">
                <i className="fas fa-gas-pump"></i> {booking.vehicle.fuel_type}
              </span>
              <span className="spec-item">
                <i className="fas fa-cog"></i> {booking.vehicle.transmission}
              </span>
              <span className="spec-item">
                <i className="fas fa-user"></i> {booking.vehicle.seats} seats
              </span>
            </div>
          </div>
        </div>
        
        <div className="booking-dates">
          <div className="date-item">
            <span className="date-label">Pickup</span>
            <span className="date-value">{formatDate(booking.start_date)}</span>
          </div>
          <div className="date-divider">
            <i className="fas fa-arrow-right"></i>
          </div>
          <div className="date-item">
            <span className="date-label">Return</span>
            <span className="date-value">{formatDate(booking.end_date)}</span>
          </div>
        </div>
        
        <div className="customer-row">
          <div className="customer-avatar">
            <img 
              src={booking.renter.profile_image_url || "/assets/images/default-avatar.png"} 
              alt={`${booking.renter.first_name} ${booking.renter.last_name}`} 
            />
          </div>
          <div className="customer-details">
            <span className="customer-name">{booking.renter.first_name} {booking.renter.last_name}</span>
            <span className="customer-email">{booking.renter.email}</span>
          </div>
        </div>
        
        <div className="booking-footer">
          <div className="booking-price">
            <span className="price-amount">{formatPrice(booking.total_amount)}</span>
            <span className="price-label">Total</span>
          </div>
          <div className="booking-actions">
            <button className="action-btn" onClick={(e) => {
              e.stopPropagation();
              navigate(`/agent/bookings/${booking.booking_id}`);
            }}>
              <i className="fas fa-eye"></i> View
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

AgentBookingCard.propTypes = {
  booking: PropTypes.shape({
    booking_id: PropTypes.string.isRequired,
    renter: PropTypes.shape({
      first_name: PropTypes.string.isRequired,
      last_name: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      profile_image_url: PropTypes.string
    }).isRequired,
    vehicle: PropTypes.shape({
      make: PropTypes.string.isRequired,
      model: PropTypes.string.isRequired,
      year: PropTypes.number.isRequired,
      fuel_type: PropTypes.string.isRequired,
      transmission: PropTypes.string.isRequired,
      seats: PropTypes.number.isRequired,
      image_url: PropTypes.string
    }).isRequired,
    booking_status: PropTypes.string.isRequired,
    start_date: PropTypes.string.isRequired,
    end_date: PropTypes.string.isRequired,
    total_amount: PropTypes.number.isRequired
  }).isRequired,
  onClick: PropTypes.func
};

export default AgentBookingCard;