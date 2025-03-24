import supabase from '../supabaseClient';
import databaseUtils from '../utils/databaseUtils';

/**
 * Vehicle service for Supabase
 * Handles vehicle-related operations
 */
const vehicleService = {
  /**
   * Get all vehicles with filtering and pagination
   * @param {Object} filters - Filter criteria
   * @param {Object} options - Query options
   * @returns {Promise} - Vehicles data
   */
  async getVehicles(filters = {}, options = {}) {
    try {
      const {
        limit = 20,
        offset = 0,
        orderBy = 'created_at:desc',
        includeOwner = false,
        includeImages = false,
        includeLocation = false,
        includeFeatures = false,
      } = options;
      
      // Build relations array for related tables
      const relations = [];
      if (includeOwner) {
        relations.push({ table: 'users', fields: 'user_id,first_name,last_name,profile_image_url,average_rating' });
      }
      if (includeLocation) {
        relations.push({ table: 'locations', fields: 'location_id,city,state,country,latitude,longitude' });
      }
      
      // Get vehicles with basic relations
      const result = await databaseUtils.getMany('vehicles', filters, {
        limit,
        offset,
        orderBy,
        relations,
      });
      
      if (result.error) throw result.error;
      
      // If we need to include images or features, fetch them separately
      if (includeImages || includeFeatures) {
        const vehicleIds = result.data.map(vehicle => vehicle.vehicle_id);
        
        // Get vehicle images if requested
        if (includeImages && vehicleIds.length > 0) {
          const { data: images, error: imagesError } = await supabase
            .from('vehicle_images')
            .select('*')
            .in('vehicle_id', vehicleIds)
            .order('is_primary', { ascending: false })
            .order('order_index', { ascending: true });
            
          if (imagesError) throw imagesError;
          
          // Group images by vehicle
          const imagesByVehicle = images.reduce((acc, image) => {
            acc[image.vehicle_id] = acc[image.vehicle_id] || [];
            acc[image.vehicle_id].push(image);
            return acc;
          }, {});
          
          // Add images to each vehicle
          result.data = result.data.map(vehicle => ({
            ...vehicle,
            images: imagesByVehicle[vehicle.vehicle_id] || [],
          }));
        }
        
        // Get vehicle features if requested
        if (includeFeatures && vehicleIds.length > 0) {
          const { data: featureLinks, error: featuresError } = await supabase
            .from('vehicle_feature_links')
            .select(`
              link_id,
              vehicle_id,
              vehicle_features (
                feature_id,
                name,
                description,
                icon,
                category
              )
            `)
            .in('vehicle_id', vehicleIds);
            
          if (featuresError) throw featuresError;
          
          // Group features by vehicle
          const featuresByVehicle = featureLinks.reduce((acc, link) => {
            acc[link.vehicle_id] = acc[link.vehicle_id] || [];
            acc[link.vehicle_id].push(link.vehicle_features);
            return acc;
          }, {});
          
          // Add features to each vehicle
          result.data = result.data.map(vehicle => ({
            ...vehicle,
            features: featuresByVehicle[vehicle.vehicle_id] || [],
          }));
        }
      }
      
      return result;
    } catch (error) {
      console.error('Error getting vehicles:', error.message);
      return { data: null, count: 0, pagination: null, error };
    }
  },
  
  /**
   * Get a vehicle by ID with all related data
   * @param {string} vehicleId - Vehicle ID
   * @returns {Promise} - Vehicle data
   */
  async getVehicleById(vehicleId) {
    try {
      // Get the vehicle with owner and location
      const { data: vehicle, error } = await supabase
        .from('vehicles')
        .select(`
          *,
          users (user_id, first_name, last_name, profile_image_url, bio),
          locations (*)
        `)
        .eq('vehicle_id', vehicleId)
        .single();
        
      if (error) throw error;
      
      // Get vehicle images
      const { data: images, error: imagesError } = await supabase
        .from('vehicle_images')
        .select('*')
        .eq('vehicle_id', vehicleId)
        .order('is_primary', { ascending: false })
        .order('order_index', { ascending: true });
        
      if (imagesError) throw imagesError;
      
      // Get vehicle features
      const { data: featureLinks, error: featuresError } = await supabase
        .from('vehicle_feature_links')
        .select(`
          link_id,
          vehicle_features (
            feature_id,
            name,
            description,
            icon,
            category
          )
        `)
        .eq('vehicle_id', vehicleId);
        
      if (featuresError) throw featuresError;
      
      // Get vehicle ratings
      const { data: ratings, error: ratingsError } = await supabase
        .from('ratings')
        .select(`
          *,
          users (user_id, first_name, last_name, profile_image_url)
        `)
        .eq('vehicle_id', vehicleId)
        .eq('rating_type', 'renter_to_vehicle')
        .eq('is_published', true)
        .order('created_at', { ascending: false });
        
      if (ratingsError) throw ratingsError;
      
      // Get vehicle availability calendar
      const { data: availability, error: availabilityError } = await supabase
        .from('availability_calendar')
        .select('*')
        .eq('vehicle_id', vehicleId)
        .gte('end_date', new Date().toISOString());
        
      if (availabilityError) throw availabilityError;
      
      // Get vehicle documents
      const { data: documents, error: documentsError } = await supabase
        .from('vehicle_documents')
        .select('*')
        .eq('vehicle_id', vehicleId)
        .eq('status', 'approved');
        
      if (documentsError) throw documentsError;
      
      // Combine all data
      const completeVehicle = {
        ...vehicle,
        owner: vehicle.users,
        location: vehicle.locations,
        images: images || [],
        features: featureLinks?.map(link => link.vehicle_features) || [],
        ratings: ratings || [],
        availability: availability || [],
        documents: documents || [],
        // Remove redundant nested objects
        users: undefined,
        locations: undefined,
      };
      
      return { data: completeVehicle, error: null };
    } catch (error) {
      console.error('Error getting vehicle by ID:', error.message);
      return { data: null, error };
    }
  },
  
  /**
   * Create a new vehicle
   * @param {Object} vehicleData - Vehicle data
   * @param {Array} images - Vehicle images
   * @param {Array} featureIds - Array of feature IDs
   * @returns {Promise} - Created vehicle
   */
  async createVehicle(vehicleData, images = [], featureIds = []) {
    try {
      // Start a transaction
      const { data, error } = await supabase.rpc('create_vehicle_transaction', {
        vehicle_data: vehicleData,
      });
      
      if (error) throw error;
      
      const vehicleId = data.vehicle_id;
      
      // Upload images if provided
      if (images.length > 0) {
        const imagePromises = images.map(async (image, index) => {
          // Upload to storage
          const fileName = `${vehicleId}/${Date.now()}_${index}.${image.name.split('.').pop()}`;
          const { url, error: uploadError } = await databaseUtils.uploadFile(
            'vehicle_images',
            fileName,
            image.file
          );
          
          if (uploadError) throw uploadError;
          
          // Create image record
          return databaseUtils.create('vehicle_images', {
            vehicle_id: vehicleId,
            image_url: url,
            image_type: index === 0 ? 'exterior' : 'detail',
            is_primary: index === 0,
            order_index: index,
          });
        });
        
        await Promise.all(imagePromises);
      }
      
      // Link features if provided
      if (featureIds.length > 0) {
        const featureData = featureIds.map(featureId => ({
          vehicle_id: vehicleId,
          feature_id: featureId,
        }));
        
        const { error: featureError } = await supabase
          .from('vehicle_feature_links')
          .insert(featureData);
          
        if (featureError) throw featureError;
      }
      
      // Get the created vehicle with all data
      return this.getVehicleById(vehicleId);
    } catch (error) {
      console.error('Error creating vehicle:', error.message);
      return { data: null, error };
    }
  },
  
  /**
   * Update a vehicle
   * @param {string} vehicleId - Vehicle ID
   * @param {Object} vehicleData - Vehicle data to update
   * @returns {Promise} - Updated vehicle
   */
  async updateVehicle(vehicleId, vehicleData) {
    try {
      const { error } = await supabase
        .from('vehicles')
        .update({
          ...vehicleData,
          updated_at: new Date().toISOString(),
        })
        .eq('vehicle_id', vehicleId);
        
      if (error) throw error;
      
      // Return the updated vehicle
      return this.getVehicleById(vehicleId);
    } catch (error) {
      console.error('Error updating vehicle:', error.message);
      return { data: null, error };
    }
  },
  
  /**
   * Delete a vehicle
   * @param {string} vehicleId - Vehicle ID
   * @returns {Promise} - Deletion result
   */
  async deleteVehicle(vehicleId) {
    try {
      // Get all images to delete from storage
      const { data: images } = await supabase
        .from('vehicle_images')
        .select('image_url')
        .eq('vehicle_id', vehicleId);
        
      // Start a transaction to delete the vehicle and related records
      const { error } = await supabase.rpc('delete_vehicle_transaction', {
        vehicle_id: vehicleId,
      });
      
      if (error) throw error;
      
      // Delete images from storage if any
      if (images && images.length > 0) {
        // Extract paths from URLs
        const imagePaths = images.map(img => {
          const url = new URL(img.image_url);
          return url.pathname.split('/').slice(-2).join('/');
        });
        
        // Delete from storage
        await supabase.storage
          .from('vehicle_images')
          .remove(imagePaths);
      }
      
      return { error: null };
    } catch (error) {
      console.error('Error deleting vehicle:', error.message);
      return { error };
    }
  },
  
  /**
   * Add an image to a vehicle
   * @param {string} vehicleId - Vehicle ID
   * @param {File} imageFile - Image file
   * @param {Object} imageData - Image metadata
   * @returns {Promise} - Added image
   */
  async addVehicleImage(vehicleId, imageFile, imageData = {}) {
    try {
      // Get current image count
      const { data: existingImages, error: countError } = await supabase
        .from('vehicle_images')
        .select('image_id')
        .eq('vehicle_id', vehicleId);
        
      if (countError) throw countError;
      
      const orderIndex = existingImages ? existingImages.length : 0;
      const isPrimary = orderIndex === 0;
      
      // Upload image
      const fileName = `${vehicleId}/${Date.now()}_${orderIndex}.${imageFile.name.split('.').pop()}`;
      const { url, error: uploadError } = await databaseUtils.uploadFile(
        'vehicle_images',
        fileName,
        imageFile
      );
      
      if (uploadError) throw uploadError;
      
      // Create image record
      const { data: newImage, error } = await databaseUtils.create('vehicle_images', {
        vehicle_id: vehicleId,
        image_url: url,
        image_type: imageData.image_type || 'exterior',
        is_primary: imageData.is_primary !== undefined ? imageData.is_primary : isPrimary,
        caption: imageData.caption || '',
        order_index: imageData.order_index !== undefined ? imageData.order_index : orderIndex,
      });
      
      if (error) throw error;
      
      return { data: newImage, error: null };
    } catch (error) {
      console.error('Error adding vehicle image:', error.message);
      return { data: null, error };
    }
  },
  
  /**
   * Remove an image from a vehicle
   * @param {string} imageId - Image ID
   * @returns {Promise} - Removal result
   */
  async removeVehicleImage(imageId) {
    try {
      // Get image URL to delete from storage
      const { data: image, error: getError } = await supabase
        .from('vehicle_images')
        .select('*')
        .eq('image_id', imageId)
        .single();
        
      if (getError) throw getError;
      
      // Delete the record
      const { error } = await supabase
        .from('vehicle_images')
        .delete()
        .eq('image_id', imageId);
        
      if (error) throw error;
      
      // Delete from storage if URL exists
      if (image && image.image_url) {
        // Extract path from URL
        const url = new URL(image.image_url);
        const path = url.pathname.split('/').slice(-2).join('/');
        
        await supabase.storage
          .from('vehicle_images')
          .remove([path]);
      }
      
      // If this was the primary image, set a new primary image
      if (image && image.is_primary) {
        const { data: remainingImages } = await supabase
          .from('vehicle_images')
          .select('*')
          .eq('vehicle_id', image.vehicle_id)
          .order('order_index', { ascending: true })
          .limit(1);
          
        if (remainingImages && remainingImages.length > 0) {
          await supabase
            .from('vehicle_images')
            .update({ is_primary: true })
            .eq('image_id', remainingImages[0].image_id);
        }
      }
      
      return { error: null };
    } catch (error) {
      console.error('Error removing vehicle image:', error.message);
      return { error };
    }
  },
  
  /**
   * Update vehicle availability
   * @param {string} vehicleId - Vehicle ID
   * @param {string} startDate - Start date
   * @param {string} endDate - End date
   * @param {string} reason - Reason for unavailability
   * @returns {Promise} - Updated availability
   */
  async setVehicleUnavailable(vehicleId, startDate, endDate, reason = 'maintenance') {
    try {
      const { data, error } = await databaseUtils.create('availability_calendar', {
        vehicle_id: vehicleId,
        start_date: startDate,
        end_date: endDate,
        reason,
      });
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error updating vehicle availability:', error.message);
      return { data: null, error };
    }
  },
  
  /**
   * Remove an unavailability period
   * @param {string} exceptionId - Exception ID
   * @returns {Promise} - Removal result
   */
  async removeUnavailabilityPeriod(exceptionId) {
    try {
      const { error } = await supabase
        .from('availability_calendar')
        .delete()
        .eq('exception_id', exceptionId);
        
      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Error removing unavailability period:', error.message);
      return { error };
    }
  },
  
  /**
   * Get all features
   * @returns {Promise} - Features list
   */
  async getFeatures() {
    try {
      const { data, error } = await supabase
        .from('vehicle_features')
        .select('*')
        .eq('is_active', true)
        .order('name', { ascending: true });
        
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error getting features:', error.message);
      return { data: null, error };
    }
  },
  
  /**
   * Check vehicle availability
   * @param {string} vehicleId - Vehicle ID
   * @param {string} startDate - Start date
   * @param {string} endDate - End date
   * @returns {Promise} - Availability status
   */
  async checkAvailability(vehicleId, startDate, endDate) {
    try {
      // Check for existing bookings
      const { data: bookingConflicts, error: bookingError } = await supabase
        .from('bookings')
        .select('booking_id')
        .eq('vehicle_id', vehicleId)
        .in('booking_status', ['confirmed', 'in_progress'])
        .or(`start_date.lte.${endDate},end_date.gte.${startDate}`)
        .limit(1);
        
      if (bookingError) throw bookingError;
      
      // Check for unavailability periods
      const { data: unavailabilityConflicts, error: unavailabilityError } = await supabase
        .from('availability_calendar')
        .select('exception_id')
        .eq('vehicle_id', vehicleId)
        .or(`start_date.lte.${endDate},end_date.gte.${startDate}`)
        .limit(1);
        
      if (unavailabilityError) throw unavailabilityError;
      
      // Combine results
      const isAvailable = 
        (bookingConflicts?.length === 0 || !bookingConflicts) && 
        (unavailabilityConflicts?.length === 0 || !unavailabilityConflicts);
      
      return {
        data: {
          available: isAvailable,
          hasBookingConflict: bookingConflicts?.length > 0,
          hasUnavailabilityConflict: unavailabilityConflicts?.length > 0,
        },
        error: null,
      };
    } catch (error) {
      console.error('Error checking availability:', error.message);
      return {
        data: { available: false, error: error.message },
        error,
      };
    }
  },
};

export default vehicleService;
