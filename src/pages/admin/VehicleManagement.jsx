import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './VehicleManagement.css';

const VehicleManagement = () => {
  const { token } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [vehiclesPerPage] = useState(8);

  useEffect(() => {
    // Fetch vehicles data
    fetchVehicles();
  }, [token]);

  useEffect(() => {
    // Apply filters whenever filter criteria changes
    applyFilters();
  }, [searchTerm, selectedStatus, selectedType, vehicles]);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      // In a real app, this would be an API call
      // For now, we'll use mock data
      setTimeout(() => {
        const vehicleTypes = ['Sedan', 'SUV', 'Hatchback', 'Convertible', 'Pickup', 'Van', 'Luxury'];
        const makes = ['Toyota', 'Honda', 'Ford', 'Nissan', 'Mitsubishi', 'Suzuki', 'Hyundai', 'Kia'];
        const locations = ['Makati City', 'Taguig City', 'Quezon City', 'Pasig City', 'Mandaluyong', 'Alabang', 'Paranaque'];
        const colors = ['Black', 'White', 'Silver', 'Red', 'Blue', 'Gray', 'Brown'];
        const statuses = ['approved', 'pending', 'rejected', 'maintenance', 'inactive'];
        const statusProbabilities = [0.7, 0.15, 0.05, 0.05, 0.05]; // 70% approved, 15% pending, etc.

        const mockVehicles = Array.from({ length: 45 }, (_, i) => {
          // Choose status based on probability
          let status;
          const rand = Math.random();
          let cumulative = 0;
          for (let j = 0; j < statuses.length; j++) {
            cumulative += statusProbabilities[j];
            if (rand < cumulative) {
              status = statuses[j];
              break;
            }
          }

          const typeIndex = Math.floor(Math.random() * vehicleTypes.length);
          
          return {
            id: i + 1,
            make: makes[Math.floor(Math.random() * makes.length)],
            model: `Model ${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`,
            year: 2019 + Math.floor(Math.random() * 6), // 2019-2024
            color: colors[Math.floor(Math.random() * colors.length)],
            type: vehicleTypes[typeIndex],
            license_plate: `ABC ${1000 + i}`,
            daily_rate: 2000 + Math.floor(Math.random() * 5000),
            location: locations[Math.floor(Math.random() * locations.length)],
            owner_id: Math.floor(Math.random() * 20) + 1,
            owner_name: `Owner ${Math.floor(Math.random() * 20) + 1}`,
            status: status,
            listing_date: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).getTime(),
            rating: (Math.random() * 2 + 3).toFixed(1), // 3.0-5.0
            booking_count: Math.floor(Math.random() * 30),
            image_url: '/images/cars/car-placeholder.jpg'
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

  const applyFilters = () => {
    let result = [...vehicles];

    // Apply search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      result = result.filter(vehicle => 
        vehicle.make.toLowerCase().includes(search) ||
        vehicle.model.toLowerCase().includes(search) ||
        vehicle.license_plate.toLowerCase().includes(search) ||
        vehicle.owner_name.toLowerCase().includes(search)
      );
    }

    // Apply status filter
    if (selectedStatus !== 'all') {
      result = result.filter(vehicle => vehicle.status === selectedStatus);
    }

    // Apply type filter
    if (selectedType !== 'all') {
      result = result.filter(vehicle => vehicle.type === selectedType);
    }

    setFilteredVehicles(result);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusFilter = (e) => {
    setSelectedStatus(e.target.value);
  };

  const handleTypeFilter = (e) => {
    setSelectedType(e.target.value);
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const formatCurrency = (amount) => {
    return `₱${amount.toLocaleString()}`;
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'approved':
        return 'status-approved';
      case 'pending':
        return 'status-pending';
      case 'rejected':
        return 'status-rejected';
      case 'maintenance':
        return 'status-maintenance';
      case 'inactive':
        return 'status-inactive';
      default:
        return '';
    }
  };

  const handleToggleVehicleStatus = async (vehicleId, currentStatus) => {
    try {
      // In a real app, this would be an API call
      // For demo purposes, we'll update the local state directly
      const updatedVehicles = vehicles.map(vehicle => {
        if (vehicle.id === vehicleId) {
          const newStatus = currentStatus === 'approved' ? 'inactive' : 'approved';
          return { ...vehicle, status: newStatus };
        }
        return vehicle;
      });
      
      setVehicles(updatedVehicles);
      // Reapply filters
      applyFilters();
    } catch (error) {
      console.error('Error toggling vehicle status:', error);
    }
  };

  // Get unique vehicle types for the filter
  const vehicleTypes = [...new Set(vehicles.map(vehicle => vehicle.type))];

  // Pagination
  const indexOfLastVehicle = currentPage * vehiclesPerPage;
  const indexOfFirstVehicle = indexOfLastVehicle - vehiclesPerPage;
  const currentVehicles = filteredVehicles.slice(indexOfFirstVehicle, indexOfLastVehicle);
  const totalPages = Math.ceil(filteredVehicles.length / vehiclesPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading vehicles...</p>
      </div>
    );
  }

  return (
    <div className="vehicle-management">
      <div className="admin-container">
        <div className="admin-header">
          <h1 className="admin-title">Vehicle Management</h1>
          <div className="header-actions">
            <Link to="/admin/vehicles/import" className="import-btn">
              <i className="fas fa-file-import"></i> Import
            </Link>
            <Link to="/admin/vehicles/create" className="add-vehicle-btn">
              <i className="fas fa-plus"></i> Add Vehicle
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="vehicles-filters">
          <div className="search-filter">
            <i className="fas fa-search search-icon"></i>
            <input
              type="text"
              placeholder="Search vehicles..."
              value={searchTerm}
              onChange={handleSearch}
              className="search-input"
            />
          </div>

          <div className="filter-group">
            <select 
              value={selectedStatus} 
              onChange={handleStatusFilter}
              className="filter-select"
            >
              <option value="all">All Status</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
              <option value="maintenance">Maintenance</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="filter-group">
            <select 
              value={selectedType} 
              onChange={handleTypeFilter}
              className="filter-select"
            >
              <option value="all">All Types</option>
              {vehicleTypes.map((type, index) => (
                <option key={index} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Vehicle Cards Grid */}
        <div className="vehicles-grid">
          {currentVehicles.length > 0 ? (
            currentVehicles.map(vehicle => (
              <div key={vehicle.id} className="vehicle-card">
                <div className="vehicle-card-header">
                  <div className="vehicle-image">
                    <img src={vehicle.image_url} alt={`${vehicle.make} ${vehicle.model}`} />
                  </div>
                  <span className={`status-badge ${getStatusBadgeClass(vehicle.status)}`}>
                    {vehicle.status.charAt(0).toUpperCase() + vehicle.status.slice(1)}
                  </span>
                </div>
                <div className="vehicle-card-body">
                  <h3 className="vehicle-title">
                    {vehicle.year} {vehicle.make} {vehicle.model}
                  </h3>
                  <div className="vehicle-meta">
                    <div className="meta-item">
                      <i className="fas fa-tag"></i>
                      <span>{formatCurrency(vehicle.daily_rate)}/day</span>
                    </div>
                    <div className="meta-item">
                      <i className="fas fa-map-marker-alt"></i>
                      <span>{vehicle.location}</span>
                    </div>
                  </div>
                  <div className="vehicle-details">
                    <div className="detail-item">
                      <span className="detail-label">License:</span>
                      <span className="detail-value">{vehicle.license_plate}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Type:</span>
                      <span className="detail-value">{vehicle.type}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Owner:</span>
                      <span className="detail-value">{vehicle.owner_name}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Listed:</span>
                      <span className="detail-value">{formatDate(vehicle.listing_date)}</span>
                    </div>
                  </div>
                  <div className="vehicle-stats">
                    <div className="stat-item">
                      <i className="fas fa-star"></i>
                      <span>{vehicle.rating}</span>
                    </div>
                    <div className="stat-item">
                      <i className="fas fa-calendar-check"></i>
                      <span>{vehicle.booking_count} bookings</span>
                    </div>
                  </div>
                </div>
                <div className="vehicle-card-footer">
                  <Link to={`/admin/vehicles/${vehicle.id}`} className="action-button view">
                    <i className="fas fa-eye"></i> View
                  </Link>
                  <Link to={`/admin/vehicles/${vehicle.id}/edit`} className="action-button edit">
                    <i className="fas fa-edit"></i> Edit
                  </Link>
                  <button 
                    className={`action-button status-toggle ${vehicle.status === 'approved' ? 'deactivate' : 'activate'}`}
                    onClick={() => handleToggleVehicleStatus(vehicle.id, vehicle.status)}
                  >
                    {vehicle.status === 'approved' ? (
                      <>
                        <i className="fas fa-ban"></i> Deactivate
                      </>
                    ) : (
                      <>
                        <i className="fas fa-check"></i> Activate
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="no-vehicles-found">
              <div className="no-results-content">
                <i className="fas fa-car-side"></i>
                <p>No vehicles found</p>
                <p className="sub-message">Try adjusting your filters</p>
              </div>
            </div>
          )}
        </div>

        {/* Pagination */}
        {filteredVehicles.length > 0 && (
          <div className="pagination">
            <button 
              className="pagination-button"
              disabled={currentPage === 1}
              onClick={() => paginate(currentPage - 1)}
            >
              <i className="fas fa-chevron-left"></i>
            </button>
            
            <div className="pagination-pages">
              {Array.from({ length: totalPages }, (_, i) => {
                // Show limited page numbers with ellipsis for better UI
                if (
                  i === 0 || // First page
                  i === totalPages - 1 || // Last page
                  (i >= currentPage - 2 && i <= currentPage + 1) // Pages around current
                ) {
                  return (
                    <button
                      key={i + 1}
                      className={`pagination-button ${currentPage === i + 1 ? 'active' : ''}`}
                      onClick={() => paginate(i + 1)}
                    >
                      {i + 1}
                    </button>
                  );
                } else if (
                  (i === 1 && currentPage > 3) || 
                  (i === totalPages - 2 && currentPage < totalPages - 3)
                ) {
                  return <span key={`ellipsis-${i}`} className="pagination-ellipsis">...</span>;
                }
                return null;
              })}
            </div>
            
            <button 
              className="pagination-button"
              disabled={currentPage === totalPages}
              onClick={() => paginate(currentPage + 1)}
            >
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VehicleManagement;