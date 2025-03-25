/**
 * API Service Provider for Drively
 * 
 * This module selects the appropriate API implementation based on configuration.
 * It serves as the main entry point for all API services in the application.
 */

import SupabaseApi from './supabaseApi';

// Determine which API implementation to use
// This can be changed via environment variable or application config
const API_PROVIDER = process.env.REACT_APP_API_PROVIDER || 'supabase'; // Default to Supabase

// Select the API implementation based on the provider setting
let ApiService;

if (API_PROVIDER === 'supabase') {
  console.log('Using Supabase API provider');
  ApiService = SupabaseApi;
} else {
  console.error(`Unknown API provider: ${API_PROVIDER}. Falling back to Supabase.`);
  ApiService = SupabaseApi;
}

export default ApiService;
