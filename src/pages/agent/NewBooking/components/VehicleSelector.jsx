import React from 'react';
import useBooking from '../hooks/useBooking';
import { vehicleTypeOptions, transmissionOptions, seatsOptions, locationOptions } from '../data/mockData';

const VehicleSelector = () => {
  const { 
    isLoading,
    filteredVehicles, 
    vehicleFilters,
    handleVehicleFilterChange,
    handlePriceRangeChange,
    setSelectedVehicle,
    setCurrentStep,
    formatCurrency
  } = useBooking();

  const handleSelectVehicle = (vehicle) => {
    setSelectedVehicle(vehicle);
    setCurrentStep(2);
  };

  return (
    <div className="vehicle-search">
      <h3>Select Vehicle</h3>
      
      <div className="vehicle-filters">
        <div className="filter-group">
          <label>Vehicle Type</label>
          <select 
            name="vehicleType"
            value={vehicleFilters.vehicleType}
            onChange={handleVehicleFilterChange}
          >
            {vehicleTypeOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        
        <div className="filter-group">
          <label>Price Range</label>
          <div className="price-range">
            <input 
              type="number" 
              name="minPrice" 
              value={vehicleFilters.priceRange[0]} 
              onChange={handlePriceRangeChange} 
              min="0" 
              max="500"
            />
            <span>to</span>
            <input 
              type="number" 
              name="maxPrice" 
              value={vehicleFilters.priceRange[1]} 
              onChange={handlePriceRangeChange} 
              min="0" 
              max="500"
            />
          </div>
        </div>
        
        <div className="filter-group">
          <label>Transmission</label>
          <select 
            name="transmission"
            value={vehicleFilters.transmission}
            onChange={handleVehicleFilterChange}
          >
            {transmissionOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        
        <div className="filter-group">
          <label>Min. Seats</label>
          <select 
            name="seats"
            value={vehicleFilters.seats}
            onChange={handleVehicleFilterChange}
          >
            {seatsOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        
        <div className="filter-group">
          <label>Location</label>
          <select 
            name="location"
            value={vehicleFilters.location}
            onChange={handleVehicleFilterChange}
          >
            <option value="">All Locations</option>
            {locationOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="vehicle-grid">
        {isLoading ? (
          <div className="loading">Loading vehicles...</div>
        ) : filteredVehicles.length > 0 ? (
          filteredVehicles.map(vehicle => (
            <div 
              key={vehicle.vehicle_id} 
              className="vehicle-card"
              onClick={() => handleSelectVehicle(vehicle)}
            >
              <div className="vehicle-image">
                <img 
                  src={vehicle.image_url || "/assets/images/default-car.png"} 
                  alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`} 
                />
              </div>
              <div className="vehicle-info">
                <div className="vehicle-name">
                  {vehicle.year} {vehicle.make} {vehicle.model}
                </div>
                <div className="vehicle-type">{vehicle.vehicle_type}</div>
                <div className="vehicle-specs">
                  <span><i className="fas fa-cog"></i> {vehicle.transmission}</span>
                  <span><i className="fas fa-gas-pump"></i> {vehicle.fuel_type}</span>
                  <span><i className="fas fa-user"></i> {vehicle.seats} seats</span>
                </div>
                <div className="vehicle-price">
                  <span className="price">{formatCurrency(vehicle.daily_rate)}</span> 
                  <span className="per-day">per day</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-vehicles">
            <p>No vehicles found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VehicleSelector;
