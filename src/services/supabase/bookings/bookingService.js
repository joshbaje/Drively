import supabase from '../supabaseClient';
import databaseUtils from '../utils/databaseUtils';

/**
 * Booking service for Supabase
 * Handles booking-related operations
 */
const bookingService = {
  /**
   * Get bookings with filtering and pagination
   * @param {Object} filters - Filter criteria
   * @param {Object} options - Query options
   * @returns {Promise} - Bookings data
   */
  async getBookings(filters = {}, options = {}) {
    try {
      const {
        limit = 20,
        offset = 0,
        orderBy = 'created_at:desc',
        includeVehicle = false,
        includeRenter = false,
        includeOwner = false,
        includePayments = false,
      } = options;
      
      // Build relations array for related tables
      const relations = [];
      if (includeVehicle) {
        relations.push({ 
          table: 'vehicles', 
          fields: 'vehicle_id,make,model,year,color,license_plate,daily_rate,image_url' 
        });
      }
      if (includeRenter) {
        relations.push({ 
          table: 'renters:users!renter_id', 
          fields: 'user_id,first_name,last_name,email,profile_image_url' 
        });
      }
      if (includeOwner) {
        relations.push({ 
          table: 'owners:users!owner_id', 
          fields: 'user_id,first_name,last_name,email,profile_image_url' 
        });
      }
      
      // Get bookings with related data
      const result = await databaseUtils.getMany('bookings', filters, {
        limit,
        offset,
        orderBy,
        relations,
      });
      
      if (result.error) throw result.error;
      
      // Include payments if requested
      if (includePayments && result.data?.length > 0) {
        const bookingIds = result.data.map(booking => booking.booking_id);
        
        const { data: payments, error: paymentsError } = await supabase
          .from('payments')
          .select('*')
          .in('booking_id', bookingIds);
          
        if (paymentsError) throw paymentsError;
        
        // Group payments by booking
        const paymentsByBooking = payments.reduce((acc, payment) => {
          acc[payment.booking_id] = acc[payment.booking_id] || [];
          acc[payment.booking_id].push(payment);
          return acc;
        }, {});
        
        // Add payments to bookings
        result.data = result.data.map(booking => ({
          ...booking,
          payments: paymentsByBooking[booking.booking_id] || [],
        }));
      }
      
      return result;
    } catch (error) {
      console.error('Error getting bookings:', error.message);
      return { data: null, count: 0, pagination: null, error };
    }
  },
  
  /**
   * Get a booking by ID with all related data
   * @param {string} bookingId - Booking ID
   * @returns {Promise} - Booking data
   */
  async getBookingById(bookingId) {
    try {
      // Get booking with related data
      const { data: booking, error } = await supabase
        .from('bookings')
        .select(`
          *,
          vehicles (*),
          renter:users!renter_id (user_id, first_name, last_name, email, phone_number, profile_image_url),
          owner:users!owner_id (user_id, first_name, last_name, email, phone_number, profile_image_url),
          pickup_location:locations!pickup_location_id (*),
          dropoff_location:locations!dropoff_location_id (*)
        `)
        .eq('booking_id', bookingId)
        .single();
        
      if (error) throw error;
      
      // Get payments
      const { data: payments, error: paymentsError } = await supabase
        .from('payments')
        .select('*')
        .eq('booking_id', bookingId);
        
      if (paymentsError) throw paymentsError;
      
      // Get handovers
      const { data: handovers, error: handoversError } = await supabase
        .from('vehicle_handovers')
        .select(`
          *,
          condition_reports:vehicle_condition_reports (*)
        `)
        .eq('booking_id', bookingId);
        
      if (handoversError) throw handoversError;
      
      // Get ratings
      const { data: ratings, error: ratingsError } = await supabase
        .from('ratings')
        .select('*')
        .eq('booking_id', bookingId);
        
      if (ratingsError) throw ratingsError;
      
      // Get insurance info if available
      const { data: insurance, error: insuranceError } = await supabase
        .from('booking_insurance')
        .select(`
          *,
          insurance_policy:insurance_policies (*)
        `)
        .eq('booking_id', bookingId)
        .maybeSingle();
        
      if (insuranceError && insuranceError.code !== 'PGRST116') throw insuranceError;
      
      // Combine all data
      const completeBooking = {
        ...booking,
        vehicle: booking.vehicles,
        renter: booking.renter,
        owner: booking.owner,
        pickup_location: booking.pickup_location,
        dropoff_location: booking.dropoff_location,
        payments: payments || [],
        handovers: handovers || [],
        ratings: ratings || [],
        insurance: insurance || null,
        // Remove redundant nested objects
        vehicles: undefined,
      };
      
      return { data: completeBooking, error: null };
    } catch (error) {
      console.error('Error getting booking by ID:', error.message);
      return { data: null, error };
    }
  },
  
  /**
   * Create a new booking
   * @param {Object} bookingData - Booking data
   * @returns {Promise} - Created booking
   */
  async createBooking(bookingData) {
    try {
      // Start a transaction to create booking, payment, etc.
      const { data, error } = await supabase.rpc('create_booking_transaction', {
        booking_data: bookingData
      });
      
      if (error) throw error;
      
      const bookingId = data.booking_id;
      
      // Return the created booking with all data
      return this.getBookingById(bookingId);
    } catch (error) {
      console.error('Error creating booking:', error.message);
      return { data: null, error };
    }
  },
  
  /**
   * Update a booking
   * @param {string} bookingId - Booking ID
   * @param {Object} bookingData - Booking data to update
   * @returns {Promise} - Updated booking
   */
  async updateBooking(bookingId, bookingData) {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({
          ...bookingData,
          updated_at: new Date().toISOString(),
        })
        .eq('booking_id', bookingId);
        
      if (error) throw error;
      
      // Return the updated booking
      return this.getBookingById(bookingId);
    } catch (error) {
      console.error('Error updating booking:', error.message);
      return { data: null, error };
    }
  },
  
  /**
   * Cancel a booking
   * @param {string} bookingId - Booking ID
   * @param {string} cancelledBy - User ID of the person cancelling
   * @param {string} reason - Cancellation reason
   * @returns {Promise} - Cancellation result
   */
  async cancelBooking(bookingId, cancelledBy, reason = '') {
    try {
      // Get the booking to check its status
      const { data: booking, error: getError } = await supabase
        .from('bookings')
        .select('booking_status, start_date, cancellation_policy_id')
        .eq('booking_id', bookingId)
        .single();
        
      if (getError) throw getError;
      
      // Can only cancel if not already cancelled/completed
      if (['cancelled', 'declined', 'completed'].includes(booking.booking_status)) {
        throw new Error(`Cannot cancel booking with status: ${booking.booking_status}`);
      }
      
      // Determine refund amount based on cancellation policy and time until booking
      let refundPercentage = 100; // Default full refund
      
      if (booking.cancellation_policy_id) {
        const { data: policy, error: policyError } = await supabase
          .from('cancellation_policies')
          .select('*')
          .eq('policy_id', booking.cancellation_policy_id)
          .single();
          
        if (policyError) throw policyError;
        
        // Calculate hours until booking start
        const now = new Date();
        const startDate = new Date(booking.start_date);
        const hoursUntilBooking = Math.max(0, (startDate - now) / (1000 * 60 * 60));
        
        if (hoursUntilBooking < policy.hours_before_partial_refund) {
          refundPercentage = policy.partial_refund_percentage;
        } else if (hoursUntilBooking < policy.hours_before_full_refund) {
          refundPercentage = 100;
        }
      }
      
      // Update booking status
      const { error: updateError } = await supabase
        .from('bookings')
        .update({
          booking_status: 'cancelled',
          cancellation_reason: reason,
          cancelled_by: cancelledBy,
          cancelled_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('booking_id', bookingId);
        
      if (updateError) throw updateError;
      
      // Get payment information to calculate refund
      const { data: payments, error: paymentsError } = await supabase
        .from('payments')
        .select('*')
        .eq('booking_id', bookingId)
        .eq('payment_type', 'booking')
        .eq('status', 'completed');
        
      if (paymentsError) throw paymentsError;
      
      let refundAmount = 0;
      if (payments && payments.length > 0) {
        // Calculate refund amount
        refundAmount = (payments[0].amount * refundPercentage) / 100;
        
        // Create refund record if refund amount > 0
        if (refundAmount > 0) {
          await supabase
            .from('payments')
            .insert([
              {
                booking_id: bookingId,
                payer_id: payments[0].payee_id, // Reverse: owner pays renter
                payee_id: payments[0].payer_id, // Reverse: renter receives from owner
                payment_type: 'refund',
                amount: refundAmount,
                currency: payments[0].currency,
                status: 'pending',
                payment_method_id: payments[0].payment_method_id,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              },
            ]);
        }
      }
      
      return {
        data: {
          bookingId,
          status: 'cancelled',
          refundAmount,
          refundPercentage,
        },
        error: null,
      };
    } catch (error) {
      console.error('Error cancelling booking:', error.message);
      return { data: null, error };
    }
  },
  
  /**
   * Update booking status
   * @param {string} bookingId - Booking ID
   * @param {string} status - New status
   * @returns {Promise} - Status update result
   */
  async updateBookingStatus(bookingId, status) {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({
          booking_status: status,
          updated_at: new Date().toISOString(),
        })
        .eq('booking_id', bookingId);
        
      if (error) throw error;
      
      return { error: null };
    } catch (error) {
      console.error('Error updating booking status:', error.message);
      return { error };
    }
  },
  
  /**
   * Add a rating for a booking
   * @param {Object} ratingData - Rating data
   * @returns {Promise} - Created rating
   */
  async addRating(ratingData) {
    try {
      const { data, error } = await databaseUtils.create('ratings', {
        ...ratingData,
        is_published: true,
      });
      
      if (error) throw error;
      
      // Update average rating based on rating type
      if (ratingData.rating_type === 'renter_to_owner' && ratingData.ratee_id) {
        // Update owner's average rating
        await this.updateOwnerAverageRating(ratingData.ratee_id);
      } else if (ratingData.rating_type === 'owner_to_renter' && ratingData.ratee_id) {
        // Update renter's average rating
        await this.updateRenterAverageRating(ratingData.ratee_id);
      } else if (ratingData.rating_type === 'renter_to_vehicle' && ratingData.vehicle_id) {
        // Update vehicle's average rating
        await this.updateVehicleAverageRating(ratingData.vehicle_id);
      }
      
      return { data, error: null };
    } catch (error) {
      console.error('Error adding rating:', error.message);
      return { data: null, error };
    }
  },
  
  /**
   * Update owner's average rating
   * @param {string} ownerId - Owner user ID
   * @returns {Promise} - Update result
   */
  async updateOwnerAverageRating(ownerId) {
    try {
      // Calculate average rating from all ratings
      const { data, error } = await supabase
        .from('ratings')
        .select('rating')
        .eq('ratee_id', ownerId)
        .eq('rating_type', 'renter_to_owner')
        .eq('is_published', true);
        
      if (error) throw error;
      
      if (data && data.length > 0) {
        const sum = data.reduce((acc, item) => acc + item.rating, 0);
        const average = sum / data.length;
        
        // Update the owner profile
        await supabase
          .from('car_owner_profiles')
          .update({ average_rating: average })
          .eq('user_id', ownerId);
      }
      
      return { error: null };
    } catch (error) {
      console.error('Error updating owner average rating:', error.message);
      return { error };
    }
  },
  
  /**
   * Update renter's average rating
   * @param {string} renterId - Renter user ID
   * @returns {Promise} - Update result
   */
  async updateRenterAverageRating(renterId) {
    try {
      // Calculate average rating from all ratings
      const { data, error } = await supabase
        .from('ratings')
        .select('rating')
        .eq('ratee_id', renterId)
        .eq('rating_type', 'owner_to_renter')
        .eq('is_published', true);
        
      if (error) throw error;
      
      if (data && data.length > 0) {
        const sum = data.reduce((acc, item) => acc + item.rating, 0);
        const average = sum / data.length;
        
        // Update the renter profile
        await supabase
          .from('renter_profiles')
          .update({ average_rating: average })
          .eq('user_id', renterId);
      }
      
      return { error: null };
    } catch (error) {
      console.error('Error updating renter average rating:', error.message);
      return { error };
    }
  },
  
  /**
   * Update vehicle's average rating
   * @param {string} vehicleId - Vehicle ID
   * @returns {Promise} - Update result
   */
  async updateVehicleAverageRating(vehicleId) {
    try {
      // Calculate average rating from all ratings
      const { data, error } = await supabase
        .from('ratings')
        .select('rating')
        .eq('vehicle_id', vehicleId)
        .eq('rating_type', 'renter_to_vehicle')
        .eq('is_published', true);
        
      if (error) throw error;
      
      if (data && data.length > 0) {
        const sum = data.reduce((acc, item) => acc + item.rating, 0);
        const average = sum / data.length;
        
        // Update the vehicle
        await supabase
          .from('vehicles')
          .update({ avg_rating: average })
          .eq('vehicle_id', vehicleId);
      }
      
      return { error: null };
    } catch (error) {
      console.error('Error updating vehicle average rating:', error.message);
      return { error };
    }
  },
  
  /**
   * Create a handover record
   * @param {Object} handoverData - Handover data
   * @returns {Promise} - Created handover
   */
  async createHandover(handoverData) {
    try {
      const { data, error } = await databaseUtils.create('vehicle_handovers', handoverData);
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error creating handover:', error.message);
      return { data: null, error };
    }
  },
  
  /**
   * Create a condition report
   * @param {Object} reportData - Condition report data
   * @returns {Promise} - Created report
   */
  async createConditionReport(reportData) {
    try {
      const { data, error } = await databaseUtils.create('vehicle_condition_reports', reportData);
      
      if (error) throw error;
      
      // Update handover status if needed
      if (reportData.handover_id) {
        await supabase
          .from('vehicle_handovers')
          .update({ status: 'completed' })
          .eq('handover_id', reportData.handover_id);
      }
      
      return { data, error: null };
    } catch (error) {
      console.error('Error creating condition report:', error.message);
      return { data: null, error };
    }
  },
  
  /**
   * Get statistics for user dashboard
   * @param {string} userId - User ID
   * @param {string} userType - User type ('renter' or 'owner')
   * @returns {Promise} - Dashboard statistics
   */
  async getDashboardStats(userId, userType) {
    try {
      const stats = {
        totalBookings: 0,
        activeBookings: 0,
        completedBookings: 0,
        cancelledBookings: 0,
        totalRevenue: 0,
        averageRating: 0,
        recentBookings: [],
      };
      
      // Build filter based on user type
      const userFilter = {};
      if (userType === 'renter') {
        userFilter.renter_id = userId;
      } else {
        userFilter.owner_id = userId;
      }
      
      // Get booking stats
      const { data: bookings, error: bookingsError } = await supabase
        .from('bookings')
        .select('booking_id, booking_status, total_amount, created_at')
        .match(userFilter);
        
      if (bookingsError) throw bookingsError;
      
      if (bookings) {
        stats.totalBookings = bookings.length;
        stats.activeBookings = bookings.filter(b => 
          ['pending', 'confirmed', 'in_progress'].includes(b.booking_status)
        ).length;
        stats.completedBookings = bookings.filter(b => b.booking_status === 'completed').length;
        stats.cancelledBookings = bookings.filter(b => 
          ['cancelled', 'declined'].includes(b.booking_status)
        ).length;
        
        // Calculate total revenue for owners
        if (userType === 'owner') {
          const { data: payments, error: paymentsError } = await supabase
            .from('payments')
            .select('amount')
            .eq('payee_id', userId)
            .eq('status', 'completed');
            
          if (paymentsError) throw paymentsError;
          
          if (payments) {
            stats.totalRevenue = payments.reduce((sum, payment) => sum + payment.amount, 0);
          }
        }
        
        // Get recent bookings with details
        const { data: recentBookings, error: recentError } = await supabase
          .from('bookings')
          .select(`
            *,
            vehicles (vehicle_id, make, model, year),
            ${userType === 'owner' ? 'renter:users!renter_id (user_id, first_name, last_name)' : 'owner:users!owner_id (user_id, first_name, last_name)'}
          `)
          .match(userFilter)
          .order('created_at', { ascending: false })
          .limit(5);
          
        if (recentError) throw recentError;
        stats.recentBookings = recentBookings || [];
      }
      
      // Get average rating
      if (userType === 'owner') {
        const { data: profile, error: profileError } = await supabase
          .from('car_owner_profiles')
          .select('average_rating')
          .eq('user_id', userId)
          .single();
          
        if (profileError && profileError.code !== 'PGRST116') throw profileError;
        if (profile) stats.averageRating = profile.average_rating;
      } else {
        const { data: profile, error: profileError } = await supabase
          .from('renter_profiles')
          .select('average_rating')
          .eq('user_id', userId)
          .single();
          
        if (profileError && profileError.code !== 'PGRST116') throw profileError;
        if (profile) stats.averageRating = profile.average_rating;
      }
      
      return { data: stats, error: null };
    } catch (error) {
      console.error('Error getting dashboard stats:', error.message);
      return { data: null, error };
    }
  },
};

export default bookingService;
