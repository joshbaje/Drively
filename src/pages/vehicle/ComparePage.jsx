import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import '../../components/vehicle/Comparison/CompareStyles.css';

const ComparePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    // Get vehicles from location state or redirect if none
    if (location.state?.vehicles && location.state.vehicles.length >= 2) {
      setVehicles(location.state.vehicles);
    } else {
      // If no vehicles in state, try to get from local storage
      const storedVehicles = localStorage.getItem('compareVehicles');
      if (storedVehicles) {
        const parsedVehicles = JSON.parse(storedVehicles);
        if (parsedVehicles.length >= 2) {
          setVehicles(parsedVehicles);
          return;
        }
      }
      
      // If still no vehicles, redirect to search page
      navigate('/search', { 
        state: { 
          message: 'Please select at least 2 vehicles to compare.' 
        } 
      });
    }
  }, [location, navigate]);

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
    
    return (
      <div className="compare-car-rating">
        {stars} <span>({rating})</span>
      </div>
    );
  };

  // Feature display helper
  const renderFeature = (feature) => {
    if (feature === true || feature === 'Yes') {
      return <span className="compare-feature available"><i className="fas fa-check"></i> Yes</span>;
    } else if (feature === false || feature === 'No') {
      return <span className="compare-feature unavailable"><i className="fas fa-times"></i> No</span>;
    }
    return feature;
  };

  return (
    <div className="compare-page">
      <div className="compare-page-header">
        <h1>Compare Vehicles</h1>
        <p>Compare features and specifications to find the perfect car for your needs.</p>
      </div>

      {vehicles.length >= 2 && (
        <table className="compare-table">
          <tbody>
            {/* Vehicle Images and Basic Info */}
            <tr>
              <th>Vehicle</th>
              {vehicles.map(vehicle => (
                <td key={vehicle.vehicle_id} className="compare-car-header">
                  <img 
                    src={vehicle.image_url || 'https://via.placeholder.com/350x200'} 
                    alt={`${vehicle.make} ${vehicle.model}`} 
                    className="compare-car-image"
                  />
                  <div className="compare-car-info">
                    <h3 className="compare-car-name">{vehicle.make} {vehicle.model}</h3>
                    <p className="compare-car-year">{vehicle.year}</p>
                    <p className="compare-car-price">${vehicle.daily_rate}/day</p>
                    {renderRating(vehicle.avg_rating || 4.5)}
                    <Link to={`/vehicles/${vehicle.vehicle_id}`} className="compare-car-book">View Details</Link>
                  </div>
                </td>
              ))}
            </tr>

            {/* Pricing */}
            <tr className="compare-category">
              <th colSpan={vehicles.length + 1}>Pricing</th>
            </tr>
            <tr>
              <th>Daily Rate</th>
              {vehicles.map(vehicle => (
                <td key={vehicle.vehicle_id}>${vehicle.daily_rate}/day</td>
              ))}
            </tr>
            <tr>
              <th>Weekly Rate</th>
              {vehicles.map(vehicle => (
                <td key={vehicle.vehicle_id}>${vehicle.weekly_rate || (vehicle.daily_rate * 6.5).toFixed(2)}/week</td>
              ))}
            </tr>
            <tr>
              <th>Monthly Rate</th>
              {vehicles.map(vehicle => (
                <td key={vehicle.vehicle_id}>${vehicle.monthly_rate || (vehicle.daily_rate * 26).toFixed(2)}/month</td>
              ))}
            </tr>
            <tr>
              <th>Security Deposit</th>
              {vehicles.map(vehicle => (
                <td key={vehicle.vehicle_id}>${vehicle.security_deposit}</td>
              ))}
            </tr>

            {/* Basic Specifications */}
            <tr className="compare-category">
              <th colSpan={vehicles.length + 1}>Specifications</th>
            </tr>
            <tr>
              <th>Vehicle Type</th>
              {vehicles.map(vehicle => (
                <td key={vehicle.vehicle_id}>{vehicle.vehicle_type}</td>
              ))}
            </tr>
            <tr className="highlight">
              <th>Transmission</th>
              {vehicles.map(vehicle => (
                <td key={vehicle.vehicle_id}>{vehicle.transmission}</td>
              ))}
            </tr>
            <tr>
              <th>Fuel Type</th>
              {vehicles.map(vehicle => (
                <td key={vehicle.vehicle_id}>{vehicle.fuel_type}</td>
              ))}
            </tr>
            <tr className="highlight">
              <th>Seats</th>
              {vehicles.map(vehicle => (
                <td key={vehicle.vehicle_id}>{vehicle.seats}</td>
              ))}
            </tr>
            <tr>
              <th>Doors</th>
              {vehicles.map(vehicle => (
                <td key={vehicle.vehicle_id}>{vehicle.doors}</td>
              ))}
            </tr>
            <tr className="highlight">
              <th>Mileage</th>
              {vehicles.map(vehicle => (
                <td key={vehicle.vehicle_id}>{vehicle.mileage.toLocaleString()} km</td>
              ))}
            </tr>

            {/* Features */}
            <tr className="compare-category">
              <th colSpan={vehicles.length + 1}>Features</th>
            </tr>
            <tr>
              <th>Air Conditioning</th>
              {vehicles.map(vehicle => (
                <td key={vehicle.vehicle_id}>
                  {renderFeature(vehicle.features?.includes('Air Conditioning') || true)}
                </td>
              ))}
            </tr>
            <tr className="highlight">
              <th>Bluetooth</th>
              {vehicles.map(vehicle => (
                <td key={vehicle.vehicle_id}>
                  {renderFeature(vehicle.features?.includes('Bluetooth') || true)}
                </td>
              ))}
            </tr>
            <tr>
              <th>Navigation System</th>
              {vehicles.map(vehicle => (
                <td key={vehicle.vehicle_id}>
                  {renderFeature(vehicle.features?.includes('Navigation System') || Math.random() > 0.5)}
                </td>
              ))}
            </tr>
            <tr className="highlight">
              <th>Backup Camera</th>
              {vehicles.map(vehicle => (
                <td key={vehicle.vehicle_id}>
                  {renderFeature(vehicle.features?.includes('Backup Camera') || Math.random() > 0.3)}
                </td>
              ))}
            </tr>
            <tr>
              <th>Sunroof</th>
              {vehicles.map(vehicle => (
                <td key={vehicle.vehicle_id}>
                  {renderFeature(vehicle.features?.includes('Sunroof') || Math.random() > 0.7)}
                </td>
              ))}
            </tr>
            <tr className="highlight">
              <th>USB Charging</th>
              {vehicles.map(vehicle => (
                <td key={vehicle.vehicle_id}>
                  {renderFeature(vehicle.features?.includes('USB Charging') || true)}
                </td>
              ))}
            </tr>
            
            {/* Rental Terms */}
            <tr className="compare-category">
              <th colSpan={vehicles.length + 1}>Rental Terms</th>
            </tr>
            <tr>
              <th>Min. Rental Duration</th>
              {vehicles.map(vehicle => (
                <td key={vehicle.vehicle_id}>{vehicle.min_rental_duration} day(s)</td>
              ))}
            </tr>
            <tr className="highlight">
              <th>Max. Rental Duration</th>
              {vehicles.map(vehicle => (
                <td key={vehicle.vehicle_id}>{vehicle.max_rental_duration || 30} day(s)</td>
              ))}
            </tr>
            <tr>
              <th>Insurance Options</th>
              {vehicles.map(vehicle => (
                <td key={vehicle.vehicle_id}>Basic, Premium</td>
              ))}
            </tr>
            <tr className="highlight">
              <th>Free Cancellation</th>
              {vehicles.map(vehicle => (
                <td key={vehicle.vehicle_id}>Up to 48 hours before pickup</td>
              ))}
            </tr>
            
            {/* Owner Info */}
            <tr className="compare-category">
              <th colSpan={vehicles.length + 1}>Owner Information</th>
            </tr>
            <tr>
              <th>Owner Rating</th>
              {vehicles.map(vehicle => (
                <td key={vehicle.vehicle_id}>{renderRating(4.7)}</td>
              ))}
            </tr>
            <tr className="highlight">
              <th>Response Rate</th>
              {vehicles.map(vehicle => (
                <td key={vehicle.vehicle_id}>{Math.floor(85 + Math.random() * 15)}%</td>
              ))}
            </tr>
            <tr>
              <th>Response Time</th>
              {vehicles.map(vehicle => (
                <td key={vehicle.vehicle_id}>Within {Math.floor(1 + Math.random() * 3)} hour(s)</td>
              ))}
            </tr>
          </tbody>
        </table>
      )}
      
      <div className="compare-page-actions">
        <button className="btn-back" onClick={() => navigate(-1)}>
          <i className="fas fa-arrow-left"></i> Back to Search
        </button>
      </div>
    </div>
  );
};

export default ComparePage;