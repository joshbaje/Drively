import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

// We'll create these components later
import VehicleSearchForm from '../components/vehicle/VehicleSearchForm';
import VehicleCard from '../components/vehicle/VehicleCard';

const HomePage = () => {
  // Mock featured vehicles
  const featuredVehicles = [
    {
      id: 1,
      make: 'Toyota',
      model: 'Vios',
      year: 2023,
      dailyRate: 2500,
      transmission: 'Automatic',
      fuelType: 'Gasoline',
      seats: 5,
      location: 'Makati City',
      rating: 4.8,
      reviewCount: 24,
      imageUrl: '/images/cars/toyota-vios.jpg'
    },
    {
      id: 2,
      make: 'Honda',
      model: 'City',
      year: 2022,
      dailyRate: 2800,
      transmission: 'Automatic',
      fuelType: 'Gasoline',
      seats: 5,
      location: 'Quezon City',
      rating: 4.7,
      reviewCount: 19,
      imageUrl: '/images/cars/honda-city.jpg'
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
    },
    {
      id: 4,
      make: 'Kia',
      model: 'Seltos',
      year: 2023,
      dailyRate: 3500,
      transmission: 'Automatic',
      fuelType: 'Gasoline',
      seats: 5,
      location: 'Pasig City',
      rating: 4.6,
      reviewCount: 15,
      imageUrl: '/images/cars/kia-seltos.jpg'
    }
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">Find the perfect car for your next adventure</h1>
            <p className="hero-subtitle">
              Drivelyph connects car owners with renters for a seamless rental experience.
              Choose from a variety of vehicles at competitive prices.
            </p>
            
            <div className="hero-search">
              <VehicleSearchForm />
            </div>
          </div>
          
          <div className="hero-image">
            <img src="/images/hero-car.png" alt="Rental car" />
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="how-it-works">
        <div className="container">
          <h2 className="section-title">How Drivelyph Works</h2>
          
          <div className="steps">
            <div className="step">
              <div className="step-icon">
                <img src="/images/icons/search.svg" alt="Search icon" />
              </div>
              <h3 className="step-title">Search</h3>
              <p className="step-description">
                Choose from a wide selection of cars by location, dates, and preferences.
              </p>
            </div>
            
            <div className="step">
              <div className="step-icon">
                <img src="/images/icons/book.svg" alt="Book icon" />
              </div>
              <h3 className="step-title">Book</h3>
              <p className="step-description">
                Book your desired vehicle with our easy and secure payment system.
              </p>
            </div>
            
            <div className="step">
              <div className="step-icon">
                <img src="/images/icons/drive.svg" alt="Drive icon" />
              </div>
              <h3 className="step-title">Drive</h3>
              <p className="step-description">
                Pick up the car and enjoy your journey with full confidence.
              </p>
            </div>
          </div>
          
          <div className="cta-buttons">
            <Link to="/search" className="btn btn-primary">Find a Car</Link>
            <Link to="/list-your-car" className="btn btn-secondary">List Your Car</Link>
          </div>
        </div>
      </section>
      
      {/* Featured Vehicles Section */}
      <section className="featured-vehicles">
        <div className="container">
          <h2 className="section-title">Featured Vehicles</h2>
          <p className="section-subtitle">Discover our top-rated vehicles chosen by our community</p>
          
          <div className="vehicle-grid">
            {featuredVehicles.map(vehicle => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
          
          <div className="view-all-link">
            <Link to="/search" className="btn btn-outline">View All Vehicles</Link>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="testimonials">
        <div className="container">
          <h2 className="section-title">What Our Users Say</h2>
          
          <div className="testimonial-slider">
            <div className="testimonial">
              <div className="testimonial-content">
                <p>"Drivelyph made my trip to Tagaytay so easy! The car was in pristine condition and the owner was very accommodating. Will definitely use again!"</p>
              </div>
              <div className="testimonial-author">
                <img src="/images/users/user-1.jpg" alt="User" className="testimonial-author-image" />
                <div className="testimonial-author-info">
                  <p className="testimonial-author-name">Maria Santos</p>
                  <p className="testimonial-author-title">Verified Renter</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Become a Host Section */}
      <section className="become-host">
        <div className="container">
          <div className="become-host-grid">
            <div className="become-host-content">
              <h2 className="become-host-title">Earn extra income by sharing your car</h2>
              <p className="become-host-description">
                Turn your car into a source of income when you're not using it. With Drivelyph, 
                you can list your vehicle on our secure platform and start earning right away.
              </p>
              <ul className="become-host-benefits">
                <li>Flexible scheduling</li>
                <li>Secure payment system</li>
                <li>Insurance coverage</li>
                <li>24/7 customer support</li>
              </ul>
              <Link to="/become-a-host" className="btn btn-primary">Start Hosting</Link>
            </div>
            <div className="become-host-image">
              <img src="/images/car-owner.jpg" alt="Car owner with keys" />
            </div>
          </div>
        </div>
      </section>
      
      {/* Download App Section */}
      <section className="download-app">
        <div className="container">
          <div className="download-app-grid">
            <div className="download-app-content">
              <h2 className="download-app-title">Take Drivelyph with you</h2>
              <p className="download-app-description">
                Download our mobile app for a seamless experience on the go. Book cars, 
                manage rentals, and stay connected with our community.
              </p>
              <div className="download-app-buttons">
                <a href="#" className="download-app-button">
                  <img src="/images/icons/app-store.svg" alt="App Store" />
                </a>
                <a href="#" className="download-app-button">
                  <img src="/images/icons/google-play.svg" alt="Google Play" />
                </a>
              </div>
            </div>
            <div className="download-app-image">
              <img src="/images/mobile-app.png" alt="Drivelyph mobile app" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;