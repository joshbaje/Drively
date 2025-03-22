import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import NewBooking from '../../pages/agent/NewBooking';
import './AgentComponents.css';

const NewBookingModal = ({ isOpen, onClose, selectedVehicleId }) => {
  useEffect(() => {
    // Log when component mounts or vehicleId changes
    if (selectedVehicleId) {
      console.log('NewBookingModal received selectedVehicleId:', selectedVehicleId);
    }
  }, [selectedVehicleId]);
  
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content booking-modal">
        <div className="modal-header">
          <h3>New Booking {selectedVehicleId ? 'for Selected Vehicle' : ''}</h3>
          <button className="modal-close" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className="modal-body">
          <NewBooking 
            isModal={true} 
            onClose={onClose} 
            preSelectedVehicleId={selectedVehicleId}
          />
        </div>
      </div>
    </div>
  );
};

NewBookingModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  selectedVehicleId: PropTypes.string
};

export default NewBookingModal;
