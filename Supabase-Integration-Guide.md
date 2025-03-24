# Drively Supabase Integration Guide

## Overview

This document provides information about Drively's Supabase integration, which serves as an alternative backend to the current Xano implementation. The architecture is designed to support both backends through a common abstraction layer, allowing for a smooth transition between providers.

## Current Status

- **Integration Status**: Partially Implemented
- **Current Default Provider**: Xano
- **Database Schema**: Created but needs to be populated
- **Environment Variables**: Required for Supabase connection

## Setup Instructions

### 1. Environment Configuration

To enable Supabase as the backend provider, add the following environment variables to your `.env` file:

```
REACT_APP_API_PROVIDER=supabase
REACT_APP_SUPABASE_URL=https://your-project-url.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key
```

### 2. Database Migration

Before using Supabase, you need to ensure the database schema is properly set up:

1. Install Supabase CLI if not already installed
2. Run migrations to set up the database schema:
   ```bash
   supabase migration up
   ```

### 3. Seeding Test Data

For development and testing purposes, you can seed the database with test data:

```bash
npm run seed:supabase
```

## Architecture Overview

The Supabase integration leverages a provider-agnostic database service:

1. **Provider Selection**: Determined by the `REACT_APP_API_PROVIDER` environment variable
2. **Connection Management**: Handled by `src/database/connection.js`
3. **Provider Configuration**: Defined in `src/database/config.js`
4. **Database Schema**: Defined in Supabase migrations

## Using the Database Connection

The database connection is designed to be used through the common abstraction layer:

```javascript
import db from '../database/connection';

// Example: Get a vehicle by ID
const getVehicle = async (id) => {
  try {
    const vehicle = await db.getById('vehicles', id);
    return vehicle;
  } catch (error) {
    console.error('Error fetching vehicle:', error);
    throw error;
  }
};
```

## Common Operations

The database connection provides several common operations that work with either provider:

- `db.getById(table, id, options)`: Retrieve a single record by ID
- `db.getMany(table, filters, options)`: Retrieve multiple records with filtering
- `db.create(table, data)`: Create a new record
- `db.update(table, id, data)`: Update an existing record
- `db.delete(table, id)`: Delete a record
- `db.uploadFile(bucket, path, file)`: Upload a file to storage

## Supabase-Specific Features

When using Supabase as the provider, the following additional features are available:

### Real-time Subscriptions

```javascript
const subscribeToVehicles = async () => {
  const client = db.getClient();
  
  return client
    .from('vehicles')
    .on('*', (payload) => {
      console.log('Change received!', payload);
      // Handle the change
    })
    .subscribe();
};
```

### Storage Management

```javascript
const getPublicUrl = (bucket, path) => {
  const client = db.getClient();
  const { data } = client.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
};
```

## Testing the Integration

To verify that the Supabase integration is working correctly:

1. Set the environment variables as described above
2. Run the application with `npm start`
3. Navigate to the test page at `/supabase-test` to see the connection status
4. Check the browser console for detailed connection information

## Troubleshooting

If you encounter issues with the Supabase integration:

1. **Connection Issues**: Verify that the URL and anon key are correct
2. **Schema Issues**: Check the Supabase migrations and ensure they've been applied
3. **CORS Issues**: Ensure the Supabase project's API settings allow requests from your local environment
4. **Type Errors**: Check that the data types match between the frontend expectations and Supabase schema

## Next Steps

To complete the Supabase integration:

1. Finalize all database table migrations
2. Implement complete user authentication flow
3. Create data seeds for development and testing
4. Add comprehensive integration tests
5. Update all API service hooks to fully support Supabase
6. Document any Supabase-specific features being used
