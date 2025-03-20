// Booking Service for Drively

const API_BASE_URL = 'https://x8ki-letl-twmt.n7.xano.io/api:scA8Isc8';

const BookingService = {
  // Create a new booking
  createBooking: async (bookingData, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(bookingData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Booking creation failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Booking error:', error);
      throw error;
    }
  },

  // Get a single booking by ID
  getBooking: async (bookingId, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch booking');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching booking:', error);
      throw error;
    }
  },

  // Get all bookings for the current user
  getUserBookings: async (token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings/user`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch bookings');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching bookings:', error);
      throw error;
    }
  },

  // Get all bookings for the owner's vehicles
  getOwnerBookings: async (token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings/owner`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch owner bookings');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching owner bookings:', error);
      throw error;
    }
  },

  // Update booking status (confirm, reject, cancel, complete)
  updateBookingStatus: async (bookingId, status, note, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          status,
          note
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update booking status');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating booking status:', error);
      throw error;
    }
  },

  // Submit a review for a completed booking
  submitReview: async (bookingId, reviewData, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(reviewData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit review');
      }

      return await response.json();
    } catch (error) {
      console.error('Error submitting review:', error);
      throw error;
    }
  },

  // Mock booking statuses for reference
  bookingStatuses: {
    PENDING: 'pending',       // Initial state when booking is created
    CONFIRMED: 'confirmed',   // Owner has confirmed the booking
    REJECTED: 'rejected',     // Owner has rejected the booking
    PAID: 'paid',             // Payment has been processed
    ACTIVE: 'active',         // Vehicle has been picked up
    COMPLETED: 'completed',   // Vehicle has been returned
    CANCELLED: 'cancelled',   // Cancelled by renter or system
    DISPUTED: 'disputed'      // Issue reported, under review
  },

  // Generate mock bookings for testing
  getMockBookings: () => {
    return [
      {
        id: 1,
        vehicleId: 5,
        vehicleName: '2022 Toyota Fortuner LTD 4x4',
        vehicleImage: '/images/cars/fortuner-1.jpg',
        startDate: '2023-05-20',
        endDate: '2023-05-25',
        status: 'completed',
        totalAmount: 22500,
        paymentStatus: 'paid',
        owner: {
          id: 101,
          name: 'John Dela Cruz',
          image: '/images/users/owner-1.jpg',
          phone: '+63 917 123 4567'
        },
        location: 'Makati City',
        hasReview: true
      },
      {
        id: 2,
        vehicleId: 8,
        vehicleName: '2022 Nissan Terra',
        vehicleImage: '/images/cars/nissan-terra.jpg',
        startDate: '2023-06-15',
        endDate: '2023-06-18',
        status: 'confirmed',
        totalAmount: 12600,
        paymentStatus: 'pending',
        owner: {
          id: 102,
          name: 'Maria Santos',
          image: '/images/users/owner-2.jpg',
          phone: '+63 918 765 4321'
        },
        location: 'Alabang',
        hasReview: false
      },
      {
        id: 3,
        vehicleId: 12,
        vehicleName: '2023 Honda Civic RS',
        vehicleImage: '/images/cars/honda-civic.jpg',
        startDate: '2023-07-10',
        endDate: '2023-07-12',
        status: 'cancelled',
        totalAmount: 8000,
        paymentStatus: 'refunded',
        owner: {
          id: 103,
          name: 'Paolo Reyes',
          image: '/images/users/owner-3.jpg',
          phone: '+63 919 876 5432'
        },
        location: 'Quezon City',
        hasReview: false
      }
    ];
  }
};

export default BookingService;