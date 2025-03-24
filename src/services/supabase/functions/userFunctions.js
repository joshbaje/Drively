import supabase, { handleSupabaseResponse } from '../supabaseClient';

/**
 * User-related functions for Supabase PostgreSQL
 * These functions interact with the Supabase database to manage user data
 */

/**
 * Get a user's profile including owner and renter profiles if available
 * @param {string} userId - The user's UUID
 * @returns {Promise<Object>} - User profile data
 */
export const getUserProfile = async (userId) => {
  const { data, error } = await supabase.rpc('get_user_profile', { user_id: userId });
  return handleSupabaseResponse(data, error);
};

/**
 * Create or update a user profile with optional owner and renter profiles
 * @param {Object} userData - Basic user information
 * @param {Object} ownerData - Optional car owner profile data
 * @param {Object} renterData - Optional renter profile data
 * @returns {Promise<Object>} - Updated user profile
 */
export const createOrUpdateUserProfile = async (userData, ownerData = null, renterData = null) => {
  const { data, error } = await supabase.rpc('create_or_update_user_profile', {
    user_data: userData,
    owner_data: ownerData,
    renter_data: renterData
  });
  return handleSupabaseResponse(data, error);
};

/**
 * Get all payment methods for a user
 * @param {string} userId - The user's UUID
 * @returns {Promise<Array>} - List of payment methods
 */
export const getUserPaymentMethods = async (userId) => {
  const { data, error } = await supabase.rpc('get_user_payment_methods', { user_id: userId });
  return handleSupabaseResponse(data, error);
};

/**
 * Set a payment method as the default for a user
 * @param {string} userId - The user's UUID
 * @param {string} paymentMethodId - The payment method's UUID
 * @returns {Promise<boolean>} - Success status
 */
export const setDefaultPaymentMethod = async (userId, paymentMethodId) => {
  const { data, error } = await supabase.rpc('set_default_payment_method', {
    user_id: userId,
    payment_method_id: paymentMethodId
  });
  return handleSupabaseResponse(data, error);
};

/**
 * Add a new address for a user
 * @param {string} userId - The user's UUID
 * @param {Object} addressData - Address information
 * @returns {Promise<Object>} - The created address
 */
export const addUserAddress = async (userId, addressData) => {
  const { data, error } = await supabase.rpc('add_user_address', {
    user_id: userId,
    address_data: addressData
  });
  return handleSupabaseResponse(data, error);
};

/**
 * Get all addresses for a user
 * @param {string} userId - The user's UUID
 * @returns {Promise<Array>} - List of addresses
 */
export const getUserAddresses = async (userId) => {
  const { data, error } = await supabase.rpc('get_user_addresses', { user_id: userId });
  return handleSupabaseResponse(data, error);
};

/**
 * Update a user's email address with password verification
 * @param {string} userId - The user's UUID
 * @param {string} newEmail - New email address
 * @param {string} password - Current password for verification
 * @returns {Promise<boolean>} - Success status
 */
export const updateUserEmail = async (userId, newEmail, password) => {
  const { data, error } = await supabase.rpc('update_user_email', {
    user_id: userId,
    new_email: newEmail,
    password: password
  });
  return handleSupabaseResponse(data, error);
};

/**
 * Verify a user document (admin function)
 * @param {string} documentId - The document's UUID
 * @param {string} verificationStatus - New status ('pending', 'approved', 'rejected')
 * @param {string} verificationNotes - Notes about the verification
 * @param {string} adminUserId - Admin user's UUID
 * @returns {Promise<Object>} - Updated document information
 */
export const verifyUserDocument = async (documentId, verificationStatus, verificationNotes, adminUserId) => {
  const { data, error } = await supabase.rpc('verify_user_document', {
    document_id: documentId,
    verification_status: verificationStatus,
    verification_notes: verificationNotes,
    admin_user_id: adminUserId
  });
  return handleSupabaseResponse(data, error);
};

/**
 * Get dashboard statistics for a user
 * @param {string} userId - The user's UUID
 * @returns {Promise<Object>} - Dashboard statistics
 */
export const getDashboardStats = async (userId) => {
  const { data, error } = await supabase.rpc('dashboard_stats_for_user', {
    user_id: userId
  });
  return handleSupabaseResponse(data, error);
};
