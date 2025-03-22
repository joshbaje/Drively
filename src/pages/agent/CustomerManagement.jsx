import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import './AgentPortal.css';
import AddCustomerModal from '../../components/agent/AddCustomerModal';

const CustomerManagement = ({ showDetails = false }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filterText, setFilterText] = useState('');
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    if (showDetails && id) {
      fetchCustomerDetails(id);
    }
  }, [showDetails, id]);

  const fetchCustomers = () => {
    // Simulate API call with mock data
    setTimeout(() => {
      const mockCustomers = [
        {
          id: 'cust1',
          firstName: 'John',
          lastName: 'Smith',
          email: 'john.smith@example.com',
          phone: '(555) 123-4567',
          status: 'active',
          totalBookings: 3,
          createdAt: '2024-12-15'
        },
        {
          id: 'cust2',
          firstName: 'Jane',
          lastName: 'Johnson',
          email: 'jane.johnson@example.com',
          phone: '(555) 234-5678',
          status: 'active',
          totalBookings: 1,
          createdAt: '2025-01-20'
        },
        {
          id: 'cust3',
          firstName: 'Michael',
          lastName: 'Wilson',
          email: 'michael.wilson@example.com',
          phone: '(555) 345-6789',
          status: 'active',
          totalBookings: 0,
          createdAt: '2025-03-05'
        },
        {
          id: 'cust4',
          firstName: 'Emily',
          lastName: 'Brown',
          email: 'emily.brown@example.com',
          phone: '(555) 456-7890',
          status: 'inactive',
          totalBookings: 2,
          createdAt: '2024-11-10'
        },
        {
          id: 'cust5',
          firstName: 'Robert',
          lastName: 'Johnson',
          email: 'robert.johnson@example.com',
          phone: '(555) 567-8901',
          status: 'active',
          totalBookings: 5,
          createdAt: '2024-09-30'
        }
      ];
      
      setCustomers(mockCustomers);
      setIsLoading(false);
    }, 1000);
  };

  const fetchCustomerDetails = (customerId) => {
    // Simulate API call for customer details
    setTimeout(() => {
      const mockCustomerDetails = {
        id: customerId,
        firstName: 'John',
        lastName: 'Smith',
        email: 'john.smith@example.com',
        phone: '(555) 123-4567',
        address: '123 Main St, Anytown, AN 12345',
        drivingLicense: 'DL12345678',
        licenseState: 'California',
        dateOfBirth: '1985-06-15',
        status: 'active',
        totalBookings: 3,
        createdAt: '2024-12-15',
        bookingHistory: [
          {
            id: 'bk12345',
            vehicle: '2022 Toyota Camry',
            startDate: '2025-04-01',
            endDate: '2025-04-05',
            amount: 402.89,
            status: 'confirmed'
          },
          {
            id: 'bk12330',
            vehicle: '2021 Honda Accord',
            startDate: '2025-02-10',
            endDate: '2025-02-15',
            amount: 375.50,
            status: 'completed'
          },
          {
            id: 'bk12320',
            vehicle: '2023 Ford Mustang',
            startDate: '2025-01-05',
            endDate: '2025-01-10',
            amount: 650.75,
            status: 'completed'
          }
        ],
        notes: [
          {
            id: 'note1',
            content: 'Customer prefers automatic transmission vehicles.',
            createdBy: 'Maria Johnson',
            createdAt: '2025-01-10T14:30:00'
          },
          {
            id: 'note2',
            content: 'Called to confirm upcoming booking details.',
            createdBy: 'David Lee',
            createdAt: '2025-03-15T11:45:00'
          }
        ]
      };
      
      setSelectedCustomer(mockCustomerDetails);
    }, 500);
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Filter customers based on search text
  const filteredCustomers = customers.filter(customer => {
    const fullName = `${customer.firstName} ${customer.lastName}`.toLowerCase();
    const searchText = filterText.toLowerCase();
    return (
      fullName.includes(searchText) ||
      customer.email.toLowerCase().includes(searchText) ||
      customer.phone.includes(searchText)
    );
  });

  if (isLoading && !showDetails) {
    return <div>Loading customers...</div>;
  }

  // Render customer details if in detail view
  if (showDetails && selectedCustomer) {
    return (
      <div className="customer-details">
        <div className="section-header">
          <div className="back-button" onClick={() => navigate('/agent/customers')}>
            <i className="fas fa-arrow-left"></i> Back to Customers
          </div>
          <div className="header-actions">
            <button className="btn-edit">
              <i className="fas fa-edit"></i> Edit
            </button>
            <button className="btn-delete">
              <i className="fas fa-trash-alt"></i> Deactivate
            </button>
          </div>
        </div>

        <div className="customer-profile">
          <div className="profile-header">
            <div className="profile-avatar">
              <i className="fas fa-user"></i>
            </div>
            <div className="profile-info">
              <h2>{selectedCustomer.firstName} {selectedCustomer.lastName}</h2>
              <div className="profile-metadata">
                <span><i className="fas fa-envelope"></i> {selectedCustomer.email}</span>
                <span><i className="fas fa-phone"></i> {selectedCustomer.phone}</span>
                <span className={`customer-status ${selectedCustomer.status}`}>
                  {selectedCustomer.status.charAt(0).toUpperCase() + selectedCustomer.status.slice(1)}
                </span>
              </div>
            </div>
          </div>

          <div className="profile-content">
            <div className="profile-section">
              <h3>Personal Information</h3>
              <div className="profile-details">
                <div className="detail-row">
                  <div className="detail-label">Address</div>
                  <div className="detail-value">{selectedCustomer.address}</div>
                </div>
                <div className="detail-row">
                  <div className="detail-label">Date of Birth</div>
                  <div className="detail-value">{formatDate(selectedCustomer.dateOfBirth)}</div>
                </div>
                <div className="detail-row">
                  <div className="detail-label">Driver's License</div>
                  <div className="detail-value">{selectedCustomer.drivingLicense} ({selectedCustomer.licenseState})</div>
                </div>
                <div className="detail-row">
                  <div className="detail-label">Customer Since</div>
                  <div className="detail-value">{formatDate(selectedCustomer.createdAt)}</div>
                </div>
              </div>
            </div>

            <div className="profile-section">
              <div className="section-header">
                <h3>Booking History</h3>
                <button className="btn-new-booking" onClick={() => navigate('/agent/bookings/new', { state: { customerId: selectedCustomer.id } })}>
                  <i className="fas fa-plus"></i> New Booking
                </button>
              </div>
              
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Booking ID</th>
                    <th>Vehicle</th>
                    <th>Dates</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedCustomer.bookingHistory.map(booking => (
                    <tr key={booking.id}>
                      <td>{booking.id}</td>
                      <td>{booking.vehicle}</td>
                      <td>{formatDate(booking.startDate)} - {formatDate(booking.endDate)}</td>
                      <td>${booking.amount.toFixed(2)}</td>
                      <td>
                        <span className={`table-status ${
                          booking.status === 'confirmed' ? 'active' : 
                          booking.status === 'completed' ? 'inactive' : 'pending'
                        }`}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                      </td>
                      <td>
                        <div className="table-actions">
                          <Link to={`/agent/bookings/${booking.id}`} className="table-action-btn">
                            <i className="fas fa-eye"></i>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="profile-section">
              <div className="section-header">
                <h3>Notes</h3>
                <button className="btn-add-note">
                  <i className="fas fa-plus"></i> Add Note
                </button>
              </div>
              
              <div className="notes-list">
                {selectedCustomer.notes.map(note => (
                  <div key={note.id} className="note-item">
                    <div className="note-content">{note.content}</div>
                    <div className="note-meta">
                      <span className="note-by">{note.createdBy}</span>
                      <span className="note-date">{formatDate(note.createdAt)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render customer list view
  return (
    <div className="customer-management">
      <div className="section-actions">
        <div className="search-container">
          <div className="global-search">
            <i className="fas fa-search"></i>
            <input 
              type="text" 
              placeholder="Search customers..." 
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
            />
          </div>
          <button 
            className="btn-add-customer"
            onClick={() => setShowAddCustomerModal(true)}
          >
            <i className="fas fa-user-plus"></i> Add Customer
          </button>
        </div>
      </div>

      <div className="customer-list">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Bookings</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map(customer => (
              <tr key={customer.id}>
                <td>{customer.firstName} {customer.lastName}</td>
                <td>{customer.email}</td>
                <td>{customer.phone}</td>
                <td>
                  <span className={`table-status ${customer.status === 'active' ? 'active' : 'inactive'}`}>
                    {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                  </span>
                </td>
                <td>{customer.totalBookings}</td>
                <td>{formatDate(customer.createdAt)}</td>
                <td>
                  <div className="table-actions">
                    <Link to={`/agent/customers/${customer.id}`} className="table-action-btn">
                      <i className="fas fa-eye"></i>
                    </Link>
                    <Link to={`/agent/bookings/new?customer=${customer.id}`} className="table-action-btn">
                      <i className="fas fa-calendar-plus"></i>
                    </Link>
                    <button className="table-action-btn">
                      <i className="fas fa-edit"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Customer Modal */}
      <AddCustomerModal 
        isOpen={showAddCustomerModal}
        onClose={() => setShowAddCustomerModal(false)}
        onAddCustomer={(customerData) => {
          // In a real app, this would be an API call to create the customer
          console.log('Creating new customer:', customerData);
          
          // Simulate successful creation
          setTimeout(() => {
            const newCustomerId = `cust${customers.length + 1}`;
            const createdCustomer = {
              id: newCustomerId,
              firstName: customerData.firstName,
              lastName: customerData.lastName,
              email: customerData.email,
              phone: customerData.phone,
              status: 'active',
              totalBookings: 0,
              createdAt: new Date().toISOString().split('T')[0]
            };
            
            setCustomers([...customers, createdCustomer]);
            setShowAddCustomerModal(false);
            
            // Optionally, navigate to the new customer's details page
            navigate(`/agent/customers/${newCustomerId}`);
          }, 1000);
        }}
      />
    </div>
  );
};

export default CustomerManagement;