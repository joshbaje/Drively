// Mock data for NewBooking component

export const mockCustomers = [
  {
    id: 'cust1',
    first_name: 'John',
    last_name: 'Smith',
    email: 'john.smith@example.com',
    phone_number: '(555) 123-4567',
    profile_image_url: null
  },
  {
    id: 'cust2',
    first_name: 'Jane',
    last_name: 'Johnson',
    email: 'jane.johnson@example.com',
    phone_number: '(555) 234-5678',
    profile_image_url: null
  },
  {
    id: 'cust3',
    first_name: 'Michael',
    last_name: 'Wilson',
    email: 'michael.wilson@example.com',
    phone_number: '(555) 345-6789',
    profile_image_url: null
  }
];

export const mockVehicles = [
  {
    vehicle_id: 'veh1',
    make: 'Toyota',
    model: 'Camry',
    year: 2022,
    vehicle_type: 'sedan',
    transmission: 'automatic',
    fuel_type: 'gasoline',
    seats: 5,
    daily_rate: 45.00,
    security_deposit: 300,
    location: 'Downtown',
    image_url: null,
    availability_status: 'available'
  },
  {
    vehicle_id: 'veh2',
    make: 'Honda',
    model: 'CR-V',
    year: 2021,
    vehicle_type: 'suv',
    transmission: 'automatic',
    fuel_type: 'gasoline',
    seats: 5,
    daily_rate: 55.00,
    security_deposit: 400,
    location: 'Airport',
    image_url: null,
    availability_status: 'available'
  },
  {
    vehicle_id: 'veh3',
    make: 'Ford',
    model: 'Mustang',
    year: 2023,
    vehicle_type: 'sports',
    transmission: 'manual',
    fuel_type: 'gasoline',
    seats: 4,
    daily_rate: 85.00,
    security_deposit: 500,
    location: 'Downtown',
    image_url: null,
    availability_status: 'available'
  },
  {
    vehicle_id: 'veh4',
    make: 'Chevrolet',
    model: 'Suburban',
    year: 2022,
    vehicle_type: 'suv',
    transmission: 'automatic',
    fuel_type: 'gasoline',
    seats: 8,
    daily_rate: 95.00,
    security_deposit: 600,
    location: 'Suburb',
    image_url: null,
    availability_status: 'available'
  },
  {
    vehicle_id: 'veh5',
    make: 'Tesla',
    model: 'Model 3',
    year: 2023,
    vehicle_type: 'sedan',
    transmission: 'automatic',
    fuel_type: 'electric',
    seats: 5,
    daily_rate: 75.00,
    security_deposit: 500,
    location: 'Downtown',
    image_url: null,
    availability_status: 'available'
  }
];

export const mockInsuranceOptions = [
  {
    id: 'ins1',
    name: 'Basic Coverage',
    description: 'Liability coverage only',
    daily_rate: 10.00
  },
  {
    id: 'ins2',
    name: 'Standard Coverage',
    description: 'Liability + comprehensive coverage',
    daily_rate: 15.00
  },
  {
    id: 'ins3',
    name: 'Premium Coverage',
    description: 'Full coverage with zero deductible',
    daily_rate: 25.00
  }
];

export const initialBookingData = {
  startDate: '',
  endDate: '',
  pickupTime: '10:00',
  returnTime: '10:00',
  pickupLocation: '',
  returnLocation: '',
  insuranceOption: '',
  specialRequests: '',
  promoCode: ''
};

export const initialVehicleFilters = {
  vehicleType: '',
  priceRange: [0, 500],
  transmission: '',
  seats: '',
  location: ''
};

export const initialPricingSummary = {
  dailyRate: 0,
  days: 0,
  subtotal: 0,
  insuranceFee: 0,
  serviceFee: 0,
  taxes: 0,
  total: 0,
  securityDeposit: 0
};

export const locationOptions = [
  { value: 'Downtown', label: 'Downtown Office' },
  { value: 'Airport', label: 'Airport Terminal 1' },
  { value: 'Suburb', label: 'Suburb Location' }
];

export const timeOptions = [
  { value: '10:00', label: '10:00 AM' },
  { value: '12:00', label: '12:00 PM' },
  { value: '14:00', label: '2:00 PM' },
  { value: '16:00', label: '4:00 PM' }
];

export const vehicleTypeOptions = [
  { value: '', label: 'All Types' },
  { value: 'sedan', label: 'Sedan' },
  { value: 'suv', label: 'SUV' },
  { value: 'sports', label: 'Sports Car' },
  { value: 'truck', label: 'Truck' }
];

export const transmissionOptions = [
  { value: '', label: 'All' },
  { value: 'automatic', label: 'Automatic' },
  { value: 'manual', label: 'Manual' }
];

export const seatsOptions = [
  { value: '', label: 'Any' },
  { value: '2', label: '2+' },
  { value: '4', label: '4+' },
  { value: '5', label: '5+' },
  { value: '7', label: '7+' }
];
