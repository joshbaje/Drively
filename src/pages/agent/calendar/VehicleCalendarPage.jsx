import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import VehicleCalendar from '../../../components/agent/calendar/VehicleCalendar';
import './VehicleCalendarPage.css';

const VehicleCalendarPage = () => {
  const { vehicleId } = useParams();
  const navigate = useNavigate();
  
  // Function to open the new booking modal with this vehicle
  const openNewBookingWithVehicle = () => {
    // We'll dispatch a custom event that the parent component can listen for
    const event = new CustomEvent('openNewBookingWithVehicle', { detail: { vehicleId } });
    window.dispatchEvent(event);
  };
  const [loading, setLoading] = useState(true);
  const [vehicle, setVehicle] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // In a real application, you would fetch the vehicle details from an API
    // For this example, we'll simulate the API call
    const fetchVehicleDetails = async () => {
      try {
        setLoading(true);
        
        // Simulate API delay
        setTimeout(() => {
          // Mock vehicle data
          const mockVehicle = {
            id: vehicleId,
            make: 'Toyota',
            model: 'Camry',
            year: 2022,
            license_plate: 'ABC 1234',
            daily_rate: 75
          };
          
          setVehicle(mockVehicle);
          setLoading(false);
        }, 800);
        
      } catch (err) {
        console.error('Error fetching vehicle details:', err);
        setError('Failed to load vehicle details. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchVehicleDetails();
  }, [vehicleId]);

  if (loading) {
    return (
      <div className="page-loading">
        <div className="spinner"></div>
        <p>Loading vehicle calendar...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-message">
        <i className="fas fa-exclamation-circle"></i>
        <p>{error}</p>
        <Link to="/agent/cars" className="back-link">
          <i className="fas fa-arrow-left"></i> Back to Vehicles
        </Link>
      </div>
    );
  }

  return (
    <div className="agent-page-container">
      <div className="page-header">
        <div className="header-title">
          <h2>Vehicle Calendar</h2>
          <p className="subtitle">Manage availability and bookings for this vehicle</p>
        </div>
        <div className="header-actions">
          <Link to="/agent/cars" className="back-button">
            <i className="fas fa-arrow-left"></i> Back to Vehicles
          </Link>
          <button onClick={openNewBookingWithVehicle} className="action-button primary">
            <i className="fas fa-plus"></i> New Booking
          </button>
        </div>
      </div>
      
      <div className="page-content">
        <VehicleCalendar vehicleId={vehicleId} />
      </div>
    </div>
  );
};

export default VehicleCalendarPage;
