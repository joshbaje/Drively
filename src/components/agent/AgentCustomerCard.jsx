import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

const AgentCustomerCard = ({ customer, onClick }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick(customer);
    } else {
      navigate(`/agent/customers/${customer.id}`);
    }
  };

  return (
    <div className="customer-card" onClick={handleClick}>
      <div className="customer-avatar">
        <img 
          src={customer.profile_image_url || "/assets/images/default-avatar.png"} 
          alt={`${customer.first_name} ${customer.last_name}`} 
        />
      </div>
      <div className="customer-info">
        <h3 className="customer-name">{customer.first_name} {customer.last_name}</h3>
        <div className="customer-details">
          <div className="detail-item">
            <i className="fas fa-envelope"></i>
            <span>{customer.email}</span>
          </div>
          <div className="detail-item">
            <i className="fas fa-phone"></i>
            <span>{customer.phone_number}</span>
          </div>
          {customer.user_type && (
            <div className="detail-item">
              <i className="fas fa-user-tag"></i>
              <span>{customer.user_type.charAt(0).toUpperCase() + customer.user_type.slice(1)}</span>
            </div>
          )}
        </div>
        <div className="customer-stats">
          <div className="stat-item">
            <span className="stat-value">{customer.total_bookings || 0}</span>
            <span className="stat-label">Bookings</span>
          </div>
          {customer.avg_rating && (
            <div className="stat-item">
              <span className="stat-value">{customer.avg_rating.toFixed(1)}</span>
              <span className="stat-label">Rating</span>
            </div>
          )}
        </div>
      </div>
      <div className="customer-actions">
        <button className="action-btn">
          <i className="fas fa-chevron-right"></i>
        </button>
      </div>
    </div>
  );
};

AgentCustomerCard.propTypes = {
  customer: PropTypes.shape({
    id: PropTypes.string.isRequired,
    first_name: PropTypes.string.isRequired,
    last_name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    phone_number: PropTypes.string.isRequired,
    profile_image_url: PropTypes.string,
    user_type: PropTypes.string,
    total_bookings: PropTypes.number,
    avg_rating: PropTypes.number
  }).isRequired,
  onClick: PropTypes.func
};

export default AgentCustomerCard;