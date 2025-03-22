import React, { useState, useEffect } from 'react';
import './VehicleCalendar.css';
import VehicleStatistics from './components/VehicleStatistics';
import WeeklyCalendarView from './components/WeeklyCalendarView';

const VehicleCalendar = ({ vehicleId }) => {
  const [vehicle, setVehicle] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [availabilityExceptions, setAvailabilityExceptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showAddExceptionModal, setShowAddExceptionModal] = useState(false);
  const [calendarView, setCalendarView] = useState('month'); // 'month' or 'week'
  const [exceptionData, setExceptionData] = useState({
    start_date: '',
    end_date: '',
    reason: 'maintenance',
    notes: ''
  });

  // Fetch vehicle details and availability data
  useEffect(() => {
    const fetchVehicleData = async () => {
      try {
        setLoading(true);
        
        // In a real app, these would be actual API calls
        // For demo, we'll simulate API responses with timeout
        
        setTimeout(() => {
          // Mock vehicle data
          const mockVehicle = {
            vehicle_id: vehicleId,
            make: 'Toyota',
            model: 'Camry',
            year: 2022,
            license_plate: 'ABC 1234',
            color: 'Silver',
            daily_rate: 75,
            availability_status: 'available',
            image_url: 'https://via.placeholder.com/400x200.png?text=Toyota+Camry+2022'
          };
          
          // Mock bookings data
          const mockBookings = [
            {
              booking_id: 'booking-1',
              start_date: new Date(2025, 2, 15),
              end_date: new Date(2025, 2, 20),
              status: 'confirmed',
              renter_name: 'John Doe',
              total_amount: 375
            },
            {
              booking_id: 'booking-2',
              start_date: new Date(2025, 2, 25),
              end_date: new Date(2025, 2, 28),
              status: 'pending',
              renter_name: 'Jane Smith',
              total_amount: 300
            }
          ];
          
          // Mock availability exceptions data
          const mockExceptions = [
            {
              exception_id: 'exception-1',
              start_date: new Date(2025, 2, 10),
              end_date: new Date(2025, 2, 12),
              reason: 'maintenance',
              notes: 'Regular maintenance check'
            }
          ];
          
          setVehicle(mockVehicle);
          setBookings(mockBookings);
          setAvailabilityExceptions(mockExceptions);
          setLoading(false);
        }, 1000);
        
      } catch (error) {
        console.error('Error fetching vehicle data:', error);
        setLoading(false);
      }
    };
    
    fetchVehicleData();
  }, [vehicleId]);

  // Helper function to get days in month
  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Helper function to get day of week (0 = Sunday, 6 = Saturday)
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

  // Check if date has booking or exception
  const getDateStatus = (date) => {
    // Check if date is in a booking
    const hasBooking = bookings.some(booking => 
      date >= new Date(booking.start_date).setHours(0,0,0,0) && 
      date <= new Date(booking.end_date).setHours(0,0,0,0)
    );
    
    // Check if date is in an exception
    const hasException = availabilityExceptions.some(exception => 
      date >= new Date(exception.start_date).setHours(0,0,0,0) && 
      date <= new Date(exception.end_date).setHours(0,0,0,0)
    );
    
    if (hasException) return 'unavailable';
    if (hasBooking) return 'booked';
    return 'available';
  };

  // Get events for selected date
  const getEventsForDate = (date) => {
    const events = [];
    
    // Add bookings for this date
    bookings.forEach(booking => {
      const bookingStart = new Date(booking.start_date).setHours(0,0,0,0);
      const bookingEnd = new Date(booking.end_date).setHours(0,0,0,0);
      
      if (date >= bookingStart && date <= bookingEnd) {
        events.push({
          type: 'booking',
          title: `Booking: ${booking.renter_name}`,
          details: booking,
          status: booking.status
        });
      }
    });
    
    // Add exceptions for this date
    availabilityExceptions.forEach(exception => {
      const exceptionStart = new Date(exception.start_date).setHours(0,0,0,0);
      const exceptionEnd = new Date(exception.end_date).setHours(0,0,0,0);
      
      if (date >= exceptionStart && date <= exceptionEnd) {
        events.push({
          type: 'exception',
          title: `Unavailable: ${exception.reason}`,
          details: exception
        });
      }
    });
    
    return events;
  };

  // Handle date selection
  const handleDateClick = (date) => {
    setSelectedDate(date);
  };

  // Open modal to add exception
  const handleAddException = () => {
    // If a date is selected, use it as default start date
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      setExceptionData({
        ...exceptionData,
        start_date: formattedDate,
        end_date: formattedDate
      });
    }
    
    setShowAddExceptionModal(true);
  };

  // Close exception modal
  const handleCloseModal = () => {
    setShowAddExceptionModal(false);
  };

  // Handle exception form input changes
  const handleExceptionInputChange = (e) => {
    const { name, value } = e.target;
    setExceptionData({
      ...exceptionData,
      [name]: value
    });
  };

  // Save exception
  const handleSaveException = () => {
    // In a real app, this would be an API call
    // For demo, we'll add it to local state
    
    const newException = {
      exception_id: `exception-${availabilityExceptions.length + 1}`,
      start_date: new Date(exceptionData.start_date),
      end_date: new Date(exceptionData.end_date),
      reason: exceptionData.reason,
      notes: exceptionData.notes
    };
    
    setAvailabilityExceptions([...availabilityExceptions, newException]);
    
    // Reset form and close modal
    setExceptionData({
      start_date: '',
      end_date: '',
      reason: 'maintenance',
      notes: ''
    });
    setShowAddExceptionModal(false);
  };

  // Delete exception
  const handleDeleteException = (exceptionId) => {
    if (window.confirm('Are you sure you want to delete this availability exception?')) {
      // In a real app, this would be an API call
      // For demo, we'll update local state
      
      const updatedExceptions = availabilityExceptions.filter(
        exception => exception.exception_id !== exceptionId
      );
      
      setAvailabilityExceptions(updatedExceptions);
      
      // If the selected date only had this exception, reset selected date
      if (selectedDate && getEventsForDate(selectedDate).length === 1) {
        setSelectedDate(null);
      }
    }
  };

  // Render calendar days
  const renderCalendarDays = () => {
    const days = [];
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    // Get total days in current month
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
      const dateString = date.toISOString().split('T')[0];
      const status = getDateStatus(date);
      
      const isSelected = selectedDate && 
        selectedDate.getDate() === day && 
        selectedDate.getMonth() === month && 
        selectedDate.getFullYear() === year;
      
      days.push(
        <div 
          key={dateString} 
          className={`calendar-day ${status} ${isSelected ? 'selected' : ''}`}
          onClick={() => handleDateClick(date)}
        >
          <div className="day-number">{day}</div>
          {status !== 'available' && (
            <div className={`day-indicator ${status}`}></div>
          )}
        </div>
      );
    }
    
    return days;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading calendar...</p>
      </div>
    );
  }
  
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  return (
    <div className="vehicle-calendar-container">
      {vehicle && (
        <>
          <div className="vehicle-info-bar">
            <div className="vehicle-image">
              <img src={vehicle.image_url} alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`} />
            </div>
            <div className="vehicle-details">
              <h3>{vehicle.year} {vehicle.make} {vehicle.model}</h3>
              <div className="vehicle-specs">
                <span className="license-plate">{vehicle.license_plate}</span>
                <span className="price">₱{vehicle.daily_rate}/day</span>
                <span className={`status ${vehicle.availability_status}`}>
                  {vehicle.availability_status}
                </span>
              </div>
            </div>
            <div className="calendar-actions">
            <div className="view-toggle-buttons">
            <button 
                className={`view-toggle-btn ${calendarView === 'month' ? 'active' : ''}`}
                onClick={() => setCalendarView('month')}
              >
                <i className="fas fa-calendar-alt"></i> Month
              </button>
              <button 
                className={`view-toggle-btn ${calendarView === 'week' ? 'active' : ''}`}
                onClick={() => setCalendarView('week')}
              >
                <i className="fas fa-calendar-week"></i> Week
              </button>
            </div>
            <button className="add-exception-btn" onClick={handleAddException}>
              <i className="fas fa-plus"></i> Add Unavailable Dates
            </button>
            </div>
          </div>
          
          <VehicleStatistics 
            vehicleId={vehicleId}
            bookings={bookings}
            availabilityExceptions={availabilityExceptions}
          />
          
          <div className="calendar-container">
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
            
            {calendarView === 'month' ? (
              <>
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
              </>
            ) : (
              <WeeklyCalendarView
                bookings={bookings}
                availabilityExceptions={availabilityExceptions}
                currentDate={currentMonth}
                onDateSelect={handleDateClick}
                selectedDate={selectedDate}
              />
            )}
          </div>
          
          <div className="calendar-legend">
            <div className="legend-item">
              <span className="legend-color available"></span>
              <span>Available</span>
            </div>
            <div className="legend-item">
              <span className="legend-color booked"></span>
              <span>Booked</span>
            </div>
            <div className="legend-item">
              <span className="legend-color unavailable"></span>
              <span>Unavailable</span>
            </div>
          </div>
          
          {selectedDate && (
            <div className="date-details">
              <h3 className="date-header">
                {selectedDate.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </h3>
              
              <div className="date-events">
                {getEventsForDate(selectedDate).length > 0 ? (
                  getEventsForDate(selectedDate).map((event, index) => (
                    <div 
                      key={index} 
                      className={`event-card ${event.type} ${event.status || ''}`}
                    >
                      <div className="event-header">
                        <h4 className="event-title">{event.title}</h4>
                        {event.type === 'exception' && (
                          <button 
                            className="delete-event-btn"
                            onClick={() => handleDeleteException(event.details.exception_id)}
                          >
                            <i className="fas fa-times"></i>
                          </button>
                        )}
                      </div>
                      
                      {event.type === 'booking' && (
                        <div className="event-details">
                          <div className="detail-row">
                            <span className="detail-label">Booking ID:</span>
                            <span className="detail-value">{event.details.booking_id}</span>
                          </div>
                          <div className="detail-row">
                            <span className="detail-label">Renter:</span>
                            <span className="detail-value">{event.details.renter_name}</span>
                          </div>
                          <div className="detail-row">
                            <span className="detail-label">Dates:</span>
                            <span className="detail-value">
                              {new Date(event.details.start_date).toLocaleDateString()} - {new Date(event.details.end_date).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="detail-row">
                            <span className="detail-label">Status:</span>
                            <span className="detail-value status-badge {event.details.status}">
                              {event.details.status}
                            </span>
                          </div>
                          <div className="detail-row">
                            <span className="detail-label">Total:</span>
                            <span className="detail-value">₱{event.details.total_amount}</span>
                          </div>
                          <div className="detail-actions">
                            <button className="event-action-btn">
                              <i className="fas fa-eye"></i> View Details
                            </button>
                          </div>
                        </div>
                      )}
                      
                      {event.type === 'exception' && (
                        <div className="event-details">
                          <div className="detail-row">
                            <span className="detail-label">Reason:</span>
                            <span className="detail-value">{event.details.reason}</span>
                          </div>
                          <div className="detail-row">
                            <span className="detail-label">Dates:</span>
                            <span className="detail-value">
                              {new Date(event.details.start_date).toLocaleDateString()} - {new Date(event.details.end_date).toLocaleDateString()}
                            </span>
                          </div>
                          {event.details.notes && (
                            <div className="detail-row">
                              <span className="detail-label">Notes:</span>
                              <span className="detail-value">{event.details.notes}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="no-events">
                    <p>No events scheduled for this date.</p>
                    <button className="add-exception-btn" onClick={handleAddException}>
                      <i className="fas fa-plus"></i> Add Unavailable Date
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
      
      {/* Add Exception Modal */}
      {showAddExceptionModal && (
        <div className="modal-overlay">
          <div className="exception-modal">
            <div className="modal-header">
              <h3>Add Unavailable Dates</h3>
              <button className="close-modal" onClick={handleCloseModal}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="start_date">Start Date</label>
                <input
                  type="date"
                  id="start_date"
                  name="start_date"
                  value={exceptionData.start_date}
                  onChange={handleExceptionInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="end_date">End Date</label>
                <input
                  type="date"
                  id="end_date"
                  name="end_date"
                  value={exceptionData.end_date}
                  onChange={handleExceptionInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="reason">Reason</label>
                <select
                  id="reason"
                  name="reason"
                  value={exceptionData.reason}
                  onChange={handleExceptionInputChange}
                >
                  <option value="maintenance">Maintenance</option>
                  <option value="personal_use">Personal Use</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="notes">Notes (Optional)</label>
                <textarea
                  id="notes"
                  name="notes"
                  value={exceptionData.notes}
                  onChange={handleExceptionInputChange}
                  placeholder="Add any additional details here..."
                  rows={3}
                ></textarea>
              </div>
            </div>
            
            <div className="modal-footer">
              <button className="cancel-btn" onClick={handleCloseModal}>
                Cancel
              </button>
              <button className="save-btn" onClick={handleSaveException}>
                Save Exception
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleCalendar;