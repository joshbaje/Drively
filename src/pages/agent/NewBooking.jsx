import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './AgentPortal.css';

const NewBooking = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [insuranceOptions, setInsuranceOptions] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [showCustomerSearch, setShowCustomerSearch] = useState(false);
  const [customerSearchText, setCustomerSearchText] = useState('');
  const [bookingData, setBookingData] = useState({
    startDate: '',
    endDate: '',
    pickupTime: '10:00',
    returnTime: '10:00',
    pickupLocation: '',
    returnLocation: '',
    insuranceOption: '',
    specialRequests: '',
    promoCode: ''
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [pricingSummary, setPricingSummary] = useState({
    dailyRate: 0,
    days: 0,
    subtotal: 0,
    insuranceFee: 0,
    serviceFee: 0,
    taxes: 0,
    total: 0,
    securityDeposit: 0
  });
  const [vehicleFilters, setVehicleFilters] = useState({
    vehicleType: '',
    priceRange: [0, 500],
    transmission: '',
    seats: '',
    location: ''
  });

  useEffect(() => {
    // Check if a customer was selected from another page
    if (location.state?.customerId) {
      fetchCustomerById(location.state.customerId);
    } else if (location.search) {
      const params = new URLSearchParams(location.search);
      const customerId = params.get