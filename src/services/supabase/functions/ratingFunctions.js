import supabase, { handleSupabaseResponse } from '../supabaseClient';

/**
 * Rating and review functions for Supabase PostgreSQL
 * These functions interact with the Supabase database to manage ratings and reviews
 */

/**
 * Create a new rating and review
 * @param {Object} ratingData - Rating information
 * @returns {Promise<Object>} - Created rating data
 */
export const createRating = async (ratingData) => {
  const { data, error } = await supabase.rpc('create_rating', {
    rating_data: ratingData
  });
  return handleSupabaseResponse(data, error);
};

/**
 * Get ratings for a user
 * @param {string} userId - The user's UUID
 * @param {string} ratingType - Optional filter by rating type ('owner_to_renter', 'renter_to_owner')
 * @returns {Promise<Array>} - List of ratings
 */
export const getUserRatings = async (userId, ratingType = null) => {
  const { data, error } = await supabase.rpc('get_user_ratings', {
    user_id: userId,
    rating_type: ratingType
  });
  return handleSupabaseResponse(data, error);
};

/**
 * Get ratings for a vehicle
 * @param {string} vehicleId - The vehicle's UUID
 * @returns {Promise<Array>} - List of ratings
 */
export const getVehicleRatings = async (vehicleId) => {
  const { data, error } = await supabase.rpc('get_vehicle_ratings', {
    vehicle_id: vehicleId
  });
  return handleSupabaseResponse(data, error);
};

/**
 * Respond to a rating
 * @param {string} ratingId - The rating's UUID
 * @param {string} response - Response text
 * @returns {Promise<Object>} - Updated rating with response
 */
export const respondToRating = async (ratingId, response) => {
  const { data, error } = await supabase.rpc('respond_to_rating', {
    rating_id: ratingId,
    response_text: response
  });
  return handleSupabaseResponse(data, error);
};

/**
 * Update published status of a rating
 * @param {string} ratingId - The rating's UUID
 * @param {boolean} isPublished - Whether the rating should be published
 * @returns {Promise<Object>} - Updated rating
 */
export const updateRatingPublished = async (ratingId, isPublished) => {
  const { data, error } = await supabase.rpc('update_rating_published', {
    rating_id: ratingId,
    is_published: isPublished
  });
  return handleSupabaseResponse(data, error);
};

/**
 * Get rating eligibility for a booking
 * @param {string} bookingId - The booking's UUID
 * @returns {Promise<Object>} - Eligibility information
 */
export const getRatingEligibility = async (bookingId) => {
  const { data, error } = await supabase.rpc('get_rating_eligibility', {
    booking_id: bookingId
  });
  return handleSupabaseResponse(data, error);
};

/**
 * Calculate average rating for a user
 * @param {string} userId - The user's UUID
 * @param {string} userType - 'owner' or 'renter'
 * @returns {Promise<Object>} - Rating statistics
 */
export const calculateUserRatingStats = async (userId, userType) => {
  const { data, error } = await supabase.rpc('calculate_user_rating_stats', {
    user_id: userId,
    user_type: userType
  });
  return handleSupabaseResponse(data, error);
};

/**
 * Calculate average rating for a vehicle
 * @param {string} vehicleId - The vehicle's UUID
 * @returns {Promise<Object>} - Rating statistics
 */
export const calculateVehicleRatingStats = async (vehicleId) => {
  const { data, error } = await supabase.rpc('calculate_vehicle_rating_stats', {
    vehicle_id: vehicleId
  });
  return handleSupabaseResponse(data, error);
};
