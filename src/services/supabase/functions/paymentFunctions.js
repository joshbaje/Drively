import supabase, { handleSupabaseResponse } from '../supabaseClient';

/**
 * Payment-related functions for Supabase PostgreSQL
 * These functions interact with the Supabase database to manage payments
 */

/**
 * Create a new payment
 * @param {Object} paymentData - Payment information
 * @returns {Promise<Object>} - Created payment data
 */
export const createPayment = async (paymentData) => {
  const { data, error } = await supabase.rpc('create_payment', {
    payment_data: paymentData
  });
  return handleSupabaseResponse(data, error);
};

/**
 * Update a payment's status
 * @param {string} paymentId - The payment's UUID
 * @param {string} status - New status ('pending', 'processing', 'completed', 'failed', 'refunded', 'disputed')
 * @param {string} transactionId - Optional external transaction ID
 * @returns {Promise<Object>} - Updated payment data
 */
export const updatePaymentStatus = async (paymentId, status, transactionId = null) => {
  const { data, error } = await supabase.rpc('update_payment_status', {
    payment_id: paymentId,
    status: status,
    transaction_id: transactionId
  });
  return handleSupabaseResponse(data, error);
};

/**
 * Process a refund
 * @param {string} paymentId - The payment's UUID
 * @param {number} amount - Refund amount (if partial)
 * @param {string} reason - Reason for refund
 * @returns {Promise<Object>} - Refund information
 */
export const processRefund = async (paymentId, amount = null, reason = null) => {
  const { data, error } = await supabase.rpc('process_refund', {
    payment_id: paymentId,
    refund_amount: amount,
    refund_reason: reason
  });
  return handleSupabaseResponse(data, error);
};

/**
 * Add a payment method for a user
 * @param {string} userId - The user's UUID
 * @param {Object} paymentMethodData - Payment method information
 * @returns {Promise<Object>} - Created payment method
 */
export const addPaymentMethod = async (userId, paymentMethodData) => {
  const { data, error } = await supabase.rpc('add_payment_method', {
    user_id: userId,
    payment_method_data: paymentMethodData
  });
  return handleSupabaseResponse(data, error);
};

/**
 * Create an owner payout
 * @param {string} ownerId - The owner's UUID
 * @param {Array} bookingIds - Array of booking UUIDs to include in payout
 * @param {string} payoutMethod - Method of payout
 * @returns {Promise<Object>} - Created payout information
 */
export const createOwnerPayout = async (ownerId, bookingIds, payoutMethod) => {
  const { data, error } = await supabase.rpc('create_owner_payout', {
    owner_id: ownerId,
    booking_ids: bookingIds,
    payout_method: payoutMethod
  });
  return handleSupabaseResponse(data, error);
};

/**
 * Get payment history for a user
 * @param {string} userId - The user's UUID
 * @param {string} role - 'payer' or 'payee'
 * @returns {Promise<Array>} - Payment history
 */
export const getPaymentHistory = async (userId, role) => {
  const { data, error } = await supabase.rpc('get_user_payment_history', {
    user_id: userId,
    user_role: role
  });
  return handleSupabaseResponse(data, error);
};

/**
 * Process security deposit claim
 * @param {string} bookingId - The booking's UUID
 * @param {number} amount - Amount to claim
 * @param {string} reason - Reason for the claim
 * @returns {Promise<Object>} - Claim information
 */
export const processDepositClaim = async (bookingId, amount, reason) => {
  const { data, error } = await supabase.rpc('process_deposit_claim', {
    booking_id: bookingId,
    claim_amount: amount,
    claim_reason: reason
  });
  return handleSupabaseResponse(data, error);
};

/**
 * Process security deposit release
 * @param {string} bookingId - The booking's UUID
 * @returns {Promise<Object>} - Release confirmation
 */
export const releaseSecurityDeposit = async (bookingId) => {
  const { data, error } = await supabase.rpc('release_security_deposit', {
    booking_id: bookingId
  });
  return handleSupabaseResponse(data, error);
};

/**
 * Calculate price for booking
 * @param {string} vehicleId - The vehicle's UUID
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {string} promoCode - Optional promotion code
 * @returns {Promise<Object>} - Price calculation details
 */
export const calculateBookingPrice = async (vehicleId, startDate, endDate, promoCode = null) => {
  const { data, error } = await supabase.rpc('calculate_booking_price', {
    vehicle_id: vehicleId,
    start_date: startDate,
    end_date: endDate,
    promo_code: promoCode
  });
  return handleSupabaseResponse(data, error);
};
