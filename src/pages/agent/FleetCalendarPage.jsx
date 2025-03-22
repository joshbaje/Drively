import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import FleetCalendar from '../../components/agent/fleet/FleetCalendar';
import './AgentPortal.css';

const FleetCalendarPage = () => {
  const navigate = useNavigate();
  
  // Function to open the new booking modal from the parent component
  const openNewBookingModal = () => {
    // We'll use a query parameter to signal the parent component to open the modal
    const event = new CustomEvent('openNewBookingModal');
    window.dispatchEvent(event);
  };
  return (
    <div className="agent-page-container">
      <div className="page-header">
        <div className="header-title">
          <h2>Fleet Calendar</h2>
          <p className="subtitle">Manage all vehicle bookings and availability in one view</p>
        </div>
        <div className="header-actions">
          <Link to="/agent/cars" className="action-button secondary">
            <i className="fas fa-car"></i> Car Management
          </Link>
          <button onClick={openNewBookingModal} className="action-button primary">
            <i className="fas fa-plus"></i> New Booking
          </button>
        </div>
      </div>
      
      <FleetCalendar />
    </div>
  );
};

export default FleetCalendarPage;