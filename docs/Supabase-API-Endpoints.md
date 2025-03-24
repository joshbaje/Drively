# Drivelyph Supabase API Endpoints Documentation

## Overview

This document outlines the API endpoints implemented in the Drivelyph car rental platform using Supabase. It serves as a reference for developers working on the front-end who need to understand how to interact with the back-end services.

## Base Configuration

Supabase client is initialized in `src/services/supabase/supabaseClient.js` using environment variables:

```javascript
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  }
});
```

## Authentication Endpoints

### Sign Up

**Function**: `authService.signUp(email, password, metadata)`  
**Description**: Registers a new user account with the provided email, password, and additional user metadata.  
**Implementation**:

```javascript
const { data, error } = await supabase.auth.signUp({
  email,
  password,
  options: {
    data: {
      ...metadata,
      user_type: metadata.user_type || 'renter',
      created_at: new Date().toISOString(),
    },
  },
});
```

**Example Usage**:
```javascript
const { data, error } = await authService.signUp(
  'user@example.com',
  'securePassword123',
  {
    first_name: 'John',
    last_name: 'Doe',
    phone_number: '123-456-7890',
    user_type: 'renter',
    date_of_birth: '1990-01-01'
  }
);
```

### Sign In

**Function**: `authService.signIn(email, password)`  
**Description**: Authenticates a user with the provided email and password.  
**Implementation**:

```javascript
const { data, error } = await supabase.auth.signInWithPassword({
  email,
  password,
});
```

**Example Usage**:
```javascript
const { data, error } = await authService.signIn(
  'user@example.com',
  'securePassword123'
);
```

### Sign Out

**Function**: `authService.signOut()`  
**Description**: Logs out the currently authenticated user.  
**Implementation**:

```javascript
const { error } = await supabase.auth.signOut();
```

**Example Usage**:
```javascript
const { error } = await authService.signOut();
```

### Get Current User

**Function**: `authService.getCurrentUser()`  
**Description**: Retrieves the currently authenticated user with profile data.  
**Implementation**:

```javascript
// Get session
const { data: sessionData } = await this.getSession();

// Get user details from database
const { data: userData } = await supabase
  .from('users')
  .select('*')
  .eq('user_id', sessionData.session.user.id)
  .single();

// Get profile data
const { data: profileData } = await supabase
  .from(userData.user_type === 'owner' ? 'car_owner_profiles' : 'renter_profiles')
  .select('*')
  .eq('user_id', userData.user_id)
  .single();
```

**Example Usage**:
```javascript
const { user, error } = await authService.getCurrentUser();
```

### Password Reset

**Function**: `authService.resetPassword(email)`  
**Description**: Sends a password reset email to the specified address.  
**Implementation**:

```javascript
const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
  redirectTo: `${window.location.origin}/reset-password`,
});
```

**Example Usage**:
```javascript
const { data, error } = await authService.resetPassword('user@example.com');
```

### Update Password

**Function**: `authService.updatePassword(newPassword)`  
**Description**: Updates the password for the currently authenticated user.  
**Implementation**:

```javascript
const { data, error } = await supabase.auth.updateUser({
  password: newPassword,
});
```

**Example Usage**:
```javascript
const { data, error } = await authService.updatePassword('newSecurePassword123');
```

## User Profile Endpoints

### Update User Profile

**Function**: `authService.updateUserProfile(userData)`  
**Description**: Updates the profile information for the currently authenticated user.  
**Implementation**:

```javascript
// Update users table
const { error: userError } = await supabase
  .from('users')
  .update({
    first_name: userData.first_name,
    last_name: userData.last_name,
    phone_number: userData.phone_number,
    bio: userData.bio,
    updated_at: new Date().toISOString(),
  })
  .eq('user_id', userData.user_id);

// Update profile table based on user type
if (userData.user_type === 'owner') {
  // Update owner profile
  const { error: ownerError } = await supabase
    .from('car_owner_profiles')
    .update({
      // Owner-specific fields
    })
    .eq('user_id', userData.user_id);
} else {
  // Update renter profile
  const { error: renterError } = await supabase
    .from('renter_profiles')
    .update({
      // Renter-specific fields
    })
    .eq('user_id', userData.user_id);
}
```

