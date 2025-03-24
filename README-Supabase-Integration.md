# Drively Supabase Integration

This document provides a comprehensive guide for the Supabase integration in the Drively car rental platform.

## Overview

Drively supports both Xano and Supabase as backend providers. This implementation allows for a seamless transition between the two backends by using a provider-agnostic database connection layer.

## Integration Status

- **Schema Definition**: Complete ✅
- **Seed Data**: Available for testing ✅
- **Service Layers**: Implemented ✅
- **Authentication**: Ready for use ✅
- **Frontend Integration**: Partially implemented ✅

## Directory Structure

```
src/
  ├── services/
  │   ├── supabase/            # Supabase services
  │   │   ├── auth/            # Authentication services
  │   │   ├── bookings/        # Booking-related services
  │   │   ├── vehicles/        # Vehicle-related services
  │   │   ├── utils/           # Utility functions for Supabase
  │   │   └── supabaseClient.js # Supabase client initialization
  │   └── api/                 # Xano API services (existing)
  └── database/
      ├── config.js            # Database configuration
      └── connection.js        # Provider-agnostic connection layer

supabase/
  ├── migrations/              # Database migrations
  │   ├── 01_create_schema.sql # Schema definition
  │   └── 02_seed_data.sql     # Test data
  └── config.toml              # Supabase configuration
```

## Configuration

### Environment Variables

These environment variables need to be set in your `.env` file:

```
# API Provider (options: 'xano' or 'supabase')
REACT_APP_API_PROVIDER=supabase

# Supabase Configuration
REACT_APP_SUPABASE_URL=https://your-project-url.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key
```

### Switch Between Providers

To switch between Xano and Supabase:

1. Change the `REACT_APP_API_PROVIDER` value in your `.env` file
2. Restart the development server

## Database Schema

The Supabase database schema follows the same structure as defined in the TypeScript interfaces. The schema includes:

- User management (users, profiles, roles)
- Vehicle management (vehicles, features, images)
- Booking system (bookings, payments, insurance)
- Ratings and reviews
- Messaging system
- Document management
- Promotions and system settings

## Authentication

Authentication is handled through Supabase Auth with JWT tokens. The auth service includes:

- Sign up (with profile creation)
- Sign in (email/password)
- Social sign in
- Password reset
- Session management
- Profile updating

## Services

Each major entity has its own service module with common operations:

### Vehicle Service

- `getVehicles()` - Retrieve vehicles with filtering and pagination
- `getVehicleById()` - Get detailed vehicle information
- `createVehicle()` - Create a new vehicle listing
- `updateVehicle()` - Update vehicle details
- `deleteVehicle()` - Remove a vehicle listing
- `setVehicleUnavailable()` - Mark a vehicle as unavailable for a period
- `checkAvailability()` - Check if a vehicle is available for booking

### Booking Service

- `getBookings()` - Retrieve bookings with filtering
- `getBookingById()` - Get detailed booking information
- `createBooking()` - Create a new booking
- `updateBooking()` - Update booking details
- `cancelBooking()` - Cancel a booking
- `addRating()` - Add a rating for a completed booking

### Utility Functions

The `databaseUtils.js` file provides common database operations:

- `getById()` - Retrieve a record by ID
- `getMany()` - Retrieve multiple records with filtering
- `create()` - Create a new record
- `update()` - Update an existing record
- `delete()` - Delete a record
- `uploadFile()` - Upload a file to Supabase Storage
- `deleteFile()` - Remove a file from Storage

## Testing

To verify the Supabase integration:

1. Configure the environment variables
2. Start the application with `npm start`
3. Navigate to `/#/supabase-test` to check the connection status

## Seed Data

The Supabase integration includes organized seed data files in the `supabase/seeds` directory. Each entity has its own dedicated seed file for easy maintenance:

```
supabase/
  └── seeds/
      ├── 00_run_all_seeds.sql    # Main runner to execute all seeds
      ├── 01_roles.sql            # User roles
      ├── 02_users.sql            # Sample users
      ├── 03_addresses.sql        # User addresses
      ├── 04_user_roles.sql       # Role assignments
      ├── 05_profiles.sql         # Owner and renter profiles
      ├── 06_locations.sql        # Pickup/dropoff locations
      ├── 07_vehicles.sql         # Sample vehicles
      ├── 08_vehicle_images.sql   # Vehicle images
      ├── 09_vehicle_features.sql # Vehicle features
      ├── 10_payment_methods.sql  # Payment methods
      ├── 11_insurance_policies.sql # Insurance policies
      ├── 12_cancellation_policies.sql # Cancellation policies
      ├── 13_promotions.sql       # Promotional codes
      ├── 14_system_settings.sql  # System settings
      └── README.md               # Documentation
```

The seed data includes:

- Sample users (owner, renter, admin)
- Vehicle listings with images and features
- Payment methods
- Insurance policies
- Cancellation policies
- Promotions
- System settings

To run all seed files:

```bash
psql -U postgres -d drively -f supabase/seeds/00_run_all_seeds.sql
```

## Common Issues and Solutions

### Connection Issues

If you encounter connection issues:

1. Verify your Supabase URL and anon key
2. Check if your project is active on the Supabase dashboard
3. Ensure your IP is not blocked by Supabase

### Authentication Problems

For authentication problems:

1. Check your email templates in Supabase Auth settings
2. Verify email confirmation settings
3. Ensure password policies match between frontend and backend

### Data Type Mismatches

PostgreSQL is stricter with data types than NoSQL databases:

1. Ensure dates are properly formatted
2. Check numeric fields for appropriate precision
3. Use proper UUID format for IDs

### Row Level Security

Supabase uses Row Level Security (RLS) policies:

1. Check if appropriate RLS policies are in place
2. Verify user roles and permissions
3. Test anonymous vs. authenticated access

## Deployment Considerations

When deploying with Supabase:

1. Generate a new anon key for production
2. Set up proper backup strategies
3. Configure CORS settings in Supabase
4. Enable logging for debugging
5. Set up monitoring for database performance

## Future Enhancements

Planned enhancements for the Supabase integration:

1. Real-time subscriptions for bookings and messages
2. Full-text search for vehicle listings
3. Geospatial queries for location-based searches
4. Storage optimization for vehicle images
5. Analytics dashboards using Supabase views

## Resources

- [Supabase Documentation](https://supabase.io/docs)
- [Supabase JavaScript Client](https://supabase.io/docs/reference/javascript/start)
- [Supabase Auth Documentation](https://supabase.io/docs/reference/javascript/auth-signin)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
