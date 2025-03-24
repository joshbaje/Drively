# Implementing Supabase Endpoints for Drivelyph

This guide provides instructions for implementing new endpoints using Supabase for the Drivelyph car rental platform. It follows the established patterns and architecture of the existing codebase.

## Architecture Overview

The Drivelyph application uses a layered architecture for API endpoints:

1. **Frontend Components** - React components that display data and handle user interactions
2. **Context Providers** - Provide state management and API access to components
3. **API Service Layer** - Centralizes API access and abstracts the backend provider
4. **Service Implementations** - Specific implementations for Supabase or other backends
5. **Supabase Client** - Directly interfaces with the Supabase API

## Step 1: Define the Service Interface

First, create a service module for your feature in the appropriate directory.

Example for a vehicle service:

```javascript
// src/services/supabase/vehicles/vehicleService.js

import supabase from '../supabaseClient';

const vehicleService = {
  /**
   * Get all vehicles with optional filtering
   * @param {Object} params - Search and filter parameters
   * @returns {Promise} - List of vehicles
   */
  async getVehicles(params = {}) {
    try {
      // Initial query
      let query = supabase
        .from('vehicles')
        .select('*, owner:users(first_name, last_name, profile_image_url)')
        .eq('is_available', true)
        .eq('is_approved', true);

      // Apply filters
      if (params.vehicle_type) {
        query = query.eq('vehicle_type', params.vehicle_type);
      }
      
      if (params.min_price && params.max_price) {
        query = query
          .gte('daily_rate', params.min_price)
          .lte('daily_rate', params.max_price);
      }
      
      // Apply location filter if provided
      if (params.city) {
        query = query.eq('city', params.city);
      }
      
      // Apply date range filter if provided (check availability)
      if (params.start_date && params.end_date) {
        // This would require more complex query logic to check against bookings
        // This is a placeholder
      }
      
      // Apply sorting
      const sortField = params.sort_by || 'created_at';
      const sortOrder = params.sort_order === 'asc' ? true : false;
      query = query.order(sortField, { ascending: sortOrder });
      
      // Apply pagination
      if (params.limit) {
        query = query.limit(params.limit);
      }
      
      if (params.offset) {
        query = query.range(params.offset, params.offset + (params.limit || 10) - 1);
      }
      
      // Execute query
      const { data, error } = await query;
      
      if (error) throw error;
      
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching vehicles:', error.message);
      return { data: null, error };
    }
  },
  
  /**
   * Get a specific vehicle by ID
   * @param {string} id - Vehicle ID
   * @returns {Promise} - Vehicle details
   */
  async getVehicleById(id) {
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .select(`
          *,
          owner:owner_id(user_id, first_name, last_name, profile_image_url, bio),
          location:location_id(*),
          images:vehicle_images(*)
        `)
        .eq('vehicle_id', id)
        .single();
        
      if (error) throw error;
      
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching vehicle:', error.message);
      return { data: null, error };
    }
  },
  
  /**
   * Create a new vehicle listing
   * @param {Object} vehicleData - Vehicle data
   * @returns {Promise} - Created vehicle
   */
  async createVehicle(vehicleData) {
    try {
      const { data: userData } = await supabase.auth.getUser();
      
      if (!userData?.user) {
        throw new Error('User must be authenticated to create a vehicle');
      }
      
      const { data, error } = await supabase
        .from('vehicles')
        .insert([
          {
            owner_id: userData.user.id,
            make: vehicleData.make,
            model: vehicleData.model,
            year: vehicleData.year,
            color: vehicleData.color,
            // Add other fields from vehicleData
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ])
        .select();
        
      if (error) throw error;
      
      return { data: data[0], error: null };
    } catch (error) {
      console.error('Error creating vehicle:', error.message);
      return { data: null, error };
    }
  },
  
  /**
   * Update an existing vehicle
   * @param {string} id - Vehicle ID
   * @param {Object} vehicleData - Updated vehicle data
   * @returns {Promise} - Updated vehicle
   */
  async updateVehicle(id, vehicleData) {
    try {
      // First check if the user owns this vehicle
      const { data: userData } = await supabase.auth.getUser();
      
      if (!userData?.user) {
        throw new Error('User must be authenticated to update a vehicle');
      }
      
      // Check ownership
      const { data: vehicleCheck, error: checkError } = await supabase
        .from('vehicles')
        .select('owner_id')
        .eq('vehicle_id', id)
        .single();
        
      if (checkError) throw checkError;
      
      if (vehicleCheck.owner_id !== userData.user.id) {
        throw new Error('You can only update your own vehicles');
      }
      
      // Perform update
      const { data, error } = await supabase
        .from('vehicles')
        .update({
          make: vehicleData.make,
          model: vehicleData.model,
          year: vehicleData.year,
          color: vehicleData.color,
          // Add other fields from vehicleData
          updated_at: new Date().toISOString()
        })
        .eq('vehicle_id', id)
        .select();
        
      if (error) throw error;
      
      return { data: data[0], error: null };
    } catch (error) {
      console.error('Error updating vehicle:', error.message);
      return { data: null, error };
    }
  },
  
  /**
   * Delete a vehicle
   * @param {string} id - Vehicle ID
   * @returns {Promise} - Success status
   */
  async deleteVehicle(id) {
    try {
      // First check if the user owns this vehicle
      const { data: userData } = await supabase.auth.getUser();
      
      if (!userData?.user) {
        throw new Error('User must be authenticated to delete a vehicle');
      }
      
      // Check ownership
      const { data: vehicleCheck, error: checkError } = await supabase
        .from('vehicles')
        .select('owner_id')
        .eq('vehicle_id', id)
        .single();
        
      if (checkError) throw checkError;
      
      if (vehicleCheck.owner_id !== userData.user.id) {
        throw new Error('You can only delete your own vehicles');
      }
      
      // Perform delete
      const { error } = await supabase
        .from('vehicles')
        .delete()
        .eq('vehicle_id', id);
        
      if (error) throw error;
      
      return { success: true, error: null };
    } catch (error) {
      console.error('Error deleting vehicle:', error.message);
      return { success: false, error };
    }
  },
  
  /**
   * Upload a vehicle image
   * @param {string} vehicleId - Vehicle ID
   * @param {File} file - Image file
   * @param {Object} options - Upload options
   * @returns {Promise} - Uploaded image data
   */
  async uploadVehicleImage(vehicleId, file, options = {}) {
    try {
      // First check if the user owns this vehicle
      const { data: userData } = await supabase.auth.getUser();
      
      if (!userData?.user) {
        throw new Error('User must be authenticated to upload images');
      }
      
      // Check ownership
      const { data: vehicleCheck, error: checkError } = await supabase
        .from('vehicles')
        .select('owner_id')
        .eq('vehicle_id', vehicleId)
        .single();
        
      if (checkError) throw checkError;
      
      if (vehicleCheck.owner_id !== userData.user.id) {
        throw new Error('You can only upload images for your own vehicles');
      }
      
      // Upload file to storage
      const filePath = `vehicles/${vehicleId}/${Date.now()}_${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('vehicle-images')
        .upload(filePath, file);
        
      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data: urlData } = supabase.storage
        .from('vehicle-images')
        .getPublicUrl(filePath);
      
      // Add to vehicle_images table
      const { data, error } = await supabase
        .from('vehicle_images')
        .insert([
          {
            vehicle_id: vehicleId,
            image_url: urlData.publicUrl,
            image_type: options.imageType || 'exterior',
            is_primary: !!options.isPrimary,
            caption: options.caption,
            order_index: options.orderIndex || 0,
            created_at: new Date().toISOString()
          }
        ])
        .select();
        
      if (error) throw error;
      
      return { data: data[0], error: null };
    } catch (error) {
      console.error('Error uploading vehicle image:', error.message);
      return { data: null, error };
    }
  }
};

