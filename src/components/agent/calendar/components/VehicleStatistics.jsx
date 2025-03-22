import React, { useState, useEffect } from 'react';
import './VehicleStatistics.css';

const VehicleStatistics = ({ vehicleId, bookings, availabilityExceptions }) => {
  const [stats, setStats] = useState({
    utilizationRate: 0,
    totalBookings: 0,
    totalRevenue: 0,
    unavailableDays: 0,
    upcomingBookings: 0,
    averageRentalDuration: 0
  });

  useEffect(() => {
    // Calculate statistics from booking and availability data
    if (bookings && bookings.length > 0) {
      calculateStatistics();
    }
  }, [bookings, availabilityExceptions]);

  const calculateStatistics = () => {
    // Current date for upcoming bookings calculation
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    
    // Calculate total days in bookings
    let totalBookingDays = 0;
    let totalRevenue = 0;
    let totalDuration = 0;
    
    // Count upcoming bookings
    const upcomingCount = bookings.filter(booking => 
      new Date(booking.start_date) >= currentDate
    ).length;
    
    // Calculate total booking days and revenue
    bookings.forEach(booking => {
      const startDate = new Date(booking.start_date);
      const endDate = new Date(booking.end_date);
      const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
      
      totalBookingDays += days;
      totalRevenue += booking.total_amount || 0;
      totalDuration += days;
    });
    
    // Calculate unavailable days
    let unavailableDays = 0;
    if (availabilityExceptions && availabilityExceptions.length > 0) {
      availabilityExceptions.forEach(exception => {
        const startDate = new Date(exception.start_date);
        const endDate = new Date(exception.end_date);
        const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
        
        unavailableDays += days;
      });
    }
    
    // Calculate utilization rate (past 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    let bookedDaysInPeriod = 0;
    
    // Count days booked in last 30 days
    bookings.forEach(booking => {
      const startDate = new Date(booking.start_date);
      const endDate = new Date(booking.end_date);
      
      // Skip if booking is entirely in the future
      if (startDate > currentDate) return;
      
      // Adjust start date if booking started before our 30-day window
      const effectiveStartDate = startDate < thirtyDaysAgo ? thirtyDaysAgo : startDate;
      
      // Adjust end date if booking ends in the future
      const effectiveEndDate = endDate > currentDate ? currentDate : endDate;
      
      // Calculate days in our period
      if (effectiveEndDate >= effectiveStartDate) {
        const days = Math.ceil((effectiveEndDate - effectiveStartDate) / (1000 * 60 * 60 * 24)) + 1;
        bookedDaysInPeriod += days;
      }
    });
    
    // Calculate unavailable days in period
    let unavailableDaysInPeriod = 0;
    
    if (availabilityExceptions && availabilityExceptions.length > 0) {
      availabilityExceptions.forEach(exception => {
        const startDate = new Date(exception.start_date);
        const endDate = new Date(exception.end_date);
        
        // Skip if unavailability is entirely in the future
        if (startDate > currentDate) return;
        
        // Adjust start date if unavailability started before our 30-day window
        const effectiveStartDate = startDate < thirtyDaysAgo ? thirtyDaysAgo : startDate;
        
        // Adjust end date if unavailability ends in the future
        const effectiveEndDate = endDate > currentDate ? currentDate : endDate;
        
        // Calculate days in our period
        if (effectiveEndDate >= effectiveStartDate) {
          const days = Math.ceil((effectiveEndDate - effectiveStartDate) / (1000 * 60 * 60 * 24)) + 1;
          unavailableDaysInPeriod += days;
        }
      });
    }
    
    // Calculate utilization rate
    const totalDaysInPeriod = 30;
    const availableDaysInPeriod = totalDaysInPeriod - unavailableDaysInPeriod;
    const utilizationRate = availableDaysInPeriod > 0 
      ? (bookedDaysInPeriod / availableDaysInPeriod) * 100 
      : 0;
    
    // Calculate average rental duration
    const averageRentalDuration = bookings.length > 0 
      ? totalDuration / bookings.length 
      : 0;
    
    setStats({
      utilizationRate: Math.round(utilizationRate),
      totalBookings: bookings.length,
      totalRevenue: totalRevenue,
      unavailableDays: unavailableDays,
      upcomingBookings: upcomingCount,
      averageRentalDuration: Math.round(averageRentalDuration * 10) / 10 // Round to 1 decimal place
    });
  };

  return (
    <div className="vehicle-statistics">
      <h3 className="statistics-title">
        <i className="fas fa-chart-bar"></i> Vehicle Statistics
      </h3>
      
      <div className="stats-grid">
        <div className="stat-card utilization">
          <div className="stat-icon">
            <i className="fas fa-tachometer-alt"></i>
          </div>
          <div className="stat-info">
            <div className="stat-value">{stats.utilizationRate}%</div>
            <div className="stat-label">Utilization Rate</div>
            <div className="stat-subtitle">Last 30 days</div>
          </div>
        </div>
        
        <div className="stat-card bookings">
          <div className="stat-icon">
            <i className="fas fa-calendar-check"></i>
          </div>
          <div className="stat-info">
            <div className="stat-value">{stats.totalBookings}</div>
            <div className="stat-label">Total Bookings</div>
            <div className="stat-subtitle">All time</div>
          </div>
        </div>
        
        <div className="stat-card revenue">
          <div className="stat-icon">
            <i className="fas fa-dollar-sign"></i>
          </div>
          <div className="stat-info">
            <div className="stat-value">₱{stats.totalRevenue.toLocaleString()}</div>
            <div className="stat-label">Total Revenue</div>
            <div className="stat-subtitle">All time</div>
          </div>
        </div>
        
        <div className="stat-card upcoming">
          <div className="stat-icon">
            <i className="fas fa-hourglass-half"></i>
          </div>
          <div className="stat-info">
            <div className="stat-value">{stats.upcomingBookings}</div>
            <div className="stat-label">Upcoming Bookings</div>
            <div className="stat-subtitle">Future reservations</div>
          </div>
        </div>
        
        <div className="stat-card duration">
          <div className="stat-icon">
            <i className="fas fa-clock"></i>
          </div>
          <div className="stat-info">
            <div className="stat-value">{stats.averageRentalDuration}</div>
            <div className="stat-label">Avg. Rental Duration</div>
            <div className="stat-subtitle">Days per booking</div>
          </div>
        </div>
        
        <div className="stat-card unavailable">
          <div className="stat-icon">
            <i className="fas fa-ban"></i>
          </div>
          <div className="stat-info">
            <div className="stat-value">{stats.unavailableDays}</div>
            <div className="stat-label">Unavailable Days</div>
            <div className="stat-subtitle">Maintenance & other</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleStatistics;