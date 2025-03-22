import React, { useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BookingProvider } from './context/BookingContext';
import useBooking from './hooks/useBooking';
import '../../../components/agent/AgentComponents.css';

// Import components
import BookingSteps from './components/BookingSteps';
import CustomerSelector from './components/CustomerSelector';
import VehicleSelector from './components/VehicleSelector';
import BookingDetailsForm from './components/BookingDetailsForm';
import BookingSummary from './components/BookingSummary';

// The inner component that uses the booking context
const NewBookingContent = ({ isModal = false, onClose, preSelectedVehicleId }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    currentStep, 
    selectedVehicle, 
    selectedCustomer, 
    isLoading,
    fetchCustomerById,
    setSelectedVehicle,
    fetchVehicleById
  } = useBooking();

  // Check for vehicle ID, customer ID in URL or location state
  useEffect(() => {
    // If a vehicle ID was passed, fetch and select that vehicle
    if (preSelectedVehicleId) {
      console.log('NewBooking: preSelectedVehicleId detected:', preSelectedVehicleId);
      fetchVehicleById(preSelectedVehicleId);
    }
    
    if (location.state?.customerId) {
      fetchCustomerById(location.state.customerId);
    } else if (location.search) {
      const params = new URLSearchParams(location.search);
      const customerId = params.get('customer');
      if (customerId) {
        fetchCustomerById(customerId);
      }
    }
  }, [preSelectedVehicleId, location, fetchCustomerById, fetchVehicleById]);

  return (
    <div className={`new-booking-container ${isModal ? 'modal-container' : ''}`}>
      {!isModal && (
        <>
          <div className="page-actions">
            <button className="back-button" onClick={() => navigate(-1)}>
              <i className="fas fa-arrow-left"></i> Back
            </button>
          </div>
          
          <h2 className="page-title">Create New Booking</h2>
        </>
      )}
      
      <BookingSteps />
      
      <div className="booking-form-container">
        {currentStep === 1 && (
          <div className="vehicle-selection-step">
            <CustomerSelector />
            <VehicleSelector />
          </div>
        )}
        
        {currentStep === 2 && selectedVehicle && (
          <BookingDetailsForm />
        )}
        
        {currentStep === 3 && selectedVehicle && selectedCustomer && (
          <BookingSummary isModal={isModal} onClose={onClose} />
        )}
      </div>
      
      {isLoading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
          <p>Processing your request...</p>
        </div>
      )}
    </div>
  );
};

// The outer component that provides the context
const NewBooking = ({ isModal = false, onClose, preSelectedVehicleId }) => {
  return (
    <BookingProvider>
      <NewBookingContent 
        isModal={isModal} 
        onClose={onClose} 
        preSelectedVehicleId={preSelectedVehicleId} 
      />
    </BookingProvider>
  );
};

export default NewBooking;
