# Drively API Integration Guide

This document provides guidelines and strategies for integrating Drively with backend API services, including both current Xano implementation and future Supabase migration plans.

## Overview

Drively uses a flexible API service architecture that allows seamless switching between different backend implementations. This makes it easier to migrate from one backend service to another without requiring significant changes to the frontend codebase.

Currently, the application uses Xano as its backend service, but substantial progress has been made on the Supabase integration. The infrastructure is in place to support both backend providers.

## Architecture

The API integration follows a provider pattern with these key components:

1. **ApiClient**: A generic HTTP client that handles requests, authentication, and error handling.
2. **XanoApi**: Xano-specific implementation of the API services.
3. **SupabaseApi**: Supabase-specific implementation (prepared for future migration).
4. **ApiService**: The main entry point that selects the appropriate implementation.

## API Service Structure

The API services are organized by resource type:

- **auth**: Authentication and user management
- **vehicles**: Vehicle listing, details, and management
- **bookings**: Booking creation, management, and status updates
- **payments**: Payment processing and history
- **ratings**: User and vehicle ratings
- **admin**: Administrative functions

Each resource category provides a comprehensive set of functions that interact with the backend.

## Current Implementation (Xano)

The current implementation uses Xano as the backend service. The base URL is:

```
https://x8ki-letl-twmt.n7.xano.io/api:scA8Isc8
```

API requests are authenticated using JWT tokens stored in local storage. The token is included in the `Authorization` header as a Bearer token.

## Supabase Integration

The Supabase integration includes:

1. A complete implementation of the same API interface using Supabase client
2. Environment variable configuration for switching between implementations
3. Required dependencies already added to the project
4. A provider-agnostic database connection layer (`src/database/connection.js`)
5. A test component for verifying Supabase connection (`src/components/SupabaseConnectionTest.js`)

### Setting Up Supabase:

1. Set up a Supabase project and configure the database schema
2. Add Supabase credentials to environment variables:
   ```
   REACT_APP_SUPABASE_URL=your-project-url
   REACT_APP_SUPABASE_ANON_KEY=your-anon-key
   REACT_APP_API_PROVIDER=supabase
   ```
3. Uncomment the Supabase import in `src/services/api/index.js`
4. Test all functionality with the Supabase backend
5. Deploy the updated application

## Authentication Flow

Both implementations support the same authentication flow:

1. User registers or logs in, receiving a token
2. Token is stored in localStorage
3. Subsequent requests include the token
4. Auth context provides user information and roles to the application

## Data Models

The API services expect and return data in the following format:

### User

```javascript
{
  user_id: String,
  email: String,
  first_name: String,
  last_name: String,
  user_type: String, // 'verified_renter', 'verified_owner', 'admin', etc.
  profile_image_url: String,
  // Additional fields depending on user type
}
```

### Vehicle

```javascript
{
  vehicle_id: String,
  owner_id: String,
  make: String,
  model: String,
  year: Number,
  // Additional vehicle details
  daily_rate: Number,
  location_id: String,
  is_available: Boolean,
  // Images, ratings, etc.
}
```

### Booking

```javascript
{
  booking_id: String,
  vehicle_id: String,
  renter_id: String,
  owner_id: String,
  start_date: String, // ISO format
  end_date: String, // ISO format
  booking_status: String, // 'pending', 'confirmed', 'completed', etc.
  total_amount: Number,
  // Additional booking details
}
```

## Error Handling

Both implementations provide consistent error handling:

1. API requests that fail return a structured error
2. Errors include a message and status code
3. Authentication errors automatically log the user out
4. Form validation errors are returned in a consistent format

## Testing

To test the API integration:

1. Use the mock services during development
2. Test authentication flows thoroughly
3. Verify data CRUD operations for all resources
4. Test error conditions and edge cases
5. For Supabase-specific testing, navigate to the `/supabase-test` route

## Environment Variables

Configure the API integration using these environment variables:

- `REACT_APP_API_PROVIDER`: Set to 'xano' or 'supabase'
- `REACT_APP_XANO_API_URL`: Xano API base URL (currently https://x8ki-letl-twmt.n7.xano.io/api:scA8Isc8)
- `REACT_APP_XANO_TOKEN_KEY`: Storage key for Xano auth token (default: 'auth_token')
- `REACT_APP_SUPABASE_URL`: Supabase project URL
- `REACT_APP_SUPABASE_ANON_KEY`: Supabase anonymous key

A sample `.env.example` file is included with the project to show the required configuration.

## Best Practices

1. Always use the API service through the main export (`src/services/api/index.js`)
2. For database operations, use the abstraction layer in `src/database/connection.js`
3. Handle loading and error states in UI components
4. Keep API call logic in hooks or context providers, not directly in components
5. Use consistent error handling patterns
6. Log non-sensitive information for debugging
7. Use the example hooks (like `src/hooks/useVehiclesExample.js`) as a reference

## Additional Resources

- [Supabase Integration Guide](./Supabase-Integration-Guide.md): Detailed guide for the Supabase integration
- [Supabase MCP Setup](./Supabase-MCP-Setup.md): Instructions for setting up the Supabase MCP
- [Database-Integration-Summary.md](./Database-Integration-Summary.md): Overview of the database integration architecture