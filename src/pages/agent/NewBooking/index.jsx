import React, { useEffect } from 'react';
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
const NewBookingContent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    currentStep, 
    selectedVehicle, 
    selectedCustomer, 
    isLoading,
    fetchCustomerById 
  } = useBooking();

  // Check for customer ID in URL or location state
  useEffect(() => {
    if (location.state?.customerId) {
      fetchCustomerById(location.state.customerId);
    } else if (location.search) {
      const params = new URLSearchParams(location.search);
      const customerId = params.get('customer');
      if (customerId) {
        fetchCustomerById(customerId);
      }
    }
  }, [location, fetchCustomerById]);

  return (
    <div className="new-booking-container">
      <div className="page-actions">
        <button className="back-button" onClick={() => navigate(-1)}>
          <i className="fas fa-arrow-left"></i> Back
        </button>
      </div>
      
      <h2 className="page-title">Create New Booking</h2>
      
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
          <BookingSummary />
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
const NewBooking = () => {
  return (
    <BookingProvider>
      <NewBookingContent />
    </BookingProvider>
  );
};

export default NewBooking;
