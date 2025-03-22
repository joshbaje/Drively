import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './VehicleCreate.css';

const VehicleCreate = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    color: '',
    type: '',
    license_plate: '',
    daily_rate: '',
    location: '',
    owner_id: '',
    owner_name: '',
    status: 'pending',
    description: '',
    features: []
  });

  // Additional form fields for features
  const [featureInput, setFeatureInput] = useState('');
  const [vehicleImages, setVehicleImages] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);

  // Available vehicle types
  const vehicleTypes = ['Sedan', 'SUV', 'Hatchback', 'Convertible', 'Pickup', 'Van', 'Luxury'];
  
  // Available colors
  const colors = ['Black', 'White', 'Silver', 'Red', 'Blue', 'Gray', 'Brown', 'Green', 'Yellow', 'Orange', 'Purple'];

  // Available locations
  const locations = ['Makati City', 'Taguig City', 'Quezon City', 'Pasig City', 'Mandaluyong', 'Alabang', 'Paranaque'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleNumericChange = (e) => {
    const { name, value } = e.target;
    // Only allow numeric input for certain fields
    if (!isNaN(value) || value === '') {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleFeatureInputChange = (e) => {
    setFeatureInput(e.target.value);
  };

  const addFeature = () => {
    if (featureInput.trim() !== '' && !formData.features.includes(featureInput.trim())) {
      setFormData({
        ...formData,
        features: [...formData.features, featureInput.trim()]
      });
      setFeatureInput('');
    }
  };

  const removeFeature = (index) => {
    const updatedFeatures = [...formData.features];
    updatedFeatures.splice(index, 1);
    setFormData({
      ...formData,
      features: updatedFeatures
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Only add new files that don't exceed the limit
    const newFiles = files.slice(0, 5 - imageFiles.length);
    
    if (newFiles.length > 0) {
      setImageFiles([...imageFiles, ...newFiles]);
      
      // Create preview URLs
      const newImageURLs = newFiles.map(file => URL.createObjectURL(file));
      setVehicleImages([...vehicleImages, ...newImageURLs]);
    }
  };

  const removeImage = (index) => {
    // Clean up the object URL to avoid memory leaks
    URL.revokeObjectURL(vehicleImages[index]);
    
    const updatedImages = [...vehicleImages];
    updatedImages.splice(index, 1);
    setVehicleImages(updatedImages);
    
    const updatedFiles = [...imageFiles];
    updatedFiles.splice(index, 1);
    setImageFiles(updatedFiles);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Validation
      if (!formData.make || !formData.model || !formData.year || !formData.license_plate || !formData.daily_rate) {
        throw new Error('Please fill in all required fields');
      }

      // In a real app, this would be an API call to create the vehicle
      // For demo purposes, we'll simulate a successful API call
      setTimeout(() => {
        console.log('Vehicle data submitted:', {
          ...formData,
          imageFiles
        });
        
        setSuccess(true);
        setLoading(false);
        
        // Automatically redirect after success
        setTimeout(() => {
          navigate('/admin/vehicles');
        }, 2000);
      }, 1500);
    } catch (error) {
      console.error('Error creating vehicle:', error);
      setError(error.message || 'An error occurred while creating the vehicle');
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="vehicle-create">
        <div className="admin-container">
          <div className="success-message">
            <div className="success-icon">
              <i className="fas fa-check-circle"></i>
            </div>
            <h2>Vehicle Added Successfully!</h2>
            <p>The vehicle has been added to the system and is pending approval.</p>
            <div className="success-actions">
              <Link to="/admin/vehicles" className="primary-button">
                Back to Vehicle Management
              </Link>
              <button 
                onClick={() => {
                  // Reset form for a new submission
                  setFormData({
                    make: '',
                    model: '',
                    year: new Date().getFullYear(),
                    color: '',
                    type: '',
                    license_plate: '',
                    daily_rate: '',
                    location: '',
                    owner_id: '',
                    owner_name: '',
                    status: 'pending',
                    description: '',
                    features: []
                  });
                  setVehicleImages([]);
                  setImageFiles([]);
                  setSuccess(false);
                }}
                className="secondary-button"
              >
                Add Another Vehicle
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="vehicle-create">
      <div className="admin-container">
        <div className="admin-header">
          <h1 className="admin-title">Add New Vehicle</h1>
          <div className="header-actions">
            <Link to="/admin/vehicles" className="back-button">
              <i className="fas fa-arrow-left"></i> Back to Vehicles
            </Link>
          </div>
        </div>

        <div className="vehicle-form-container">
          {error && (
            <div className="error-message">
              <i className="fas fa-exclamation-circle"></i>
              <span>{error}</span>
            </div>
          )}

          <form className="vehicle-form" onSubmit={handleSubmit}>
            <div className="form-section">
              <h3 className="section-title">
                <i className="fas fa-car"></i> Basic Information
              </h3>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="make">Make <span className="required">*</span></label>
                  <input
                    type="text"
                    id="make"
                    name="make"
                    value={formData.make}
                    onChange={handleChange}
                    placeholder="e.g. Toyota"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="model">Model <span className="required">*</span></label>
                  <input
                    type="text"
                    id="model"
                    name="model"
                    value={formData.model}
                    onChange={handleChange}
                    placeholder="e.g. Corolla"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="year">Year <span className="required">*</span></label>
                  <input
                    type="number"
                    id="year"
                    name="year"
                    value={formData.year}
                    onChange={handleNumericChange}
                    min="1990"
                    max={new Date().getFullYear() + 1}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="license_plate">License Plate <span className="required">*</span></label>
                  <input
                    type="text"
                    id="license_plate"
                    name="license_plate"
                    value={formData.license_plate}
                    onChange={handleChange}
                    placeholder="e.g. ABC 1234"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="type">Vehicle Type</label>
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                  >
                    <option value="">Select Type</option>
                    {vehicleTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="color">Color</label>
                  <select
                    id="color"
                    name="color"
                    value={formData.color}
                    onChange={handleChange}
                  >
                    <option value="">Select Color</option>
                    {colors.map((color) => (
                      <option key={color} value={color}>{color}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3 className="section-title">
                <i className="fas fa-dollar-sign"></i> Pricing & Location
              </h3>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="daily_rate">Daily Rate (₱) <span className="required">*</span></label>
                  <input
                    type="text"
                    id="daily_rate"
                    name="daily_rate"
                    value={formData.daily_rate}
                    onChange={handleNumericChange}
                    placeholder="e.g. 2500"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="location">Location</label>
                  <select
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                  >
                    <option value="">Select Location</option>
                    {locations.map((location) => (
                      <option key={location} value={location}>{location}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3 className="section-title">
                <i className="fas fa-user"></i> Owner Information
              </h3>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="owner_id">Owner ID</label>
                  <input
                    type="text"
                    id="owner_id"
                    name="owner_id"
                    value={formData.owner_id}
                    onChange={handleNumericChange}
                    placeholder="e.g. 12345"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="owner_name">Owner Name</label>
                  <input
                    type="text"
                    id="owner_name"
                    name="owner_name"
                    value={formData.owner_name}
                    onChange={handleChange}
                    placeholder="e.g. John Doe"
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3 className="section-title">
                <i className="fas fa-list-ul"></i> Features & Description
              </h3>
              
              <div className="form-group">
                <label htmlFor="description">Vehicle Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter a detailed description of the vehicle..."
                  rows={4}
                />
              </div>

              <div className="form-group">
                <label htmlFor="features">Vehicle Features</label>
                <div className="feature-input-group">
                  <input
                    type="text"
                    id="featureInput"
                    value={featureInput}
                    onChange={handleFeatureInputChange}
                    placeholder="e.g. Bluetooth, GPS, Leather Seats"
                  />
                  <button 
                    type="button" 
                    className="add-feature-btn"
                    onClick={addFeature}
                  >
                    <i className="fas fa-plus"></i> Add
                  </button>
                </div>
                
                {formData.features.length > 0 && (
                  <div className="features-list">
                    {formData.features.map((feature, index) => (
                      <div key={index} className="feature-tag">
                        <span>{feature}</span>
                        <button 
                          type="button" 
                          className="remove-feature-btn"
                          onClick={() => removeFeature(index)}
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="form-section">
              <h3 className="section-title">
                <i className="fas fa-images"></i> Vehicle Images
              </h3>
              
              <div className="form-group">
                <label>Upload Images (maximum 5)</label>
                <div className="image-upload-container">
                  <div 
                    className="image-upload-box"
                    onClick={() => {
                      if (vehicleImages.length < 5) {
                        document.getElementById('vehicleImages').click();
                      }
                    }}
                  >
                    <input
                      type="file"
                      id="vehicleImages"
                      accept="image/*"
                      multiple
                      onChange={handleImageChange}
                      style={{ display: 'none' }}
                    />
                    <div className="upload-icon">
                      <i className="fas fa-cloud-upload-alt"></i>
                    </div>
                    <p>Click to upload (max 5 images)</p>
                    <p className="upload-info">{vehicleImages.length} of 5 images uploaded</p>
                  </div>
                  
                  {vehicleImages.length > 0 && (
                    <div className="image-previews">
                      {vehicleImages.map((image, index) => (
                        <div key={index} className="image-preview-item">
                          <img src={image} alt={`Vehicle preview ${index + 1}`} />
                          <button 
                            type="button"
                            className="remove-image-btn"
                            onClick={() => removeImage(index)}
                          >
                            <i className="fas fa-times"></i>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3 className="section-title">
                <i className="fas fa-cog"></i> Status
              </h3>
              <div className="form-group">
                <label htmlFor="status">Initial Status</label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="pending">Pending Approval</option>
                  <option value="approved">Approved</option>
                  <option value="inactive">Inactive</option>
                </select>
                <p className="field-note">
                  <i className="fas fa-info-circle"></i> 
                  New vehicles are usually set to "Pending Approval" until reviewed
                </p>
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="cancel-button" onClick={() => navigate('/admin/vehicles')}>
                Cancel
              </button>
              <button type="submit" className="submit-button" disabled={loading}>
                {loading ? (
                  <>
                    <div className="button-spinner"></div>
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <i className="fas fa-plus-circle"></i> Create Vehicle
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VehicleCreate;