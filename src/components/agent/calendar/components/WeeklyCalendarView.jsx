import React, { useState, useEffect } from 'react';
import './WeeklyCalendarView.css';

const WeeklyCalendarView = ({ 
  bookings, 
  availabilityExceptions, 
  currentDate, 
  onDateSelect,
  selectedDate
}) => {
  const [weekDays, setWeekDays] = useState([]);
  const [weekStart, setWeekStart] = useState(null);
  const [weekEnd, setWeekEnd] = useState(null);

  // Initialize the week days when current date changes
  useEffect(() => {
    if (currentDate) {
      calculateWeekDays(currentDate);
    }
  }, [currentDate]);

  // Calculate the days of the week for the given date
  const calculateWeekDays = (date) => {
    const days = [];
    const currentDay = new Date(date);
    
    // Get the first day of the week (Sunday)
    const firstDayOfWeek = new Date(currentDay);
    const day = currentDay.getDay();
    firstDayOfWeek.setDate(currentDay.getDate() - day);
    
    // Create an array of all 7 days of the week
    for (let i = 0; i < 7; i++) {
      const weekDay = new Date(firstDayOfWeek);
      weekDay.setDate(firstDayOfWeek.getDate() + i);
      days.push(weekDay);
    }
    
    setWeekDays(days);
    setWeekStart(days[0]);
    setWeekEnd(days[6]);
  };

  // Navigate to previous week
  const goToPreviousWeek = () => {
    if (weekStart) {
      const newDate = new Date(weekStart);
      newDate.setDate(newDate.getDate() - 7);
      calculateWeekDays(newDate);
    }
  };

  // Navigate to next week
  const goToNextWeek = () => {
    if (weekEnd) {
      const newDate = new Date(weekEnd);
      newDate.setDate(newDate.getDate() + 1);
      calculateWeekDays(newDate);
    }
  };

  // Check the status of a specific date
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

  // Get events for a specific date
  const getEventsForDate = (date) => {
    const events = [];
    
    // Add bookings for this date
    bookings.forEach(booking => {
      const bookingStart = new Date(booking.start_date).setHours(0,0,0,0);
      const bookingEnd = new Date(booking.end_date).setHours(0,0,0,0);
      
      if (date >= bookingStart && date <= bookingEnd) {
        // Check if this is the first day of the booking
        const isFirstDay = date.getTime() === bookingStart;
        
        events.push({
          type: 'booking',
          title: `${isFirstDay ? 'Start: ' : ''}${booking.renter_name}`,
          details: booking,
          status: booking.status,
          isFirstDay
        });
      }
    });
    
    // Add exceptions for this date
    availabilityExceptions.forEach(exception => {
      const exceptionStart = new Date(exception.start_date).setHours(0,0,0,0);
      const exceptionEnd = new Date(exception.end_date).setHours(0,0,0,0);
      
      if (date >= exceptionStart && date <= exceptionEnd) {
        // Check if this is the first day of the exception
        const isFirstDay = date.getTime() === exceptionStart;
        
        events.push({
          type: 'exception',
          title: `${isFirstDay ? 'Start: ' : ''}${exception.reason}`,
          details: exception,
          isFirstDay
        });
      }
    });
    
    return events;
  };

  // Format date to display month and day
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Check if date is today
  const isToday = (date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  // Check if date is selected
  const isSelected = (date) => {
    if (!selectedDate) return false;
    
    return date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear();
  };

  // Format the week date range for display
  const formatWeekRange = () => {
    if (!weekStart || !weekEnd) return '';
    
    const start = weekStart.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
    
    const end = weekEnd.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
    
    return `${start} - ${end}`;
  };

  return (
    <div className="weekly-view-container">
      <div className="weekly-view-header">
        <button className="week-nav prev" onClick={goToPreviousWeek}>
          <i className="fas fa-chevron-left"></i>
        </button>
        <h3 className="current-week">
          {formatWeekRange()}
        </h3>
        <button className="week-nav next" onClick={goToNextWeek}>
          <i className="fas fa-chevron-right"></i>
        </button>
      </div>
      
      <div className="week-view">
        {weekDays.map((date, index) => {
          const status = getDateStatus(date);
          const events = getEventsForDate(date);
          
          return (
            <div 
              key={index} 
              className={`week-day ${status} ${isToday(date) ? 'today' : ''} ${isSelected(date) ? 'selected' : ''}`}
              onClick={() => onDateSelect(date)}
            >
              <div className="week-day-header">
                <div className="week-day-name">
                  {date.toLocaleDateString('en-US', { weekday: 'short' })}
                </div>
                <div className="week-day-date">
                  {formatDate(date)}
                </div>
              </div>
              
              <div className="week-day-events">
                {events.length > 0 ? (
                  events.map((event, eventIndex) => (
                    <div 
                      key={eventIndex} 
                      className={`week-event ${event.type} ${event.status || ''} ${event.isFirstDay ? 'first-day' : ''}`}
                    >
                      <div className="event-time">
                        {event.isFirstDay ? (
                          <span>
                            {new Date(event.details.start_date).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        ) : (
                          <span>All Day</span>
                        )}
                      </div>
                      <div className="event-title">{event.title}</div>
                    </div>
                  ))
                ) : (
                  <div className="no-events">Available</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeeklyCalendarView;