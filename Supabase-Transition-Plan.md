# Drively: Complete Migration to Supabase

## Overview

This document outlines the detailed plan to fully transition Drively from Xano to Supabase as the exclusive backend provider. The goal is to completely remove all Xano dependencies and leverage Supabase's PostgreSQL database, authentication, storage, and real-time capabilities.

## Migration Strategy

### 1. Preparation Phase

#### Code Analysis
- ✅ Identify all Xano API endpoints currently in use
- ✅ Map Xano data models to Supabase schema
- ✅ Review authentication implementation

#### Environment Setup
- ✅ Configure Supabase project with proper settings
- ✅ Set environment variables in `.env`
- ✅ Create database schema with migrations

#### Service Architecture
- ✅ Design provider-agnostic connection layer
- ✅ Create Supabase-specific service implementations

## 2. Migration Components

### Authentication Migration

#### Current Status
Authentication is partially implemented with Supabase but has issues and likely still relies on Xano in parts.

#### Required Changes
1. **Remove Xano Authentication**:
   ```javascript
   // REMOVE from src/services/api/index.js
   import xanoAuth from './xanoAuth';
   
   // REPLACE with
   import supabaseAuth from '../supabase/auth/authService';
   ```

2. **Update Auth Context**:
   ```javascript
   // src/context/AuthContext.js
   // Replace ApiService.auth with direct Supabase imports
   import { supabaseClient } from '../services/supabase/supabaseClient';
   
   // Update login method
   const login = async (email, password) => {
     try {
       setLoading(true);
       const { data, error } = await supabaseClient.auth.signInWithPassword({
         email,
         password,
       });
       
       if (error) throw error;
       
       setUser(data.user);
       return data;
     } catch (err) {
       setError(err.message);
       throw err;
     } finally {
       setLoading(false);
     }
   };
   ```

3. **Create Test Users in Supabase**:
   - Sign up to Supabase Auth using the Admin UI
   - Create key test accounts that match existing Xano users
   - Document credentials for the team

### Database Access Migration

#### Current Status
Database schema is defined but some or all data access may still use Xano API.

#### Required Changes
1. **Identify All Data Services**:
   - Vehicle services
   - Booking services
   - User profile services
   - Rating/Review services

2. **Replace Each Service**:
   ```javascript
   // Example: VehicleService.js
   // REMOVE
   import apiClient from '../api/apiClient';
   
   // REPLACE with
   import { supabaseClient } from '../supabase/supabaseClient';
   
   const getVehicles = async (params = {}) => {
     let query = supabaseClient
       .from('vehicles')
       .select(`
         *,
         owner:owner_id(first_name, last_name, profile_image_url),
         images:vehicle_images(*)
       `);
     
     // Add filters based on params
     if (params.vehicle_type) {
       query = query.eq('vehicle_type', params.vehicle_type);
     }
     
     if (params.min_price) {
       query = query.gte('daily_rate', params.min_price);
     }
     
     // Execute query
     const { data, error } = await query;
     
     if (error) throw error;
     return data;
   };
   ```

3. **Implement Row Level Security**:
   ```sql
   -- Example policies for vehicles table
   -- Only owners can update their own vehicles
   CREATE POLICY "Owners can update their own vehicles" 
   ON vehicles
   FOR UPDATE 
   USING (auth.uid() = owner_id);
   
   -- Everyone can view approved, available vehicles
   CREATE POLICY "Public vehicles are viewable by everyone" 
   ON vehicles
   FOR SELECT 
   USING (is_approved = true AND is_available = true);
   ```

### File Storage Migration

#### Current Status
Basic Storage setup exists but images likely still reference Xano URLs.

#### Required Changes
1. **Create Storage Buckets**:
   - `vehicle-images`: For all vehicle photos
   - `user-profiles`: For user profile images
   - `documents`: For legal documents and verification

2. **Set Storage Permissions**:
   ```sql
   -- Example policy for vehicle images
   CREATE POLICY "Public read access for vehicle images"
   ON storage.objects
   FOR SELECT
   USING (bucket_id = 'vehicle-images');
   
   -- Only owners can upload to their vehicles
   CREATE POLICY "Owners can upload vehicle images"
   ON storage.objects
   FOR INSERT
   WITH CHECK (
     bucket_id = 'vehicle-images' AND
     EXISTS (
       SELECT 1 FROM vehicles
       WHERE vehicles.owner_id = auth.uid() AND 
             vehicles.vehicle_id::text = (storage.foldername(name))[1]
     )
   );
   ```

