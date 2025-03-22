/**
 * Xano API Implementation for Drively
 * 
 * This module provides API services specifically for the Xano backend.
 */

import ApiClient from './apiClient';

// API configuration
const API_CONFIG = {
  baseUrl: 'https://x8ki-letl-twmt.n7.xano.io/api:scA8Isc8',
  debug: process.env.NODE_ENV === 'development',
  tokenKey: 'auth_token'
};

// Create Xano API client instance
const xanoClient = new ApiClient(API_CONFIG);

/**
 * Xano API Service
 */
const XanoApi = {
  // *** AUTH SERVICES ***
  auth: {
    login: async (email, password) => {
      try {
        const response = await xanoClient.post('auth/login', { email, password }, { requireAuth: false });
        
        if (response.authToken) {
          localStorage.setItem('auth_token', response.authToken);
        }
        
        return response;
      } catch (error) {
        console.error('Login error:', error);
        throw error;
      }
    },
    
    register: async (userData) => {
      try {
        // Transform userData to match Xano API expectations
        const apiData = {
          first_name: userData.first_name,
          last_name: userData.last_name,
          email: userData.email,
          password: userData.password,
          date_of_birth: userData.date_of_birth || null,
          phone: userData.phone_number || userData.phone,
          type: userData.user_type === 'owner' ? 'car_owner' : 'renter'
        };
        
        const response = await xanoClient.post('auth/signup', apiData, { requireAuth: false });
        
        if (response.authToken) {
          localStorage.setItem('auth_token', response.authToken);
        }
        
        return response;
      } catch (error) {
        console.error('Registration error:', error);
        throw error;
      }
    },
    
    getCurrentUser: async () => {
      return xanoClient.get('auth/me');
    },
    
    logout: () => {
      localStorage.removeItem('auth_token');
    },
    
    updateProfile: async (profileData) => {
      return xanoClient.put('auth/update-profile', profileData);
    },
    
    resetPasswordRequest: async (email) => {
      return xanoClient.post('auth/reset-password-request', { email }, { requireAuth: false });
    },
    
    resetPassword: async (token, newPassword) => {
      return xanoClient.post('auth/reset-password', {
        token,
        password: newPassword
      }, { requireAuth: false });
    }
  },
  
  // *** VEHICLE SERVICES ***
  vehicles: {
    getAll: async (params = {}) => {
      const queryString = new URLSearchParams(params).toString();
      return xanoClient.get(`vehicles${queryString ? `?${queryString}` : ''}`);
    },
    
    getById: async (id) => {
      return xanoClient.get(`vehicles/${id}`);
    },
    
    create: async (vehicleData) => {
      return xanoClient.post('vehicles', vehicleData);
    },
    
    update: async (id, vehicleData) => {
      return xanoClient.put(`vehicles/${id}`, vehicleData);
    },
    
    delete: async (id) => {
      return xanoClient.delete(`vehicles/${id}`);
    },
    
    uploadImage: async (vehicleId, imageFile, metadata = {}) => {
      return xanoClient.uploadFile(`vehicles/${vehicleId}/images`, imageFile, metadata);
    },
    
    deleteImage: async (vehicleId, imageId) => {
      return xanoClient.delete(`vehicles/${vehicleId}/images/${imageId}`);
    },
    
    // Vehicle availability management
    getAvailability: async (vehicleId, startDate, endDate) => {
      return xanoClient.get(`vehicles/${vehicleId}/availability?start_date=${startDate}&end_date=${endDate}`);
    },
    
    blockDates: async (vehicleId, blockData) => {
      return xanoClient.post(`vehicles/${vehicleId}/block-dates`, blockData);
    },
    
    unblockDates: async (vehicleId, blockId) => {
      return xanoClient.delete(`vehicles/${vehicleId}/block-dates/${blockId}`);
    }
  },
  
  // *** BOOKING SERVICES ***
  bookings: {
    create: async (bookingData) => {
      return xanoClient.post('bookings', bookingData);
    },
    
    getById: async (id) => {
      return xanoClient.get(`bookings/${id}`);
    },
    
    getUserBookings: async () => {
      return xanoClient.get('bookings/user');
    },
    
    getOwnerBookings: async () => {
      return xanoClient.get('bookings/owner');
    },
    
    updateStatus: async (bookingId, status, note = '') => {
      return xanoClient.put(`bookings/${bookingId}/status`, { status, note });
    },
    
    cancelBooking: async (bookingId, reason) => {
      return xanoClient.post(`bookings/${bookingId}/cancel`, { reason });
    }
  },
  
  // *** PAYMENT SERVICES ***
  payments: {
    processPayment: async (bookingId, paymentData) => {
      return xanoClient.post(`payments/booking/${bookingId}`, paymentData);
    },
    
    getPaymentDetails: async (paymentId) => {
      return xanoClient.get(`payments/${paymentId}`);
    },
    
    getUserPayments: async () => {
      return xanoClient.get('payments/user');
    }
  },
  
  // *** RATING SERVICES ***
  ratings: {
    submitRating: async (bookingId, ratingData) => {
      return xanoClient.post(`ratings/booking/${bookingId}`, ratingData);
    },
    
    getVehicleRatings: async (vehicleId) => {
      return xanoClient.get(`ratings/vehicle/${vehicleId}`);
    },
    
    getUserRatings: async (userId) => {
      return xanoClient.get(`ratings/user/${userId}`);
    }
  },
  
  // *** ADMIN SERVICES ***
  admin: {
    getUsersList: async (params = {}) => {
      const queryString = new URLSearchParams(params).toString();
      return xanoClient.get(`admin/users${queryString ? `?${queryString}` : ''}`);
    },
    
    updateUserStatus: async (userId, status) => {
      return xanoClient.put(`admin/users/${userId}/status`, { status });
    },
    
    getBookingsList: async (params = {}) => {
      const queryString = new URLSearchParams(params).toString();
      return xanoClient.get(`admin/bookings${queryString ? `?${queryString}` : ''}`);
    },
    
    getDashboardStats: async () => {
      return xanoClient.get('admin/dashboard-stats');
    }
  }
};

export default XanoApi;