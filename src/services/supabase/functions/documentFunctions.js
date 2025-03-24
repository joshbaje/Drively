import supabase, { handleSupabaseResponse } from '../supabaseClient';

/**
 * Document-related functions for Supabase PostgreSQL
 * These functions interact with the Supabase database to manage documents
 */

/**
 * Upload and save a user document
 * @param {string} userId - The user's UUID
 * @param {string} documentType - Type of document ('driver_license', 'id_card', 'passport', etc.)
 * @param {string} fileUrl - URL to the stored document file
 * @param {Date} expiryDate - Optional document expiration date
 * @returns {Promise<Object>} - Created document record
 */
export const uploadUserDocument = async (userId, documentType, fileUrl, expiryDate = null) => {
  const { data, error } = await supabase.rpc('upload_user_document', {
    user_id: userId,
    document_type: documentType,
    file_url: fileUrl,
    expiry_date: expiryDate
  });
  return handleSupabaseResponse(data, error);
};

/**
 * Upload and save a vehicle document
 * @param {string} vehicleId - The vehicle's UUID
 * @param {string} documentType - Type of document ('registration', 'insurance', 'inspection', 'permit', etc.)
 * @param {string} fileUrl - URL to the stored document file
 * @param {Date} expiryDate - Optional document expiration date
 * @returns {Promise<Object>} - Created document record
 */
export const uploadVehicleDocument = async (vehicleId, documentType, fileUrl, expiryDate = null) => {
  const { data, error } = await supabase.rpc('upload_vehicle_document', {
    vehicle_id: vehicleId,
    document_type: documentType,
    file_url: fileUrl,
    expiry_date: expiryDate
  });
  return handleSupabaseResponse(data, error);
};

/**
 * Get user documents
 * @param {string} userId - The user's UUID
 * @param {string} documentType - Optional filter by document type
 * @returns {Promise<Array>} - List of documents
 */
export const getUserDocuments = async (userId, documentType = null) => {
  const { data, error } = await supabase.rpc('get_user_documents', {
    user_id: userId,
    document_type: documentType
  });
  return handleSupabaseResponse(data, error);
};

/**
 * Get vehicle documents
 * @param {string} vehicleId - The vehicle's UUID
 * @param {string} documentType - Optional filter by document type
 * @returns {Promise<Array>} - List of documents
 */
export const getVehicleDocuments = async (vehicleId, documentType = null) => {
  const { data, error } = await supabase.rpc('get_vehicle_documents', {
    vehicle_id: vehicleId,
    document_type: documentType
  });
  return handleSupabaseResponse(data, error);
};

/**
 * Get documents pending verification (admin function)
 * @param {string} documentType - Optional filter by document type
 * @returns {Promise<Array>} - List of pending documents
 */
export const getPendingDocuments = async (documentType = null) => {
  const { data, error } = await supabase.rpc('get_pending_documents', {
    document_type: documentType
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
 * Verify a vehicle document (admin function)
 * @param {string} documentId - The document's UUID
 * @param {string} verificationStatus - New status ('pending', 'approved', 'rejected')
 * @param {string} verificationNotes - Notes about the verification
 * @param {string} adminUserId - Admin user's UUID
 * @returns {Promise<Object>} - Updated document information
 */
export const verifyVehicleDocument = async (documentId, verificationStatus, verificationNotes, adminUserId) => {
  const { data, error } = await supabase.rpc('verify_vehicle_document', {
    document_id: documentId,
    verification_status: verificationStatus,
    verification_notes: verificationNotes,
    admin_user_id: adminUserId
  });
  return handleSupabaseResponse(data, error);
};

/**
 * Check if a document is expired or about to expire
 * @param {string} documentId - The document's UUID
 * @returns {Promise<Object>} - Expiration status
 */
export const checkDocumentExpiration = async (documentId) => {
  const { data, error } = await supabase.rpc('check_document_expiration', {
    document_id: documentId
  });
  return handleSupabaseResponse(data, error);
};