3. **Create File Migration Script**:
   ```javascript
   // File migration utility
   const migrateVehicleImages = async () => {
     // Get vehicles with images
     const { data: vehicles } = await supabaseClient
       .from('vehicles')
       .select('vehicle_id, images:vehicle_images(*)');
       
     // Process each vehicle's images
     for (const vehicle of vehicles) {
       for (const image of vehicle.images) {
         // Download from Xano URL
         const xanoImageResponse = await fetch(image.image_url);
         const imageBlob = await xanoImageResponse.blob();
         
         // Upload to Supabase
         const fileName = `${vehicle.vehicle_id}/${Date.now()}-${image.image_type}.jpg`;
         const { data, error } = await supabaseClient
           .storage
           .from('vehicle-images')
           .upload(fileName, imageBlob, {
             contentType: 'image/jpeg',
             upsert: true
           });
           
         if (error) {
           console.error('Error uploading image:', error);
           continue;
         }
         
         // Update image URL in database
         const { error: updateError } = await supabaseClient
           .from('vehicle_images')
           .update({ 
             image_url: supabaseClient.storage.from('vehicle-images').getPublicUrl(fileName).data.publicUrl 
           })
           .eq('image_id', image.image_id);
       }
     }
   };
   ```

## 3. Implementation Phases

### Phase 1: Core Authentication (Week 1)

1. Fix Supabase client initialization issues
2. Update AuthContext to use Supabase exclusively
3. Create test user accounts in Supabase
4. Test login, registration, and session management
5. Remove all Xano auth code

### Phase 2: Vehicle and Booking Services (Week 2)

1. Implement Supabase vehicle service
2. Replace all vehicle-related Xano API calls
3. Update vehicle search and filtering
4. Implement booking service with Supabase
5. Test vehicle and booking CRUD operations

### Phase 3: User Profiles and Reviews (Week 3)

1. Implement user profile management with Supabase
2. Replace rating and review services
3. Update user document verification
4. Test profile updates and review submission

### Phase 4: Storage Migration (Week 4)

1. Set up storage buckets with proper policies
2. Run migration scripts for images and files
3. Update all components to use Supabase URLs
4. Test file uploads and downloads

### Phase 5: Real-time Features (Week 5)

1. Implement Supabase subscriptions for notifications
2. Add real-time booking updates
3. Create real-time messaging between users
4. Set up admin dashboard with live updates

## 4. Testing Strategy

### Authentication Testing

- Test user registration with email verification
- Test login with valid and invalid credentials
- Test password reset flow
- Test session persistence across page reloads
- Test protected routes and permissions

### Database Testing

- Test vehicle search with various filters
- Test booking creation and updates
- Test database triggers and functions
- Verify data integrity across related tables

### Storage Testing

- Test image uploads for various sizes and types
- Test permission boundaries (who can see what)
- Test file deletion and replacement
- Verify public URLs work correctly

### User Acceptance Testing

- Create test scenarios covering all major user flows
- Test with different user roles (owner, renter, admin)
- Verify all features work without Xano dependencies

## 5. Rollback Plan

Despite our goal to completely migrate to Supabase, we should maintain a rollback strategy:

1. **Database Export**: Before migration, export all Xano data
2. **Dual Services Period**: Temporarily maintain both services during initial deployment
3. **Feature Flags**: Use flags to toggle between Supabase and Xano if needed
4. **Monitoring**: Implement extensive error monitoring during cutover

## 6. Post-Migration Optimization

After completing the migration, focus on:

1. **Query Optimization**: Enhance database queries with PostgreSQL features
2. **Edge Functions**: Implement Supabase Edge Functions for complex operations
3. **Caching Strategy**: Add caching for frequently accessed data
4. **Analytics**: Implement analytics with Supabase features

## 7. Documentation Updates

1. **Developer Guide**: Update with Supabase-specific instructions
2. **API Documentation**: Document all Supabase endpoints and operations
3. **Environment Setup**: Update setup instructions for new developers
4. **Testing Guide**: Document testing procedures for Supabase features

## Conclusion

This migration represents a significant architectural improvement for Drively. By following this detailed plan, we can ensure a complete transition from Xano to Supabase with minimal disruption while setting up the platform for future growth and scalability.
