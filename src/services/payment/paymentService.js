// Payment Service for Drively
// This would typically integrate with a payment gateway like PayMaya, GCash, or Stripe

const API_BASE_URL = 'https://x8ki-letl-twmt.n7.xano.io/api:scA8Isc8';

const PaymentService = {
  // Process a payment
  processPayment: async (paymentData, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/payments/process`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(paymentData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Payment processing failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Payment error:', error);
      throw error;
    }
  },

  // Verify a payment
  verifyPayment: async (paymentId, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/payments/verify/${paymentId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Payment verification failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Verification error:', error);
      throw error;
    }
  },

  // Get available payment methods
  getPaymentMethods: async (token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/payments/methods`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch payment methods');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      throw error;
    }
  },

  // Mock payment methods (for development)
  getMockPaymentMethods: () => {
    return [
      {
        id: 'credit_card',
        name: 'Credit/Debit Card',
        icon: 'fa-credit-card',
        description: 'Pay with Visa, Mastercard, or JCB'
      },
      {
        id: 'gcash',
        name: 'GCash',
        icon: 'fa-wallet',
        description: 'Pay using GCash mobile wallet'
      },
      {
        id: 'paymaya',
        name: 'PayMaya',
        icon: 'fa-wallet',
        description: 'Pay using PayMaya digital wallet'
      },
      {
        id: 'bank_transfer',
        name: 'Bank Transfer',
        icon: 'fa-university',
        description: 'Direct bank transfer via PESONet or InstaPay'
      }
    ];
  },

  // Process a refund
  processRefund: async (bookingId, amount, reason, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/payments/refund`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          bookingId,
          amount,
          reason
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Refund processing failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Refund error:', error);
      throw error;
    }
  }
};

export default PaymentService;