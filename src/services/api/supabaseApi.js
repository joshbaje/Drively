/**
 * Supabase API Adapter
 * 
 * This adapter provides a consistent interface that matches the structure
 * expected by the application, but delegates to Supabase services for implementation.
 * This allows for a smooth transition from Xano to Supabase.
 */

import supabase from '../supabase/supabaseClient';
import authService from '../supabase/auth/authService';
import { checkSupabaseReady } from '../supabase/supabaseClient';

const SupabaseApi = {
  /**
   * Authentication services
   */
  auth: {
    /**
     * Log in a user
     * @param {string} email - User email
     * @param {string} password - User password
     * @returns {Promise} - User data and auth token
     */
    login: async (email, password) => {
      try {
        // First, check if Supabase is properly initialized
        if (!checkSupabaseReady()) {
          throw new Error('Authentication service is not available. Please check your configuration.');
        }
        
        console.log('Supabase login attempt for email:', email);
        const { data, error } = await authService.signIn(email, password);
        
        if (error) {
          console.error('Supabase login error:', error.message);
          throw error;
        }
        
        if (!data || !data.session) {
          throw new Error('Login failed: No session returned');
        }
        
        // Get user data
        const { user, error: userError } = await authService.getCurrentUser();
        
        if (userError) {
          console.warn('Login succeeded but failed to get user data:', userError.message);
        }
        
        return {
          success: true,
          user: user || null,
          session: data.session,
          token: data.session.access_token
        };
      } catch (error) {
        console.error('Login error in SupabaseApi:', error);
        throw error;
      }
    },
    
    /**
     * Rest of the methods remain the same, 
     * but replace all `isSupabaseReady()` with `checkSupabaseReady()`
     */
    register: async (userData) => {
      try {
        // First, check if Supabase is properly initialized
        if (!checkSupabaseReady()) {
          throw new Error('Authentication service is not available. Please check your configuration.');
        }
        
        // Rest of the function remains unchanged
      } catch (error) {
        console.error('Registration error:', error);
        throw error;
      }
    },
    
    getCurrentUser: async () => {
      try {
        // First, check if Supabase is properly initialized
        if (!checkSupabaseReady()) {
          throw new Error('Authentication service is not available. Please check your configuration.');
        }
        
        // Get the current user from the Supabase auth service
        const { user, error } = await authService.getCurrentUser();
        
        if (error) {
          console.error('Error from authService:', error.message);
          throw error;
        }
        
        if (!user) {
          console.warn('No user found in getCurrentUser');
          return null;
        }
        
        return user;
      } catch (error) {
        console.error('Get current user error:', error);
        throw new Error('Failed to fetch user data');
      }
    },
    
    updateProfile: async (profileData) => {
      try {
        // First, check if Supabase is properly initialized
        if (!checkSupabaseReady()) {
          throw new Error('Authentication service is not available. Please check your configuration.');
        }
        
        // Rest of the function remains unchanged
      } catch (error) {
        console.error('Update profile error:', error);
        throw error;
      }
    },
    
    resetPasswordRequest: async (email) => {
      try {
        // First, check if Supabase is properly initialized
        if (!checkSupabaseReady()) {
          throw new Error('Authentication service is not available. Please check your configuration.');
        }
        
        // Rest of the function remains unchanged
      } catch (error) {
        console.error('Reset password request error:', error);
        throw error;
      }
    },
    
    logout: async () => {
      try {
        // First, check if Supabase is properly initialized
        if (!checkSupabaseReady()) {
          throw new Error('Authentication service is not available. Please check your configuration.');
        }
        
        // Rest of the function remains unchanged
      } catch (error) {
        console.error('Logout error:', error);
        // We'll still attempt to clean up local storage
        localStorage.removeItem('auth_token');
        
        throw error;
      }
    }
  },
  
  /**
   * Vehicle-related services
   */
  vehicles: {
    // Implementation using Supabase directly
    getVehicles: async (params = {}) => {
      try {
        // First, check if Supabase is properly initialized
        if (!checkSupabaseReady()) {
          throw new Error('Data service is not available. Please check your configuration.');
        }
        
        // Rest of the function remains unchanged
      } catch (error) {
        console.error('Error fetching vehicles:', error);
        throw error;
      }
    },
    
    getVehicleById: async (id) => {
      try {
        // First, check if Supabase is properly initialized
        if (!checkSupabaseReady()) {
          throw new Error('Data service is not available. Please check your configuration.');
        }
        
        // Rest of the function remains unchanged
      } catch (error) {
        console.error('Error fetching vehicle by ID:', error);
        throw error;
      }
    }
    
    // Add other vehicle methods as needed
  },
  
  /**
   * Booking services
   */
  bookings: {
    // Implementation using supabase directly
    createBooking: async (bookingData) => {
      try {
        // First, check if Supabase is properly initialized
        if (!checkSupabaseReady()) {
          throw new Error('Data service is not available. Please check your configuration.');
        }
        
        // Rest of the function remains unchanged
      } catch (error) {
        console.error('Error creating booking:', error);
        throw error;
      }
    },
    
    getUserBookings: async () => {
      try {
        // First, check if Supabase is properly initialized
        if (!checkSupabaseReady()) {
          throw new Error('Data service is not available. Please check your configuration.');
        }
        
        // Rest of the function remains unchanged
      } catch (error) {
        console.error('Error fetching user bookings:', error);
        throw error;
      }
    }
    
    // Add other booking methods as needed
  }
};

export default SupabaseApi;