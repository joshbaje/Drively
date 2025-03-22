import React, { useState } from 'react';

const AddCarModal = ({ isOpen, onClose, onAddCar }) => {
  const [newCar, setNewCar] = useState({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    trim: '',
    color: '',
    vehicle_type: 'sedan',
    transmission: 'automatic',
    fuel_type: 'gasoline',
    seats: 5,
    doors: 4,
    license_plate: '',
    vin: '',
    daily_rate: '',
    security_deposit: '',
    description: '',
    location: 'Downtown'
  });

  // Handle input change for new car form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCar(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle number input change with validation
  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    if (value === '' || !isNaN(value)) {
      setNewCar(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Handle form submission for new car
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Call the parent's onAddCar function with the new car data
    onAddCar(newCar);
    
    // Reset the form
    setNewCar({
      make: '',
      model: '',
      year: new Date().getFullYear(),
      trim: '',
      color: '',
      vehicle_type: 'sedan',
      transmission: 'automatic',
      fuel_type: 'gasoline',
      seats: 5,
      doors: 4,
      license_plate: '',
      vin: '',
      daily_rate: '',
      security_deposit: '',
      description: '',
      location: 'Downtown'
    });
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Add New Car</h2>
          <button 
            className="modal-close" 
            onClick={onClose}
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <h3>Basic Information</h3>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="make">Make *</label>
                <input
                  type="text"
                  id="make"
                  name="make"
                  value={newCar.make}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="model">Model *</label>
                <input
                  type="text"
                  id="model"
                  name="model"
                  value={newCar.model}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="year">Year *</label>
                <input
                  type="number"
                  id="year"
                  name="year"
                  min="1990"
                  max={new Date().getFullYear() + 1}
                  value={newCar.year}
                  onChange={handleNumberChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="trim">Trim</label>
                <input
                  type="text"
                  id="trim"
                  name="trim"
                  value={newCar.trim}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="color">Color *</label>
                <input
                  type="text"
                  id="color"
                  name="color"
                  value={newCar.color}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="vehicle_type">Vehicle Type *</label>
                <select
                  id="vehicle_type"
                  name="vehicle_type"
                  value={newCar.vehicle_type}
                  onChange={handleInputChange}
                  required
                >
                  <option value="sedan">Sedan</option>
                  <option value="suv">SUV</option>
                  <option value="truck">Truck</option>
                  <option value="van">Van</option>
                  <option value="convertible">Convertible</option>
                  <option value="sports">Sports</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="form-section">
            <h3>Specifications</h3>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="transmission">Transmission *</label>
                <select
                  id="transmission"
                  name="transmission"
                  value={newCar.transmission}
                  onChange={handleInputChange}
                  required
                >
                  <option value="automatic">Automatic</option>
                  <option value="manual">Manual</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="fuel_type">Fuel Type *</label>
                <select
                  id="fuel_type"
                  name="fuel_type"
                  value={newCar.fuel_type}
                  onChange={handleInputChange}
                  required
                >
                  <option value="gasoline">Gasoline</option>
                  <option value="diesel">Diesel</option>
                  <option value="electric">Electric</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="seats">Seats *</label>
                <input
                  type="number"
                  id="seats"
                  name="seats"
                  min="1"
                  max="15"
                  value={newCar.seats}
                  onChange={handleNumberChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="doors">Doors *</label>
                <input
                  type="number"
                  id="doors"
                  name="doors"
                  min="1"
                  max="6"
                  value={newCar.doors}
                  onChange={handleNumberChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Registration</h3>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="license_plate">License Plate *</label>
                <input
                  type="text"
                  id="license_plate"
                  name="license_plate"
                  value={newCar.license_plate}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="vin">VIN *</label>
                <input
                  type="text"
                  id="vin"
                  name="vin"
                  value={newCar.vin}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Rental Information</h3>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="daily_rate">Daily Rate (₱) *</label>
                <input
                  type="text"
                  id="daily_rate"
                  name="daily_rate"
                  value={newCar.daily_rate}
                  onChange={handleNumberChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="security_deposit">Security Deposit (₱) *</label>
                <input
                  type="text"
                  id="security_deposit"
                  name="security_deposit"
                  value={newCar.security_deposit}
                  onChange={handleNumberChange}
                  required
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="location">Location *</label>
                <select
                  id="location"
                  name="location"
                  value={newCar.location}
                  onChange={handleInputChange}
                  required
                >
                  <option value="Downtown">Downtown Office</option>
                  <option value="Airport">Airport Terminal 1</option>
                  <option value="Suburb">Suburb Location</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                rows="4"
                value={newCar.description}
                onChange={handleInputChange}
              ></textarea>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-save">
              Add Car
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCarModal;