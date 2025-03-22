import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import './AgentPortal.css';
import CarFormModal from '../../components/agent/CarFormModal';

const CarManagement = ({ showDetails = false }) => {
  const [cars, setCars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedCar, setSelectedCar] = useState(null);

  useEffect(() => {
    // In a real application, this would be an API call
    fetchCars();
    
    if (showDetails && id) {
      fetchCarDetails(id);
    }
  }, [showDetails, id]);

  const fetchCars = () => {
    // Simulate API call with mock data
    setTimeout(() => {
      const mockCars = [
        {
          id: 'car1',
          make: 'Toyota',
          model: 'Camry',
          year: 2022,
          trim: 'XLE',
          price: 75,
          priceUnit: 'day',
          status: 'available',
          mileage: 15000,
          transmission: 'Automatic',
          fuel: 'Gasoline',
          features: ['Bluetooth', 'Backup Camera', 'Apple CarPlay', 'Android Auto'],
          images: ['/assets/images/cars/camry.jpg'],
          location: 'New York',
          owner: {
            id: 'owner1',
            name: 'John Smith',
            rating: 4.8
          }
        },
        {
          id: 'car2',
          make: 'Honda',
          model: 'CR-V',
          year: 2021,
          trim: 'Touring',
          price: 85,
          priceUnit: 'day',
          status: 'available',
          mileage: 22000,
          transmission: 'Automatic',
          fuel: 'Gasoline',
          features: ['Leather Seats', 'Sunroof', 'Navigation', 'Heated Seats'],
          images: ['/assets/images/cars/crv.jpg'],
          location: 'Boston',
          owner: {
            id: 'owner2',
            name: 'Jane Wilson',
            rating: 4.6
          }
        },
        {
          id: 'car3',
          make: 'Tesla',
          model: 'Model 3',
          year: 2023,
          trim: 'Long Range',
          price: 120,
          priceUnit: 'day',
          status: 'rented',
          mileage: 8000,
          transmission: 'Automatic',
          fuel: 'Electric',
          features: ['Autopilot', 'Premium Sound', 'Heated Seats', 'Glass Roof'],
          images: ['/assets/images/cars/tesla.jpg'],
          location: 'San Francisco',
          owner: {
            id: 'owner3',
            name: 'Michael Brown',
            rating: 4.9
          }
        },
        {
          id: 'car4',
          make: 'BMW',
          model: 'X5',
          year: 2021,
          trim: 'xDrive40i',
          price: 150,
          priceUnit: 'day',
          status: 'maintenance',
          mileage: 18000,
          transmission: 'Automatic',
          fuel: 'Gasoline',
          features: ['Leather Seats', 'Panoramic Sunroof', 'Navigation', 'Premium Sound'],
          images: ['/assets/images/cars/bmw.jpg'],
          location: 'Chicago',
          owner: {
            id: 'owner4',
            name: 'Sarah Johnson',
            rating: 4.7
          }
        },
        {
          id: 'car5',
          make: 'Ford',
          model: 'Mustang',
          year: 2022,
          trim: 'GT',
          price: 110,
          priceUnit: 'day',
          status: 'available',
          mileage: 12000,
          transmission: 'Manual',
          fuel: 'Gasoline',
          features: ['Leather Seats', 'Bluetooth', 'Backup Camera', 'Apple CarPlay'],
          images: ['/assets/images/cars/mustang.jpg'],
          location: 'Miami',
          owner: {
            id: 'owner5',
            name: 'Robert Davis',
            rating: 4.5
          }
        },
        {
          id: 'car6',
          make: 'Audi',
          model: 'Q7',
          year: 2020,
          trim: 'Premium Plus',
          price: 140,
          priceUnit: 'day',
          status: 'available',
          mileage: 25000,
          transmission: 'Automatic',
          fuel: 'Gasoline',
          features: ['Leather Seats', 'Sunroof', 'Navigation', 'Heated Seats'],
          images: ['/assets/images/cars/audi.jpg'],
          location: 'Los Angeles',
          owner: {
            id: 'owner6',
            name: 'Emily Wilson',
            rating: 4.8
          }
        }
      ];
      
      setCars(mockCars);
      setIsLoading(false);
    }, 1000);
  };

  const fetchCarDetails = (carId) => {
    // In a real app, this would be a separate API call
    // Here we're just using the mock data
    setTimeout(() => {
      const car = cars.find(c => c.id === carId) || null;
      setSelectedCar(car);
    }, 500);
  };

  // Filter cars based on search term and status
  const filteredCars = cars.filter(car => {
    const matchesSearch = car.make.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         car.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         `${car.year}`.includes(searchTerm);
    
    const matchesStatus = filterStatus === 'all' || car.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  // State for car form modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCar, setEditingCar] = useState(null);

  // Handle adding a new car
  const handleAddCar = () => {
    setEditingCar(null); // Ensure we're not in edit mode
    setIsModalOpen(true);
  };

  // Handle editing a car
  const handleEditCar = (car) => {
    setEditingCar(car);
    setIsModalOpen(true);
  };

  // Handle saving a car (new or edited)
  const handleSaveCar = (carData) => {
    // For a new car
    if (!editingCar) {
      // In a real app, this would be an API call to create a new car
      // For now, we'll just add it to our local state with a mock ID
      const newCar = {
        ...carData,
        id: `car${cars.length + 1}`,
        images: ['/assets/images/placeholder-car.jpg']
      };
      
      setCars([...cars, newCar]);
    } else {
      // For editing an existing car
      // In a real app, this would be an API call to update the car
      const updatedCars = cars.map(car => 
        car.id === editingCar.id ? { ...car, ...carData } : car
      );
      
      setCars(updatedCars);
    }
    
    setIsModalOpen(false);
  };

  if (isLoading) {
    return <div>Loading car data...</div>;
  }

  // If viewing details of a specific car
  if (showDetails && id) {
    if (!selectedCar) {
      return <div>Car not found or loading...</div>;
    }

    return (
      <div className="car-details">
        <div className="car-details-header">
          <button 
            className="back-button"
            onClick={() => navigate('/agent/cars')}
          >
            <i className="fas fa-arrow-left"></i> Back to Cars
          </button>
          <h2>{selectedCar.year} {selectedCar.make} {selectedCar.model} {selectedCar.trim}</h2>
        </div>

        <div className="car-details-content">
          <div className="car-details-main">
            <div className="car-details-image">
              <img src={selectedCar.images && selectedCar.images.length > 0 ? selectedCar.images[0] : '/assets/images/placeholder-car.jpg'} alt={`${selectedCar.make} ${selectedCar.model}`} />
            </div>
            <div className="car-details-info">
              <div className="car-info-section">
                <h3>Car Information</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <div className="info-label">Make</div>
                    <div className="info-value">{selectedCar.make}</div>
                  </div>
                  <div className="info-item">
                    <div className="info-label">Model</div>
                    <div className="info-value">{selectedCar.model}</div>
                  </div>
                  <div className="info-item">
                    <div className="info-label">Year</div>
                    <div className="info-value">{selectedCar.year}</div>
                  </div>
                  <div className="info-item">
                    <div className="info-label">Trim</div>
                    <div className="info-value">{selectedCar.trim}</div>
                  </div>
                  <div className="info-item">
                    <div className="info-label">Mileage</div>
                    <div className="info-value">{selectedCar.mileage.toLocaleString()} miles</div>
                  </div>
                  <div className="info-item">
                    <div className="info-label">Transmission</div>
                    <div className="info-value">{selectedCar.transmission}</div>
                  </div>
                  <div className="info-item">
                    <div className="info-label">Fuel Type</div>
                    <div className="info-value">{selectedCar.fuel}</div>
                  </div>
                  <div className="info-item">
                    <div className="info-label">Location</div>
                    <div className="info-value">{selectedCar.location}</div>
                  </div>
                  <div className="info-item">
                    <div className="info-label">Status</div>
                    <div className="info-value">
                      <span className={`car-status ${selectedCar.status}`}>
                        {selectedCar.status.charAt(0).toUpperCase() + selectedCar.status.slice(1)}
                      </span>
                    </div>
                  </div>
                  <div className="info-item">
                    <div className="info-label">Daily Rate</div>
                    <div className="info-value">${selectedCar.price}/{selectedCar.priceUnit}</div>
                  </div>
                </div>
              </div>

              <div className="car-info-section">
                <h3>Features</h3>
                <div className="features-list">
                  {selectedCar.features.map((feature, index) => (
                    <div key={index} className="feature-item">
                      <i className="fas fa-check"></i> {feature}
                    </div>
                  ))}
                </div>
              </div>

              <div className="car-info-section">
                <h3>Owner Information</h3>
                <div className="owner-info">
                  <div className="info-item">
                    <div className="info-label">Name</div>
                    <div className="info-value">{selectedCar.owner.name}</div>
                  </div>
                  <div className="info-item">
                    <div className="info-label">Rating</div>
                    <div className="info-value">
                      {selectedCar.owner.rating} <i className="fas fa-star" style={{ color: '#f1c40f' }}></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="car-action-buttons">
            <button className="action-button edit">
              <i className="fas fa-edit"></i> Edit Car Details
            </button>
            <button className="action-button schedule">
              <i className="fas fa-calendar-alt"></i> View Availability
            </button>
            <button className="action-button book">
              <i className="fas fa-plus-circle"></i> Create Booking
            </button>
            {selectedCar.status === 'available' ? (
              <button className="action-button maintenance">
                <i className="fas fa-tools"></i> Set to Maintenance
              </button>
            ) : selectedCar.status === 'maintenance' ? (
              <button className="action-button available">
                <i className="fas fa-check"></i> Set as Available
              </button>
            ) : null}
          </div>
        </div>
      </div>
    );
  }

  // Regular car management view
  return (
    <div className="car-management">
      <div className="car-management-header">
        <div>
          <h2 className="section-title">Car Management</h2>
          <div className="car-count">{filteredCars.length} cars</div>
        </div>
        <button className="add-car-btn" onClick={handleAddCar}>
          <i className="fas fa-plus"></i> Add New Car
        </button>
      </div>

      <div className="booking-search-row">
        <div className="booking-search">
          <input
            type="text"
            placeholder="Search by make, model, or year..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <i className="fas fa-search"></i>
        </div>

        <div className="filter-group">
          <select 
            className="filter-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="available">Available</option>
            <option value="rented">Rented</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </div>
      </div>

      <div className="car-grid">
        {filteredCars.map(car => (
          <div key={car.id} className="car-card">
            <img 
              src={car.images && car.images.length > 0 ? car.images[0] : '/assets/images/placeholder-car.jpg'} 
              alt={`${car.make} ${car.model}`} 
              className="car-image" 
            />
            <div className="car-info">
              <h3 className="car-title">{car.year} {car.make} {car.model}</h3>
              <div className="car-details">
                <div className="car-trim">{car.trim}</div>
                <div className="car-mileage">{car.mileage.toLocaleString()} miles</div>
                <div className="car-location">
                  <i className="fas fa-map-marker-alt"></i> {car.location}
                </div>
              </div>
              <div className="car-price">${car.price}/{car.priceUnit}</div>
            </div>
            <div className="car-actions">
              <span className={`car-status ${car.status}`}>
                {car.status.charAt(0).toUpperCase() + car.status.slice(1)}
              </span>
              <div className="car-buttons">
                <Link to={`/agent/cars/${car.id}`} className="table-action-btn">
                  <i className="fas fa-eye"></i>
                </Link>
                <button 
                  className="table-action-btn"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent navigation
                    handleEditCar(car);
                  }}
                >
                  <i className="fas fa-edit"></i>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Car Form Modal */}
      <CarFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveCar}
        carData={editingCar}
      />
    </div>
  );
};

export default CarManagement;