**Example Usage**:
```javascript
const { error } = await authService.updateUserProfile({
  user_id: '123e4567-e89b-12d3-a456-426614174000',
  first_name: 'John',
  last_name: 'Smith',
  phone_number: '123-456-7890',
  bio: 'Updated bio information',
  user_type: 'renter'
});
```

## Vehicle Endpoints

### Get Vehicles

**Function**: `vehicleService.getVehicles(params)`  
**Description**: Retrieves a list of vehicles based on search parameters.  
**Implementation**:

```javascript
// Build query
let query = supabase
  .from('vehicles')
  .select('*, owner:users(first_name, last_name, profile_image_url)')
  .eq('is_available', true)
  .eq('is_approved', true);

// Apply filters from params
if (params.vehicle_type) {
  query = query.eq('vehicle_type', params.vehicle_type);
}

if (params.min_price && params.max_price) {
  query = query
    .gte('daily_rate', params.min_price)
    .lte('daily_rate', params.max_price);
}

// Get results
const { data, error } = await query;
```

**Example Usage**:
```javascript
const vehicles = await vehicleService.getVehicles({
  vehicle_type: 'sedan',
  min_price: 1000,
  max_price: 5000
});
```

### Get Vehicle By ID

**Function**: `vehicleService.getVehicleById(id)`  
**Description**: Retrieves detailed information about a specific vehicle.  
**Implementation**:

```javascript
const { data, error } = await supabase
  .from('vehicles')
  .select(`
    *,
    owner:users(first_name, last_name, profile_image_url, bio),
    location:locations(*),
    images:vehicle_images(*)
  `)
  .eq('vehicle_id', id)
  .single();
```

**Example Usage**:
```javascript
const vehicle = await vehicleService.getVehicleById('123e4567-e89b-12d3-a456-426614174000');
```

### Create Vehicle

**Function**: `vehicleService.createVehicle(vehicleData)`  
**Description**: Creates a new vehicle listing.  
**Implementation**:

```javascript
const { data, error } = await supabase
  .from('vehicles')
  .insert([
    {
      owner_id: user.id,
      make: vehicleData.make,
      model: vehicleData.model,
      year: vehicleData.year,
      // Other vehicle fields
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ])
  .select();
```

**Example Usage**:
```javascript
const newVehicle = await vehicleService.createVehicle({
  make: 'Toyota',
  model: 'Vios',
  year: 2023,
  color: 'White',
  // Other vehicle details
});
```

## Booking Endpoints

### Create Booking

**Function**: `bookingService.createBooking(bookingData)`  
**Description**: Creates a new booking for a vehicle.  
**Implementation**:

```javascript
const { data, error } = await supabase
  .from('bookings')
  .insert([
    {
      vehicle_id: bookingData.vehicle_id,
      renter_id: user.id,
      owner_id: bookingData.owner_id,
      start_date: bookingData.start_date,
      end_date: bookingData.end_date,
      // Other booking fields
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ])
  .select();
```

**Example Usage**:
```javascript
const booking = await bookingService.createBooking({
  vehicle_id: '123e4567-e89b-12d3-a456-426614174000',
  owner_id: '123e4567-e89b-12d3-a456-426614174001',
  start_date: '2025-04-01T08:00:00Z',
  end_date: '2025-04-05T18:00:00Z',
  // Other booking details
});
```

### Get User Bookings

**Function**: `bookingService.getUserBookings()`  
**Description**: Retrieves bookings for the currently authenticated user.  
**Implementation**:

```javascript
const { data, error } = await supabase
  .from('bookings')
  .select(`
    *,
    vehicle:vehicles(*),
    owner:owner_id(*),
    renter:renter_id(*)
  `)
  .eq('renter_id', user.id)
  .order('created_at', { ascending: false });
```

**Example Usage**:
```javascript
const myBookings = await bookingService.getUserBookings();
```

## Storage Endpoints

### Upload Vehicle Image

**Function**: `storageService.uploadVehicleImage(vehicleId, file)`  
**Description**: Uploads an image file for a vehicle and stores the URL.  
**Implementation**:

