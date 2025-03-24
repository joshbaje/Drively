/**
 * Drively API Services
 * 
 * This file provides a centralized API service layer that exclusively uses Supabase
 * as the backend provider for all data operations.
 */

import supabaseServices from './supabase';

// Main API service object that wraps all backend services
const apiService = {
  // Authentication and user management
  auth: {
    login: async (email, password) => supabaseServices.auth.signIn(email, password),
    register: async (userData) => supabaseServices.auth.signUp(userData.email, userData.password, userData),
    logout: async () => supabaseServices.auth.signOut(),
    getCurrentUser: async () => supabaseServices.auth.getCurrentUser(),
    resetPassword: async (email) => supabaseServices.auth.resetPassword(email),
    updatePassword: async (newPassword) => supabaseServices.auth.updatePassword(newPassword),
    updateProfile: async (userData) => supabaseServices.auth.updateUserProfile(userData),
    isAuthenticated: async () => supabaseServices.isAuthenticated(),
  },
  
  // Vehicle operations
  vehicles: {
    getVehicles: async (filters, options) => supabaseServices.vehicles.getVehicles(filters, options),
    getVehicleById: async (id) => supabaseServices.vehicles.getVehicleById(id),
    createVehicle: async (vehicleData, images, features) => 
      supabaseServices.vehicles.createVehicle(vehicleData, images, features),
    updateVehicle: async (id, vehicleData) => supabaseServices.vehicles.updateVehicle(id, vehicleData),
    deleteVehicle: async (id) => supabaseServices.vehicles.deleteVehicle(id),
    addVehicleImage: async (vehicleId, imageFile, imageData) => 
      supabaseServices.vehicles.addVehicleImage(vehicleId, imageFile, imageData),
    removeVehicleImage: async (imageId) => supabaseServices.vehicles.removeVehicleImage(imageId),
    setVehicleUnavailable: async (vehicleId, startDate, endDate, reason) => 
      supabaseServices.vehicles.setVehicleUnavailable(vehicleId, startDate, endDate, reason),
    removeUnavailabilityPeriod: async (exceptionId) => 
      supabaseServices.vehicles.removeUnavailabilityPeriod(exceptionId),
    getFeatures: async () => supabaseServices.vehicles.getFeatures(),
    checkAvailability: async (vehicleId, startDate, endDate) => 
      supabaseServices.vehicles.checkAvailability(vehicleId, startDate, endDate),
  },
  
  // Booking operations
  bookings: {
    getBookings: async (filters, options) => supabaseServices.bookings.getBookings(filters, options),
    getBookingById: async (id) => supabaseServices.bookings.getBookingById(id),
    createBooking: async (bookingData) => supabaseServices.bookings.createBooking(bookingData),
    updateBooking: async (id, bookingData) => supabaseServices.bookings.updateBooking(id, bookingData),
    cancelBooking: async (id, cancelledBy, reason) => 
      supabaseServices.bookings.cancelBooking(id, cancelledBy, reason),
    updateBookingStatus: async (id, status) => supabaseServices.bookings.updateBookingStatus(id, status),
    addRating: async (ratingData) => supabaseServices.bookings.addRating(ratingData),
    createHandover: async (handoverData) => supabaseServices.bookings.createHandover(handoverData),
    createConditionReport: async (reportData) => supabaseServices.bookings.createConditionReport(reportData),
    getDashboardStats: async (userId, userType) => 
      supabaseServices.bookings.getDashboardStats(userId, userType),
  },
  
  // Utility operations
  utils: {
    uploadFile: async (bucket, path, file) => supabaseServices.utils.uploadFile(bucket, path, file),
    deleteFile: async (bucket, path) => supabaseServices.utils.deleteFile(bucket, path),
  },
  
  // Raw Supabase client for advanced operations
  supabase: supabaseServices.client
};

export default apiService;
