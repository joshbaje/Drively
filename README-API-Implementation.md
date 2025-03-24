# Drively API Implementation with Supabase

## Overview

This document provides a comprehensive guide to the Drively API implementation, which now exclusively uses Supabase for all backend operations. The API layer is structured to provide a clean, consistent interface for all data operations while abstracting away the underlying Supabase implementation details.

## API Service Architecture

### Service Layer Structure

```
src/
  └── services/
      ├── index.js                  # Main API service entry point
      └── supabase/
          ├── index.js              # Supabase services aggregator
          ├── supabaseClient.js     # Supabase client initialization
          ├── auth/
          │   └── authService.js    # Authentication operations
          ├── vehicles/
          │   └── vehicleService.js # Vehicle operations
          ├── bookings/
          │   └── bookingService.js # Booking operations
          └── utils/
              └── databaseUtils.js  # Common database operations
```

### API Service Pattern

The API service follows a modular, domain-driven design pattern:

1. **Domain Services**: Separate services for auth, vehicles, bookings, etc.
2. **Unified Interface**: All services are exposed through a single entry point
3. **Consistent Error Handling**: All methods return `{ data, error }` objects
4. **Typed Interfaces**: TypeScript interfaces for all data structures

## Using the API Services

### Basic Usage

Import the API service and use it in your components:

```javascript
import api from 'src/services';

// Example: Get all vehicles
const [vehicles, setVehicles] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
  const fetchVehicles = async () => {
    setLoading(true);
    const { data, error } = await api.vehicles.getVehicles();
    
    if (error) {
      setError(error.message);
    } else {
      setVehicles(data || []);
    }
    
    setLoading(false);
  };
  
  fetchVehicles();
}, []);
```

### Authentication

```javascript
// Login
const handleLogin = async (email, password) => {
  const { data, error } = await api.auth.login(email, password);
  
  if (error) {
    // Handle login error
    setError(error.message);
    return;
  }
  
  // Login successful
  setUser(data.user);
  navigate('/dashboard');
};

// Logout
const handleLogout = async () => {
  await api.auth.logout();
  setUser(null);
  navigate('/');
};

// Get current user
const { data: user } = await api.auth.getCurrentUser();
```

### Vehicle Operations

```javascript
// Get all vehicles with filtering
const { data: vehicles } = await api.vehicles.getVehicles(
  { is_available: true, vehicle_type: 'sedan' },
  { limit: 10, offset: 0, includeImages: true }
);

// Get vehicle by ID
const { data: vehicle } = await api.vehicles.getVehicleById('vehicle-uuid');

// Create vehicle
const { data: newVehicle } = await api.vehicles.createVehicle(
  vehicleData,
  imageFiles,
  selectedFeatureIds
);

// Update vehicle
await api.vehicles.updateVehicle('vehicle-uuid', { daily_rate: 2500 });

// Delete vehicle
await api.vehicles.deleteVehicle('vehicle-uuid');
```

### Booking Operations

```javascript
// Get user's bookings
const { data: bookings } = await api.bookings.getBookings(
  { renter_id: currentUser.id },
  { includeVehicle: true }
);

// Create booking
const { data: booking } = await api.bookings.createBooking({
  vehicle_id: selectedVehicle.id,
  start_date: startDate.toISOString(),
  end_date: endDate.toISOString(),
  // Other booking data...
});

// Cancel booking
await api.bookings.cancelBooking(
  bookingId,
  currentUser.id,
  'Changed plans'
);

// Get dashboard stats
const { data: stats } = await api.bookings.getDashboardStats(
  currentUser.id,
  currentUser.user_type
);
```

## Advanced Topics

### File Uploads

```javascript
// Upload a vehicle image
const handleImageUpload = async (vehicleId, imageFile) => {
  const { data, error } = await api.vehicles.addVehicleImage(
    vehicleId,
    imageFile,
    { image_type: 'exterior', is_primary: true }
  );
  
  if (error) {
    console.error('Error uploading image:', error);
    return;
  }
  
  // Image uploaded successfully
  console.log('Image URL:', data.image_url);
};
```

### Real-time Subscriptions

For real-time updates (such as chat messages or booking status changes), use the Supabase client directly:

```javascript
import api from 'src/services';

// Subscribe to new messages in a conversation
const messageSubscription = api.supabase
  .from('messages')
  .on('INSERT', payload => {
    if (payload.new.conversation_id === conversationId) {
      setMessages(current => [...current, payload.new]);
    }
  })
  .subscribe();

// Remember to unsubscribe when done
return () => {
  api.supabase.removeSubscription(messageSubscription);
};
```

## Error Handling

All API methods return an object with `data` and `error` properties:

```javascript
const { data, error } = await api.vehicles.getVehicleById(id);

if (error) {
  if (error.code === 'PGRST116') {
    // Record not found
    setNotFound(true);
  } else {
    // Other error
    setError(error.message);
  }
  return;
}

// Success case
setVehicle(data);
```

## Database Utilities

For advanced or custom operations, you can use the database utilities:

```javascript
import api from 'src/services';

// Get records with complex filtering
const { data } = await api.utils.getMany('vehicles', {
  daily_rate: { gte: 1000, lte: 5000 },
  is_available: true,
  vehicle_type: { in: ['sedan', 'suv'] }
});

// Upload a file to storage
const { url } = await api.utils.uploadFile(
  'documents',
  `user/${userId}/license.jpg`,
  licenseFile
);
```

## Best Practices

1. **Handle Loading States**: Always show loading indicators during API calls
2. **Error Handling**: Always check for errors and provide user feedback
3. **Data Validation**: Validate inputs before calling API methods
4. **Optimistic Updates**: Update UI immediately, then revert if API fails
5. **Batch Operations**: Use transactions for multiple related operations
6. **Caching**: Consider caching results for frequently accessed data

## Row Level Security (RLS) Policies

Supabase uses PostgreSQL's Row Level Security to enforce access control at the database level. Here are some of the main policies in effect:

1. **Users can only access their own data**
2. **Vehicle owners can only modify their own vehicles**
3. **Renters can only view their own bookings**
4. **Admins have full access to all data**

These policies are enforced automatically by Supabase regardless of which API method is used, providing an additional layer of security.

## API Limitations

1. **Maximum payload size**: 8MB for normal requests, 50MB for file uploads
2. **Rate limiting**: 1000 requests per minute per user
3. **Bulk operations**: Maximum 1000 records per operation
4. **Query limits**: Maximum 20 seconds execution time

## Troubleshooting

Common issues and solutions:

1. **Authentication errors**: Check if user session is valid using `api.auth.isAuthenticated()`
2. **Missing data**: Ensure relationships are included using `include*` options
3. **Slow queries**: Use appropriate indexes and filters
4. **File upload errors**: Check file size and supported formats
5. **Data consistency issues**: Use transactions for related operations