export default vehicleService;
```

## Step 2: Update the Service Index File

Add your new service to the main services index file:

```javascript
// src/services/supabase/index.js

import supabase from './supabaseClient';
import authService from './auth/authService';
import vehicleService from './vehicles/vehicleService';
import bookingService from './bookings/bookingService';

// Create service object
const supabaseServices = {
  supabase,
  auth: authService,
  vehicles: vehicleService,
  bookings: bookingService,
  
  // Add other service modules as needed
};

export default supabaseServices;
```

## Step 3: Create the API Adapter

Implement the API adapter that maintains compatibility with the application structure:

```javascript
// src/services/api/supabaseApi.js

// Add to the existing file

// Vehicle-related services
vehicles: {
  getVehicles: async (params) => {
    try {
      const { data, error } = await supabaseServices.vehicles.getVehicles(params);
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      throw error;
    }
  },
  
  getVehicleById: async (id) => {
    try {
      const { data, error } = await supabaseServices.vehicles.getVehicleById(id);
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching vehicle by ID:', error);
      throw error;
    }
  },
  
  createVehicle: async (vehicleData) => {
    try {
      const { data, error } = await supabaseServices.vehicles.createVehicle(vehicleData);
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating vehicle:', error);
      throw error;
    }
  },
  
  updateVehicle: async (id, vehicleData) => {
    try {
      const { data, error } = await supabaseServices.vehicles.updateVehicle(id, vehicleData);
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating vehicle:', error);
      throw error;
    }
  },
  
  deleteVehicle: async (id) => {
    try {
      const { success, error } = await supabaseServices.vehicles.deleteVehicle(id);
      
      if (error) throw error;
      return { success };
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      throw error;
    }
  },
  
  uploadVehicleImage: async (vehicleId, imageFile, options) => {
    try {
      const { data, error } = await supabaseServices.vehicles.uploadVehicleImage(vehicleId, imageFile, options);
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error uploading vehicle image:', error);
      throw error;
    }
  }
}
```

## Step 4: Create a Context Provider (Optional)

For complex features, create a dedicated context provider:

```javascript
// src/context/VehicleContext.js

