import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import VehicleSearchForm from '../components/vehicle/VehicleSearchForm';
import VehicleCard from '../components/vehicle/VehicleCard';
import VehicleFilter from '../components/vehicle/VehicleFilter';
import './SearchPage.css';

const SearchPage = () => {
  const location = useLocation();
  const [searchParams, setSearchParams] = useState({});
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [filters, setFilters] = useState({
    priceRange: [0, 10000],
    vehicleTypes: [],
    fuelTypes: [],
    transmission: [],
    features: []
  });
  const [loading, setLoading] = useState(true);

  // Parse query params on page load
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const params = {};
    
    // Extract search parameters from URL
    for(let entry of queryParams.entries()) {
      params[entry[0]] = entry[1];
    }
    
    setSearchParams(params);
    
    // In a real application, you would fetch data from an API
    // For now, we'll use mock data
    fetchVehicles(params);
  }, [location.search]);

  // Mock function to fetch vehicles (would be replaced with API call)
  const fetchVehicles = (params) => {
    setLoading(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      // Mock vehicle data
      const mockVehicles = [
        {
          id: 1,
          make: 'Toyota',
          model: 'Vios',
          year: 2023,
          dailyRate: 2500,
          transmission: 'Automatic',
          fuelType: 'Gasoline',
          seats: 5,
          location: 'Makati City',
          rating: 4.8,
          reviewCount: 24,
          imageUrl: '/images/cars/toyota-vios.jpg',
          features: ['Bluetooth', 'USB Port', 'Backup Camera']
        },
        {
          id: 2,
          make: 'Honda',
          model: 'City',
          year: 2022,
          dailyRate: 2800,
          transmission: 'Automatic',
          fuelType: 'Gasoline',
          seats: 5,
          location: 'Quezon City',
          rating: 4.7,
          reviewCount: 19,
          imageUrl: '/images/cars/honda-city.jpg',
          features: ['Navigation System', 'Bluetooth', 'USB Port']
        },
        {
          id: 3,
          make: 'Mitsubishi',
          model: 'Montero Sport',
          year: 2021,
          dailyRate: 4200,
          transmission: 'Automatic',
          fuelType: 'Diesel',
          seats: 7,
          location: 'Taguig City',
          rating: 4.9,
          reviewCount: 32,
          imageUrl: '/images/cars/montero-sport.jpg',
          features: ['4x4', 'Bluetooth', 'Backup Camera', 'Leather Seats']
        },
        {
          id: 4,
          make: 'Kia',
          model: 'Seltos',
          year: 2023,
          dailyRate: 3500,
          transmission: 'Automatic',
          fuelType: 'Gasoline',
          seats: 5,
          location: 'Pasig City',
          rating: 4.6,
          reviewCount: 15,
          imageUrl: '/images/cars/kia-seltos.jpg',
          features: ['Panoramic Sunroof', 'Navigation System', 'Bluetooth']
        },
        {
          id: 5,
          make: 'Ford',
          model: 'Everest',
          year: 2022,
          dailyRate: 4500,
          transmission: 'Automatic',
          fuelType: 'Diesel',
          seats: 7,
          location: 'Makati City',
          rating: 4.8,
          reviewCount: 27,
          imageUrl: '/images/cars/ford-everest.jpg',
          features: ['4x4', 'Leather Seats', 'Navigation System']
        },
        {
          id: 6,
          make: 'Toyota',
          model: 'Fortuner',
          year: 2021,
          dailyRate: 4000,
          transmission: 'Automatic',
          fuelType: 'Diesel',
          seats: 7,
          location: 'Mandaluyong City',
          rating: 4.7,
          reviewCount: 22,
          imageUrl: '/images/cars/toyota-fortuner.jpg',
          features: ['Bluetooth', 'Backup Camera', 'Cruise Control']
        },
        {
          id: 7,
          make: 'Honda',
          model: 'Civic',
          year: 2023,
          dailyRate: 3200,
          transmission: 'Automatic',
          fuelType: 'Gasoline',
          seats: 5,
          location: 'Quezon City',
          rating: 4.9,
          reviewCount: 18,
          imageUrl: '/images/cars/honda-civic.jpg',
          features: ['Apple CarPlay', 'Android Auto', 'Bluetooth']
        },
        {
          id: 8,
          make: 'Nissan',
          model: 'Terra',
          year: 2022,
          dailyRate: 4200,
          transmission: 'Automatic',
          fuelType: 'Diesel',
          seats: 7,
          location: 'Alabang',
          rating: 4.6,
          reviewCount: 14,
          imageUrl: '/images/cars/nissan-terra.jpg',
          features: ['4x4', 'Leather Seats', 'Bluetooth']
        }
      ];
      
      // Filter vehicles based on search params (in a real app, this would be done server-side)
      let filteredResults = mockVehicles;
      
      if (params.location) {
        filteredResults = filteredResults.filter(vehicle => 
          vehicle.location.toLowerCase().includes(params.location.toLowerCase())
        );
      }
      
      if (params.vehicleType) {
        // This is just a placeholder. In a real app, vehicle types would be properly mapped
        const vehicleTypeMap = {
          'sedan': ['Vios', 'City', 'Civic'],
          'suv': ['Montero Sport', 'Seltos', 'Everest', 'Fortuner', 'Terra']
        };
        
        filteredResults = filteredResults.filter(vehicle => 
          vehicleTypeMap[params.vehicleType]?.includes(vehicle.model)
        );
      }
      
      setVehicles(filteredResults);
      setFilteredVehicles(filteredResults);
      setLoading(false);
    }, 1000);
  };

  // Apply filters to the vehicles
  const applyFilters = (newFilters) => {
    setFilters(newFilters);
    
    let filtered = [...vehicles];
    
    // Apply price range filter
    filtered = filtered.filter(vehicle => 
      vehicle.dailyRate >= newFilters.priceRange[0] && 
      vehicle.dailyRate <= newFilters.priceRange[1]
    );
    
    // Apply vehicle type filter
    if (newFilters.vehicleTypes.length > 0) {
      // In a real app, this would be more sophisticated
      const vehicleTypeMap = {
        'sedan': ['Vios', 'City', 'Civic'],
        'suv': ['Montero Sport', 'Seltos', 'Everest', 'Fortuner', 'Terra']
      };
      
      filtered = filtered.filter(vehicle => {
        for (const type of newFilters.vehicleTypes) {
          if (vehicleTypeMap[type]?.includes(vehicle.model)) {
            return true;
          }
        }
        return false;
      });
    }
    
    // Apply fuel type filter
    if (newFilters.fuelTypes.length > 0) {
      filtered = filtered.filter(vehicle => 
        newFilters.fuelTypes.includes(vehicle.fuelType)
      );
    }
    
    // Apply transmission filter
    if (newFilters.transmission.length > 0) {
      filtered = filtered.filter(vehicle => 
        newFilters.transmission.includes(vehicle.transmission)
      );
    }
    
    // Apply features filter
    if (newFilters.features.length > 0) {
      filtered = filtered.filter(vehicle => 
        newFilters.features.every(feature => 
          vehicle.features.includes(feature)
        )
      );
    }
    
    setFilteredVehicles(filtered);
  };

  return (
    <div className="search-page">
      <div className="search-header">
        <div className="container">
          <h1 className="search-title">Search Results</h1>
          <div className="search-form-container">
            <VehicleSearchForm initialValues={searchParams} />
          </div>
        </div>
      </div>
      
      <div className="search-results-section">
        <div className="container">
          <div className="search-results-container">
            <div className="search-sidebar">
              <VehicleFilter
                filters={filters}
                onFilterChange={applyFilters}
                availableFilters={{
                  fuelTypes: ['Gasoline', 'Diesel'],
                  transmission: ['Automatic', 'Manual'],
                  features: ['Bluetooth', 'USB Port', 'Backup Camera', 'Navigation System', 
                             'Leather Seats', '4x4', 'Panoramic Sunroof', 'Apple CarPlay', 
                             'Android Auto', 'Cruise Control']
                }}
              />
            </div>
            
            <div className="search-results">
              <div className="search-results-header">
                <h2 className="results-count">
                  {loading ? 'Searching...' : `${filteredVehicles.length} vehicles found`}
                </h2>
                <div className="results-sort">
                  <label htmlFor="sort">Sort by:</label>
                  <select id="sort" className="sort-select">
                    <option value="recommended">Recommended</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rating</option>
                    <option value="newest">Newest First</option>
                  </select>
                </div>
              </div>
              
              {loading ? (
                <div className="loading-spinner">
                  <div className="spinner"></div>
                  <p>Loading vehicles...</p>
                </div>
              ) : filteredVehicles.length === 0 ? (
                <div className="no-results">
                  <h3>No vehicles found</h3>
                  <p>Try adjusting your search criteria or filters</p>
                </div>
              ) : (
                <div className="vehicle-grid">
                  {filteredVehicles.map(vehicle => (
                    <VehicleCard key={vehicle.id} vehicle={vehicle} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;