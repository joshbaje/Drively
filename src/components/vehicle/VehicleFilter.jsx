import React, { useState } from 'react';
import './VehicleFilter.css';

const VehicleFilter = ({ filters, onFilterChange, availableFilters }) => {
  const [isExpanded, setIsExpanded] = useState({
    price: true,
    vehicleType: true,
    fuelType: true,
    transmission: true,
    features: true
  });

  // Handle checkbox changes for array-based filters
  const handleCheckboxChange = (filterKey, value) => {
    const updatedFilters = { ...filters };
    
    if (updatedFilters[filterKey].includes(value)) {
      updatedFilters[filterKey] = updatedFilters[filterKey].filter(item => item !== value);
    } else {
      updatedFilters[filterKey] = [...updatedFilters[filterKey], value];
    }
    
    onFilterChange(updatedFilters);
  };
  
  // Handle price range change
  const handlePriceChange = (index, value) => {
    const newPriceRange = [...filters.priceRange];
    newPriceRange[index] = parseInt(value);
    
    // Ensure min <= max
    if (index === 0 && newPriceRange[0] > newPriceRange[1]) {
      newPriceRange[0] = newPriceRange[1];
    } else if (index === 1 && newPriceRange[1] < newPriceRange[0]) {
      newPriceRange[1] = newPriceRange[0];
    }
    
    onFilterChange({
      ...filters,
      priceRange: newPriceRange
    });
  };
  
  // Toggle section expansion
  const toggleSection = (section) => {
    setIsExpanded({
      ...isExpanded,
      [section]: !isExpanded[section]
    });
  };
  
  // Calculate percentage for price range slider
  const calculatePercentage = (value, min, max) => {
    return ((value - min) / (max - min)) * 100;
  };

  return (
    <div className="vehicle-filter">
      <div className="filter-header">
        <h2 className="filter-title">Filters</h2>
        <button className="clear-filters-btn" onClick={() => onFilterChange({
          priceRange: [0, 10000],
          vehicleTypes: [],
          fuelTypes: [],
          transmission: [],
          features: []
        })}>
          Clear All
        </button>
      </div>
      
      {/* Price Range Filter */}
      <div className="filter-section">
        <div className="filter-section-header" onClick={() => toggleSection('price')}>
          <h3 className="filter-section-title">Price Range</h3>
          <i className={`fas fa-chevron-${isExpanded.price ? 'up' : 'down'}`}></i>
        </div>
        
        {isExpanded.price && (
          <div className="filter-section-content">
            <div className="price-range-slider">
              <div className="range-slider-track">
                <div 
                  className="range-slider-fill" 
                  style={{
                    left: `${calculatePercentage(filters.priceRange[0], 0, 10000)}%`,
                    width: `${calculatePercentage(filters.priceRange[1], 0, 10000) - calculatePercentage(filters.priceRange[0], 0, 10000)}%`
                  }}
                ></div>
              </div>
              <input 
                type="range" 
                min="0" 
                max="10000" 
                value={filters.priceRange[0]} 
                onChange={(e) => handlePriceChange(0, e.target.value)} 
                className="range-slider-thumb range-slider-thumb-left"
              />
              <input 
                type="range" 
                min="0" 
                max="10000" 
                value={filters.priceRange[1]} 
                onChange={(e) => handlePriceChange(1, e.target.value)} 
                className="range-slider-thumb range-slider-thumb-right"
              />
            </div>
            
            <div className="price-range-inputs">
              <div className="price-input-group">
                <span className="price-currency">₱</span>
                <input 
                  type="number" 
                  value={filters.priceRange[0]} 
                  onChange={(e) => handlePriceChange(0, e.target.value)} 
                  min="0" 
                  max={filters.priceRange[1]} 
                  className="price-input"
                />
              </div>
              <span className="price-range-separator">-</span>
              <div className="price-input-group">
                <span className="price-currency">₱</span>
                <input 
                  type="number" 
                  value={filters.priceRange[1]} 
                  onChange={(e) => handlePriceChange(1, e.target.value)} 
                  min={filters.priceRange[0]} 
                  max="10000" 
                  className="price-input"
                />
              </div>
              <span className="price-period">/day</span>
            </div>
          </div>
        )}
      </div>
      
      {/* Vehicle Type Filter */}
      <div className="filter-section">
        <div className="filter-section-header" onClick={() => toggleSection('vehicleType')}>
          <h3 className="filter-section-title">Vehicle Type</h3>
          <i className={`fas fa-chevron-${isExpanded.vehicleType ? 'up' : 'down'}`}></i>
        </div>
        
        {isExpanded.vehicleType && (
          <div className="filter-section-content">
            <div className="filter-options">
              {['sedan', 'suv', 'truck', 'convertible', 'van'].map(type => (
                <label key={type} className="filter-option">
                  <input 
                    type="checkbox" 
                    checked={filters.vehicleTypes.includes(type)} 
                    onChange={() => handleCheckboxChange('vehicleTypes', type)} 
                  />
                  <span className="filter-checkbox"></span>
                  <span className="filter-option-label">{type.charAt(0).toUpperCase() + type.slice(1)}</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Fuel Type Filter */}
      <div className="filter-section">
        <div className="filter-section-header" onClick={() => toggleSection('fuelType')}>
          <h3 className="filter-section-title">Fuel Type</h3>
          <i className={`fas fa-chevron-${isExpanded.fuelType ? 'up' : 'down'}`}></i>
        </div>
        
        {isExpanded.fuelType && (
          <div className="filter-section-content">
            <div className="filter-options">
              {availableFilters.fuelTypes.map(type => (
                <label key={type} className="filter-option">
                  <input 
                    type="checkbox" 
                    checked={filters.fuelTypes.includes(type)} 
                    onChange={() => handleCheckboxChange('fuelTypes', type)} 
                  />
                  <span className="filter-checkbox"></span>
                  <span className="filter-option-label">{type}</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Transmission Filter */}
      <div className="filter-section">
        <div className="filter-section-header" onClick={() => toggleSection('transmission')}>
          <h3 className="filter-section-title">Transmission</h3>
          <i className={`fas fa-chevron-${isExpanded.transmission ? 'up' : 'down'}`}></i>
        </div>
        
        {isExpanded.transmission && (
          <div className="filter-section-content">
            <div className="filter-options">
              {availableFilters.transmission.map(type => (
                <label key={type} className="filter-option">
                  <input 
                    type="checkbox" 
                    checked={filters.transmission.includes(type)} 
                    onChange={() => handleCheckboxChange('transmission', type)} 
                  />
                  <span className="filter-checkbox"></span>
                  <span className="filter-option-label">{type}</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Features Filter */}
      <div className="filter-section">
        <div className="filter-section-header" onClick={() => toggleSection('features')}>
          <h3 className="filter-section-title">Features</h3>
          <i className={`fas fa-chevron-${isExpanded.features ? 'up' : 'down'}`}></i>
        </div>
        
        {isExpanded.features && (
          <div className="filter-section-content">
            <div className="filter-options">
              {availableFilters.features.map(feature => (
                <label key={feature} className="filter-option">
                  <input 
                    type="checkbox" 
                    checked={filters.features.includes(feature)} 
                    onChange={() => handleCheckboxChange('features', feature)} 
                  />
                  <span className="filter-checkbox"></span>
                  <span className="filter-option-label">{feature}</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VehicleFilter;