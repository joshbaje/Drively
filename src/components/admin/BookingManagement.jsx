import React, { useState, useEffect } from 'react';
import './BookingManagement.css';

const BookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [bookingsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    dateRange: 'all'
  });
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  useEffect(() => {
    // Fetch bookings from API
    // This is a placeholder - replace with actual API call
    const fetchBookings = async () => {
      try {
        setLoading(true);
        
        // Simulating API call with mock data
        // In a real implementation, you would fetch this from your backend
        setTimeout(() => {
          const statuses = [
            'pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'declined'
          ];
          
          const mockBookings = Array.from({ length: 30 }, (_, i) => {
            const today = new Date();
            const startDate = new Date(
              today.getFullYear(),
              today.getMonth(),
              today.getDate() - Math.floor(Math.random() * 30)
            );
            const endDate = new Date(
              startDate.getFullYear(),
              startDate.getMonth(),
              startDate.getDate() + Math.floor(Math.random() * 10) + 1
            );
            
            const dailyRate = Math.floor(Math.random() * 3000) + 1000;
            const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
            const subtotal = dailyRate * days;
            const taxAmount = Math.round(subtotal * 0.12);
            const serviceFee = Math.round(subtotal * 0.10);
            const insuranceFee = Math.round(subtotal * 0.05);
            const totalAmount = subtotal + taxAmount + serviceFee + insuranceFee;
            
            return {
              booking_id: `bkg-${i + 1}`,
              vehicle_id: `veh-${Math.floor(Math.random() * 20) + 1}`,
              renter_id: `user-${Math.floor(Math.random() * 10) + 1}`,
              owner_id: `user-${Math.floor(Math.random() * 10) + 11}`,
              renter_name: `Renter ${Math.floor(Math.random() * 10) + 1}`,
              owner_name: `Owner ${Math.floor(Math.random() * 10) + 1}`,
              vehicle_details: {
                make: ['Toyota', 'Honda', 'Ford', 'Hyundai', 'Mazda'][Math.floor(Math.random() * 5)],
                model: `Model ${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`,
                year: 2015 + Math.floor(Math.random() * 10),
                license_plate: `ABC ${Math.floor(Math.random() * 9000) + 1000}`
              },
              start_date: startDate.toISOString(),
              end_date: endDate.toISOString(),
              booking_status: statuses[Math.floor(Math.random() * statuses.length)],
              daily_rate: dailyRate,
              total_days: days,
              subtotal: subtotal,
              tax_amount: taxAmount,
              service_fee: serviceFee,
              insurance_fee: insuranceFee,
              total_amount: totalAmount,
              security_deposit: Math.round(totalAmount * 0.3),
              payment_status: ['pending', 'paid', 'refunded'][Math.floor(Math.random() * 3)],
              created_at: new Date(
                today.getFullYear(),
                today.getMonth(),
                today.getDate() - Math.floor(Math.random() * 30)
              ).toISOString()
            };
          });
          
          setBookings(mockBookings);
          setFilteredBookings(mockBookings);
          setLoading(false);
        }, 1000);
        
      } catch (error) {
        console.error('Error fetching bookings:', error);
        setLoading(false);
      }
    };
    
    fetchBookings();
  }, []);
  
  useEffect(() => {
    // Filter bookings based on search term and filters
    const filtered = bookings.filter(booking => {
      // Search by booking ID, renter name, owner name, vehicle info
      const searchMatch = 
        booking.booking_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.renter_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.owner_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${booking.vehicle_details.make} ${booking.vehicle_details.model}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.vehicle_details.license_plate.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Filter by status
      const statusMatch = 
        filters.status === 'all' || 
        booking.booking_status === filters.status;
      
      // Filter by date range
      let dateMatch = true;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const bookingStartDate = new Date(booking.start_date);
      const bookingEndDate = new Date(booking.end_date);
      
      if (filters.dateRange === 'today') {
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        dateMatch = 
          (bookingStartDate >= today && bookingStartDate < tomorrow) || 
          (bookingEndDate >= today && bookingEndDate < tomorrow) ||
          (bookingStartDate <= today && bookingEndDate >= tomorrow);
      } else if (filters.dateRange === 'week') {
        const weekLater = new Date(today);
        weekLater.setDate(weekLater.getDate() + 7);
        dateMatch = 
          (bookingStartDate >= today && bookingStartDate < weekLater) || 
          (bookingEndDate >= today && bookingEndDate < weekLater) ||
          (bookingStartDate <= today && bookingEndDate >= weekLater);
      } else if (filters.dateRange === 'month') {
        const monthLater = new Date(today);
        monthLater.setMonth(monthLater.getMonth() + 1);
        dateMatch = 
          (bookingStartDate >= today && bookingStartDate < monthLater) || 
          (bookingEndDate >= today && bookingEndDate < monthLater) ||
          (bookingStartDate <= today && bookingEndDate >= monthLater);
      } else if (filters.dateRange === 'past') {
        dateMatch = bookingEndDate < today;
      }
      
      return searchMatch && statusMatch && dateMatch;
    });
    
    setFilteredBookings(filtered);
    setCurrentPage(1); // Reset to first page on filter change
  }, [searchTerm, filters, bookings]);
  
  // Get current bookings for pagination
  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentBookings = filteredBookings.slice(indexOfFirstBooking, indexOfLastBooking);
  
  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleViewBooking = (booking) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBooking(null);
  };
  
  const handleUpdateStatus = (booking, newStatus) => {
    // Implement status update functionality
    console.log(`Update booking ${booking.booking_id} status to ${newStatus}`);
    
    // In a real implementation, this would make an API call
    // For now, we'll just update the local state
    const updatedBookings = bookings.map(b => 
      b.booking_id === booking.booking_id 
        ? { ...b, booking_status: newStatus } 
        : b
    );
    
    setBookings(updatedBookings);
    setSelectedBooking({ ...booking, booking_status: newStatus });
  };
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  const formatDateTime = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleString(undefined, options);
  };
  
  const formatCurrency = (amount) => {
    return `₱${amount.toLocaleString()}`;
  };
  
  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading bookings...</p>
      </div>
    );
  }
  
  return (
    <div className="bookings-container">
      <div className="bookings-header">
        <h2>Booking Management</h2>
        <div className="bookings-actions">
          <button className="btn-primary">
            <i className="fas fa-plus"></i> Create Booking
          </button>
          <button className="btn-secondary">
            <i className="fas fa-download"></i> Export
          </button>
        </div>
      </div>
      
      <div className="bookings-filter">
        <div className="filter-group search-input">
          <label htmlFor="search">Search Bookings</label>
          <input
            type="text"
            id="search"
            placeholder="Search by ID, renter, owner, vehicle..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        
        <div className="filter-group">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="declined">Declined</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label htmlFor="dateRange">Date Range</label>
          <select
            id="dateRange"
            name="dateRange"
            value={filters.dateRange}
            onChange={handleFilterChange}
          >
            <option value="all">All Dates</option>
            <option value="today">Today</option>
            <option value="week">Next 7 Days</option>
            <option value="month">Next 30 Days</option>
            <option value="past">Past Bookings</option>
          </select>
        </div>
      </div>
      
      <table className="bookings-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Renter</th>
            <th>Vehicle</th>
            <th>Dates</th>
            <th>Status</th>
            <th>Total</th>
            <th>Payment</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentBookings.length > 0 ? (
            currentBookings.map(booking => (
              <tr key={booking.booking_id}>
                <td>{booking.booking_id}</td>
                <td>{booking.renter_name}</td>
                <td>
                  {booking.vehicle_details.year} {booking.vehicle_details.make} {booking.vehicle_details.model}
                  <div style={{ fontSize: '12px', color: '#666' }}>{booking.vehicle_details.license_plate}</div>
                </td>
                <td>
                  {formatDate(booking.start_date)} - {formatDate(booking.end_date)}
                  <div style={{ fontSize: '12px', color: '#666' }}>{booking.total_days} days</div>
                </td>
                <td>
                  <div className={`status-badge status-${booking.booking_status}`}>
                    {booking.booking_status.replace('_', ' ').split(' ').map(word => 
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ')}
                  </div>
                </td>
                <td>{formatCurrency(booking.total_amount)}</td>
                <td>
                  <div className={`status-badge status-${booking.payment_status === 'paid' ? 'confirmed' : booking.payment_status === 'refunded' ? 'cancelled' : 'pending'}`}>
                    {booking.payment_status.charAt(0).toUpperCase() + booking.payment_status.slice(1)}
                  </div>
                </td>
                <td>
                  <div className="booking-actions">
                    <button 
                      className="action-button view" 
                      onClick={() => handleViewBooking(booking)}
                      title="View Booking"
                    >
                      <i className="fas fa-eye"></i>
                    </button>
                    <button 
                      className="action-button edit" 
                      title="Edit Booking"
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button 
                      className="action-button delete" 
                      title="Delete Booking"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" style={{ textAlign: 'center', padding: '30px' }}>
                <i className="fas fa-calendar-times" style={{ fontSize: '24px', color: '#ccc', marginBottom: '10px' }}></i>
                <p>No bookings found matching your criteria.</p>
              </td>
            </tr>
          )}
        </tbody>
      </table>
      
      {/* Pagination */}
      {filteredBookings.length > bookingsPerPage && (
        <div className="pagination">
          <button 
            onClick={() => paginate(currentPage - 1)} 
            disabled={currentPage === 1}
          >
            <i className="fas fa-chevron-left"></i>
          </button>
          
          {Array.from({ length: Math.ceil(filteredBookings.length / bookingsPerPage) }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => paginate(i + 1)}
              className={currentPage === i + 1 ? 'active' : ''}
            >
              {i + 1}
            </button>
          ))}
          
          <button 
            onClick={() => paginate(currentPage + 1)} 
            disabled={currentPage === Math.ceil(filteredBookings.length / bookingsPerPage)}
          >
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      )}
      
      {/* Booking Detail Modal */}
      {isModalOpen && selectedBooking && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="booking-detail-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Booking Details: {selectedBooking.booking_id}</h3>
              <button className="modal-close" onClick={closeModal}>×</button>
            </div>
            <div className="modal-body">
              <div className="booking-details">
                <div className="detail-section">
                  <h4>Booking Information</h4>
                  <div className="detail-row">
                    <div className="detail-label">Status:</div>
                    <div className="detail-value">
                      <div className={`status-badge status-${selectedBooking.booking_status}`}>
                        {selectedBooking.booking_status.replace('_', ' ').split(' ').map(word => 
                          word.charAt(0).toUpperCase() + word.slice(1)
                        ).join(' ')}
                      </div>
                    </div>
                  </div>
                  <div className="detail-row">
                    <div className="detail-label">Created:</div>
                    <div className="detail-value">{formatDateTime(selectedBooking.created_at)}</div>
                  </div>
                  <div className="detail-row">
                    <div className="detail-label">Start Date:</div>
                    <div className="detail-value">{formatDateTime(selectedBooking.start_date)}</div>
                  </div>
                  <div className="detail-row">
                    <div className="detail-label">End Date:</div>
                    <div className="detail-value">{formatDateTime(selectedBooking.end_date)}</div>
                  </div>
                  <div className="detail-row">
                    <div className="detail-label">Duration:</div>
                    <div className="detail-value">{selectedBooking.total_days} days</div>
                  </div>
                </div>
                
                <div className="detail-section">
                  <h4>Vehicle Information</h4>
                  <div className="detail-row">
                    <div className="detail-label">Vehicle:</div>
                    <div className="detail-value">
                      {selectedBooking.vehicle_details.year} {selectedBooking.vehicle_details.make} {selectedBooking.vehicle_details.model}
                    </div>
                  </div>
                  <div className="detail-row">
                    <div className="detail-label">License Plate:</div>
                    <div className="detail-value">{selectedBooking.vehicle_details.license_plate}</div>
                  </div>
                  <div className="detail-row">
                    <div className="detail-label">Owner:</div>
                    <div className="detail-value">{selectedBooking.owner_name}</div>
                  </div>
                </div>
                
                <div className="detail-section">
                  <h4>Renter Information</h4>
                  <div className="detail-row">
                    <div className="detail-label">Renter:</div>
                    <div className="detail-value">{selectedBooking.renter_name}</div>
                  </div>
                  <div className="detail-row">
                    <div className="detail-label">Renter ID:</div>
                    <div className="detail-value">{selectedBooking.renter_id}</div>
                  </div>
                </div>
                
                <div className="detail-section">
                  <h4>Payment Information</h4>
                  <div className="detail-row">
                    <div className="detail-label">Daily Rate:</div>
                    <div className="detail-value">{formatCurrency(selectedBooking.daily_rate)}</div>
                  </div>
                  <div className="detail-row">
                    <div className="detail-label">Subtotal:</div>
                    <div className="detail-value">{formatCurrency(selectedBooking.subtotal)}</div>
                  </div>
                  <div className="detail-row">
                    <div className="detail-label">Tax:</div>
                    <div className="detail-value">{formatCurrency(selectedBooking.tax_amount)}</div>
                  </div>
                  <div className="detail-row">
                    <div className="detail-label">Service Fee:</div>
                    <div className="detail-value">{formatCurrency(selectedBooking.service_fee)}</div>
                  </div>
                  <div className="detail-row">
                    <div className="detail-label">Insurance Fee:</div>
                    <div className="detail-value">{formatCurrency(selectedBooking.insurance_fee)}</div>
                  </div>
                  <div className="detail-row">
                    <div className="detail-label">Total:</div>
                    <div className="detail-value" style={{ fontWeight: 'bold' }}>
                      {formatCurrency(selectedBooking.total_amount)}
                    </div>
                  </div>
                  <div className="detail-row">
                    <div className="detail-label">Security Deposit:</div>
                    <div className="detail-value">{formatCurrency(selectedBooking.security_deposit)}</div>
                  </div>
                  <div className="detail-row">
                    <div className="detail-label">Payment Status:</div>
                    <div className="detail-value">
                      <div className={`status-badge status-${selectedBooking.payment_status === 'paid' ? 'confirmed' : selectedBooking.payment_status === 'refunded' ? 'cancelled' : 'pending'}`}>
                        {selectedBooking.payment_status.charAt(0).toUpperCase() + selectedBooking.payment_status.slice(1)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="status-update">
                <h4>Update Booking Status</h4>
                <p>Current status: <strong>{selectedBooking.booking_status.replace('_', ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</strong></p>
                <div className="status-buttons">
                  {selectedBooking.booking_status !== 'confirmed' && (
                    <button 
                      className="status-btn btn-confirm" 
                      onClick={() => handleUpdateStatus(selectedBooking, 'confirmed')}
                    >
                      Confirm
                    </button>
                  )}
                  {selectedBooking.booking_status !== 'in_progress' && selectedBooking.booking_status !== 'completed' && selectedBooking.booking_status !== 'cancelled' && selectedBooking.booking_status !== 'declined' && (
                    <button 
                      className="status-btn btn-in-progress" 
                      onClick={() => handleUpdateStatus(selectedBooking, 'in_progress')}
                    >
                      Start Rental
                    </button>
                  )}
                  {selectedBooking.booking_status !== 'completed' && selectedBooking.booking_status !== 'cancelled' && selectedBooking.booking_status !== 'declined' && (
                    <button 
                      className="status-btn btn-complete" 
                      onClick={() => handleUpdateStatus(selectedBooking, 'completed')}
                    >
                      Complete
                    </button>
                  )}
                  {selectedBooking.booking_status !== 'cancelled' && selectedBooking.booking_status !== 'completed' && (
                    <button 
                      className="status-btn btn-cancel" 
                      onClick={() => handleUpdateStatus(selectedBooking, 'cancelled')}
                    >
                      Cancel
                    </button>
                  )}
                  {selectedBooking.booking_status === 'pending' && (
                    <button 
                      className="status-btn btn-decline" 
                      onClick={() => handleUpdateStatus(selectedBooking, 'declined')}
                    >
                      Decline
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingManagement;