import { createContext, useState, useEffect, useContext } from 'react';
import ApiService from '../services/api';

export const VehicleContext = createContext();

export const VehicleProvider = ({ children }) => {
  const [vehicles, setVehicles] = useState([]);
  const [currentVehicle, setCurrentVehicle] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchVehicles = async (params = {}) => {
    try {
      setLoading(true);
      const data = await ApiService.vehicles.getVehicles(params);
      setVehicles(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching vehicles:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchVehicleById = async (id) => {
    try {
      setLoading(true);
      const data = await ApiService.vehicles.getVehicleById(id);
      setCurrentVehicle(data);
      setError(null);
      return data;
    } catch (err) {
      setError(err.message);
      console.error('Error fetching vehicle details:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createVehicle = async (vehicleData) => {
    try {
      setLoading(true);
      const data = await ApiService.vehicles.createVehicle(vehicleData);
      setError(null);
      // Update vehicles list
      setVehicles(prev => [data, ...prev]);
      return data;
    } catch (err) {
      setError(err.message);
      console.error('Error creating vehicle:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateVehicle = async (id, vehicleData) => {
    try {
      setLoading(true);
      const data = await ApiService.vehicles.updateVehicle(id, vehicleData);
      setError(null);
      
      // Update current vehicle if it matches
      if (currentVehicle && currentVehicle.vehicle_id === id) {
        setCurrentVehicle(data);
      }
      
      // Update vehicles list
      setVehicles(prev => 
        prev.map(vehicle => 
          vehicle.vehicle_id === id ? data : vehicle
        )
      );
      
      return data;
    } catch (err) {
      setError(err.message);
      console.error('Error updating vehicle:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteVehicle = async (id) => {
    try {
      setLoading(true);
      await ApiService.vehicles.deleteVehicle(id);
      setError(null);
      
      // Remove from vehicles list
      setVehicles(prev => 
        prev.filter(vehicle => vehicle.vehicle_id !== id)
      );
      
      // Clear current vehicle if it matches
      if (currentVehicle && currentVehicle.vehicle_id === id) {
        setCurrentVehicle(null);
      }
      
      return { success: true };
    } catch (err) {
      setError(err.message);
      console.error('Error deleting vehicle:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const uploadVehicleImage = async (vehicleId, imageFile, options = {}) => {
    try {
      setLoading(true);
      const data = await ApiService.vehicles.uploadVehicleImage(vehicleId, imageFile, options);
      setError(null);
      
      // Update current vehicle if it matches
      if (currentVehicle && currentVehicle.vehicle_id === vehicleId) {
        setCurrentVehicle(prev => ({
          ...prev,
          images: prev.images ? [...prev.images, data] : [data]
        }));
      }
      
      return data;
    } catch (err) {
      setError(err.message);
      console.error('Error uploading vehicle image:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <VehicleContext.Provider
      value={{
        vehicles,
        currentVehicle,
        loading,
        error,
        fetchVehicles,
        fetchVehicleById,
        createVehicle,
        updateVehicle,
        deleteVehicle,
        uploadVehicleImage
      }}
    >
      {children}
    </VehicleContext.Provider>
  );
};

export const useVehicles = () => useContext(VehicleContext);

export default VehicleProvider;
```

## Step 5: Use the Endpoints in Components

Now you can use your new endpoints in React components:

```jsx
// src/pages/VehicleListPage.jsx

import React, { useEffect, useState } from 'react';
import { useVehicles } from '../context/VehicleContext';
import VehicleCard from '../components/vehicle/VehicleCard';
import SearchFilter from '../components/vehicle/SearchFilter';

const VehicleListPage = () => {
  const { vehicles, loading, error, fetchVehicles } = useVehicles();
  const [filters, setFilters] = useState({
    vehicle_type: '',
    min_price: '',
    max_price: '',
    city: ''
  });
  
  useEffect(() => {
    // Load vehicles on initial render
    fetchVehicles();
  }, []);
  
  const handleSearch = (newFilters) => {
    setFilters(newFilters);
    fetchVehicles(newFilters);
  };
  
  if (loading) {
    return <div className="loading">Loading vehicles...</div>;
  }
  
  if (error) {
    return <div className="error">Error: {error}</div>;
  }
  
  return (
    <div className="vehicle-list-page">
      <h1>Available Vehicles</h1>
      
      <SearchFilter onSearch={handleSearch} initialValues={filters} />
      
      <div className="vehicle-grid">
        {vehicles.length === 0 ? (
          <p>No vehicles found matching your criteria.</p>
        ) : (
          vehicles.map(vehicle => (
            <VehicleCard key={vehicle.vehicle_id} vehicle={vehicle} />
          ))
        )}
      </div>
    </div>
  );
};

export default VehicleListPage;
```

## Step 6: Handle File Uploads

For file uploads (such as vehicle images), you need to use the Supabase Storage API:

```jsx
// src/components/vehicle/VehicleImageUploader.jsx

import React, { useState } from 'react';
import { useVehicles } from '../../context/VehicleContext';

const VehicleImageUploader = ({ vehicleId }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  const { uploadVehicleImage } = useVehicles();
  
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    
    // Validate file type
    if (selectedFile && !selectedFile.type.startsWith('image/')) {
      setError('Please select an image file (JPEG, PNG, etc.)');
      return;
    }
    
    // Validate file size (max 5MB)
    if (selectedFile && selectedFile.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }
    
    setFile(selectedFile);
    setError(null);
  };
  
  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file to upload');
      return;
    }
    
    try {
      setUploading(true);
      setError(null);
      
      const options = {
        imageType: 'exterior',  // Default type
        caption: 'Vehicle image'
      };
      
      await uploadVehicleImage(vehicleId, file, options);
      setSuccess(true);
      setFile(null);
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      setError(err.message || 'Error uploading image');
    } finally {
      setUploading(false);
    }
  };
  
  return (
    <div className="vehicle-image-uploader">
      <h3>Upload Vehicle Images</h3>
      
      {error && <div className="error">{error}</div>}
      {success && <div className="success">Image uploaded successfully!</div>}
      
      <div className="file-input">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading}
        />
        
        {file && (
          <div className="selected-file">
            <p>Selected file: {file.name}</p>
            <img 
              src={URL.createObjectURL(file)} 
              alt="Preview" 
              style={{ maxWidth: '200px', maxHeight: '200px' }} 
            />
          </div>
        )}
      </div>
      
      <button
        onClick={handleUpload}
        disabled={!file || uploading}
        className="upload-button"
      >
        {uploading ? 'Uploading...' : 'Upload Image'}
      </button>
    </div>
  );
};

export default VehicleImageUploader;
```

## Step 7: Implement Real-time Subscriptions (Optional)

Supabase allows real-time updates using the Realtime service:

```javascript
// src/services/supabase/realtime/realtimeService.js

import supabase from '../supabaseClient';

const realtimeService = {
  /**
   * Subscribe to changes in a booking's status
   * @param {string} bookingId - Booking ID to watch
   * @param {Function} callback - Function to call when status changes
   * @returns {Object} - Subscription that can be unsubscribed
   */
  subscribeToBookingStatus(bookingId, callback) {
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
  },
  
  /**
   * Subscribe to new messages in a conversation
   * @param {string} conversationId - Conversation ID to watch
   * @param {Function} callback - Function to call when new messages arrive
   * @returns {Object} - Subscription that can be unsubscribed
   */
  subscribeToMessages(conversationId, callback) {
    const subscription = supabase
      .channel(`messages-${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`
        },
        (payload) => {
          callback(payload.new);
        }
      )
      .subscribe();
      
    return subscription;
  }
};

export default realtimeService;
```

Usage in a component:

```jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ApiService from '../../services/api';
import realtimeService from '../../services/supabase/realtime/realtimeService';

const BookingDetailsPage = () => {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Fetch initial booking data
    const fetchBooking = async () => {
      try {
        const data = await ApiService.bookings.getBookingById(id);
        setBooking(data);
      } catch (error) {
        console.error('Error fetching booking:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBooking();
    
    // Set up real-time subscription for booking status changes
    const subscription = realtimeService.subscribeToBookingStatus(id, (updatedBooking) => {
      console.log('Booking updated in real-time:', updatedBooking);
      setBooking(prev => ({ ...prev, ...updatedBooking }));
    });
    
    // Clean up subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [id]);
  
  // Component rendering...
};
```

## Best Practices for Supabase Endpoints

1. **Error Handling**: Always use try/catch blocks and return consistent error objects.

2. **Authentication**: Check user authentication status before performing operations.

3. **Authorization**: Verify that users have permission to access or modify data.

4. **Data Validation**: Validate input data before sending to Supabase.

5. **Transactions**: For multi-step operations, use transactions to ensure data consistency.

6. **Rate Limiting**: Implement rate limiting for operations that could be abused.

7. **Caching**: Consider caching results for frequently accessed data.

8. **Pagination**: Implement pagination for large result sets.

9. **Secure File Uploads**: Validate file types, sizes, and permissions before upload.

10. **Audit Logging**: Log important operations for security and debugging.

## Database Policies

Remember to set up appropriate Row Level Security (RLS) policies in your Supabase project:

```sql
-- Enable RLS on tables
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Anyone can view approved vehicles
CREATE POLICY "Public vehicles are viewable by everyone"
ON vehicles
FOR SELECT
USING (is_approved = true AND is_available = true);

-- Owners can update their own vehicles
CREATE POLICY "Users can update their own vehicles"
ON vehicles
FOR UPDATE
USING (auth.uid() = owner_id);

-- Owners can delete their own vehicles
CREATE POLICY "Users can delete their own vehicles"
ON vehicles
FOR DELETE
USING (auth.uid() = owner_id);

-- Only owners can insert vehicles
CREATE POLICY "Users can insert their own vehicles"
ON vehicles
FOR INSERT
WITH CHECK (auth.uid() = owner_id);
```

## Testing Endpoints

Always test your endpoints before integrating them into the application:

1. Unit tests for service functions
2. Integration tests for API endpoints
3. End-to-end tests for complete user flows

Example Jest test:

```javascript
import vehicleService from '../services/supabase/vehicles/vehicleService';
import supabase from '../services/supabase/supabaseClient';

// Mock Supabase
jest.mock('../services/supabase/supabaseClient', () => ({
  from: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  eq: jest.fn().mockReturnThis(),
  insert: jest.fn().mockReturnThis(),
  update: jest.fn().mockReturnThis(),
  delete: jest.fn().mockReturnThis(),
  single: jest.fn(),
  storage: {
    from: jest.fn().mockReturnValue({
      upload: jest.fn(),
      getPublicUrl: jest.fn()
    })
  },
  auth: {
    getUser: jest.fn()
  }
}));

describe('Vehicle Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test('getVehicleById fetches vehicle with correct ID', async () => {
    // Mock Supabase response
    const mockVehicle = { vehicle_id: '123', make: 'Toyota' };
    supabase.single.mockResolvedValue({ data: mockVehicle, error: null });
    
    // Call service
    const result = await vehicleService.getVehicleById('123');
    
    // Verify correct methods were called
    expect(supabase.from).toHaveBeenCalledWith('vehicles');
    expect(supabase.select).toHaveBeenCalled();
    expect(supabase.eq).toHaveBeenCalledWith('vehicle_id', '123');
    expect(supabase.single).toHaveBeenCalled();
    
    // Verify result
    expect(result.data).toEqual(mockVehicle);
    expect(result.error).toBeNull();
  });
  
  // Additional tests...
});
```

## Conclusion

By following these steps and best practices, you can implement robust Supabase endpoints for the Drivelyph car rental platform. This approach ensures:

1. Consistent structure and error handling
2. Proper separation of concerns
3. Type safety and validation
4. Secure data access
5. Efficient use of Supabase features

Remember to update documentation as you add new endpoints and keep the API interface consistent for a smooth migration from Xano to Supabase.
