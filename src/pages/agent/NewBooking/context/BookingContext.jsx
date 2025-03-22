import React, { createContext, useState, useEffect } from 'react';
import { 
  mockCustomers, 
  mockVehicles, 
  mockInsuranceOptions,
  initialBookingData,
  initialVehicleFilters,
  initialPricingSummary 
} from '../data/mockData';

// Create context
export const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
  // State for loading indicator
  const [isLoading, setIsLoading] = useState(false);
  
  // State for customers, vehicles, and options
  const [customers, setCustomers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [insuranceOptions, setInsuranceOptions] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  
  // State for selections
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  
  // State for modal
  const [showCustomerSearch, setShowCustomerSearch] = useState(false);
  const [customerSearchText, setCustomerSearchText] = useState('');
  
  // State for form data
  const [bookingData, setBookingData] = useState(initialBookingData);
  const [currentStep, setCurrentStep] = useState(1);
  const [pricingSummary, setPricingSummary] = useState(initialPricingSummary);
  const [vehicleFilters, setVehicleFilters] = useState(initialVehicleFilters);

  // Load mock data on component mount
  useEffect(() => {
    loadCustomers();
    loadVehicles();
    loadInsuranceOptions();
  }, []);

  // Filter vehicles when filters change
  useEffect(() => {
    filterVehicles();
  }, [vehicles, vehicleFilters]);

  // Calculate pricing when relevant data changes
  useEffect(() => {
    if (selectedVehicle && bookingData.startDate && bookingData.endDate) {
      calculatePricing();
    }
  }, [selectedVehicle, bookingData.startDate, bookingData.endDate, bookingData.insuranceOption]);

  // Load mock customers
  const loadCustomers = () => {
    setIsLoading(true);
    // Simulating API call with setTimeout
    setTimeout(() => {
      setCustomers(mockCustomers);
      setIsLoading(false);
    }, 500);
  };

  // Load mock vehicles
  const loadVehicles = () => {
    setIsLoading(true);
    // Simulating API call with setTimeout
    setTimeout(() => {
      setVehicles(mockVehicles);
      setFilteredVehicles(mockVehicles);
      setIsLoading(false);
    }, 500);
  };

  // Load mock insurance options
  const loadInsuranceOptions = () => {
    // Simulating API call with setTimeout
    setTimeout(() => {
      setInsuranceOptions(mockInsuranceOptions);
    }, 500);
  };

  // Fetch a specific vehicle by ID
  const fetchVehicleById = (vehicleId) => {
    setIsLoading(true);
    // Simulating API call with setTimeout
    setTimeout(() => {
      const foundVehicle = vehicles.find(v => v.id === vehicleId);
      
      if (foundVehicle) {
        setSelectedVehicle(foundVehicle);
      } else {
        // If not found in loaded vehicles, create a mock one (simulating API fetch)
        const mockVehicle = {
          id: vehicleId,
          make: 'Toyota',
          model: 'Camry',
          year: 2022,
          vehicle_type: 'sedan',
          transmission: 'automatic',
          daily_rate: 75,
          security_deposit: 1000,
          location: 'New York',
          image_url: '/assets/images/cars/camry.jpg',
          license_plate: 'ABC 1234',
          seats: 5,
          availability_status: 'available'
        };
        setSelectedVehicle(mockVehicle);
      }
      
      setIsLoading(false);
    }, 300);
  };

  // Fetch a specific customer by ID
  const fetchCustomerById = (customerId) => {
    setIsLoading(true);
    // Simulating API call with setTimeout
    setTimeout(() => {
      const foundCustomer = customers.find(c => c.id === customerId);
      
      if (foundCustomer) {
        setSelectedCustomer(foundCustomer);
      } else {
        // If not found in loaded customers, create a mock one (simulating API fetch)
        const mockCustomer = {
          id: customerId,
          first_name: 'John',
          last_name: 'Smith',
          email: 'john.smith@example.com',
          phone_number: '(555) 123-4567',
          profile_image_url: null
        };
        setSelectedCustomer(mockCustomer);
      }
      
      setIsLoading(false);
    }, 300);
  };

  // Filter vehicles based on selected criteria
  const filterVehicles = () => {
    if (!vehicles.length) return;

    let filtered = [...vehicles];

    // Apply vehicle type filter
    if (vehicleFilters.vehicleType) {
      filtered = filtered.filter(v => v.vehicle_type === vehicleFilters.vehicleType);
    }

    // Apply price range filter
    filtered = filtered.filter(
      v => v.daily_rate >= vehicleFilters.priceRange[0] && 
           v.daily_rate <= vehicleFilters.priceRange[1]
    );

    // Apply transmission filter
    if (vehicleFilters.transmission) {
      filtered = filtered.filter(v => v.transmission === vehicleFilters.transmission);
    }

    // Apply seats filter
    if (vehicleFilters.seats) {
      filtered = filtered.filter(v => v.seats >= parseInt(vehicleFilters.seats));
    }

    // Apply location filter
    if (vehicleFilters.location) {
      filtered = filtered.filter(v => v.location === vehicleFilters.location);
    }

    setFilteredVehicles(filtered);
  };

  // Calculate pricing based on selections
  const calculatePricing = () => {
    if (!selectedVehicle || !bookingData.startDate || !bookingData.endDate) return;

    // Calculate number of days
    const startDate = new Date(bookingData.startDate);
    const endDate = new Date(bookingData.endDate);
    const timeDiff = endDate.getTime() - startDate.getTime();
    const days = Math.ceil(timeDiff / (1000 * 3600 * 24));

    if (days <= 0) return;

    // Calculate subtotal
    const dailyRate = selectedVehicle.daily_rate;
    const subtotal = dailyRate * days;

    // Calculate insurance fee
    let insuranceFee = 0;
    if (bookingData.insuranceOption) {
      const selectedInsurance = insuranceOptions.find(i => i.id === bookingData.insuranceOption);
      if (selectedInsurance) {
        insuranceFee = selectedInsurance.daily_rate * days;
      }
    }

    // Calculate service fee and taxes (simplified example)
    const serviceFee = subtotal * 0.1; // 10% service fee
    const taxes = subtotal * 0.12; // 12% tax

    // Calculate total
    const total = subtotal + insuranceFee + serviceFee + taxes;

    setPricingSummary({
      dailyRate,
      days,
      subtotal,
      insuranceFee,
      serviceFee,
      taxes,
      total,
      securityDeposit: selectedVehicle.security_deposit
    });
  };

  // Helper function to format dates
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Helper function to format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'PHP'
    }).format(amount);
  };

  // Filter customers based on search text
  const getFilteredCustomers = () => {
    return customers.filter(customer => {
      if (!customerSearchText) return true;
      
      const fullName = `${customer.first_name} ${customer.last_name}`.toLowerCase();
      const searchLower = customerSearchText.toLowerCase();
      
      return (
        fullName.includes(searchLower) ||
        customer.email.toLowerCase().includes(searchLower) ||
        customer.phone_number.includes(searchLower)
      );
    });
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle vehicle filter change
  const handleVehicleFilterChange = (e) => {
    const { name, value } = e.target;
    setVehicleFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle price range change
  const handlePriceRangeChange = (e) => {
    const { name, value } = e.target;
    const index = name === 'minPrice' ? 0 : 1;
    const newPriceRange = [...vehicleFilters.priceRange];
    newPriceRange[index] = parseInt(value);
    setVehicleFilters(prev => ({
      ...prev,
      priceRange: newPriceRange
    }));
  };

  return (
    <BookingContext.Provider
      value={{
        // State
        isLoading,
        customers,
        vehicles,
        insuranceOptions,
        filteredVehicles,
        selectedCustomer,
        selectedVehicle,
        showCustomerSearch,
        customerSearchText,
        bookingData,
        currentStep,
        pricingSummary,
        vehicleFilters,
        
        // Setters
        setIsLoading,
        setSelectedCustomer,
        setSelectedVehicle,
        setShowCustomerSearch,
        setCustomerSearchText,
        setBookingData,
        setCurrentStep,
        setVehicleFilters,
        
        // Methods
        fetchVehicleById,
        fetchCustomerById,
        filterVehicles,
        calculatePricing,
        formatDate,
        formatCurrency,
        getFilteredCustomers,
        handleInputChange,
        handleVehicleFilterChange,
        handlePriceRangeChange
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};
