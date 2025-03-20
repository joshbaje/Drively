import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext';
import './OwnerDashboard.css';

const OwnerDashboard = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('bookings');
  const [bookings, setBookings] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [earnings, setEarnings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEarnings: 0,
    monthlyEarnings: 0,
    totalBookings: 0,
    activeVehicles: 0,
    overallRating: 0
  });

  useEffect(() => {
    // In a real app, fetch data from API
    // For now, use mock data
    fetchMockData();
  }, []);

  const fetchMockData = () => {
    // Mock data for dashboard
    const mockBookings = [
      {
        id: 'bk12345',
        vehicle: '2022 Toyota Camry',
        renter: 'John Doe',
        startDate: '2025-04-01',
        endDate: '2025-04-05',
        status: 'confirmed',
        amount: 402.89
      },
      {
        id: 'bk12346',
        vehicle: '2023 Honda Civic',
        renter: 'Jane Smith',
        startDate: '2025-04-10',
        endDate: '2025-04-15',
        status: 'pending',
        amount: 375.50
      },
      {
        id: 'bk12347',
        vehicle: '2021 Ford Mustang',
        renter: 'Robert Johnson',
        startDate: '2025-03-15',
        endDate: '2025-03-20',
        status: 'completed',
        amount: 650.75
      },
      {
        id: 'bk12348',
        vehicle: '2022 Toyota Camry',
        renter: 'Emily Brown',
        startDate: '2025-03-01',
        endDate: '2025-03-05',
        status: 'cancelled',
        amount: 402.89
      },
      {
        id: 'bk12349',
        vehicle: '2023 Honda Civic',
        renter: 'Michael Wilson',
        startDate: '2025-04-20',
        endDate: '2025-04-25',
        status: 'in-progress',
        amount: 375.50
      }
    ];

    const mockVehicles = [
      {
        id: 'v123',
        make: 'Toyota',
        model: 'Camry',
        year: 2022,
        image: '/assets/images/cars/camry.jpg',
        dailyRate: 59.99,
        totalBookings: 15,
        avgRating: 4.8,
        isAvailable: true
      },
      {
        id: 'v124',
        make: 'Honda',
        model: 'Civic',
        year: 2023,
        image: '/assets/images/cars/civic.jpg',
        dailyRate: 55.50,
        totalBookings: 8,
        avgRating: 4.5,
        isAvailable: true
      },
      {
        id: 'v125',
        make: 'Ford',
        model: 'Mustang',
        year: 2021,
        image: '/assets/images/cars/mustang.jpg',
        dailyRate: 95.75,
        totalBookings: 12,
        avgRating: 4.9,
        isAvailable: false
      }
    ];

    const mockEarnings = [
      {
        id: 'p12345',
        bookingId: 'bk12347',
        vehicle: '2021 Ford Mustang',
        renter: 'Robert Johnson',
        date: '2025-03-20',
        amount: 650.75,
        status: 'completed'
      },
      {
        id: 'p12346',
        bookingId: 'bk12341',
        vehicle: '2022 Toyota Camry',
        renter: 'Alex Williams',
        date: '2025-03-12',
        amount: 420.50,
        status: 'completed'
      },
      {
        id: 'p12347',
        bookingId: 'bk12342',
        vehicle: '2023 Honda Civic',
        renter: 'Sarah Thompson',
        date: '2025-03-05',
        amount: 375.25,
        status: 'completed'
      },
      {
        id: 'p12348',
        bookingId: 'bk12345',
        vehicle: '2022 Toyota Camry',
        renter: 'John Doe',
        date: '2025-04-05',
        amount: 402.89,
        status: 'pending'
      }
    ];

    const mockReviews = [
      {
        id: 'r12345',
        reviewer: 'Robert Johnson',
        reviewerImage: '/assets/images/users/user1.jpg',
        vehicleName: '2021 Ford Mustang',
        vehicleImage: '/assets/images/cars/mustang.jpg',
        rating: 5,
        comment: 'Amazing car and excellent service! The owner was very helpful and the car was in perfect condition. Would definitely rent again!',
        date: '2025-03-21'
      },
      {
        id: 'r12346',
        reviewer: 'Alex Williams',
        reviewerImage: '/assets/images/users/user2.jpg',
        vehicleName: '2022 Toyota Camry',
        vehicleImage: '/assets/images/cars/camry.jpg',
        rating: 4,
        comment: 'Good experience overall. The car was clean and worked well. The pickup process was smooth. Would recommend.',
        date: '2025-03-13'
      },
      {
        id: 'r12347',
        reviewer: 'Sarah Thompson',
        reviewerImage: '/assets/images/users/user3.jpg',
        vehicleName: '2023 Honda Civic',
        vehicleImage: '/assets/images/cars/civic.jpg',
        rating: 5,
        comment: 'Perfect rental experience! The car was fuel efficient and very comfortable for our trip. The owner was very responsive and flexible with the pickup and return times.',
        date: '2025-03-06'
      }
    ];

    // Calculate dashboard stats
    const statsData = {
      totalEarnings: mockEarnings.filter(e => e.status === 'completed').reduce((sum, e) => sum + e.amount, 0),
      monthlyEarnings: mockEarnings.filter(e => e.status === 'completed' && new Date(e.date).getMonth() === new Date().getMonth()).reduce((sum, e) => sum + e.amount, 0),
      totalBookings: mockBookings.length,
      activeVehicles: mockVehicles.filter(v => v.isAvailable).length,
      overallRating: mockReviews.reduce((sum, r) => sum + r.rating, 0) / mockReviews.length
    };

    setBookings(mockBookings);
    setVehicles(mockVehicles);
    setEarnings(mockEarnings);
    setReviews(mockReviews);
    setStats(statsData);
    setIsLoading(false);
  };

  // Format date to readable format
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Format currency
  const formatCurrency = (amount) => {
    return `$${parseFloat(amount).toFixed(2)}`;
  };

  // Render star rating
  const renderRating = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<i key={i} className="fas fa-star"></i>);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<i key={i} className="fas fa-star-half-alt"></i>);
      } else {
        stars.push(<i key={i} className="far fa-star"></i>);
      }
    }
    
    return <div className="review-rating">{stars}</div>;
  };

  if (isLoading) {
    return <div className="owner-dashboard">Loading dashboard data...</div>;
  }

  return (
    <div className="owner-dashboard">
      <div className="owner-dashboard-header">
        <div className="owner-greeting">
          <h1>Welcome, {user?.first_name || 'Car Owner'}</h1>
          <p>Manage your vehicle listings, bookings, and payments all in one place.</p>
        </div>
        <div className="action-buttons">
          <Link to="/list-your-car" className="btn-add-vehicle">
            <i className="fas fa-plus"></i> Add New Vehicle
          </Link>
        </div>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card earnings">
          <div className="stat-title">Total Earnings</div>
          <div className="stat-value">{formatCurrency(stats.totalEarnings)}</div>
          <div className="stat-change positive">
            <i className="fas fa-arrow-up"></i> 12% from last month
          </div>
        </div>
        <div className="stat-card bookings">
          <div className="stat-title">Total Bookings</div>
          <div className="stat-value">{stats.totalBookings}</div>
          <div className="stat-change positive">
            <i className="fas fa-arrow-up"></i> 8% from last month
          </div>
        </div>
        <div className="stat-card vehicles">
          <div className="stat-title">Active Vehicles</div>
          <div className="stat-value">{stats.activeVehicles}</div>
          <div className="stat-period">out of {vehicles.length} total</div>
        </div>
        <div className="stat-card rating">
          <div className="stat-title">Overall Rating</div>
          <div className="stat-value">{stats.overallRating.toFixed(1)}</div>
          <div className="stat-period">from {reviews.length} reviews</div>
        </div>
      </div>

      <div className="dashboard-tabs">
        <div 
          className={`dashboard-tab ${activeTab === 'bookings' ? 'active' : ''}`}
          onClick={() => setActiveTab('bookings')}
        >
          <i className="fas fa-calendar-check"></i> Recent Bookings
        </div>
        <div 
          className={`dashboard-tab ${activeTab === 'vehicles' ? 'active' : ''}`}
          onClick={() => setActiveTab('vehicles')}
        >
          <i className="fas fa-car"></i> My Vehicles
        </div>
        <div 
          className={`dashboard-tab ${activeTab === 'earnings' ? 'active' : ''}`}
          onClick={() => setActiveTab('earnings')}
        >
          <i className="fas fa-dollar-sign"></i> Earnings
        </div>
        <div 
          className={`dashboard-tab ${activeTab === 'reviews' ? 'active' : ''}`}
          onClick={() => setActiveTab('reviews')}
        >
          <i className="fas fa-star"></i> Reviews
        </div>
      </div>

      {activeTab === 'bookings' && (
        <div className="tab-content">
          <table className="bookings-table">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Vehicle</th>
                <th>Renter</th>
                <th>Dates</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(booking => (
                <tr key={booking.id}>
                  <td>{booking.id}</td>
                  <td>{booking.vehicle}</td>
                  <td>{booking.renter}</td>
                  <td>{formatDate(booking.startDate)} - {formatDate(booking.endDate)}</td>
                  <td>{formatCurrency(booking.amount)}</td>
                  <td>
                    <span className={`booking-status ${booking.status}`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </td>
                  <td>
                    <Link to={`/bookings/${booking.id}`} className="view-booking-btn">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'vehicles' && (
        <div className="tab-content">
          <div className="vehicle-listings">
            {vehicles.map(vehicle => (
              <div key={vehicle.id} className="vehicle-card">
                <img 
                  src={vehicle.image || 'https://via.placeholder.com/300x180'} 
                  alt={`${vehicle.make} ${vehicle.model}`} 
                  className="vehicle-image"
                />
                <div className="vehicle-content">
                  <h3 className="vehicle-title">{vehicle.year} {vehicle.make} {vehicle.model}</h3>
                  <div className="vehicle-info">
                    <div className="vehicle-price">${vehicle.dailyRate}/day</div>
                    <div className={`vehicle-status ${vehicle.isAvailable ? 'available' : 'unavailable'}`}>
                      <i className={`fas fa-${vehicle.isAvailable ? 'check-circle' : 'times-circle'}`}></i>
                      {vehicle.isAvailable ? 'Available' : 'Unavailable'}
                    </div>
                  </div>
                  <div className="vehicle-metrics">
                    <div>{vehicle.totalBookings} bookings</div>
                    <div>{vehicle.avgRating} rating</div>
                  </div>
                  <div className="vehicle-actions">
                    <Link to={`/vehicles/edit/${vehicle.id}`} className="btn-edit-vehicle">
                      <i className="fas fa-edit"></i> Edit
                    </Link>
                    <Link to={`/vehicles/calendar/${vehicle.id}`} className="btn-manage-calendar">
                      <i className="fas fa-calendar-alt"></i> Calendar
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'earnings' && (
        <div className="tab-content">
          <div className="earnings-chart">
            {/* In a real app, you would render a chart here */}
            <div style={{ textAlign: 'center', padding: '120px 0', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
              <p>Monthly Earnings Chart (Last 6 Months)</p>
              <p>In a real app, this would show a chart using a library like Recharts</p>
            </div>
          </div>
          
          <div className="earnings-details">
            <div className="earnings-detail-card">
              <div className="earnings-detail-title">Total Earnings</div>
              <div className="earnings-detail-value">{formatCurrency(stats.totalEarnings)}</div>
            </div>
            <div className="earnings-detail-card">
              <div className="earnings-detail-title">This Month</div>
              <div className="earnings-detail-value">{formatCurrency(stats.monthlyEarnings)}</div>
            </div>
            <div className="earnings-detail-card">
              <div className="earnings-detail-title">Pending Payouts</div>
              <div className="earnings-detail-value">
                {formatCurrency(earnings.filter(e => e.status === 'pending').reduce((sum, e) => sum + e.amount, 0))}
              </div>
            </div>
          </div>
          
          <table className="earnings-table">
            <thead>
              <tr>
                <th>Payment ID</th>
                <th>Booking</th>
                <th>Vehicle</th>
                <th>Renter</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {earnings.map(earning => (
                <tr key={earning.id}>
                  <td>{earning.id}</td>
                  <td>{earning.bookingId}</td>
                  <td>{earning.vehicle}</td>
                  <td>{earning.renter}</td>
                  <td>{formatDate(earning.date)}</td>
                  <td>{formatCurrency(earning.amount)}</td>
                  <td>
                    <span className={`payment-status ${earning.status}`}>
                      {earning.status.charAt(0).toUpperCase() + earning.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'reviews' && (
        <div className="tab-content">
          <div className="reviews-list">
            {reviews.map(review => (
              <div key={review.id} className="review-card">
                <div className="review-header">
                  <div className="reviewer-info">
                    <img 
                      src={review.reviewerImage || 'https://via.placeholder.com/40x40'} 
                      alt={review.reviewer} 
                      className="reviewer-avatar"
                    />
                    <div>
                      <div className="reviewer-name">{review.reviewer}</div>
                      <div className="review-date">{formatDate(review.date)}</div>
                    </div>
                  </div>
                  {renderRating(review.rating)}
                </div>
                <div className="review-content">
                  {review.comment}
                </div>
                <div className="review-vehicle">
                  <img 
                    src={review.vehicleImage || 'https://via.placeholder.com/60x40'} 
                    alt={review.vehicleName} 
                    className="review-vehicle-image"
                  />
                  <div className="review-vehicle-name">{review.vehicleName}</div>
                </div>
                <div className="review-actions">
                  <button className="btn-reply">
                    <i className="fas fa-reply"></i> Reply to Review
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnerDashboard;