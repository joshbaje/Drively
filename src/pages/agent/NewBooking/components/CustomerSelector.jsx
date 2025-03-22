import React, { useState } from 'react';
import useBooking from '../hooks/useBooking';
import AddCustomerModal from '../../../../components/agent/AddCustomerModal';

const CustomerSelector = () => {
  const { 
    selectedCustomer, 
    showCustomerSearch, 
    customerSearchText, 
    setShowCustomerSearch, 
    setCustomerSearchText,
    setSelectedCustomer,
    getFilteredCustomers
  } = useBooking();

  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);

  const handleCustomerSearch = (e) => {
    setCustomerSearchText(e.target.value);
  };

  const handleSelectCustomer = (customer) => {
    setSelectedCustomer(customer);
    setShowCustomerSearch(false);
  };

  const filteredCustomers = getFilteredCustomers();

  return (
    <div className="customer-selection">
      <h3>Customer Information</h3>
      
      {selectedCustomer ? (
        <div className="selected-customer">
          <div className="customer-avatar">
            <img 
              src={selectedCustomer.profile_image_url || "https://ui-avatars.com/api/?name=" + encodeURIComponent(`${selectedCustomer.first_name} ${selectedCustomer.last_name}`) + "&background=FB9EC6&color=fff"} 
              alt={`${selectedCustomer.first_name} ${selectedCustomer.last_name}`} 
            />
          </div>
          <div className="customer-info">
            <div className="customer-name">
              {selectedCustomer.first_name} {selectedCustomer.last_name}
            </div>
            <div className="customer-contact">
              <div><i className="fas fa-envelope"></i> {selectedCustomer.email}</div>
              <div><i className="fas fa-phone"></i> {selectedCustomer.phone_number}</div>
            </div>
          </div>
          <button 
            className="change-customer-btn"
            onClick={() => setShowCustomerSearch(true)}
          >
            Change
          </button>
        </div>
      ) : (
        <button 
          className="select-customer-btn"
          onClick={() => setShowCustomerSearch(true)}
        >
          <i className="fas fa-user-plus"></i> Select Customer
        </button>
      )}
      
      {showCustomerSearch && (
        <div className="customer-search-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Select Customer</h3>
              <button 
                className="close-modal-btn"
                onClick={() => setShowCustomerSearch(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="customer-search">
              <input 
                type="text"
                placeholder="Search by name, email or phone..."
                value={customerSearchText}
                onChange={handleCustomerSearch}
              />
            </div>
            
            <div className="customer-list">
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map(customer => (
                  <div 
                    key={customer.id} 
                    className="customer-item"
                    onClick={() => handleSelectCustomer(customer)}
                  >
                    <div className="customer-avatar">
                      <img 
                        src={customer.profile_image_url || "https://ui-avatars.com/api/?name=" + encodeURIComponent(`${customer.first_name} ${customer.last_name}`) + "&background=FB9EC6&color=fff"} 
                        alt={`${customer.first_name} ${customer.last_name}`} 
                      />
                    </div>
                    <div className="customer-info">
                      <div className="customer-name">{customer.first_name} {customer.last_name}</div>
                      <div className="customer-email">{customer.email}</div>
                      <div className="customer-phone">{customer.phone_number}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-results">
                  <p>No customers found. Try a different search or create a new customer.</p>
                  <button 
                    className="create-customer-btn"
                    onClick={() => {
                      setShowAddCustomerModal(true);
                      setShowCustomerSearch(false);
                    }}
                  >
                    <i className="fas fa-user-plus"></i> Create New Customer
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Add Customer Modal */}
      <AddCustomerModal
        isOpen={showAddCustomerModal}
        onClose={() => setShowAddCustomerModal(false)}
        onAddCustomer={(customerData) => {
          // Convert the new customer data to the expected format
          const newCustomer = {
            id: `customer-${Date.now()}`,
            first_name: customerData.firstName,
            last_name: customerData.lastName,
            email: customerData.email,
            phone_number: customerData.phone,
            profile_image_url: null,
            // Add any other required fields
          };

          // Set this new customer as the selected customer
          setSelectedCustomer(newCustomer);
          setShowAddCustomerModal(false);
        }}
      />
    </div>
  );
};

export default CustomerSelector;
