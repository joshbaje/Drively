import React, { useState, useEffect, useRef } from 'react';
import '../agent/AgentComponents.css';

// Helper function to validate VIN (Vehicle Identification Number)
const isValidVIN = (vin) => {
  // Basic VIN validation - 17 characters, no I, O, Q
  if (!vin) return false;
  
  // Remove spaces, dots, and dashes
  const cleanVIN = vin.replace(/[\s.-]/g, '').toUpperCase();
  
  // Must be 17 characters
  if (cleanVIN.length !== 17) return false;
  
  // Cannot contain I, O, or Q
  if (/[IOQ]/.test(cleanVIN)) return false;
  
  // Should only contain alphanumeric characters
  return /^[A-HJ-NPR-Z0-9]{17}$/.test(cleanVIN);
};

const CarFormModal = ({ isOpen, onClose, onSave, carData = null }) => {
  const [showSuccess, setShowSuccess] = useState(false);
  // File input ref
  const fileInputRef = useRef(null);
  
  // Initialize form state
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    trim: '',
    price: '',
    priceUnit: 'day',
    status: 'available',
    mileage: '',
    vin: '',
    licensePlate: '',
    transmission: 'Automatic',
    fuel: 'Gasoline',
    features: [],
    location: '',
    ownerId: '',
    images: [],
    description: ''
  });

  const [imagePreviewUrls, setImagePreviewUrls] = useState([]);

  const [owners, setOwners] = useState([]);
  const [featureInput, setFeatureInput] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Load data if editing
  useEffect(() => {
    if (carData) {
      setFormData({
        ...carData,
        ownerId: carData.owner?.id || '',
        features: carData.features || [],
        images: carData.images || [],
      });
      
      // Set image previews if images exist
      if (carData.images && carData.images.length > 0) {
        setImagePreviewUrls(carData.images);
      }
    }
    
    // Fetch owners list (in a real app)
    fetchOwners();
  }, [carData]);

  // Mock function to fetch owners
  const fetchOwners = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      const mockOwners = [
        { id: 'owner1', name: 'John Smith' },
        { id: 'owner2', name: 'Jane Wilson' },
        { id: 'owner3', name: 'Michael Brown' },
        { id: 'owner4', name: 'Sarah Johnson' },
        { id: 'owner5', name: 'Robert Davis' },
        { id: 'owner6', name: 'Emily Wilson' },
      ];
      setOwners(mockOwners);
      setIsLoading(false);
    }, 500);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is changed
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  // Handle number inputs
  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    const numValue = value === '' ? '' : Number(value);
    setFormData(prev => ({
      ...prev,
      [name]: numValue
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  // Add feature to the list
  const handleAddFeature = () => {
    if (!featureInput.trim()) return;
    
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, featureInput.trim()]
    }));
    setFeatureInput('');
  };

  // Remove feature from the list
  const handleRemoveFeature = (index) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, idx) => idx !== index)
    }));
  };

  // Validate form before submission
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.make) newErrors.make = 'Make is required';
    if (!formData.model) newErrors.model = 'Model is required';
    if (!formData.year) newErrors.year = 'Year is required';
    if (!formData.price) newErrors.price = 'Price is required';
    if (!formData.mileage && formData.mileage !== 0) newErrors.mileage = 'Mileage is required';
    if (!formData.location) newErrors.location = 'Location is required';
    if (!formData.ownerId) newErrors.ownerId = 'Owner is required';
    if (!formData.licensePlate) newErrors.licensePlate = 'License plate is required';
    
    if (formData.vin) {
      if (!isValidVIN(formData.vin)) {
        newErrors.vin = 'Please enter a valid 17-character VIN (no I, O, Q characters)'
      }
    } else {
      newErrors.vin = 'VIN is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle image files
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    // Limit to 5 images
    const maxImages = 5;
    const remainingSlots = maxImages - imagePreviewUrls.length;
    const filesToProcess = files.slice(0, remainingSlots);
    
    if (filesToProcess.length === 0) return;
    
    // Create preview URLs for each file
    const newImagePreviews = filesToProcess.map(file => URL.createObjectURL(file));
    
    // Update state
    setImagePreviewUrls(prev => [...prev, ...newImagePreviews]);
    
    // In a real app, we would upload these to a server and get back URLs
    // For demo purposes, we'll just store the local object URLs
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...newImagePreviews]
    }));
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  // Remove image from preview
  const handleRemoveImage = (index) => {
    const newImagePreviewUrls = [...imagePreviewUrls];
    newImagePreviewUrls.splice(index, 1);
    setImagePreviewUrls(newImagePreviewUrls);
    
    const newImages = [...formData.images];
    newImages.splice(index, 1);
    setFormData(prev => ({
      ...prev,
      images: newImages
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    // Prepare data for saving
    const carToSave = {
      ...formData,
      // Convert numeric fields appropriately
      year: Number(formData.year),
      price: Number(formData.price),
      mileage: Number(formData.mileage),
    };
    
    // In a real app, this would be an API call
    setTimeout(() => {
      onSave(carToSave);
      setIsLoading(false);
      setShowSuccess(true);
      
      // Auto-hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content car-form-modal">
        <div className="modal-header">
          <h2>{carData ? 'Edit Car' : 'Add New Car'}</h2>
          <button 
            className="modal-close" 
            onClick={onClose}
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-section">
              <h3>Basic Information</h3>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="make">Make *</label>
                  <input
                    type="text"
                    id="make"
                    name="make"
                    value={formData.make}
                    onChange={handleInputChange}
                    className={errors.make ? 'error' : ''}
                  />
                  {errors.make && <div className="error-message">{errors.make}</div>}
                </div>
                <div className="form-group">
                  <label htmlFor="model">Model *</label>
                  <input
                    type="text"
                    id="model"
                    name="model"
                    value={formData.model}
                    onChange={handleInputChange}
                    className={errors.model ? 'error' : ''}
                  />
                  {errors.model && <div className="error-message">{errors.model}</div>}
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="year">Year *</label>
                  <input
                    type="number"
                    id="year"
                    name="year"
                    min="1900"
                    max={new Date().getFullYear() + 1}
                    value={formData.year}
                    onChange={handleNumberChange}
                    className={errors.year ? 'error' : ''}
                  />
                  {errors.year && <div className="error-message">{errors.year}</div>}
                </div>
                <div className="form-group">
                  <label htmlFor="trim">Trim</label>
                  <input
                    type="text"
                    id="trim"
                    name="trim"
                    value={formData.trim}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="mileage">Mileage *</label>
                  <input
                    type="number"
                    id="mileage"
                    name="mileage"
                    min="0"
                    value={formData.mileage}
                    onChange={handleNumberChange}
                    className={errors.mileage ? 'error' : ''}
                  />
                  {errors.mileage && <div className="error-message">{errors.mileage}</div>}
                </div>
                <div className="form-group">
                  <label htmlFor="location">Location *</label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className={errors.location ? 'error' : ''}
                  />
                  {errors.location && <div className="error-message">{errors.location}</div>}
                </div>
              </div>

              <div className="form-section">
                <h3>Registration Information</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="licensePlate">License Plate *</label>
                    <input
                      type="text"
                      id="licensePlate"
                      name="licensePlate"
                      value={formData.licensePlate}
                      onChange={handleInputChange}
                      className={errors.licensePlate ? 'error' : ''}
                    />
                    {errors.licensePlate && <div className="error-message">{errors.licensePlate}</div>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="vin">VIN (Vehicle Identification Number) *</label>
                    <input
                      type="text"
                      id="vin"
                      name="vin"
                      value={formData.vin}
                      onChange={handleInputChange}
                      className={errors.vin ? 'error' : ''}
                      placeholder="e.g., 1HGBH41JXMN109186"
                    />
                    {errors.vin && <div className="error-message">{errors.vin}</div>}
                    <div className="field-hint">
                      <i className="fas fa-info-circle"></i>
                      <span>17-character code unique to each vehicle (no I, O, Q characters)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="form-section">
              <h3>Specifications</h3>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="transmission">Transmission</label>
                  <select
                    id="transmission"
                    name="transmission"
                    value={formData.transmission}
                    onChange={handleInputChange}
                  >
                    <option value="Automatic">Automatic</option>
                    <option value="Manual">Manual</option>
                    <option value="Semi-Automatic">Semi-Automatic</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="fuel">Fuel Type</label>
                  <select
                    id="fuel"
                    name="fuel"
                    value={formData.fuel}
                    onChange={handleInputChange}
                  >
                    <option value="Gasoline">Gasoline</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Electric">Electric</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Plug-in Hybrid">Plug-in Hybrid</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="form-section">
              <h3>Pricing & Availability</h3>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="price">Price *</label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={handleNumberChange}
                    className={errors.price ? 'error' : ''}
                  />
                  {errors.price && <div className="error-message">{errors.price}</div>}
                </div>
                <div className="form-group">
                  <label htmlFor="priceUnit">Price Unit</label>
                  <select
                    id="priceUnit"
                    name="priceUnit"
                    value={formData.priceUnit}
                    onChange={handleInputChange}
                  >
                    <option value="day">Per Day</option>
                    <option value="hour">Per Hour</option>
                    <option value="week">Per Week</option>
                  </select>
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="status">Status</label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                  >
                    <option value="available">Available</option>
                    <option value="rented">Rented</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="unlisted">Unlisted</option>
                    <option value="pending">Pending Approval</option>
                  </select>
                  <div className="field-hint">
                    <i className="fas fa-info-circle"></i>
                    <span>'Available' cars will appear in search results, 'Pending Approval' requires admin review.</span>
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="ownerId">Owner *</label>
                  <select
                    id="ownerId"
                    name="ownerId"
                    value={formData.ownerId}
                    onChange={handleInputChange}
                    className={errors.ownerId ? 'error' : ''}
                  >
                    <option value="">Select Owner</option>
                    {owners.map(owner => (
                      <option key={owner.id} value={owner.id}>
                        {owner.name}
                      </option>
                    ))}
                  </select>
                  {errors.ownerId && <div className="error-message">{errors.ownerId}</div>}
                </div>
              </div>
            </div>
            
            <div className="form-section">
              <h3>Vehicle Images</h3>
              <div className="image-upload-section">
                <div className="image-previews">
                  {imagePreviewUrls.length > 0 ? (
                    imagePreviewUrls.map((imageUrl, index) => (
                      <div key={index} className="image-preview">
                        <img src={imageUrl} alt={`Vehicle ${index + 1}`} />
                        <button 
                          type="button" 
                          className="remove-image"
                          onClick={() => handleRemoveImage(index)}
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="no-images">No images uploaded</div>
                  )}
                  
                  {imagePreviewUrls.length < 5 && (
                    <div className="image-upload-btn">
                      <input
                        type="file"
                        id="imageUpload"
                        ref={fileInputRef}
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        style={{ display: 'none' }}
                      />
                      <button 
                        type="button" 
                        className="btn-select-images"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <i className="fas fa-plus"></i> Add Image
                      </button>
                    </div>
                  )}
                </div>
                <div className="image-instructions">
                  <p>Upload up to 5 images of the vehicle (exterior, interior, etc.)</p>
                  <p>First image will be used as the primary display image</p>
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>Description</h3>
              <div className="form-group">
                <label htmlFor="description">Vehicle Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter a detailed description of the vehicle..."
                  rows="4"
                ></textarea>
                <div className="field-hint">
                  <i className="fas fa-info-circle"></i>
                  <span>Describe the vehicle's condition, notable features, and any other relevant information.</span>
                </div>
              </div>
            </div>
            
            <div className="form-section">
              <h3>Features</h3>
              <div className="form-row feature-input-row">
                <div className="form-group feature-input">
                  <input
                    type="text"
                    id="featureInput"
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    placeholder="Add a feature..."
                  />
                </div>
                <button 
                  type="button" 
                  className="btn-add-feature"
                  onClick={handleAddFeature}
                >
                  <i className="fas fa-plus"></i> Add
                </button>
              </div>
              
              <div className="features-list">
                {formData.features.length === 0 ? (
                  <div className="no-features">No features added yet</div>
                ) : (
                  formData.features.map((feature, index) => (
                    <div key={index} className="feature-tag">
                      <span>{feature}</span>
                      <button 
                        type="button" 
                        className="btn-remove-feature"
                        onClick={() => handleRemoveFeature(index)}
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
          
          <div className="modal-footer">
            {showSuccess && (
              <div className="success-message">
                <i className="fas fa-check-circle"></i>
                <span>{carData ? 'Car updated successfully!' : 'New car added successfully!'}</span>
              </div>
            )}
            <div className="footer-buttons">
              <button 
                type="button" 
                className="btn-cancel" 
                onClick={onClose}
                disabled={isLoading}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn-save"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i> Saving...
                  </>
                ) : (
                  <>
                    <i className="fas fa-save"></i> {carData ? 'Update Car' : 'Add Car'}
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CarFormModal;