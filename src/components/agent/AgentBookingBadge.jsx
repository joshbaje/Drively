import React from 'react';
import PropTypes from 'prop-types';
import './AgentBookingBadge.css';

const AgentBookingBadge = ({ startDate, endDate, status = 'Available' }) => {
  return (
    <div className="agent-booking-badge">
      <div className="booking-badge-status">{status}</div>
      {startDate && endDate && (
        <div className="booking-badge-dates">
          {startDate} - {endDate}
        </div>
      )}
    </div>
  );
};

AgentBookingBadge.propTypes = {
  startDate: PropTypes.string,
  endDate: PropTypes.string,
  status: PropTypes.string
};

export default AgentBookingBadge;
