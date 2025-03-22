/**
 * API Service Provider for Drively
 * 
 * This module selects the appropriate API implementation based on configuration.
 * It serves as the main entry point for all API services in the application.
 */

import XanoApi from './xanoApi';
// Import Supabase API when ready to migrate
// import SupabaseApi from './supabaseApi';

// Determine which API implementation to use
// This can be changed via environment variable or application config
const API_PROVIDER = process.env.REACT_APP_API_PROVIDER || 'xano';

// Select the API implementation
const ApiService = API_PROVIDER === 'supabase' 
  ? null // Replace with SupabaseApi when ready
  : XanoApi;

export default ApiService;