```javascript
// Upload file to storage
const filePath = `vehicles/${vehicleId}/${Date.now()}_${file.name}`;
const { data: uploadData, error: uploadError } = await supabase.storage
  .from('vehicle-images')
  .upload(filePath, file);

if (uploadError) throw uploadError;

// Get public URL
const { data: urlData } = supabase.storage
  .from('vehicle-images')
  .getPublicUrl(filePath);

// Add to vehicle_images table
const { data: imageData, error: imageError } = await supabase
  .from('vehicle_images')
  .insert([
    {
      vehicle_id: vehicleId,
      image_url: urlData.publicUrl,
      image_type: 'exterior', // Default or specified
      is_primary: false,
      created_at: new Date().toISOString()
    }
  ])
  .select();
```

**Example Usage**:
```javascript
const imageData = await storageService.uploadVehicleImage(
  '123e4567-e89b-12d3-a456-426614174000',
  imageFile
);
```

### Upload Profile Image

**Function**: `storageService.uploadProfileImage(userId, file)`  
**Description**: Uploads a profile image for a user.  
**Implementation**:

```javascript
// Upload file to storage
const filePath = `profiles/${userId}`;
const { data: uploadData, error: uploadError } = await supabase.storage
  .from('profile-images')
  .upload(filePath, file, {
    upsert: true
  });

if (uploadError) throw uploadError;

// Get public URL
const { data: urlData } = supabase.storage
  .from('profile-images')
  .getPublicUrl(filePath);

// Update user profile
const { data: userData, error: userError } = await supabase
  .from('users')
  .update({
    profile_image_url: urlData.publicUrl,
    updated_at: new Date().toISOString()
  })
  .eq('user_id', userId);
```

**Example Usage**:
```javascript
const userData = await storageService.uploadProfileImage(
  '123e4567-e89b-12d3-a456-426614174000',
  imageFile
);
```

## Real-time Subscriptions

### Subscribe to Booking Status Changes

**Function**: `realtimeService.subscribeToBookingStatus(bookingId, callback)`  
**Description**: Sets up a real-time subscription to receive updates when a booking's status changes.  
**Implementation**:

```javascript
const subscription = supabase
  .channel(`booking-${bookingId}`)
  .on(
    'postgres_changes',
    {
      event: 'UPDATE',
      schema: 'public',
      table: 'bookings',
      filter: `booking_id=eq.${bookingId}`
    },
    (payload) => {
      callback(payload.new);
    }
  )
  .subscribe();

return subscription;
```

**Example Usage**:
```javascript
const subscription = realtimeService.subscribeToBookingStatus(
  '123e4567-e89b-12d3-a456-426614174000',
  (updatedBooking) => {
    console.log('Booking status changed:', updatedBooking.booking_status);
    // Update UI based on new status
  }
);

// Later, unsubscribe
subscription.unsubscribe();
```

## Error Handling

All service methods follow a consistent pattern for error handling:

```javascript
try {
  const { data, error } = await supabase.someMethod();
  
  if (error) throw error;
  
  return { data, error: null };
} catch (error) {
  console.error('Error in operation:', error.message);
  return { data: null, error };
}
```

## Supabase Database Tables

The Drivelyph application uses the following database tables in Supabase:

1. **Users** - User accounts and authentication
2. **Car Owner Profiles** - Profile data specific to vehicle owners
3. **Renter Profiles** - Profile data specific to vehicle renters
4. **Vehicles** - Vehicle listings available for rent
5. **Vehicle Images** - Images associated with vehicles
6. **Locations** - Pickup and dropoff locations
7. **Bookings** - Rental reservations
8. **Payments** - Payment transactions
9. **Ratings** - User and vehicle ratings and reviews
10. **Messages** - Communication between users

Each table has corresponding endpoints in the API service for CRUD operations.

## Setting Up a New Supabase Project

To set up a new Supabase project for Drivelyph:

1. Create a project at [supabase.com](https://supabase.com)
2. Run database migrations from `supabase/migrations/` folder to create schema
3. Configure authentication settings:
   - Enable email signup
   - Configure email templates
   - Set up OAuth providers if needed
4. Create storage buckets for images:
   - `vehicle-images`
   - `profile-images`
   - `documents`
5. Set up appropriate bucket policies
6. Set environment variables:
   ```
   REACT_APP_SUPABASE_URL=https://your-project-id.supabase.co
   REACT_APP_SUPABASE_ANON_KEY=your-anon-key
   REACT_APP_API_PROVIDER=supabase
   ```

## References

For more detailed information about the Supabase API, refer to:

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript)
- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
