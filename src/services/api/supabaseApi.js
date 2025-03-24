/**
 * Supabase API Adapter
 * 
 * This adapter provides a consistent interface that matches the structure
 * expected by the application, but delegates to Supabase services for implementation.
 * This allows for a smooth transition from Xano to Supabase.
 */

import supabaseServices from '../supabase';
import authService from '../supabase/auth/authService';

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
        const { data, error } = await authService.signIn(email, password);
        
        if (error) throw new Error(error.message);
        
        if (!data || !data.session) {
          throw new Error('Authentication failed');
        }
        
        // Extract user and session data in the expected format
        return {
          user: data.user,
          authToken: data.session.access_token
        };
      } catch (error) {
        console.error('Login error:', error);
        throw error;
      }
    },
    
    /**
     * Register a new user
     * @param {Object} userData - User registration data
     * @returns {Promise} - User data and auth token
     */
    register: async (userData) => {
      try {
        const { email, password, first_name, last_name, user_type, phone_number, date_of_birth } = userData;
        
        const { data, error } = await authService.signUp(
          email, 
          password, 
          {
            first_name,
            last_name,
            phone_number,
            date_of_birth,
            user_type: user_type || 'renter'
          }
        );
        
        if (error) throw new Error(error.message);
        
        if (!data) {
          throw new Error('Registration failed');
        }
        
        // If email confirmation is required, return success without token
        if (data.user && !data.session) {
          return {
            user: data.user,
            message: 'Please check your email to confirm your account'
          };
        }
        
        // Return in the expected format with session
        return {
          user: data.user,
          authToken: data.session ? data.session.access_token : null
        };
      } catch (error) {
        console.error('Registration error:', error);
        throw error;
      }
    },
    
    /**
     * Get current authenticated user
     * @returns {Promise} - User data
     */
    getCurrentUser: async () => {
      try {
        const { user, error } = await authService.getCurrentUser();
        
        if (error) throw new Error(error.message);
        
        return user;
      } catch (error) {
        console.error('Get current user error:', error);
        throw error;
      }
    },
    
    /**
     * Update user profile
     * @param {Object} profileData - Profile data to update
     * @returns {Promise} - Updated user data
     */
    updateProfile: async (profileData) => {
      try {
        const { error } = await authService.updateUserProfile(profileData);
        
        if (error) throw new Error(error.message);
        
        // Get the updated user data
        const { user, error: getUserError } = await authService.getCurrentUser();
        
        if (getUserError) throw new Error(getUserError.message);
        
        return user;
      } catch (error) {
        console.error('Update profile error:', error);
        throw error;
      }
    },
    
    /**
     * Request password reset
     * @param {string} email - User email
     * @returns {Promise} - Success status
     */
    resetPasswordRequest: async (email) => {
      try {
        const { error } = await authService.resetPassword(email);
        
        if (error) throw new Error(error.message);
        
        return { success: true, message: 'Password reset email sent. Please check your inbox.' };
      } catch (error) {
        console.error('Reset password request error:', error);
        throw error;
      }
    },
    
    /**
     * Log out the current user
     * @returns {void}
     */
    logout: async () => {
      try {
        const { error } = await authService.signOut();
        
        if (error) throw new Error(error.message);
        
        return { success: true };
      } catch (error) {
        console.error('Logout error:', error);
        throw error;
      }
    }
  },
  
  /**
   * Vehicle-related services
   */
  vehicles: {
    // Implementation using supabaseServices.vehicles
    // Add vehicle methods here
    getVehicles: async (params) => {
      try {
        // Implement using Supabase queries
        const { data, error } = await supabaseServices.supabase
          .from('vehicles')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Error fetching vehicles:', error);
        throw error;
      }
    },
    
    getVehicleById: async (id) => {
      try {
        // Implement using Supabase queries
        const { data, error } = await supabaseServices.supabase
          .from('vehicles')
          .select('*')
          .eq('vehicle_id', id)
          .single();
          
        if (error) throw error;
        return data;
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
    // Implementation using supabaseServices.bookings
    // Add booking methods here
    createBooking: async (bookingData) => {
      try {
        // Implement using Supabase queries
        const { data, error } = await supabaseServices.supabase
          .from('bookings')
          .insert([bookingData])
          .select();
          
        if (error) throw error;
        return data[0];
      } catch (error) {
        console.error('Error creating booking:', error);
        throw error;
      }
    },
    
    getUserBookings: async () => {
      try {
        // Get current user ID
        const { data: { session } } = await supabaseServices.supabase.auth.getSession();
        
        if (!session) throw new Error('No active session');
        
        // Implement using Supabase queries
        const { data, error } = await supabaseServices.supabase
          .from('bookings')
          .select('*')
          .eq('renter_id', session.user.id)
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Error fetching user bookings:', error);
        throw error;
      }
    }
    
    // Add other booking methods as needed
  }
};

export default SupabaseApi;
