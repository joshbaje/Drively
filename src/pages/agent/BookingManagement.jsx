import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import './AgentPortal.css';

const BookingManagement = ({ showDetails = false }) => {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [bookingUpdate, setBookingUpdate] = useState({
    status: '',
    notes: ''
  });

  // When the component mounts or params/location changes
  useEffect(() => {
    // Load mock booking data
    loadMockBookings();
    
    // If we're showing details, try to find the booking ID in params
    if (showDetails && params.id) {
      fetchBookingDetails(params.id);
    } else if (location.state?.booking) {
      // If we have booking info in location state (e.g., from NewBooking)
      setSelectedBooking(location.state.booking);
    }
  }, [params.id, showDetails, location.state]);

  // When filters or search text change, update filtered bookings
  useEffect(() => {
    filterBookings();
  }, [bookings, searchText, statusFilter, dateFilter]);

  const loadMockBookings = () => {
    // Simulate API fetch with timeout
    setIsLoading(true);
    setTimeout(() => {
      const mockBookings = [
        {
          booking_id: 'booking-1',
          vehicle: {
            make: 'Toyota',
            model: 'Corolla',
            year: 2022,
            image_url: 'https://via.placeholder.com/150?text=Toyota+Corolla'
          },
          customer: {
            first_name: 'John',
            last_name: 'Doe',
            email: 'john.doe@example.com',
            phone_number: '555-123-4567'
          },
          booking_status: 'confirmed',
          payment_status: 'paid',
          start_date: '2025-03-15T10:00:00',
          end_date: '2025-03-20T10:00:00',
          total_amount: 375,
          created_at: '2025-03-10T14:23:45'
        },
        {
          booking_id: 'booking-2',
          vehicle: {
            make: 'Honda',
            model: 'CR-V',
            year: 2021,
            image_url: 'https://via.placeholder.com/150?text=Honda+CR-V'
          },
          customer: {
            first_name: 'Jane',
            last_name: 'Smith',
            email: 'jane.smith@example.com',
            phone_number: '555-987-6543'
          },
          booking_status: 'in_progress',
          payment_status: 'paid',
          start_date: '2025-03-12T14:00:00',
          end_date: '2025-03-17T14:00:00',
          total_amount: 425,
          created_at: '2025-03-05T09:15:30'
        },
        {
          booking_id: 'booking-3',
          vehicle: {
            make: 'Tesla',
            model: 'Model 3',
            year: 2023,
            image_url: 'https://via.placeholder.com/150?text=Tesla+Model+3'
          },
          customer: {
            first_name: 'Michael',
            last_name: 'Johnson',
            email: 'michael.johnson@example.com',
            phone_number: '555-456-7890'
          },
          booking_status: 'pending',
          payment_status: 'pending',
          start_date: '2025-03-25T09:00:00',
          end_date: '2025-03-30T09:00:00',
          total_amount: 650,
          created_at: '2025-03-18T16:45:20'
        },
        {
          booking_id: 'booking-4',
          vehicle: {
            make: 'Ford',
            model: 'F-150',
            year: 2022,
            image_url: 'https://via.placeholder.com/150?text=Ford+F-150'
          },
          customer: {
            first_name: 'Sarah',
            last_name: 'Williams',
            email: 'sarah.williams@example.com',
            phone_number: '555-789-0123'
          },
          booking_status: 'completed',
          payment_status: 'paid',
          start_date: '2025-03-01T12:00:00',
          end_date: '2025-03-07T12:00:00',
          total_amount: 665,
          created_at: '2025-02-25T11:30:15'
        }
      ];
      
      setBookings(mockBookings);
      setFilteredBookings(mockBookings);
      setIsLoading(false);
    }, 800);
  };

  const fetchBookingDetails = (bookingId) => {
    // Simulate API fetch with timeout
    setIsLoading(true);
    setTimeout(() => {
      const booking = bookings.find(b => b.booking_id === bookingId);
      if (booking) {
        setSelectedBooking({
          ...booking,
          // Add additional details for the detail view
          pickup_location: '123 Main St, San Francisco, CA',
          dropoff_location: '123 Main St, San Francisco, CA',
          daily_rate: booking.total_amount / 5, // Assuming 5 days
          total_days: 5,
          subtotal: booking.total_amount * 0.7, // 70% of total
          tax_amount: booking.total_amount * 0.08, // 8% tax
          service_fee: booking.total_amount * 0.1, // 10% service fee
          insurance_fee: booking.total_amount * 0.12, // 12% insurance
          security_deposit: 300,
          deposit_status: 'held',
          special_requests: 'Please have the car cleaned before pickup.',
          notes: 'Customer may arrive 30 minutes earlier than scheduled.',
          insurance_option: {
            name: 'Standard Coverage',
            description: 'Includes liability and collision coverage',
            daily_rate: 25
          }
        });
      }
      setIsLoading(false);
    }, 500);
  };

  const filterBookings = () => {
    if (!bookings.length) return;
    
    let filtered = [...bookings];
    
    // Apply search filter
    if (searchText) {
      const searchLower = searchText.toLowerCase();
      filtered = filtered.filter(booking => 
        booking.booking_id.toLowerCase().includes(searchLower) ||
        `${booking.customer.first_name} ${booking.customer.last_name}`.toLowerCase().includes(searchLower) ||
        booking.customer.email.toLowerCase().includes(searchLower) ||
        booking.customer.phone_number.includes(searchLower) ||
        `${booking.vehicle.year} ${booking.vehicle.make} ${booking.vehicle.model}`.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(booking => booking.booking_status === statusFilter);
    }
    
    // Apply date filter
    if (dateFilter !== 'all') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const nextWeek = new Date(today);
      nextWeek.setDate(nextWeek.getDate() + 7);
      const nextMonth = new Date(today);
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      
      filtered = filtered.filter(booking => {
        const startDate = new Date(booking.start_date);
        
        switch (dateFilter) {
          case 'today':
            return startDate >= today && startDate < tomorrow;
          case 'this_week':
            return startDate >= today && startDate < nextWeek;
          case 'this_month':
            return startDate >= today && startDate < nextMonth;
          case 'past':
            return startDate < today;
          default:
            return true;
        }
      });
    }
    
    setFilteredBookings(filtered);
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const handleDateFilterChange = (e) => {
    setDateFilter(e.target.value);
  };

  const handleViewBooking = (bookingId) => {
    navigate(`/agent/bookings/${bookingId}`);
  };

  const handleCreateNewBooking = () => {
    navigate('/agent/bookings/new');
  };

  const handleBack = () => {
    navigate('/agent/bookings');
  };

  const handleEditBooking = () => {
    setBookingUpdate({
      status: selectedBooking.booking_status,
      notes: selectedBooking.notes || ''
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateBookingChange = (field, value) => {
    setBookingUpdate(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveBookingUpdate = () => {
    // In a real application, this would be an API call
    // For now, we'll just update the selected booking
    setSelectedBooking(prev => ({
      ...prev,
      booking_status: bookingUpdate.status,
      notes: bookingUpdate.notes
    }));
    
    // Also update the booking in the list
    setBookings(prev => 
      prev.map(booking => 
        booking.booking_id === selectedBooking.booking_id 
          ? { 
              ...booking, 
              booking_status: bookingUpdate.status,
              notes: bookingUpdate.notes
            } 
          : booking
      )
    );
    
    setIsEditModalOpen(false);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleString('en-US', options);
  };

  const renderBookingStatusBadge = (status) => {
    const statusClasses = {
      pending: 'status-pending',
      confirmed: 'status-confirmed',
      in_progress: 'status-in-progress',
      completed: 'status-completed',
      cancelled: 'status-cancelled',
      declined: 'status-declined'
    };
    
    return (
      <span className={`status-badge ${statusClasses[status] || ''}`}>
        {status.replace('_', ' ')}
      </span>
    );
  };

  const renderBookingsList = () => {
    return (
      <div className="bookings-list-container">
        <div className="list-header">
          <div className="header-title">
            <h2>Booking Management</h2>
            <span className="booking-count">{filteredBookings.length} bookings</span>
          </div>
          <button 
            className="btn-primary"
            onClick={handleCreateNewBooking}
          >
            <i className="fas fa-plus"></i> New Booking
          </button>
        </div>
        
        <div className="filters-bar">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search bookings..."
              value={searchText}
              onChange={handleSearch}
              className="search-input"
            />
            <i className="fas fa-search search-icon"></i>
          </div>
          
          <div className="filter-group">
            <label>Status:</label>
            <select 
              value={statusFilter}
              onChange={handleStatusFilterChange}
              className="filter-select"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="declined">Declined</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label>Date:</label>
            <select 
              value={dateFilter}
              onChange={handleDateFilterChange}
              className="filter-select"
            >
              <option value="all">All Dates</option>
              <option value="today">Today</option>
              <option value="this_week">This Week</option>
              <option value="this_month">This Month</option>
              <option value="past">Past</option>
            </select>
          </div>
        </div>
        
        {isLoading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading bookings...</p>
          </div>
        ) : (
          <>
            {filteredBookings.length > 0 ? (
              <div className="bookings-table">
                <table>
                  <thead>
                    <tr>
                      <th>Booking ID</th>
                      <th>Customer</th>
                      <th>Vehicle</th>
                      <th>Status</th>
                      <th>Dates</th>
                      <th>Amount</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings.map(booking => (
                      <tr key={booking.booking_id}>
                        <td className="booking-id">{booking.booking_id}</td>
                        <td className="customer-info">
                          <div className="customer-name">{booking.customer.first_name} {booking.customer.last_name}</div>
                          <div className="customer-contact">{booking.customer.email}</div>
                        </td>
                        <td className="vehicle-info">
                          <div className="vehicle-image">
                            <img src={booking.vehicle.image_url} alt={`${booking.vehicle.make} ${booking.vehicle.model}`} />
                          </div>
                          <div className="vehicle-details">
                            {booking.vehicle.year} {booking.vehicle.make} {booking.vehicle.model}
                          </div>
                        </td>
                        <td className="booking-status">
                          {renderBookingStatusBadge(booking.booking_status)}
                          <div className="payment-status">
                            Payment: <span className={`payment-${booking.payment_status}`}>{booking.payment_status}</span>
                          </div>
                        </td>
                        <td className="booking-dates">
                          <div>Start: {formatDate(booking.start_date)}</div>
                          <div>End: {formatDate(booking.end_date)}</div>
                        </td>
                        <td className="booking-amount">${booking.total_amount.toFixed(2)}</td>
                        <td className="booking-actions">
                          <button 
                            className="btn-view"
                            onClick={() => handleViewBooking(booking.booking_id)}
                          >
                            <i className="fas fa-eye"></i> View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="no-results">
                <i className="fas fa-search"></i>
                <h3>No Bookings Found</h3>
                <p>Try adjusting your search or filters to find bookings.</p>
                <button 
                  className="btn-secondary"
                  onClick={() => {
                    setSearchText('');
                    setStatusFilter('all');
                    setDateFilter('all');
                  }}
                >
                  Clear Filters
                </button>
              </div>
            )}
          </>
        )}
      </div>
    );
  };

  const renderBookingDetails = () => {
    if (!selectedBooking) {
      return (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading booking details...</p>
        </div>
      );
    }
    
    return (
      <div className="booking-details-container">
        <div className="details-header">
          <div className="header-left">
            <button 
              className="btn-back"
              onClick={handleBack}
            >
              <i className="fas fa-arrow-left"></i> Back to Bookings
            </button>
            <h2>Booking Details</h2>
          </div>
          <div className="header-right">
            <div className="booking-id">ID: {selectedBooking.booking_id}</div>
            <div className="booking-date">Created: {formatDate(selectedBooking.created_at)}</div>
          </div>
        </div>
        
        <div className="details-card">
          <div className="details-status-header">
            <div className="status-section">
              <h3>Booking Status</h3>
              {renderBookingStatusBadge(selectedBooking.booking_status)}
            </div>
            <button 
              className="btn-primary"
              onClick={handleEditBooking}
            >
              <i className="fas fa-edit"></i> Edit Booking
            </button>
          </div>
          
          <div className="details-grid">
            <div className="details-column">
              <div className="details-section">
                <h3>Customer Information</h3>
                <div className="customer-card">
                  <div className="customer-header">
                    <div className="customer-name">
                      {selectedBooking.customer.first_name} {selectedBooking.customer.last_name}
                    </div>
                    <button 
                      className="btn-text"
                      onClick={() => navigate(`/agent/customers/${selectedBooking.customer.id}`)}
                    >
                      View Profile
                    </button>
                  </div>
                  <div className="customer-contact">
                    <div><i className="fas fa-envelope"></i> {selectedBooking.customer.email}</div>
                    <div><i className="fas fa-phone"></i> {selectedBooking.customer.phone_number}</div>
                  </div>
                </div>
              </div>
              
              <div className="details-section">
                <h3>Vehicle Information</h3>
                <div className="vehicle-card">
                  <div className="vehicle-image">
                    <img src={selectedBooking.vehicle.image_url} alt={`${selectedBooking.vehicle.make} ${selectedBooking.vehicle.model}`} />
                  </div>
                  <div className="vehicle-info">
                    <div className="vehicle-name">
                      {selectedBooking.vehicle.year} {selectedBooking.vehicle.make} {selectedBooking.vehicle.model}
                    </div>
                    <button 
                      className="btn-text"
                      onClick={() => navigate(`/agent/vehicles/${selectedBooking.vehicle.id}`)}
                    >
                      View Vehicle
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="details-section">
                <h3>Booking Times</h3>
                <div className="booking-times">
                  <div className="time-row">
                    <div className="time-label">Pickup:</div>
                    <div className="time-value">{formatDate(selectedBooking.start_date)}</div>
                  </div>
                  <div className="time-row">
                    <div className="time-label">Return:</div>
                    <div className="time-value">{formatDate(selectedBooking.end_date)}</div>
                  </div>
                  <div className="time-row">
                    <div className="time-label">Duration:</div>
                    <div className="time-value">{selectedBooking.total_days} days</div>
                  </div>
                </div>
              </div>
              
              <div className="details-section">
                <h3>Locations</h3>
                <div className="locations-info">
                  <div className="location-row">
                    <div className="location-label">Pickup Location:</div>
                    <div className="location-value">{selectedBooking.pickup_location}</div>
                  </div>
                  <div className="location-row">
                    <div className="location-label">Dropoff Location:</div>
                    <div className="location-value">{selectedBooking.dropoff_location}</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="details-column">
              <div className="details-section">
                <h3>Price Details</h3>
                <div className="price-details">
                  <div className="price-row">
                    <div className="price-label">Daily Rate:</div>
                    <div className="price-value">${selectedBooking.daily_rate.toFixed(2)} × {selectedBooking.total_days} days</div>
                  </div>
                  <div className="price-row">
                    <div className="price-label">Subtotal:</div>
                    <div className="price-value">${selectedBooking.subtotal.toFixed(2)}</div>
                  </div>
                  <div className="price-row">
                    <div className="price-label">Insurance:</div>
                    <div className="price-value">${selectedBooking.insurance_fee.toFixed(2)}</div>
                  </div>
                  <div className="price-row">
                    <div className="price-label">Service Fee:</div>
                    <div className="price-value">${selectedBooking.service_fee.toFixed(2)}</div>
                  </div>
                  <div className="price-row">
                    <div className="price-label">Taxes:</div>
                    <div className="price-value">${selectedBooking.tax_amount.toFixed(2)}</div>
                  </div>
                  <div className="price-row total">
                    <div className="price-label">Total:</div>
                    <div className="price-value">${selectedBooking.total_amount.toFixed(2)}</div>
                  </div>
                  <div className="price-row deposit">
                    <div className="price-label">Security Deposit:</div>
                    <div className="price-value">${selectedBooking.security_deposit.toFixed(2)}</div>
                  </div>
                  <div className="deposit-status">
                    Deposit Status: <span className={`status-${selectedBooking.deposit_status}`}>{selectedBooking.deposit_status}</span>
                  </div>
                </div>
              </div>
              
              <div className="details-section">
                <h3>Payment Information</h3>
                <div className="payment-details">
                  <div className="payment-row">
                    <div className="payment-label">Payment Status:</div>
                    <div className="payment-value">
                      <span className={`payment-${selectedBooking.payment_status}`}>
                        {selectedBooking.payment_status}
                      </span>
                    </div>
                  </div>
                  <div className="payment-row">
                    <div className="payment-label">Payment Method:</div>
                    <div className="payment-value">Credit Card (ending in 4242)</div>
                  </div>
                  <div className="payment-actions">
                    <button className="btn-secondary">
                      <i className="fas fa-print"></i> Print Receipt
                    </button>
                    <button className="btn-secondary">
                      <i className="fas fa-envelope"></i> Email Receipt
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="details-section">
                <h3>Insurance</h3>
                <div className="insurance-details">
                  <div className="insurance-name">{selectedBooking.insurance_option.name}</div>
                  <div className="insurance-description">{selectedBooking.insurance_option.description}</div>
                  <div className="insurance-rate">Rate: ${selectedBooking.insurance_option.daily_rate}/day</div>
                </div>
              </div>
              
              <div className="details-section">
                <h3>Additional Information</h3>
                <div className="additional-info">
                  <div className="info-row">
                    <div className="info-label">Special Requests:</div>
                    <div className="info-value">{selectedBooking.special_requests || 'None'}</div>
                  </div>
                  <div className="info-row">
                    <div className="info-label">Notes:</div>
                    <div className="info-value">{selectedBooking.notes || 'No notes'}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Modal for editing booking
  const renderEditModal = () => {
    if (!isEditModalOpen) return null;
    
    return (
      <div className="modal-overlay">
        <div className="modal-container">
          <div className="modal-header">
            <h2>Edit Booking</h2>
            <button 
              className="modal-close" 
              onClick={() => setIsEditModalOpen(false)}
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
          
          <div className="modal-body">
            <div className="modal-form">
              <div className="form-group">
                <label>Booking Status</label>
                <select
                  value={bookingUpdate.status}
                  onChange={(e) => handleUpdateBookingChange('status', e.target.value)}
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="declined">Declined</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Notes</label>
                <textarea
                  value={bookingUpdate.notes}
                  onChange={(e) => handleUpdateBookingChange('notes', e.target.value)}
                  rows={4}
                  placeholder="Add booking notes here..."
                ></textarea>
              </div>
            </div>
          </div>
          
          <div className="modal-footer">
            <button 
              className="btn-secondary" 
              onClick={() => setIsEditModalOpen(false)}
            >
              Cancel
            </button>
            <button 
              className="btn-primary" 
              onClick={handleSaveBookingUpdate}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="booking-management-container">
      {showDetails ? renderBookingDetails() : renderBookingsList()}
      {renderEditModal()}
    </div>
  );
};

export default BookingManagement;