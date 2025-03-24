import supabase, { handleSupabaseResponse } from '../supabaseClient';

/**
 * Search-related functions for Supabase PostgreSQL
 * These functions interact with the Supabase database to search for vehicles
 */

/**
 * Search for vehicles with filters
 * @param {Object} filters - Search criteria
 * @param {string} filters.location - City or location
 * @param {Date} filters.startDate - Start of rental period
 * @param {Date} filters.endDate - End of rental period
 * @param {number} filters.minPrice - Minimum daily rate
 * @param {number} filters.maxPrice - Maximum daily rate
 * @param {Array} filters.vehicleTypes - Array of vehicle types
 * @param {Array} filters.fuelTypes - Array of fuel types
 * @param {string} filters.transmission - Transmission type
 * @param {number} filters.minSeats - Minimum number of seats
 * @param {Array} filters.features - Array of feature IDs
 * @param {string} filters.sortBy - Sort field
 * @param {string} filters.sortOrder - Sort direction ('asc' or 'desc')
 * @param {number} filters.limit - Maximum results
 * @param {number} filters.offset - Offset for pagination
 * @returns {Promise<Object>} - Search results and count
 */
export const searchVehicles = async (filters) => {
  const { data, error } = await supabase.rpc('search_vehicles', filters);
  return handleSupabaseResponse(data, error);
};

/**
 * Search for vehicles by location
 * @param {string} location - City, state, or other location
 * @param {number} distance - Search radius in km
 * @param {Date} startDate - Optional start date
 * @param {Date} endDate - Optional end date
 * @returns {Promise<Array>} - Matching vehicles
 */
export const searchVehiclesByLocation = async (location, distance, startDate = null, endDate = null) => {
  const { data, error } = await supabase.rpc('search_vehicles_by_location', {
    location: location,
    distance_km: distance,
    start_date: startDate,
    end_date: endDate
  });
  return handleSupabaseResponse(data, error);
};

/**
 * Get featured vehicles
 * @param {number} limit - Maximum number of results
 * @returns {Promise<Array>} - Featured vehicles
 */
export const getFeaturedVehicles = async (limit = 10) => {
  const { data, error } = await supabase.rpc('get_featured_vehicles', {
    result_limit: limit
  });
  return handleSupabaseResponse(data, error);
};

/**
 * Get recommended vehicles based on user preferences
 * @param {string} userId - The user's UUID
 * @param {number} limit - Maximum number of results
 * @returns {Promise<Array>} - Recommended vehicles
 */
export const getRecommendedVehicles = async (userId, limit = 10) => {
  const { data, error } = await supabase.rpc('get_recommended_vehicles', {
    user_id: userId,
    result_limit: limit
  });
  return handleSupabaseResponse(data, error);
};

/**
 * Get similar vehicles to a specific vehicle
 * @param {string} vehicleId - The vehicle's UUID
 * @param {number} limit - Maximum number of results
 * @returns {Promise<Array>} - Similar vehicles
 */
export const getSimilarVehicles = async (vehicleId, limit = 5) => {
  const { data, error } = await supabase.rpc('get_similar_vehicles', {
    vehicle_id: vehicleId,
    result_limit: limit
  });
  return handleSupabaseResponse(data, error);
};

/**
 * Search vehicles by keyword
 * @param {string} keyword - Search term
 * @param {number} limit - Maximum number of results
 * @returns {Promise<Array>} - Matching vehicles
 */
export const searchVehiclesByKeyword = async (keyword, limit = 20) => {
  const { data, error } = await supabase.rpc('search_vehicles_by_keyword', {
    search_term: keyword,
    result_limit: limit
  });
  return handleSupabaseResponse(data, error);
};

/**
 * Get available vehicle types with counts
 * @returns {Promise<Array>} - Vehicle types with counts
 */
export const getVehicleTypesWithCounts = async () => {
  const { data, error } = await supabase.rpc('get_vehicle_types_with_counts');
  return handleSupabaseResponse(data, error);
};

/**
 * Get available features for filtering
 * @returns {Promise<Array>} - Features with categories
 */
export const getAvailableFeatures = async () => {
  const { data, error } = await supabase.rpc('get_available_features');
  return handleSupabaseResponse(data, error);
};
