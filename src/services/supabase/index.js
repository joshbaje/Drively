/**
 * Supabase Services
 * This module aggregates all Supabase-related services in one place
 */

import supabase from './supabaseClient';
import authService from './auth/authService';

// Create service object
const supabaseServices = {
  supabase,
  auth: authService,
  
  // Add other service modules as needed
  // vehicles: vehicleService,
  // bookings: bookingService,
  // etc.
};

export default supabaseServices;
