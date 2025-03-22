import React, { useState } from 'react';

const AddCustomerModal = ({ isOpen, onClose, onAddCustomer }) => {
  const [newCustomer, setNewCustomer] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    drivingLicense: '',
    licenseState: '',
    dateOfBirth: ''
  });

  // Handle input change for new customer form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCustomer(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission for new customer
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Call the parent's onAddCustomer function with the new customer data
    onAddCustomer(newCustomer);
    
    // Reset the form
    setNewCustomer({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      drivingLicense: '',
      licenseState: '',
      dateOfBirth: ''
    });
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Add New Customer</h2>
          <button 
            className="modal-close" 
            onClick={onClose}
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">First Name *</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={newCustomer.firstName}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="lastName">Last Name *</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={newCustomer.lastName}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={newCustomer.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone *</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={newCustomer.phone}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="address">Address</label>
            <input
              type="text"
              id="address"
              name="address"
              value={newCustomer.address}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="drivingLicense">Driver's License #</label>
              <input
                type="text"
                id="drivingLicense"
                name="drivingLicense"
                value={newCustomer.drivingLicense}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="licenseState">State/Province</label>
              <input
                type="text"
                id="licenseState"
                name="licenseState"
                value={newCustomer.licenseState}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="dateOfBirth">Date of Birth</label>
            <input
              type="date"
              id="dateOfBirth"
              name="dateOfBirth"
              value={newCustomer.dateOfBirth}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-save">
              Create Customer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCustomerModal;