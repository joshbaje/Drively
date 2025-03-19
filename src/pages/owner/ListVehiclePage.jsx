import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import apiService from '../../services/apiService';
import './ListVehiclePage.css';

const ListVehiclePage = () => {
  const { isAuthenticated, isOwner, user } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: '',
    trim: '',
    color: '',
    licensePlate: '',
    mileage: '',
    vehicleType: '',
    transmission: 'automatic',
    fuelType: 'gasoline',
    seats: '',
    doors: '',
    description: '',
    location: '',
    dailyRate: '',
    weeklyRate: '',
    monthlyRate: '',
    securityDeposit: '',
    features: [],
    rules: '',
    guidelines: ''
  });
  
  const [images, setImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // List of available features that can be selected
  const availableFeatures = [
    'Bluetooth',
    'USB Charging Ports',
    'Backup Camera',
    'GPS Navigation',
    'Leather Seats',
    'Sunroof',
    'Cruise Control',
    'Apple CarPlay',
    'Android Auto',
    '4x4 Capability',
    'Keyless Entry',
    'Push-to-Start',
    'Heated Seats',
    'Third Row Seats',
    'Roof Rack'
  ];
  
  // Redirect if not authenticated or not an owner
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/list-your-car' } });
    } else if (isAuthenticated && !isOwner) {
      navigate('/become-a-host');
    }
  }, [isAuthenticated, isOwner, navigate]);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      if (name === 'features') {
        const feature = value;
        setFormData(prevFormData => {
          if (checked) {
            return {
              ...prevFormData,
              features: [...prevFormData.features, feature]
            };
          } else {
            return {
              ...prevFormData,
              features: prevFormData.features.filter(f => f !== feature)
            };
          }
        });
      } else {
        setFormData(prevFormData => ({
          ...prevFormData,
          [name]: checked
        }));
      }
    } else {
      setFormData(prevFormData => ({
        ...prevFormData,
        [name]: value
      }));
    }
  };
  
  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    // Allow only positive numbers
    if (value === '' || /^[0-9]+$/.test(value)) {
      setFormData(prevFormData => ({
        ...prevFormData,
        [name]: value
      }));
    }
  };
  
  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    // Allow only positive numbers
    if (value === '' || /^[0-9]+$/.test(value)) {
      setFormData(prevFormData => ({
        ...prevFormData,
        [name]: value
      }));
    }
    
    // Auto-calculate weekly and monthly rates based on daily rate
    if (name === 'dailyRate' && value !== '') {
      const dailyRate = parseInt(value, 10);
      const weeklyRate = Math.round(dailyRate * 6.5); // 7 days with discount
      const monthlyRate = Math.round(dailyRate * 26); // 30 days with discount
      
      setFormData(prevFormData => ({
        ...prevFormData,
        weeklyRate: weeklyRate.toString(),
        monthlyRate: monthlyRate.toString()
      }));
    }
  };
  
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length > 0) {
      // Preview images
      const newImages = files.map(file => ({
        file,
        preview: URL.createObjectURL(file),
        isPrimary: images.length === 0 // First image is primary by default
      }));
      
      setImages(prevImages => [...prevImages, ...newImages]);
    }
  };
  
  const removeImage = (index) => {
    const updatedImages = [...images];
    
    // If removing the primary image, set the next available as primary
    if (updatedImages[index].isPrimary && updatedImages.length > 1) {
      // Find the next image that isn't being removed
      const nextIndex = index === updatedImages.length - 1 ? 0 : index + 1;
      updatedImages[nextIndex].isPrimary = true;
    }
    
    // Release object URL to prevent memory leaks
    URL.revokeObjectURL(updatedImages[index].preview);
    
    // Remove the image
    updatedImages.splice(index, 1);
    setImages(updatedImages);
  };
  
  const setPrimaryImage = (index) => {
    const updatedImages = images.map((image, i) => ({
      ...image,
      isPrimary: i === index
    }));
    
    setImages(updatedImages);
  };
  
  const validateForm = () => {
    // Required fields
    const requiredFields = [
      'make', 'model', 'year', 'color', 'licensePlate', 
      'mileage', 'vehicleType', 'transmission', 'fuelType',
      'seats', 'doors', 'description', 'location', 'dailyRate'
    ];
    
    for (const field of requiredFields) {
      if (!formData[field]) {
        setError(`Please fill in all required fields. Missing: ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return false;
      }
    }
    
    // Check if at least one image is uploaded
    if (images.length === 0) {
      setError('Please upload at least one image of your vehicle');
      return false;
    }
    
    return true;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError('');
      
      // Prepare vehicle data for API
      const vehicleData = {
        ...formData,
        dailyRate: parseInt(formData.dailyRate, 10),
        weeklyRate: parseInt(formData.weeklyRate, 10),
        monthlyRate: parseInt(formData.monthlyRate, 10),
        securityDeposit: parseInt(formData.securityDeposit, 10) || 5000, // Default if not specified
        mileage: parseInt(formData.mileage, 10),
        seats: parseInt(formData.seats, 10),
        doors: parseInt(formData.doors, 10),
        year: parseInt(formData.year, 10)
      };
      
      // Mock API call for now
      console.log('Submitting vehicle data:', vehicleData);
      
      // In a real application, you would:
      // 1. Create the vehicle
      // const response = await apiService.createVehicle(vehicleData);
      // const vehicleId = response.id;
      
      // 2. Upload images
      // for (const image of images) {
      //   await apiService.uploadVehicleImage(vehicleId, image.file);
      // }
      
      // Simulate API response
      setTimeout(() => {
        setSuccess('Your vehicle has been successfully listed! It will be reviewed by our team and will be available for rental soon.');
        
        // Reset form after successful submission
        setFormData({
          make: '',
          model: '',
          year: '',
          trim: '',
          color: '',
          licensePlate: '',
          mileage: '',
          vehicleType: '',
          transmission: 'automatic',
          fuelType: 'gasoline',
          seats: '',
          doors: '',
          description: '',
          location: '',
          dailyRate: '',
          weeklyRate: '',
          monthlyRate: '',
          securityDeposit: '',
          features: [],
          rules: '',
          guidelines: ''
        });
        setImages([]);
        setIsSubmitting(false);
        
        // Redirect to dashboard after delay
        setTimeout(() => {
          navigate('/owner/dashboard');
        }, 3000);
      }, 1500);
      
    } catch (err) {
      setError(err.message || 'Failed to list your vehicle. Please try again.');
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="list-vehicle-page">
      <div className="page-header">
        <div className="container">
          <h1>List Your Vehicle</h1>
          <p>Share your vehicle with our community and start earning</p>
        </div>
      </div>
      
      <div className="container">
        {error && <div className="auth-error">{error}</div>}
        {success && (
          <div className="success-message">
            <i className="fas fa-check-circle"></i>
            {success}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          {/* Vehicle Details Section */}
          <div className="form-container">
            <div className="form-section">
              <h2 className="form-section-title">Vehicle Details</h2>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="make" className="required-field">Make</label>
                  <input
                    type="text"
                    id="make"
                    name="make"
                    value={formData.make}
                    onChange={handleChange}
                    placeholder="e.g. Toyota"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="model" className="required-field">Model</label>
                  <input
                    type="text"
                    id="model"
                    name="model"
                    value={formData.model}
                    onChange={handleChange}
                    placeholder="e.g. Fortuner"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="year" className="required-field">Year</label>
                  <input
                    type="text"
                    id="year"
                    name="year"
                    value={formData.year}
                    onChange={handleNumberChange}
                    placeholder="e.g. 2023"
                    maxLength="4"
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="trim">Trim (Optional)</label>
                  <input
                    type="text"
                    id="trim"
                    name="trim"
                    value={formData.trim}
                    onChange={handleChange}
                    placeholder="e.g. LTD 4x4"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="color" className="required-field">Color</label>
                  <input
                    type="text"
                    id="color"
                    name="color"
                    value={formData.color}
                    onChange={handleChange}
                    placeholder="e.g. Pearl White"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="licensePlate" className="required-field">License Plate</label>
                  <input
                    type="text"
                    id="licensePlate"
                    name="licensePlate"
                    value={formData.licensePlate}
                    onChange={handleChange}
                    placeholder="e.g. ABC 1234"
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="vehicleType" className="required-field">Vehicle Type</label>
                  <select
                    id="vehicleType"
                    name="vehicleType"
                    value={formData.vehicleType}
                    onChange={handleChange}
                  >
                    <option value="">Select Vehicle Type</option>
                    <option value="sedan">Sedan</option>
                    <option value="suv">SUV</option>
                    <option value="hatchback">Hatchback</option>
                    <option value="mpv">MPV</option>
                    <option value="pickup">Pickup Truck</option>
                    <option value="van">Van</option>
                    <option value="sports">Sports Car</option>
                    <option value="luxury">Luxury Car</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="transmission" className="required-field">Transmission</label>
                  <select
                    id="transmission"
                    name="transmission"
                    value={formData.transmission}
                    onChange={handleChange}
                  >
                    <option value="automatic">Automatic</option>
                    <option value="manual">Manual</option>
                    <option value="cvt">CVT</option>
                    <option value="semi-automatic">Semi-Automatic</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="fuelType" className="required-field">Fuel Type</label>
                  <select
                    id="fuelType"
                    name="fuelType"
                    value={formData.fuelType}
                    onChange={handleChange}
                  >
                    <option value="gasoline">Gasoline</option>
                    <option value="diesel">Diesel</option>
                    <option value="hybrid">Hybrid</option>
                    <option value="electric">Electric</option>
                  </select>
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="mileage" className="required-field">Mileage (km)</label>
                  <input
                    type="text"
                    id="mileage"
                    name="mileage"
                    value={formData.mileage}
                    onChange={handleNumberChange}
                    placeholder="e.g. 15000"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="seats" className="required-field">Seats</label>
                  <input
                    type="text"
                    id="seats"
                    name="seats"
                    value={formData.seats}
                    onChange={handleNumberChange}
                    placeholder="e.g. 5"
                    maxLength="2"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="doors" className="required-field">Doors</label>
                  <input
                    type="text"
                    id="doors"
                    name="doors"
                    value={formData.doors}
                    onChange={handleNumberChange}
                    placeholder="e.g. 4"
                    maxLength="1"
                  />
                </div>
              </div>
            </div>
            
            <div className="form-section">
              <h2 className="form-section-title">Location & Description</h2>
              
              <div className="form-group">
                <label htmlFor="location" className="required-field">Location</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. Makati City"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="description" className="required-field">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your vehicle and highlight its best features. What makes it special?"
                  rows="6"
                ></textarea>
              </div>
            </div>
          </div>
          
          {/* Features Section */}
          <div className="form-container">
            <div className="form-section">
              <h2 className="form-section-title">Features</h2>
              <p>Select all the features that your vehicle has:</p>
              
              <div className="features-grid">
                {availableFeatures.map((feature, index) => (
                  <div key={index} className="feature-item">
                    <input
                      type="checkbox"
                      id={`feature-${index}`}
                      name="features"
                      value={feature}
                      checked={formData.features.includes(feature)}
                      onChange={handleChange}
                    />
                    <label htmlFor={`feature-${index}`}>{feature}</label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="form-section">
              <h2 className="form-section-title">Rules & Guidelines</h2>
              
              <div className="form-group rules-list">
                <label htmlFor="rules">Rules (Each rule on a new line)</label>
                <textarea
                  id="rules"
                  name="rules"
                  value={formData.rules}
                  onChange={handleChange}
                  placeholder="e.g. No smoking in the vehicle&#10;No pets allowed&#10;Return with same fuel level"
                ></textarea>
              </div>
              
              <div className="form-group guidelines-text">
                <label htmlFor="guidelines">Guidelines for Renters</label>
                <textarea
                  id="guidelines"
                  name="guidelines"
                  value={formData.guidelines}
                  onChange={handleChange}
                  placeholder="Provide any additional information or guidelines that renters should know about your vehicle."
                ></textarea>
              </div>
            </div>
          </div>
          
          {/* Images Section */}
          <div className="form-container">
            <div className="form-section">
              <h2 className="form-section-title">Vehicle Images</h2>
              <p className="upload-instruction">Upload clear photos of your vehicle. Include exterior and interior shots. The first image will be the main image.</p>
              
              <input
                type="file"
                id="vehicle-images"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />
              
              <label htmlFor="vehicle-images" className="image-upload-area">
                <div className="image-upload-icon">
                  <i className="fas fa-camera"></i>
                </div>
                <p>Click to upload images</p>
                <p>Supported formats: JPG, PNG (max 5MB per image)</p>
              </label>
              
              {images.length > 0 && (
                <div className="uploaded-images">
                  {images.map((image, index) => (
                    <div key={index} className="uploaded-image-item">
                      <img src={image.preview} alt={`Vehicle preview ${index + 1}`} />
                      <div 
                        className="remove-image-btn"
                        onClick={() => removeImage(index)}
                      >
                        <i className="fas fa-times"></i>
                      </div>
                      {image.isPrimary && (
                        <div className="primary-image-badge">Primary</div>
                      )}
                      {!image.isPrimary && (
                        <div 
                          className="set-primary-btn"
                          onClick={() => setPrimaryImage(index)}
                          style={{
                            position: 'absolute',
                            bottom: '5px',
                            right: '5px',
                            backgroundColor: 'rgba(255, 255, 255, 0.8)',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '12px'
                          }}
                        >
                          Set as primary
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Pricing Section */}
          <div className="form-container">
            <div className="form-section">
              <h2 className="form-section-title">Pricing</h2>
              
              <div className="pricing-container">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="dailyRate" className="required-field">Daily Rate (₱)</label>
                    <input
                      type="text"
                      id="dailyRate"
                      name="dailyRate"
                      value={formData.dailyRate}
                      onChange={handlePriceChange}
                      placeholder="e.g. 2500"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="weeklyRate">Weekly Rate (₱)</label>
                    <input
                      type="text"
                      id="weeklyRate"
                      name="weeklyRate"
                      value={formData.weeklyRate}
                      onChange={handlePriceChange}
                      placeholder="Auto-calculated"
                    />
                    <small style={{ display: 'block', marginTop: '5px', color: '#666' }}>
                      Recommended: 10% discount from daily rate
                    </small>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="monthlyRate">Monthly Rate (₱)</label>
                    <input
                      type="text"
                      id="monthlyRate"
                      name="monthlyRate"
                      value={formData.monthlyRate}
                      onChange={handlePriceChange}
                      placeholder="Auto-calculated"
                    />
                    <small style={{ display: 'block', marginTop: '5px', color: '#666' }}>
                      Recommended: 15% discount from daily rate
                    </small>
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="securityDeposit">Security Deposit (₱)</label>
                  <input
                    type="text"
                    id="securityDeposit"
                    name="securityDeposit"
                    value={formData.securityDeposit}
                    onChange={handlePriceChange}
                    placeholder="e.g. 10000"
                  />
                  <small style={{ display: 'block', marginTop: '5px', color: '#666' }}>
                    If left empty, a default security deposit of ₱5,000 will be applied
                  </small>
                </div>
              </div>
            </div>
          </div>
          
          <div className="action-buttons">
            <button 
              type="submit" 
              className="submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'List Your Vehicle'}
            </button>
            
            <button 
              type="button" 
              className="cancel-button"
              onClick={() => navigate('/')}
              disabled={isSubmitting}
            >
              Cancel
            </button>
          </div>
          
          <p className="form-note">
            By listing your vehicle, you agree to our <a href="/terms">Terms of Service</a> and <a href="/privacy">Privacy Policy</a>. Your vehicle will be reviewed by our team before being listed on the platform.
          </p>
        </form>
      </div>
    </div>
  );
};

export default ListVehiclePage;