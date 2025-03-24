import supabase, { handleSupabaseResponse } from '../supabaseClient';

/**
 * Booking-related functions for Supabase PostgreSQL
 * These functions interact with the Supabase database to manage bookings
 */

/**
 * Create a new booking
 * @param {Object} bookingData - Booking information
 * @returns {Promise<Object>} - Created booking data
 */
export const createBooking = async (bookingData) => {
  const { data, error } = await supabase.rpc('create_booking', {
    booking_data: bookingData
  });
  return handleSupabaseResponse(data, error);
};

/**
 * Get a specific booking with details
 * @param {string} bookingId - The booking's UUID
 * @returns {Promise<Object>} - Booking details with related information
 */
export const getBookingDetails = async (bookingId) => {
  const { data, error } = await supabase.rpc('get_booking_details', { booking_id: bookingId });
  return handleSupabaseResponse(data, error);
};

/**
 * Update a booking's status
 * @param {string} bookingId - The booking's UUID
 * @param {string} status - New status ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'declined')
 * @param {string} reason - Optional reason for cancellation
 * @returns {Promise<Object>} - Updated booking status
 */
export const updateBookingStatus = async (bookingId, status, reason = null) => {
  const { data, error } = await supabase.rpc('update_booking_status', {
    booking_id: bookingId,
    status: status,
    reason: reason
  });
  return handleSupabaseResponse(data, error);
};

/**
 * Get all bookings for a user as renter
 * @param {string} userId - The user's UUID
 * @param {string} status - Optional filter by status
 * @returns {Promise<Array>} - List of bookings
 */
export const getRenterBookings = async (userId, status = null) => {
  const { data, error } = await supabase.rpc('get_user_bookings_as_renter', {
    user_id: userId,
    status_filter: status
  });
  return handleSupabaseResponse(data, error);
};

/**
 * Get all bookings for a user as owner
 * @param {string} userId - The user's UUID
 * @param {string} status - Optional filter by status
 * @returns {Promise<Array>} - List of bookings
 */
export const getOwnerBookings = async (userId, status = null) => {
  const { data, error } = await supabase.rpc('get_user_bookings_as_owner', {
    user_id: userId,
    status_filter: status
  });
  return handleSupabaseResponse(data, error);
};

/**
 * Create a vehicle handover record
 * @param {Object} handoverData - Handover information
 * @returns {Promise<Object>} - Created handover record
 */
export const createVehicleHandover = async (handoverData) => {
  const { data, error } = await supabase.rpc('create_vehicle_handover', {
    handover_data: handoverData
  });
  return handleSupabaseResponse(data, error);
};

/**
 * Update a vehicle handover record
 * @param {string} handoverId - The handover's UUID
 * @param {Object} handoverData - Updated handover information
 * @returns {Promise<Object>} - Updated handover record
 */
export const updateVehicleHandover = async (handoverId, handoverData) => {
  const { data, error } = await supabase.rpc('update_vehicle_handover', {
    handover_id: handoverId,
    handover_data: handoverData
  });
  return handleSupabaseResponse(data, error);
};

/**
 * Create a vehicle condition report
 * @param {string} handoverId - The handover's UUID
 * @param {Object} reportData - Condition report information
 * @returns {Promise<Object>} - Created condition report
 */
export const createConditionReport = async (handoverId, reportData) => {
  const { data, error } = await supabase.rpc('create_vehicle_condition_report', {
    handover_id: handoverId,
    report_data: reportData
  });
  return handleSupabaseResponse(data, error);
};

/**
 * Extend a booking
 * @param {string} bookingId - The booking's UUID
 * @param {Date} newEndDate - New end date for the booking
 * @returns {Promise<Object>} - Updated booking information and payment details
 */
export const extendBooking = async (bookingId, newEndDate) => {
  const { data, error } = await supabase.rpc('extend_booking', {
    booking_id: bookingId,
    new_end_date: newEndDate
  });
  return handleSupabaseResponse(data, error);
};

/**
 * Get calendar of bookings for a vehicle
 * @param {string} vehicleId - The vehicle's UUID
 * @param {Date} startDate - Start of calendar period
 * @param {Date} endDate - End of calendar period
 * @returns {Promise<Array>} - List of bookings and availability exceptions
 */
export const getVehicleCalendar = async (vehicleId, startDate, endDate) => {
  const { data, error } = await supabase.rpc('get_vehicle_calendar', {
    vehicle_id: vehicleId,
    start_date: startDate,
    end_date: endDate
  });
  return handleSupabaseResponse(data, error);
};
