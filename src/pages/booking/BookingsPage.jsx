import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import apiService from '../../services/apiService';
import ReviewModal from '../../components/rating/ReviewModal';
import './BookingsPage.css';

const BookingsPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  
  useEffect(() => {
    // Fetch bookings when component mounts
    fetchBookings();
  }, []);
  
  const fetchBookings = async () => {
    setLoading(true);
    
    try {
      // In a real app, we would call the API
      // const response = await apiService.getUserBookings();
      
      // For now, let's use mock data
      setTimeout(() => {
        const mockBookings = [
          {
            id: 'BK-2025-001',
            status: 'confirmed',
            vehicle: {
              id: 1,
              make: 'Toyota',
              model: 'Fortuner',
              year: 2022,
              image: '/images/cars/fortuner-1.jpg',
              location: 'Makati City'
            },
            owner: {
              id: 101,
              name: 'John Dela Cruz'
            },
            start_date: '2025-04-10',
            end_date: '2025-04-15',
            total_days: 5,
            daily_rate: 4500,
            insurance_rate: 35,
            service_fee: 2250,
            tax: 2994,
            total_amount: 27879,
            created_at: '2025-03-15'
          },
          {
            id: 'BK-2025-002',
            status: 'pending',
            vehicle: {
              id: 3,
              make: 'Mitsubishi',
              model: 'Montero Sport',
              year: 2021,
              image: '/images/cars/montero-sport.jpg',
              location: 'Taguig City'
            },
            owner: {
              id: 102,
              name: 'Maria Santos'
            },
            start_date: '2025-05-05',
            end_date: '2025-05-08',
            total_days: 3,
            daily_rate: 4200,
            insurance_rate: 35,
            service_fee: 1260,
            tax: 1711,
            total_amount: 15985,
            created_at: '2025-03-18'
          },
          {
            id: 'BK-2025-003',
            status: 'completed',
            vehicle: {
              id: 2,
              make: 'Honda',
              model: 'City',
              year: 2022,
              image: '/images/cars/honda-city.jpg',
              location: 'Quezon City'
            },
            owner: {
              id: 103,
              name: 'Robert Tan'
            },
            start_date: '2025-02-10',
            end_date: '2025-02-12',
            total_days: 2,
            daily_rate: 2800,
            insurance_rate: 20,
            service_fee: 560,
            tax: 806,
            total_amount: 7566,
            created_at: '2025-01-25',
            reviewed: false
          },
          {
            id: 'BK-2025-004',
            status: 'cancelled',
            vehicle: {
              id: 4,
              make: 'Kia',
              model: 'Seltos',
              year: 2023,
              image: '/images/cars/kia-seltos.jpg',
              location: 'Pasig City'
            },
            owner: {
              id: 104,
              name: 'Jennifer Cruz'
            },
            start_date: '2025-03-01',
            end_date: '2025-03-03',
            total_days: 2,
            daily_rate: 3500,
            insurance_rate: 20,
            service_fee: 700,
            tax: 1006,
            total_amount: 9426,
            created_at: '2025-02-15'
          },
          {
            id: 'BK-2025-005',
            status: 'completed',
            vehicle: {
              id: 5,
              make: 'Ford',
              model: 'Everest',
              year: 2023,
              image: '/images/cars/ford-everest.jpg',
              location: 'Quezon City'
            },
            owner: {
              id: 105,
              name: 'Michael Santos'
            },
            start_date: '2025-01-15',
            end_date: '2025-01-18',
            total_days: 3,
            daily_rate: 4500,
            insurance_rate: 35,
            service_fee: 1350,
            tax: 1764,
            total_amount: 16764,
            created_at: '2025-01-05',
            reviewed: true
          }
        ];
        
        setBookings(mockBookings);
        setLoading(false);
      }, 1500);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setLoading(false);
    }
  };
  
  // Filter bookings based on active tab
  const getFilteredBookings = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    switch (activeTab) {
      case 'upcoming':
        return bookings.filter(booking => 
          (booking.status === 'confirmed' || booking.status === 'pending') && 
          new Date(booking.end_date) >= today
        );
      case 'completed':
        return bookings.filter(booking => 
          booking.status === 'completed' ||
          (booking.status === 'confirmed' && new Date(booking.end_date) < today)
        );
      case 'cancelled':
        return bookings.filter(booking => booking.status === 'cancelled');
      case 'all':
      default:
        return bookings;
    }
  };
  
  // Handle review submission
  const handleReviewSubmit = (reviewData) => {
    console.log('Review submitted:', reviewData);
    
    // In a real app, submit to API and update booking status
    // For now, just update the local state to mark this booking as reviewed
    setBookings(prevBookings => 
      prevBookings.map(booking => 
        booking.id === reviewData.bookingId 
          ? { ...booking, reviewed: true }
          : booking
      )
    );
  };
  
  // Open review modal for a booking
  const openReviewModal = (booking) => {
    setSelectedBooking(booking);
    setShowReviewModal(true);
  };
  
  const filteredBookings = getFilteredBookings();
  
  // Format date: e.g., "Mon, Apr 10, 2025"
  const formatDate = (dateString) => {
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  // Format price with currency symbol
  const formatPrice = (price) => {
    return `₱${price.toLocaleString()}`;
  };
  
  // Get status text display
  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'Pending Approval';
      case 'confirmed':
        return 'Confirmed';
      case 'completed':
        return 'Completed';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };
  
  // Handle booking cancellation
  const handleCancelBooking = (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      // In a real app, we would call the API
      // await apiService.cancelBooking(bookingId);
      
      // For now, let's just update the local state
      setBookings(prevBookings => 
        prevBookings.map(booking => 
          booking.id === bookingId 
            ? { ...booking, status: 'cancelled' } 
            : booking
        )
      );
    }
  };
  
  return (
    <div className="bookings-page">
      <div className="page-header">
        <div className="container">
          <h1>My Bookings</h1>
          <p>Manage your car rental bookings</p>
        </div>
      </div>
      
      <div className="bookings-container">
        <div className="bookings-tabs">
          <div className="tabs-header">
            <button 
              className={`tab-btn ${activeTab === 'upcoming' ? 'active' : ''}`}
              onClick={() => setActiveTab('upcoming')}
            >
              Upcoming
            </button>
            <button 
              className={`tab-btn ${activeTab === 'completed' ? 'active' : ''}`}
              onClick={() => setActiveTab('completed')}
            >
              Completed
            </button>
            <button 
              className={`tab-btn ${activeTab === 'cancelled' ? 'active' : ''}`}
              onClick={() => setActiveTab('cancelled')}
            >
              Cancelled
            </button>
            <button 
              className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              All Bookings
            </button>
          </div>
          
          {loading ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Loading bookings...</p>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="no-bookings">
              <div className="no-bookings-icon">
                <i className="fas fa-calendar-times"></i>
              </div>
              <h2 className="no-bookings-message">No {activeTab} bookings found</h2>
              <p className="no-bookings-description">
                {activeTab === 'upcoming' 
                  ? 'You don\'t have any upcoming bookings. Start exploring cars to rent!' 
                  : `You don't have any ${activeTab} bookings yet.`}
              </p>
              <Link to="/search" className="find-cars-btn">Find Cars to Rent</Link>
            </div>
          ) : (
            <div className="bookings-grid">
              {filteredBookings.map(booking => (
                <div key={booking.id} className="booking-card">
                  <div className="booking-header">
                    <span className="booking-id">Booking ID: {booking.id}</span>
                    <span className={`booking-status status-${booking.status}`}>
                      {getStatusText(booking.status)}
                    </span>
                  </div>
                  
                  <div className="booking-content">
                    <div className="booking-vehicle">
                      <div className="vehicle-image">
                        <img src={`${process.env.PUBLIC_URL}${booking.vehicle.image}`} alt={`${booking.vehicle.make} ${booking.vehicle.model}`} />
                      </div>
                      <div className="vehicle-info">
                        <h3 className="vehicle-name">
                          {booking.vehicle.year} {booking.vehicle.make} {booking.vehicle.model}
                        </h3>
                        <p className="vehicle-details">
                          <i className="fas fa-map-marker-alt"></i> {booking.vehicle.location} | 
                          <i className="fas fa-user" style={{ marginLeft: '10px' }}></i> {booking.owner.name}
                        </p>
                        <Link to={`/vehicles/${booking.vehicle.id}`} className="vehicle-link">
                          View Vehicle Details
                        </Link>
                      </div>
                    </div>
                    
                    <div className="booking-dates">
                      <div className="date-item">
                        <div className="date-label">Pick-up Date</div>
                        <div className="date-value">{formatDate(booking.start_date)}</div>
                      </div>
                      <div className="date-item">
                        <div className="date-label">Return Date</div>
                        <div className="date-value">{formatDate(booking.end_date)}</div>
                      </div>
                    </div>
                    
                    <div className="booking-price">
                      <div className="price-row">
                        <span className="price-label">Daily Rate</span>
                        <span className="price-value">{formatPrice(booking.daily_rate)} × {booking.total_days} days</span>
                      </div>
                      <div className="price-row">
                        <span className="price-label">Insurance</span>
                        <span className="price-value">{formatPrice(booking.insurance_rate)} × {booking.total_days} days</span>
                      </div>
                      <div className="price-row">
                        <span className="price-label">Service Fee</span>
                        <span className="price-value">{formatPrice(booking.service_fee)}</span>
                      </div>
                      <div className="price-row">
                        <span className="price-label">Tax</span>
                        <span className="price-value">{formatPrice(booking.tax)}</span>
                      </div>
                      <div className="price-row">
                        <span className="price-label">Total</span>
                        <span className="price-value">{formatPrice(booking.total_amount)}</span>
                      </div>
                    </div>
                    
                    <div className="booking-actions">
                      {booking.status === 'confirmed' && new Date(booking.start_date) > new Date() && (
                        <button 
                          className="booking-button btn-danger"
                          onClick={() => handleCancelBooking(booking.id)}
                        >
                          Cancel Booking
                        </button>
                      )}
                      {booking.status === 'completed' && !booking.reviewed && (
                        <button 
                          className="booking-button btn-primary"
                          onClick={() => openReviewModal(booking)}
                        >
                          Write a Review
                        </button>
                      )}
                      {booking.status === 'completed' && booking.reviewed && (
                        <span className="review-complete-badge">
                          <i className="fas fa-check-circle"></i> Reviewed
                        </span>
                      )}
                      <button className="booking-button btn-secondary">
                        Contact Support
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Review Modal */}
      {selectedBooking && (
        <ReviewModal
          isOpen={showReviewModal}
          onClose={() => setShowReviewModal(false)}
          booking={selectedBooking}
          onSubmitReview={handleReviewSubmit}
        />
      )}
    </div>
  );
};

export default BookingsPage;