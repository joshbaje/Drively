import supabase, { handleSupabaseResponse } from '../supabaseClient';

/**
 * Vehicle-related functions for Supabase PostgreSQL
 * These functions interact with the Supabase database to manage vehicle listings
 */

/**
 * Create a new vehicle listing
 * @param {Object} vehicleData - Vehicle information
 * @param {Object} locationData - Location information
 * @param {Array} features - Optional array of feature IDs
 * @returns {Promise<Object>} - Created vehicle data
 */
export const createVehicleListing = async (vehicleData, locationData, features = null) => {
  const { data, error } = await supabase.rpc('create_vehicle_listing', {
    vehicle_data: vehicleData,
    location_data: locationData,
    features: features
  });
  return handleSupabaseResponse(data, error);
};

/**
 * Get detailed vehicle information
 * @param {string} vehicleId - The vehicle's UUID
 * @returns {Promise<Object>} - Vehicle details with related information
 */
export const getVehicleDetails = async (vehicleId) => {
  const { data, error } = await supabase.rpc('get_vehicle_details', { vehicle_id: vehicleId });
  return handleSupabaseResponse(data, error);
};

/**
 * Update a vehicle's availability status
 * @param {string} vehicleId - The vehicle's UUID
 * @param {boolean} isAvailable - Whether the vehicle is available
 * @param {string} availabilityStatus - Status ('available', 'rented', 'maintenance', 'unlisted')
 * @param {string} reason - Optional reason for unavailability
 * @returns {Promise<Object>} - Updated vehicle status
 */
export const updateVehicleAvailability = async (vehicleId, isAvailable, availabilityStatus, reason = null) => {
  const { data, error } = await supabase.rpc('update_vehicle_availability', {
    vehicle_id: vehicleId,
    is_available: isAvailable,
    availability_status: availabilityStatus,
    reason: reason
  });
  return handleSupabaseResponse(data, error);
};

/**
 * Add images to a vehicle listing
 * @param {string} vehicleId - The vehicle's UUID
 * @param {Array} images - Array of image objects
 * @returns {Promise<Object>} - Added images information
 */
export const addVehicleImages = async (vehicleId, images) => {
  const { data, error } = await supabase.rpc('add_vehicle_images', {
    vehicle_id: vehicleId,
    images: images
  });
  return handleSupabaseResponse(data, error);
};

/**
 * Update a vehicle's features
 * @param {string} vehicleId - The vehicle's UUID
 * @param {Array} featureIds - Array of feature UUIDs
 * @returns {Promise<Object>} - Updated features list
 */
export const updateVehicleFeatures = async (vehicleId, featureIds) => {
  const { data, error } = await supabase.rpc('update_vehicle_features', {
    vehicle_id: vehicleId,
    feature_ids: featureIds
  });
  return handleSupabaseResponse(data, error);
};

/**
 * Update a vehicle's pricing information
 * @param {string} vehicleId - The vehicle's UUID
 * @param {number} dailyRate - Daily rental rate
 * @param {number} hourlyRate - Optional hourly rate
 * @param {number} weeklyRate - Optional weekly rate
 * @param {number} monthlyRate - Optional monthly rate
 * @param {number} securityDeposit - Optional security deposit
 * @returns {Promise<Object>} - Updated pricing information
 */
export const updateVehiclePricing = async (
  vehicleId, 
  dailyRate, 
  hourlyRate = null, 
  weeklyRate = null, 
  monthlyRate = null,
  securityDeposit = null
) => {
  const { data, error } = await supabase.rpc('update_vehicle_pricing', {
    vehicle_id: vehicleId,
    daily_rate: dailyRate,
    hourly_rate: hourlyRate,
    weekly_rate: weeklyRate,
    monthly_rate: monthlyRate,
    security_deposit: securityDeposit
  });
  return handleSupabaseResponse(data, error);
};

/**
 * Create a period when a vehicle is unavailable
 * @param {string} vehicleId - The vehicle's UUID
 * @param {Date} startDate - Start of unavailability
 * @param {Date} endDate - End of unavailability
 * @param {string} reason - Reason for unavailability
 * @param {string} notes - Optional additional notes
 * @returns {Promise<Object>} - Created exception information
 */
export const createAvailabilityException = async (vehicleId, startDate, endDate, reason, notes = null) => {
  const { data, error } = await supabase.rpc('create_availability_exception', {
    vehicle_id: vehicleId,
    start_date: startDate,
    end_date: endDate,
    reason: reason,
    notes: notes
  });
  return handleSupabaseResponse(data, error);
};

/**
 * Check if a vehicle is available for a given date range
 * @param {string} vehicleId - The vehicle's UUID
 * @param {Date} startDate - Desired start date
 * @param {Date} endDate - Desired end date
 * @returns {Promise<Object>} - Availability status and any conflicts
 */
export const checkVehicleAvailability = async (vehicleId, startDate, endDate) => {
  const { data, error } = await supabase.rpc('check_vehicle_availability', {
    vehicle_id: vehicleId,
    start_date: startDate,
    end_date: endDate
  });
  return handleSupabaseResponse(data, error);
};

/**
 * Get a list of vehicles pending approval (admin function)
 * @returns {Promise<Array>} - List of vehicles pending approval
 */
export const getVehiclesForApproval = async () => {
  const { data, error } = await supabase.rpc('get_admin_vehicle_approval_list');
  return handleSupabaseResponse(data, error);
};
