import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import VehicleGallery from './VehicleGallery';
// import BookingForm from './components/booking/BookingForm';
import BookingForm from '../../components/booking/BookingForm'
import './VehicleDetailsPage.css';

const VehicleDetailsPage = () => {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    // Fetch vehicle data (this would be an API call in a real app)
    fetchVehicleDetails(id);
    
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, [id]);

  const fetchVehicleDetails = (vehicleId) => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Mock data for a vehicle
      const vehicleData = {
        id: parseInt(vehicleId),
        make: 'Toyota',
        model: 'Fortuner',
        year: 2022,
        trim: 'LTD 4x4',
        color: 'Pearl White',
        dailyRate: 4500,
        weeklyRate: 28000,
        monthlyRate: 110000,
        securityDeposit: 10000,
        transmission: 'Automatic',
        fuelType: 'Diesel',
        seats: 7,
        doors: 5,
        mileage: 15000,
        licensePlate: 'ABC 1234',
        location: 'Makati City',
        owner: {
          id: 101,
          name: 'John Dela Cruz',
          joinedDate: 'January 2022',
          responseRate: 98,
          responseTime: '< 1 hour',
          rating: 4.9,
          reviewCount: 42,
          profileImage: '/images/users/owner-1.jpg',
          verified: true
        },
        rating: 4.8,
        reviewCount: 27,
        description: `This Toyota Fortuner 2022 is the perfect SUV for your adventures in the Philippines. It's spacious, comfortable, and reliable for both city driving and long road trips.

The vehicle features a powerful 2.8L diesel engine with automatic transmission, providing excellent performance while maintaining good fuel efficiency.

Equipped with 7 seats, it's ideal for family trips or group travels. The interiors are in excellent condition with leather seats and the latest technology features.`,
        features: [
          'Bluetooth',
          'USB Charging Ports',
          'Backup Camera',
          'GPS Navigation',
          'Leather Seats',
          'Sunroof',
          'Cruise Control',
          'Apple CarPlay',
          'Android Auto',
          '4x4 Capability'
        ],
        rules: [
          'No smoking in the vehicle',
          'No pets allowed',
          'Return with same fuel level',
          'Clean the vehicle before returning'
        ],
        guidelines: `Please take care of the vehicle as if it were your own. The car should be returned in the same condition as received.

For pick-up and drop-off, I'm flexible with location within Makati and BGC area. For other locations, we can discuss.

Please note that the car is equipped with a GPS tracker for security purposes.`,
        images: [
          {
            id: 1,
            url: '/images/cars/fortuner-1.jpg',
            type: 'exterior',
            isPrimary: true
          },
          {
            id: 2,
            url: '/images/cars/fortuner-2.jpg',
            type: 'exterior'
          },
          {
            id: 3,
            url: '/images/cars/fortuner-3.jpg',
            type: 'interior'
          },
          {
            id: 4,
            url: '/images/cars/fortuner-4.jpg',
            type: 'interior'
          },
          {
            id: 5,
            url: '/images/cars/fortuner-5.jpg',
            type: 'exterior'
          }
        ],
        reviews: [
          {
            id: 1,
            user: {
              name: 'Maria Santos',
              image: '/images/users/user-1.jpg'
            },
            rating: 5,
            date: 'March 12, 2025',
            comment: 'Excellent vehicle! Very clean and well-maintained. John was a great host, very responsive and flexible with pickup and return. Would definitely rent again.'
          },
          {
            id: 2,
            user: {
              name: 'Paolo Reyes',
              image: '/images/users/user-2.jpg'
            },
            rating: 4,
            date: 'February 28, 2025',
            comment: 'The Fortuner was perfect for our Tagaytay trip. Powerful on the hills and very comfortable. Only thing to note is that the GPS was a bit outdated, but we used our phones instead. Overall great experience.'
          },
          {
            id: 3,
            user: {
              name: 'Jennifer Cruz',
              image: '/images/users/user-3.jpg'
            },
            rating: 5,
            date: 'February 15, 2025',
            comment: 'This was my first time using Drively and I couldn\'t be happier. The car was in immaculate condition and drove so smoothly. John explained everything clearly and was very accommodating with our schedule.'
          }
        ],
        similarVehicles: [
          {
            id: 5,
            make: 'Ford',
            model: 'Everest',
            year: 2022,
            dailyRate: 4500,
            transmission: 'Automatic',
            fuelType: 'Diesel',
            seats: 7,
            location: 'Makati City',
            rating: 4.8,
            reviewCount: 27,
            imageUrl: '/images/cars/ford-everest.jpg'
          },
          {
            id: 8,
            make: 'Nissan',
            model: 'Terra',
            year: 2022,
            dailyRate: 4200,
            transmission: 'Automatic',
            fuelType: 'Diesel',
            seats: 7,
            location: 'Alabang',
            rating: 4.6,
            reviewCount: 14,
            imageUrl: '/images/cars/nissan-terra.jpg'
          },
          {
            id: 3,
            make: 'Mitsubishi',
            model: 'Montero Sport',
            year: 2021,
            dailyRate: 4200,
            transmission: 'Automatic',
            fuelType: 'Diesel',
            seats: 7,
            location: 'Taguig City',
            rating: 4.9,
            reviewCount: 32,
            imageUrl: '/images/cars/montero-sport.jpg'
          }
        ]
      };
      
      setVehicle(vehicleData);
      setLoading(false);
    }, 1000);
  };

  // Function to render stars based on rating
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={`full-${i}`} className="fas fa-star"></i>);
    }
    
    // Add half star if needed
    if (hasHalfStar) {
      stars.push(<i key="half" className="fas fa-star-half-alt"></i>);
    }
    
    // Add empty stars to complete 5 stars
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<i key={`empty-${i}`} className="far fa-star"></i>);
    }
    
    return stars;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading vehicle details...</p>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="not-found-container">
        <h2>Vehicle Not Found</h2>
        <p>The vehicle you're looking for doesn't exist or has been removed.</p>
        <Link to="/search" className="btn btn-primary">Browse Other Vehicles</Link>
      </div>
    );
  }

  return (
    <div className="vehicle-details-page">
      {/* Breadcrumbs */}
      <div className="breadcrumbs">
        <div className="container">
          <ul className="breadcrumb-list">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/search">Search</Link></li>
            <li>{vehicle.year} {vehicle.make} {vehicle.model}</li>
          </ul>
        </div>
      </div>
      
      {/* Vehicle Header */}
      <div className="vehicle-header">
        <div className="container">
          <h1 className="vehicle-title">{vehicle.year} {vehicle.make} {vehicle.model} {vehicle.trim}</h1>
          
          <div className="vehicle-subtitle">
            <div className="vehicle-rating">
              <div className="stars">{renderStars(vehicle.rating)}</div>
              <span className="rating-text">
                {vehicle.rating.toFixed(1)} ({vehicle.reviewCount} {vehicle.reviewCount === 1 ? 'review' : 'reviews'})
              </span>
            </div>
            <div className="vehicle-location">
              <i className="fas fa-map-marker-alt"></i>
              <span>{vehicle.location}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="vehicle-content">
        <div className="container">
          <div className="vehicle-details-grid">
            <div className="vehicle-details-main">
              {/* Vehicle Gallery */}
              <VehicleGallery images={vehicle.images} />
              
              {/* Vehicle Tabs */}
              <div className="vehicle-tabs">
                <div className="tabs-header">
                  <button 
                    className={`tab-btn ${activeTab === 'description' ? 'active' : ''}`}
                    onClick={() => setActiveTab('description')}
                  >
                    Description
                  </button>
                  <button 
                    className={`tab-btn ${activeTab === 'features' ? 'active' : ''}`}
                    onClick={() => setActiveTab('features')}
                  >
                    Features
                  </button>
                  <button 
                    className={`tab-btn ${activeTab === 'rules' ? 'active' : ''}`}
                    onClick={() => setActiveTab('rules')}
                  >
                    Rules & Guidelines
                  </button>
                  <button 
                    className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
                    onClick={() => setActiveTab('reviews')}
                  >
                    Reviews ({vehicle.reviewCount})
                  </button>
                </div>
                
                <div className="tabs-content">
                  {/* Description Tab */}
                  <div className={`tab-panel ${activeTab === 'description' ? 'active' : ''}`}>
                    <h3 className="tab-title">About this {vehicle.make} {vehicle.model}</h3>
                    <p className="vehicle-description">{vehicle.description}</p>
                    
                    <div className="vehicle-specs">
                      <div className="spec-item">
                        <div className="spec-icon">
                          <i className="fas fa-cog"></i>
                        </div>
                        <div className="spec-content">
                          <h4 className="spec-title">Transmission</h4>
                          <p className="spec-value">{vehicle.transmission}</p>
                        </div>
                      </div>
                      
                      <div className="spec-item">
                        <div className="spec-icon">
                          <i className="fas fa-gas-pump"></i>
                        </div>
                        <div className="spec-content">
                          <h4 className="spec-title">Fuel Type</h4>
                          <p className="spec-value">{vehicle.fuelType}</p>
                        </div>
                      </div>
                      
                      <div className="spec-item">
                        <div className="spec-icon">
                          <i className="fas fa-users"></i>
                        </div>
                        <div className="spec-content">
                          <h4 className="spec-title">Seats</h4>
                          <p className="spec-value">{vehicle.seats}</p>
                        </div>
                      </div>
                      
                      <div className="spec-item">
                        <div className="spec-icon">
                          <i className="fas fa-door-open"></i>
                        </div>
                        <div className="spec-content">
                          <h4 className="spec-title">Doors</h4>
                          <p className="spec-value">{vehicle.doors}</p>
                        </div>
                      </div>
                      
                      <div className="spec-item">
                        <div className="spec-icon">
                          <i className="fas fa-tachometer-alt"></i>
                        </div>
                        <div className="spec-content">
                          <h4 className="spec-title">Mileage</h4>
                          <p className="spec-value">{vehicle.mileage.toLocaleString()} km</p>
                        </div>
                      </div>
                      
                      <div className="spec-item">
                        <div className="spec-icon">
                          <i className="fas fa-palette"></i>
                        </div>
                        <div className="spec-content">
                          <h4 className="spec-title">Color</h4>
                          <p className="spec-value">{vehicle.color}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Features Tab */}
                  <div className={`tab-panel ${activeTab === 'features' ? 'active' : ''}`}>
                    <h3 className="tab-title">Vehicle Features</h3>
                    <div className="features-grid">
                      {vehicle.features.map((feature, index) => (
                        <div key={index} className="feature-item">
                          <i className="fas fa-check"></i>
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Rules Tab */}
                  <div className={`tab-panel ${activeTab === 'rules' ? 'active' : ''}`}>
                    <h3 className="tab-title">Rules</h3>
                    <ul className="rules-list">
                      {vehicle.rules.map((rule, index) => (
                        <li key={index} className="rule-item">
                          <i className="fas fa-exclamation-circle"></i>
                          <span>{rule}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <h3 className="tab-title">Guidelines</h3>
                    <p className="guidelines-text">{vehicle.guidelines}</p>
                  </div>
                  
                  {/* Reviews Tab */}
                  <div className={`tab-panel ${activeTab === 'reviews' ? 'active' : ''}`}>
                    <h3 className="tab-title">Reviews ({vehicle.reviewCount})</h3>
                    <div className="reviews-list">
                      {vehicle.reviews.map(review => (
                        <div key={review.id} className="review-item">
                          <div className="review-header">
                            <div className="reviewer-info">
                              <img src={review.user.image} alt={review.user.name} className="reviewer-image" />
                              <div className="reviewer-details">
                                <h4 className="reviewer-name">{review.user.name}</h4>
                                <p className="review-date">{review.date}</p>
                              </div>
                            </div>
                            <div className="review-rating">
                              <div className="stars">{renderStars(review.rating)}</div>
                            </div>
                          </div>
                          <p className="review-comment">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                    
                    <div className="view-all-reviews">
                      <button className="view-all-btn">View All Reviews</button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Owner Info */}
              <div className="owner-info">
                <h3 className="section-title">About the Owner</h3>
                <div className="owner-card">
                  <div className="owner-header">
                    <div className="owner-profile">
                      <img src={vehicle.owner.profileImage} alt={vehicle.owner.name} className="owner-image" />
                      <div className="owner-details">
                        <h4 className="owner-name">
                          {vehicle.owner.name}
                          {vehicle.owner.verified && (
                            <span className="verified-badge">
                              <i className="fas fa-check-circle"></i>
                            </span>
                          )}
                        </h4>
                        <p className="owner-joined">Joined {vehicle.owner.joinedDate}</p>
                      </div>
                    </div>
                    <div className="owner-rating">
                      <div className="stars">{renderStars(vehicle.owner.rating)}</div>
                      <span className="rating-count">{vehicle.owner.reviewCount} reviews</span>
                    </div>
                  </div>
                  <div className="owner-stats">
                    <div className="stat-item">
                      <span className="stat-value">{vehicle.owner.responseRate}%</span>
                      <span className="stat-label">Response Rate</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-value">{vehicle.owner.responseTime}</span>
                      <span className="stat-label">Response Time</span>
                    </div>
                  </div>
                  <button className="contact-host-btn">
                    <i className="fas fa-comment"></i>
                    Contact Host
                  </button>
                </div>
              </div>
              
              {/* Similar Vehicles */}
              <div className="similar-vehicles">
                <h3 className="section-title">Similar Vehicles</h3>
                <div className="similar-vehicles-grid">
                  {vehicle.similarVehicles.map(similarVehicle => (
                    <div key={similarVehicle.id} className="similar-vehicle-card">
                      <div className="similar-vehicle-image">
                        <img src={similarVehicle.imageUrl} alt={`${similarVehicle.year} ${similarVehicle.make} ${similarVehicle.model}`} />
                      </div>
                      <div className="similar-vehicle-content">
                        <h4 className="similar-vehicle-title">
                          {similarVehicle.year} {similarVehicle.make} {similarVehicle.model}
                        </h4>
                        <div className="similar-vehicle-price">₱{similarVehicle.dailyRate.toLocaleString()}/day</div>
                        <Link to={`/vehicles/${similarVehicle.id}`} className="view-details-btn">
                          View Details
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Booking Sidebar */}
            <div className="vehicle-details-sidebar">
              <div className="booking-card">
                <div className="booking-card-header">
                  <div className="daily-rate">
                    <span className="rate-amount">₱{vehicle.dailyRate.toLocaleString()}</span>
                    <span className="rate-period">/ day</span>
                  </div>
                  <div className="booking-rating">
                    <div className="stars">{renderStars(vehicle.rating)}</div>
                    <span className="rating-count">{vehicle.reviewCount}</span>
                  </div>
                </div>
                
                <BookingForm vehicleId={vehicle.id} dailyRate={vehicle.dailyRate} securityDeposit={vehicle.securityDeposit} />
                
                <div className="rate-details">
                  <div className="rate-item">
                    <span className="rate-item-label">Weekly rate</span>
                    <span className="rate-item-value">₱{vehicle.weeklyRate.toLocaleString()}</span>
                  </div>
                  <div className="rate-item">
                    <span className="rate-item-label">Monthly rate</span>
                    <span className="rate-item-value">₱{vehicle.monthlyRate.toLocaleString()}</span>
                  </div>
                  <div className="rate-item">
                    <span className="rate-item-label">Security deposit</span>
                    <span className="rate-item-value">₱{vehicle.securityDeposit.toLocaleString()}</span>
                  </div>
                </div>
              </div>
              
              <div className="share-card">
                <h4 className="share-title">Share this vehicle</h4>
                <div className="share-buttons">
                  <button className="share-btn facebook">
                    <i className="fab fa-facebook-f"></i>
                  </button>
                  <button className="share-btn twitter">
                    <i className="fab fa-twitter"></i>
                  </button>
                  <button className="share-btn whatsapp">
                    <i className="fab fa-whatsapp"></i>
                  </button>
                  <button className="share-btn telegram">
                    <i className="fab fa-telegram-plane"></i>
                  </button>
                  <button className="share-btn link">
                    <i className="fas fa-link"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetailsPage;