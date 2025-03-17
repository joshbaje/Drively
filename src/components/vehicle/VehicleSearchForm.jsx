import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './VehicleSearchForm.css';

const VehicleSearchForm = () => {
  const navigate = useNavigate();
  const [searchData, setSearchData] = useState({
    location: '',
    startDate: '',
    endDate: '',
    vehicleType: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Build query string from search data
    const queryParams = new URLSearchParams();
    Object.entries(searchData).forEach(([key, value]) => {
      if (value) queryParams.append(key, value);
    });
    
    // Navigate to search page with query parameters
    navigate(`/search?${queryParams.toString()}`);
  };

  // Get tomorrow's date for minimum end date
  const getTomorrow = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  // Get today's date for minimum start date
  const getToday = () => {
    return new Date().toISOString().split('T')[0];
  };

  return (
    <form className="vehicle-search-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="location" className="form-label">Location</label>
        <input
          type="text"
          id="location"
          name="location"
          className="form-control"
          placeholder="City, address, or airport"
          value={searchData.location}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="startDate" className="form-label">Pick-up Date</label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            className="form-control"
            value={searchData.startDate}
            onChange={handleChange}
            min={getToday()}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="endDate" className="form-label">Return Date</label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            className="form-control"
            value={searchData.endDate}
            onChange={handleChange}
            min={searchData.startDate || getTomorrow()}
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="vehicleType" className="form-label">Vehicle Type</label>
        <select
          id="vehicleType"
          name="vehicleType"
          className="form-control"
          value={searchData.vehicleType}
          onChange={handleChange}
        >
          <option value="">All Vehicle Types</option>
          <option value="sedan">Sedan</option>
          <option value="suv">SUV</option>
          <option value="truck">Truck</option>
          <option value="convertible">Convertible</option>
          <option value="van">Van</option>
        </select>
      </div>

      <button type="submit" className="search-button">
        <i className="fas fa-search"></i> Find Cars
      </button>
    </form>
  );
};

export default VehicleSearchForm;