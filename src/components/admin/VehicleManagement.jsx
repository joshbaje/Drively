import React, { useState, useEffect } from 'react';
import './VehicleManagement.css';

const VehicleManagement = () => {
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [vehiclesPerPage] = useState(9);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    type: 'all',
    status: 'all',
    approved: 'all'
  });
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  useEffect(() => {
    // Fetch vehicles from API
    // This is a placeholder - replace with actual API call
    const fetchVehicles = async () => {
      try {
        setLoading(true);
        
        // Simulating API call with mock data
        // In a real implementation, you would fetch this from your backend
        setTimeout(() => {
          const vehicleTypes = ['sedan', 'suv', 'truck', 'convertible', 'van'];
          const makes = ['Toyota', 'Honda', 'Ford', 'Hyundai', 'Mazda', 'Kia', 'Nissan'];
          const colors = ['Red', 'Blue', 'White', 'Black', 'Silver', 'Gray'];
          const statusOptions = ['available', 'rented', 'maintenance', 'unlisted'];
          
          const mockVehicles = Array.from({ length: 30 }, (_, i) => {
            const make = makes[Math.floor(Math.random() * makes.length)];
            const model = `Model ${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`;
            const year = 2015 + Math.floor(Math.random() * 10);
            
            return {
              vehicle_id: `veh-${i + 1}`,
              owner_id: `user-${Math.floor(Math.random() * 10) + 1}`,
              owner_name: `Owner ${Math.floor(Math.random() * 10) + 1}`,
              make,
              model,
              year,
              color: colors[Math.floor(Math.random() * colors.length)],
              license_plate: `ABC ${Math.floor(Math.random() * 9000) + 1000}`,
              vehicle_type: vehicleTypes[Math.floor(Math.random() * vehicleTypes.length)],
              transmission: Math.random() > 0.3 ? 'automatic' : 'manual',
              fuel_type: ['gasoline', 'diesel', 'electric', 'hybrid'][Math.floor(Math.random() * 4)],
              seats: Math.floor(Math.random() * 5) + 2,
              is_available: Math.random() > 0.3,
              availability_status: statusOptions[Math.floor(Math.random() * statusOptions.length)],
              is_approved: Math.random() > 0.2,
              is_featured: Math.random() > 0.8,
              avg_rating: parseFloat((Math.random() * 2 + 3).toFixed(1)),
              daily_rate: Math.floor(Math.random() * 3000) + 1000,
              location: `${['Makati', 'Manila', 'Quezon City', 'Taguig', 'Pasig'][Math.floor(Math.random() * 5)]}, Philippines`,
              image_url: `https://via.placeholder.com/400x200.png?text=${make}+${model}+${year}`,
              created_at: new Date(
                2023,
                Math.floor(Math.random() * 12),
                Math.floor(Math.random() * 28) + 1
              ).toISOString()
            };
          });
          
          setVehicles(mockVehicles);
          setFilteredVehicles(mockVehicles);
          setLoading(false);
        }, 1000);
        
      } catch (error) {
        console.error('Error fetching vehicles:', error);
        setLoading(false);
      }
    };
    
    fetchVehicles();
  }, []);
  
  useEffect(() => {
    // Filter vehicles based on search term and filters
    const filtered = vehicles.filter(vehicle => {
      // Search by make, model, owner, plate
      const searchMatch = 
        `${vehicle.make} ${vehicle.model} ${vehicle.year}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.license_plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.owner_name.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Filter by vehicle type
      const typeMatch = 
        filters.type === 'all' || 
        vehicle.vehicle_type === filters.type;
      
      // Filter by availability status
      const statusMatch = 
        filters.status === 'all' || 
        vehicle.availability_status === filters.status;
      
      // Filter by approval status
      let approvedMatch = true;
      if (filters.approved === 'approved') {
        approvedMatch = vehicle.is_approved;
      } else if (filters.approved === 'pending') {
        approvedMatch = !vehicle.is_approved;
      }
      
      return searchMatch && typeMatch && statusMatch && approvedMatch;
    });
    
    setFilteredVehicles(filtered);
    setCurrentPage(1); // Reset to first page on filter change
  }, [searchTerm, filters, vehicles]);
  
  // Get current vehicles for pagination
  const indexOfLastVehicle = currentPage * vehiclesPerPage;
  const indexOfFirstVehicle = indexOfLastVehicle - vehiclesPerPage;
  const currentVehicles = filteredVehicles.slice(indexOfFirstVehicle, indexOfLastVehicle);
  
  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleViewVehicle = (vehicle) => {
    setSelectedVehicle(vehicle);
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedVehicle(null);
  };
  
  const handleEditVehicle = (vehicle) => {
    // Implement edit vehicle functionality
    console.log('Edit vehicle:', vehicle);
  };
  
  const handleDeleteVehicle = (vehicle) => {
    // Implement delete vehicle functionality
    if (window.confirm(`Are you sure you want to delete vehicle ${vehicle.make} ${vehicle.model}?`)) {
      console.log('Delete vehicle:', vehicle);
    }
  };
  
  const handleApproveVehicle = (vehicle) => {
    // Implement approve vehicle functionality
    console.log('Approve vehicle:', vehicle);
  };
  
  const handleRejectVehicle = (vehicle) => {
    // Implement reject vehicle functionality
    console.log('Reject vehicle:', vehicle);
  };
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading vehicles...</p>
      </div>
    );
  }
  
  return (
    <div className="vehicles-container">
      <div className="vehicles-header">
        <h2>Vehicle Management</h2>
        <div className="vehicles-actions">
          <button className="btn-primary">
            <i className="fas fa-plus"></i> Add New Vehicle
          </button>
          <button className="btn-secondary">
            <i className="fas fa-download"></i> Export
          </button>
        </div>
      </div>
      
      <div className="vehicles-filter">
        <div className="filter-group search-input">
          <label htmlFor="search">Search Vehicles</label>
          <input
            type="text"
            id="search"
            placeholder="Search by make, model, owner, plate..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        
        <div className="filter-group">
          <label htmlFor="type">Vehicle Type</label>
          <select
            id="type"
            name="type"
            value={filters.type}
            onChange={handleFilterChange}
          >
            <option value="all">All Types</option>
            <option value="sedan">Sedan</option>
            <option value="suv">SUV</option>
            <option value="truck">Truck</option>
            <option value="convertible">Convertible</option>
            <option value="van">Van</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
          >
            <option value="all">All Status</option>
            <option value="available">Available</option>
            <option value="rented">Rented</option>
            <option value="maintenance">Maintenance</option>
            <option value="unlisted">Unlisted</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label htmlFor="approved">Approval</label>
          <select
            id="approved"
            name="approved"
            value={filters.approved}
            onChange={handleFilterChange}
          >
            <option value="all">All</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending Approval</option>
          </select>
        </div>
      </div>
      
      <div className="vehicles-grid">
        {currentVehicles.length > 0 ? (
          currentVehicles.map(vehicle => (
            <div key={vehicle.vehicle_id} className="vehicle-card">
              <div className="vehicle-image">
                <img src={vehicle.image_url} alt={`${vehicle.make} ${vehicle.model}`} />
                
                <div className={`vehicle-status status-${vehicle.availability_status}`}>
                  {vehicle.availability_status.charAt(0).toUpperCase() + vehicle.availability_status.slice(1)}
                </div>
                
                {vehicle.is_featured && (
                  <div className="featured-badge">Featured</div>
                )}
                
                <div className={`approval-badge approval-${vehicle.is_approved ? 'approved' : 'pending'}`}>
                  {vehicle.is_approved ? 'Approved' : 'Pending Approval'}
                </div>
              </div>
              
              <div className="vehicle-info">
                <h3 className="vehicle-title">{vehicle.year} {vehicle.make} {vehicle.model}</h3>
                <div className="vehicle-owner">Owner: {vehicle.owner_name}</div>
                <div className="vehicle-price">₱{vehicle.daily_rate.toLocaleString()} / day</div>
                
                <div className="vehicle-specs">
                  <div className="spec-item">
                    <i className="fas fa-car"></i> {vehicle.vehicle_type}
                  </div>
                  <div className="spec-item">
                    <i className="fas fa-gas-pump"></i> {vehicle.fuel_type}
                  </div>
                  <div className="spec-item">
                    <i className="fas fa-cog"></i> {vehicle.transmission}
                  </div>
                  <div className="spec-item">
                    <i className="fas fa-users"></i> {vehicle.seats} seats
                  </div>
                </div>
                
                <div className="vehicle-location">
                  <i className="fas fa-map-marker-alt"></i> {vehicle.location}
                </div>
                
                <div className="vehicle-rating">
                  <span className="rating-stars">
                    <i className="fas fa-star"></i>
                  </span>
                  {vehicle.avg_rating} ({Math.floor(Math.random() * 50) + 1} reviews)
                </div>
              </div>
              
              <div className="vehicle-footer">
                <div>{vehicle.license_plate}</div>
                <div className="vehicle-actions">
                  <button 
                    className="action-button action-view" 
                    onClick={() => handleViewVehicle(vehicle)}
                    title="View Vehicle"
                  >
                    <i className="fas fa-eye"></i>
                  </button>
                  <button 
                    className="action-button action-edit" 
                    onClick={() => handleEditVehicle(vehicle)}
                    title="Edit Vehicle"
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                  <button 
                    className="action-button action-delete" 
                    onClick={() => handleDeleteVehicle(vehicle)}
                    title="Delete Vehicle"
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                  {!vehicle.is_approved && (
                    <button 
                      className="action-button action-approve" 
                      onClick={() => handleApproveVehicle(vehicle)}
                      title="Approve Vehicle"
                    >
                      <i className="fas fa-check"></i>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-results">
            <i className="fas fa-car-side"></i>
            <p>No vehicles found matching your criteria.</p>
          </div>
        )}
      </div>
      
      {/* Pagination */}
      {filteredVehicles.length > vehiclesPerPage && (
        <div className="pagination">
          <button 
            onClick={() => paginate(currentPage - 1)} 
            disabled={currentPage === 1}
          >
            <i className="fas fa-chevron-left"></i>
          </button>
          
          {Array.from({ length: Math.ceil(filteredVehicles.length / vehiclesPerPage) }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => paginate(i + 1)}
              className={currentPage === i + 1 ? 'active' : ''}
            >
              {i + 1}
            </button>
          ))}
          
          <button 
            onClick={() => paginate(currentPage + 1)} 
            disabled={currentPage === Math.ceil(filteredVehicles.length / vehiclesPerPage)}
          >
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      )}
      
      {/* Vehicle Detail Modal */}
      {isModalOpen && selectedVehicle && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="vehicle-detail-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Vehicle Details</h3>
              <button className="modal-close" onClick={closeModal}>×</button>
            </div>
            <div className="modal-body">
              <div className="vehicle-gallery">
                <div className="gallery-item">
                  <img src={selectedVehicle.image_url} alt={`${selectedVehicle.make} ${selectedVehicle.model}`} />
                </div>
                {/* Placeholder for additional images */}
                <div className="gallery-item">
                  <img src={`https://via.placeholder.com/150?text=Interior`} alt="Interior" />
                </div>
                <div className="gallery-item">
                  <img src={`https://via.placeholder.com/150?text=Exterior`} alt="Exterior" />
                </div>
                <div className="gallery-item">
                  <img src={`https://via.placeholder.com/150?text=Detail`} alt="Detail" />
                </div>
              </div>
              
              <div className="vehicle-details">
                <div className="detail-section">
                  <h4>Vehicle Information</h4>
                  <div className="detail-row">
                    <div className="detail-label">Make:</div>
                    <div className="detail-value">{selectedVehicle.make}</div>
                  </div>
                  <div className="detail-row">
                    <div className="detail-label">Model:</div>
                    <div className="detail-value">{selectedVehicle.model}</div>
                  </div>
                  <div className="detail-row">
                    <div className="detail-label">Year:</div>
                    <div className="detail-value">{selectedVehicle.year}</div>
                  </div>
                  <div className="detail-row">
                    <div className="detail-label">Color:</div>
                    <div className="detail-value">{selectedVehicle.color}</div>
                  </div>
                  <div className="detail-row">
                    <div className="detail-label">Type:</div>
                    <div className="detail-value">{selectedVehicle.vehicle_type}</div>
                  </div>
                  <div className="detail-row">
                    <div className="detail-label">Transmission:</div>
                    <div className="detail-value">{selectedVehicle.transmission}</div>
                  </div>
                  <div className="detail-row">
                    <div className="detail-label">Fuel Type:</div>
                    <div className="detail-value">{selectedVehicle.fuel_type}</div>
                  </div>
                  <div className="detail-row">
                    <div className="detail-label">Seats:</div>
                    <div className="detail-value">{selectedVehicle.seats}</div>
                  </div>
                  <div className="detail-row">
                    <div className="detail-label">License Plate:</div>
                    <div className="detail-value">{selectedVehicle.license_plate}</div>
                  </div>
                </div>
                
                <div className="detail-section">
                  <h4>Listing Information</h4>
                  <div className="detail-row">
                    <div className="detail-label">Owner:</div>
                    <div className="detail-value">{selectedVehicle.owner_name}</div>
                  </div>
                  <div className="detail-row">
                    <div className="detail-label">Daily Rate:</div>
                    <div className="detail-value">₱{selectedVehicle.daily_rate.toLocaleString()}</div>
                  </div>
                  <div className="detail-row">
                    <div className="detail-label">Location:</div>
                    <div className="detail-value">{selectedVehicle.location}</div>
                  </div>
                  <div className="detail-row">
                    <div className="detail-label">Status:</div>
                    <div className="detail-value">{selectedVehicle.availability_status}</div>
                  </div>
                  <div className="detail-row">
                    <div className="detail-label">Available:</div>
                    <div className="detail-value">{selectedVehicle.is_available ? 'Yes' : 'No'}</div>
                  </div>
                  <div className="detail-row">
                    <div className="detail-label">Approved:</div>
                    <div className="detail-value">{selectedVehicle.is_approved ? 'Yes' : 'No'}</div>
                  </div>
                  <div className="detail-row">
                    <div className="detail-label">Featured:</div>
                    <div className="detail-value">{selectedVehicle.is_featured ? 'Yes' : 'No'}</div>
                  </div>
                  <div className="detail-row">
                    <div className="detail-label">Rating:</div>
                    <div className="detail-value">{selectedVehicle.avg_rating} / 5</div>
                  </div>
                  <div className="detail-row">
                    <div className="detail-label">Created:</div>
                    <div className="detail-value">{formatDate(selectedVehicle.created_at)}</div>
                  </div>
                </div>
              </div>
              
              {!selectedVehicle.is_approved && (
                <div className="approval-section">
                  <h4>Approval Actions</h4>
                  <p>This vehicle is pending approval. Please review the details and take action.</p>
                  <div className="approval-buttons">
                    <button 
                      className="btn-approve" 
                      onClick={() => handleApproveVehicle(selectedVehicle)}
                    >
                      <i className="fas fa-check"></i> Approve Vehicle
                    </button>
                    <button 
                      className="btn-reject" 
                      onClick={() => handleRejectVehicle(selectedVehicle)}
                    >
                      <i className="fas fa-times"></i> Reject Vehicle
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleManagement;
