/**
 * Booking data hook for Drively
 * 
 * This hook provides functions for interacting with booking data
 * and manages loading/error state for components.
 */

import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../services/api';
import { useAuth } from '../context/AuthContext';

const useBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [currentBooking, setCurrentBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Create a new booking
  const createBooking = useCallback(async (bookingData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await ApiService.bookings.create(bookingData);
      setCurrentBooking(response);
      return response;
    } catch (err) {
      setError(err.message || 'Failed to create booking');
      console.error('Error creating booking:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get a specific booking by ID
  const getBookingById = useCallback(async (bookingId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await ApiService.bookings.getById(bookingId);
      setCurrentBooking(response);
      return response;
    } catch (err) {
      setError(err.message || 'Failed to fetch booking details');
      console.error(`Error fetching booking ID ${bookingId}:`, err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get all bookings for the current user (as renter)
  const getUserBookings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await ApiService.bookings.getUserBookings();
      setBookings(response);
      return response;
    } catch (err) {
      setError(err.message || 'Failed to fetch your bookings');
      console.error('Error fetching user bookings:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Get all bookings for the current user's vehicles (as owner)
  const getOwnerBookings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await ApiService.bookings.getOwnerBookings();
      setBookings(response);
      return response;
    } catch (err) {
      setError(err.message || 'Failed to fetch your vehicle bookings');
      console.error('Error fetching owner bookings:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Update booking status
  const updateBookingStatus = useCallback(async (bookingId, status, note = '') => {
    try {
      setLoading(true);
      setError(null);
      const response = await ApiService.bookings.updateStatus(bookingId, status, note);
      
      // Update current booking if it's the one being modified
      if (currentBooking && currentBooking.booking_id === bookingId) {
        setCurrentBooking(response);
      }
      
      // Update booking in the list if it exists there
      setBookings(prev => 
        prev.map(booking => 
          booking.booking_id === bookingId ? response : booking
        )
      );
      
      return response;
    } catch (err) {
      setError(err.message || `Failed to update booking to ${status}`);
      console.error(`Error updating booking ID ${bookingId} to ${status}:`, err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentBooking]);

  // Cancel a booking
  const cancelBooking = useCallback(async (bookingId, reason) => {
    return updateBookingStatus(bookingId, 'cancelled', reason);
  }, [updateBookingStatus]);

  // Complete the booking flow process (from booking to payment)
  const completeBookingFlow = useCallback(async (bookingData) => {
    try {
      setLoading(true);
      setError(null);
      
      // 1. Create the booking
      const booking = await ApiService.bookings.create(bookingData);
      
      // 2. Navigate to payment page with the booking ID
      navigate(`/payment/${booking.booking_id}`);
      
      return booking;
    } catch (err) {
      setError(err.message || 'Failed to complete booking process');
      console.error('Error in booking flow:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  // Submit a rating for a completed booking
  const submitBookingRating = useCallback(async (bookingId, ratingData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await ApiService.ratings.submitRating(bookingId, ratingData);
      
      // Update the booking to show it's been reviewed
      if (currentBooking && currentBooking.booking_id === bookingId) {
        setCurrentBooking({
          ...currentBooking,
          has_review: true,
          review: response
        });
      }
      
      return response;
    } catch (err) {
      setError(err.message || 'Failed to submit rating');
      console.error(`Error submitting rating for booking ID ${bookingId}:`, err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentBooking]);

  // Get booking statistics for the current user
  const getBookingStats = useCallback(async () => {
    try {
      const userBookings = await ApiService.bookings.getUserBookings();
      
      // For renters: Get their booking statistics
      if (user?.user_type === 'verified_renter') {
        const stats = {
          total: userBookings.length,
          active: userBookings.filter(b => ['confirmed', 'paid', 'in_progress'].includes(b.booking_status)).length,
          completed: userBookings.filter(b => b.booking_status === 'completed').length,
          cancelled: userBookings.filter(b => b.booking_status === 'cancelled').length,
          totalSpent: userBookings
            .filter(b => ['completed', 'paid', 'in_progress'].includes(b.booking_status))
            .reduce((sum, b) => sum + b.total_amount, 0)
        };
        return stats;
      }
      
      // For owners: Get their vehicle booking statistics
      if (user?.user_type === 'verified_owner') {
        const ownerBookings = await ApiService.bookings.getOwnerBookings();
        const stats = {
          total: ownerBookings.length,
          active: ownerBookings.filter(b => ['confirmed', 'paid', 'in_progress'].includes(b.booking_status)).length,
          completed: ownerBookings.filter(b => b.booking_status === 'completed').length,
          cancelled: ownerBookings.filter(b => b.booking_status === 'cancelled').length,
          totalEarned: ownerBookings
            .filter(b => ['completed', 'paid', 'in_progress'].includes(b.booking_status))
            .reduce((sum, b) => sum + b.total_amount, 0)
        };
        return stats;
      }
      
      return null;
    } catch (err) {
      console.error('Error fetching booking stats:', err);
      return null;
    }
  }, [user?.user_type]);

  return {
    // State
    bookings,
    currentBooking,
    loading,
    error,
    
    // Actions
    createBooking,
    getBookingById,
    getUserBookings,
    getOwnerBookings,
    updateBookingStatus,
    cancelBooking,
    completeBookingFlow,
    submitBookingRating,
    getBookingStats,
    
    // Helpers
    clearError: () => setError(null),
    clearCurrentBooking: () => setCurrentBooking(null)
  };
};

export default useBookings;