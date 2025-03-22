import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './FleetCalendar.css';

const FleetCalendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [vehiclesViewMode, setVehiclesViewMode] = useState('all'); // 'all', 'available', 'booked'

  // Fetch vehicles and bookings on component mount
  useEffect(() => {
    fetchVehicles();
    fetchBookings();
  }, []);

  // Mock fetch vehicles
  const fetchVehicles = () => {
    // Simulate API call
    setTimeout(() => {
      const mockVehicles = [
        {
          id: 'car1',
          make: 'Toyota',
          model: 'Camry',
          year: 2022,
          image: 'https://via.placeholder.com/150?text=Toyota',
          status: 'available',
          licensePlate: 'ABC 1234',
          location: 'New York',
          dailyRate: 75
        },
        {
          id: 'car2',
          make: 'Honda',
          model: 'CR-V',
          year: 2021,
          image: 'https://via.placeholder.com/150?text=Honda',
          status: 'available',
          licensePlate: 'DEF 5678',
          location: 'Boston',
          dailyRate: 85
        },
        {
          id: 'car3',
          make: 'Tesla',
          model: 'Model 3',
          year: 2023,
          image: 'https://via.placeholder.com/150?text=Tesla',
          status: 'rented',
          licensePlate: 'GHI 9012',
          location: 'San Francisco',
          dailyRate: 120
        },
        {
          id: 'car4',
          make: 'BMW',
          model: 'X5',
          year: 2021,
          image: 'https://via.placeholder.com/150?text=BMW',
          status: 'maintenance',
          licensePlate: 'JKL 3456',
          location: 'Chicago',
          dailyRate: 150
        },
        {
          id: 'car5',
          make: 'Ford',
          model: 'Mustang',
          year: 2022,
          image: 'https://via.placeholder.com/150?text=Ford',
          status: 'available',
          licensePlate: 'MNO 7890',
          location: 'Miami',
          dailyRate: 110
        }
      ];

      setVehicles(mockVehicles);
      setLoading(false);
    }, 1000);
  };

  // Mock fetch bookings
  const fetchBookings = () => {
    // Simulate API call
    setTimeout(() => {
      const mockBookings = [
        {
          id: 'booking1',
          vehicleId: 'car1',
          startDate: new Date(2025, 2, 15),
          endDate: new Date(2025, 2, 20),
          status: 'confirmed',
          customerName: 'John Doe'
        },
        {
          id: 'booking2',
          vehicleId: 'car2',
          startDate: new Date(2025, 2, 18),
          endDate: new Date(2025, 2, 22),
          status: 'confirmed',
          customerName: 'Jane Smith'
        },
        {
          id: 'booking3',
          vehicleId: 'car3',
          startDate: new Date(2025, 2, 10),
          endDate: new Date(2025, 2, 25),
          status: 'confirmed',
          customerName: 'Robert Johnson'
        },
        {
          id: 'booking4',
          vehicleId: 'car5',
          startDate: new Date(2025, 2, 5),
          endDate: new Date(2025, 2, 8),
          status: 'confirmed',
          customerName: 'Emily Williams'
        },
        {
          id: 'booking5',
          vehicleId: 'car1',
          startDate: new Date(2025, 2, 25),
          endDate: new Date(2025, 2, 28),
          status: 'pending',
          customerName: 'Michael Brown'
        }
      ];

      setBookings(mockBookings);
    }, 1000);
  };

  // Helper functions for calendar
  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay();
  };

  // Navigate to previous month
  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  // Navigate to next month
  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  // Get bookings for a specific date
  const getBookingsForDate = (date) => {
    return bookings.filter(booking => {
      const bookingStart = new Date(booking.startDate);
      const bookingEnd = new Date(booking.endDate);
      
      bookingStart.setHours(0, 0, 0, 0);
      bookingEnd.setHours(0, 0, 0, 0);
      
      return date >= bookingStart && date <= bookingEnd;
    });
  };

  // Get available vehicles for a specific date
  const getAvailableVehiclesForDate = (date) => {
    const dateBookings = getBookingsForDate(date);
    const bookedVehicleIds = dateBookings.map(booking => booking.vehicleId);
    
    return vehicles.filter(vehicle => 
      !bookedVehicleIds.includes(vehicle.id) && 
      vehicle.status !== 'maintenance'
    );
  };

  // Handle date selection
  const handleDateClick = (date) => {
    setSelectedDate(date);
  };

  // Render calendar days
  const renderCalendarDays = () => {
    const days = [];
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    // Get total days in month
    const daysInMonth = getDaysInMonth(month, year);
    
    // Get day of week for first day of month (0 = Sunday, 6 = Saturday)
    const firstDayOfMonth = getFirstDayOfMonth(month, year);
    
    // Add empty cells for days before the 1st of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }
    
    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      date.setHours(0, 0, 0, 0);
      
      const dateBookings = getBookingsForDate(date);
      const availableVehicles = getAvailableVehiclesForDate(date);
      const totalVehicles = vehicles.length;
      const bookedCount = dateBookings.length;
      const availableCount = availableVehicles.length;
      
      const isSelected = selectedDate && 
                       selectedDate.getDate() === day && 
                       selectedDate.getMonth() === month && 
                       selectedDate.getFullYear() === year;
      
      // Determine day status
      let dayStatus = 'normal';
      if (bookedCount === 0) {
        dayStatus = 'all-available';
      } else if (availableCount === 0) {
        dayStatus = 'all-booked';
      } else {
        dayStatus = 'mixed';
      }
      
      days.push(
        <div 
          key={`day-${day}`} 
          className={`calendar-day ${dayStatus} ${isSelected ? 'selected' : ''}`}
          onClick={() => handleDateClick(date)}
        >
          <div className="day-number">{day}</div>
          <div className="booking-summary">
            <div className="booking-count">
              <i className="fas fa-calendar-check"></i> {bookedCount}
            </div>
            <div className="available-count">
              <i className="fas fa-car"></i> {availableCount}
            </div>
          </div>
        </div>
      );
    }
    
    return days;
  };

  // Render selected date details
  const renderSelectedDateDetails = () => {
    if (!selectedDate) return null;
    
    const dateBookings = getBookingsForDate(selectedDate);
    const availableVehicles = getAvailableVehiclesForDate(selectedDate);
    
    // Format date nicely
    const formattedDate = selectedDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    return (
      <div className="selected-date-details">
        <h3 className="date-header">{formattedDate}</h3>
        
        <div className="date-stats">
          <div className="date-stat">
            <div className="stat-label">Total Vehicles</div>
            <div className="stat-value">{vehicles.length}</div>
          </div>
          <div className="date-stat">
            <div className="stat-label">Booked</div>
            <div className="stat-value">{dateBookings.length}</div>
          </div>
          <div className="date-stat">
            <div className="stat-label">Available</div>
            <div className="stat-value">{availableVehicles.length}</div>
          </div>
          <div className="date-stat">
            <div className="stat-label">Utilization</div>
            <div className="stat-value">
              {vehicles.length > 0 ? Math.round((dateBookings.length / vehicles.length) * 100) : 0}%
            </div>
          </div>
        </div>
        
        <div className="vehicles-toggle">
          <button 
            className={`toggle-btn ${vehiclesViewMode === 'all' ? 'active' : ''}`}
            onClick={() => setVehiclesViewMode('all')}
          >
            All Vehicles
          </button>
          <button 
            className={`toggle-btn ${vehiclesViewMode === 'booked' ? 'active' : ''}`}
            onClick={() => setVehiclesViewMode('booked')}
          >
            Booked
          </button>
          <button 
            className={`toggle-btn ${vehiclesViewMode === 'available' ? 'active' : ''}`}
            onClick={() => setVehiclesViewMode('available')}
          >
            Available
          </button>
        </div>
        
        <div className="vehicles-list">
          {vehiclesViewMode === 'all' && vehicles.map(vehicle => renderVehicleCard(vehicle, dateBookings))}
          {vehiclesViewMode === 'booked' && dateBookings.map(booking => {
            const vehicle = vehicles.find(v => v.id === booking.vehicleId);
            return vehicle ? renderVehicleCard(vehicle, dateBookings, booking) : null;
          })}
          {vehiclesViewMode === 'available' && availableVehicles.map(vehicle => renderVehicleCard(vehicle, dateBookings))}
        </div>
      </div>
    );
  };

  // Render vehicle card
  const renderVehicleCard = (vehicle, dateBookings, specificBooking = null) => {
    const booking = specificBooking || dateBookings.find(b => b.vehicleId === vehicle.id);
    const isBooked = Boolean(booking);
    
    return (
      <div key={vehicle.id} className={`vehicle-card ${isBooked ? 'booked' : 'available'}`}>
        <div className="vehicle-image">
          <img src={vehicle.image} alt={`${vehicle.make} ${vehicle.model}`} />
        </div>
        <div className="vehicle-info">
          <h4 className="vehicle-title">{vehicle.year} {vehicle.make} {vehicle.model}</h4>
          <div className="vehicle-details">
            <div className="vehicle-plate">{vehicle.licensePlate}</div>
            <div className="vehicle-location">
              <i className="fas fa-map-marker-alt"></i> {vehicle.location}
            </div>
            <div className="vehicle-rate">₱{vehicle.dailyRate}/day</div>
          </div>
        </div>
        <div className="vehicle-status">
          {isBooked ? (
            <div className="booking-info">
              <div className="booking-customer">
                <i className="fas fa-user"></i> {booking.customerName}
              </div>
              <div className="booking-dates">
                {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
              </div>
              <div className={`booking-status ${booking.status}`}>
                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
              </div>
            </div>
          ) : (
            <div className="availability-badge available">Available</div>
          )}
        </div>
        <div className="vehicle-actions">
          <Link to={`/agent/cars/${vehicle.id}`} className="action-btn view">
            <i className="fas fa-eye"></i>
          </Link>
          <Link to={`/agent/cars/${vehicle.id}/calendar`} className="action-btn calendar">
            <i className="fas fa-calendar-alt"></i>
          </Link>
          {!isBooked && (
            <Link to="/agent/bookings/new" className="action-btn book">
              <i className="fas fa-plus"></i>
            </Link>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading fleet calendar...</p>
      </div>
    );
  }

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="fleet-calendar-container">
      <div className="fleet-header">
        <div className="fleet-info">
          <h2 className="fleet-title">Fleet Calendar</h2>
          <div className="fleet-stats">
            <div className="stat-item">
              <span className="stat-value">{vehicles.length}</span>
              <span className="stat-label">Total Vehicles</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{vehicles.filter(v => v.status === 'available').length}</span>
              <span className="stat-label">Available</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{vehicles.filter(v => v.status === 'rented').length}</span>
              <span className="stat-label">Rented</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{vehicles.filter(v => v.status === 'maintenance').length}</span>
              <span className="stat-label">Maintenance</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="fleet-calendar">
        <div className="calendar-header">
          <button className="month-nav prev" onClick={goToPreviousMonth}>
            <i className="fas fa-chevron-left"></i>
          </button>
          <h3 className="current-month">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </h3>
          <button className="month-nav next" onClick={goToNextMonth}>
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
        
        <div className="calendar-weekdays">
          <div>Sun</div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
        </div>
        
        <div className="calendar-days">
          {renderCalendarDays()}
        </div>
      </div>
      
      <div className="calendar-legend">
        <div className="legend-item">
          <div className="legend-color all-available"></div>
          <span>All Available</span>
        </div>
        <div className="legend-item">
          <div className="legend-color mixed"></div>
          <span>Partially Booked</span>
        </div>
        <div className="legend-item">
          <div className="legend-color all-booked"></div>
          <span>Fully Booked</span>
        </div>
      </div>
      
      {renderSelectedDateDetails()}
    </div>
  );
};

export default FleetCalendar;