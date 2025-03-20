import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import BookingService from '../../services/booking/bookingService';
import PaymentService from '../../services/payment/paymentService';
import './PaymentPage.css';

const PaymentPage = () => {
  const { bookingId } = useParams();
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const bookingData = location.state?.bookingData || null;

  const [booking, setBooking] = useState(null);
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    cardholderName: '',
    expiryDate: '',
    cvv: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countdown, setCountdown] = useState(900); // 15 minutes in seconds

  useEffect(() => {
    // Fetch booking details or use the booking data from location state
    if (bookingData) {
      setBooking(bookingData);
      // We would also fetch vehicle details in a real app
      setVehicle({
        id: bookingData.vehicleId,
        make: 'Toyota',
        model: 'Fortuner',
        year: 2022,
        trim: 'LTD 4x4',
        imageUrl: '/images/cars/fortuner-1.jpg'
      });
      setLoading(false);
    } else if (bookingId && token) {
      fetchBookingDetails();
    } else {
      setError('No booking information found');
      setLoading(false);
    }

    // Get payment methods
    if (token) {
      // In a real app, you'd fetch from the API
      setPaymentMethods(PaymentService.getMockPaymentMethods());
    }

    // Start countdown timer
    const timer = setInterval(() => {
      setCountdown(prevTime => {
        if (prevTime <= 1) {
          clearInterval(timer);
          // Handle payment session expiration
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [bookingId, token, bookingData]);

  const fetchBookingDetails = async () => {
    try {
      setLoading(true);
      const data = await BookingService.getBooking(bookingId, token);
      setBooking(data);
      // Fetch vehicle details here in a real app
      setVehicle({
        id: data.vehicleId,
        make: 'Toyota',
        model: 'Fortuner',
        year: 2022,
        trim: 'LTD 4x4',
        imageUrl: '/images/cars/fortuner-1.jpg'
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCardInputChange = (e) => {
    const { name, value } = e.target;
    setCardDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatTimeRemaining = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedPaymentMethod) {
      setError('Please select a payment method');
      return;
    }

    if (selectedPaymentMethod === 'credit_card' && 
        (!cardDetails.cardNumber || !cardDetails.cardholderName || 
         !cardDetails.expiryDate || !cardDetails.cvv)) {
      setError('Please fill in all card details');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      // In a real app, this would send the payment to a gateway
      const paymentData = {
        bookingId: booking.id,
        paymentMethod: selectedPaymentMethod,
        amount: booking.totalAmount,
        cardDetails: selectedPaymentMethod === 'credit_card' ? cardDetails : null
      };

      // Mock successful payment for development
      setTimeout(() => {
        // Redirect to confirmation page
        navigate(`/booking/confirmation/${booking.id}`, {
          state: { 
            paymentSuccessful: true,
            transactionId: 'TX' + Math.floor(Math.random() * 1000000),
            booking: booking
          }
        });
      }, 2000);

      // Real implementation would be something like:
      // const result = await PaymentService.processPayment(paymentData, token);
      // navigate(`/booking/confirmation/${booking.id}`, {
      //   state: { 
      //     paymentSuccessful: true,
      //     transactionId: result.transactionId,
      //     booking: booking
      //   }
      // });
    } catch (err) {
      setError(err.message || 'Payment failed. Please try again.');
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="payment-loading">
        <div className="spinner"></div>
        <p>Loading payment details...</p>
      </div>
    );
  }

  if (error && !booking) {
    return (
      <div className="payment-error">
        <i className="fas fa-exclamation-circle"></i>
        <h2>Error Loading Payment</h2>
        <p>{error}</p>
        <button onClick={() => navigate('/bookings')} className="btn-secondary">
          Return to Bookings
        </button>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="payment-error">
        <i className="fas fa-exclamation-circle"></i>
        <h2>Booking Not Found</h2>
        <p>The booking information could not be found.</p>
        <button onClick={() => navigate('/bookings')} className="btn-secondary">
          Return to Bookings
        </button>
      </div>
    );
  }

  return (
    <div className="payment-page">
      <div className="container">
        <div className="payment-header">
          <h1>Complete Your Payment</h1>
          <div className="payment-timer">
            <i className="fas fa-clock"></i>
            <span>Time remaining: {formatTimeRemaining(countdown)}</span>
          </div>
        </div>

        <div className="payment-content">
          <div className="payment-form-container">
            {error && (
              <div className="payment-alert error">
                <i className="fas fa-exclamation-circle"></i>
                <p>{error}</p>
              </div>
            )}

            <div className="booking-summary">
              <h2>Booking Summary</h2>
              {vehicle && (
                <div className="vehicle-summary">
                  <div className="vehicle-image">
                    <img src={vehicle.imageUrl} alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`} />
                  </div>
                  <div className="vehicle-details">
                    <h3>{vehicle.year} {vehicle.make} {vehicle.model} {vehicle.trim}</h3>
                    <div className="booking-dates">
                      <div className="date-item">
                        <span className="date-label">Pickup:</span>
                        <span className="date-value">{booking.startDate}</span>
                      </div>
                      <div className="date-item">
                        <span className="date-label">Return:</span>
                        <span className="date-value">{booking.endDate}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="price-breakdown">
                <h3>Price Details</h3>
                <div className="price-item">
                  <span className="price-label">Daily Rate</span>
                  <span className="price-value">₱{booking.dailyRate?.toLocaleString() || '0'}</span>
                </div>
                <div className="price-item">
                  <span className="price-label">Duration</span>
                  <span className="price-value">{booking.totalDays} days</span>
                </div>
                <div className="price-item">
                  <span className="price-label">Rental Subtotal</span>
                  <span className="price-value">₱{(booking.dailyRate * booking.totalDays)?.toLocaleString() || '0'}</span>
                </div>
                {booking.insuranceType && (
                  <div className="price-item">
                    <span className="price-label">Insurance ({booking.insuranceType})</span>
                    <span className="price-value">₱{(booking.insuranceRate * booking.totalDays)?.toLocaleString() || '0'}</span>
                  </div>
                )}
                <div className="price-item">
                  <span className="price-label">Service Fee</span>
                  <span className="price-value">₱{(booking.serviceFee || booking.totalAmount * 0.1)?.toLocaleString()}</span>
                </div>
                <div className="price-item">
                  <span className="price-label">Tax</span>
                  <span className="price-value">₱{(booking.tax || booking.totalAmount * 0.12)?.toLocaleString()}</span>
                </div>
                <div className="price-item total">
                  <span className="price-label">Total Amount</span>
                  <span className="price-value">₱{booking.totalAmount?.toLocaleString() || '0'}</span>
                </div>
                {booking.securityDeposit && (
                  <div className="price-item deposit">
                    <span className="price-label">Security Deposit (refundable)</span>
                    <span className="price-value">₱{booking.securityDeposit.toLocaleString()}</span>
                  </div>
                )}
              </div>
            </div>

            <form onSubmit={handlePaymentSubmit} className="payment-form">
              <h2>Payment Method</h2>
              
              <div className="payment-methods">
                {paymentMethods.map(method => (
                  <div 
                    key={method.id}
                    className={`payment-method-card ${selectedPaymentMethod === method.id ? 'selected' : ''}`}
                    onClick={() => setSelectedPaymentMethod(method.id)}
                  >
                    <div className="payment-method-icon">
                      <i className={`fas ${method.icon}`}></i>
                    </div>
                    <div className="payment-method-details">
                      <h4>{method.name}</h4>
                      <p>{method.description}</p>
                    </div>
                    <div className="payment-method-radio">
                      <input 
                        type="radio" 
                        id={`method-${method.id}`}
                        name="paymentMethod"
                        checked={selectedPaymentMethod === method.id}
                        onChange={() => setSelectedPaymentMethod(method.id)}
                      />
                      <label htmlFor={`method-${method.id}`}></label>
                    </div>
                  </div>
                ))}
              </div>
              
              {selectedPaymentMethod === 'credit_card' && (
                <div className="credit-card-form">
                  <div className="form-group">
                    <label htmlFor="cardNumber">Card Number</label>
                    <input
                      type="text"
                      id="cardNumber"
                      name="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={cardDetails.cardNumber}
                      onChange={handleCardInputChange}
                      maxLength="19"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="cardholderName">Cardholder Name</label>
                    <input
                      type="text"
                      id="cardholderName"
                      name="cardholderName"
                      placeholder="Juan Dela Cruz"
                      value={cardDetails.cardholderName}
                      onChange={handleCardInputChange}
                    />
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="expiryDate">Expiry Date</label>
                      <input
                        type="text"
                        id="expiryDate"
                        name="expiryDate"
                        placeholder="MM/YY"
                        value={cardDetails.expiryDate}
                        onChange={handleCardInputChange}
                        maxLength="5"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="cvv">CVV</label>
                      <input
                        type="text"
                        id="cvv"
                        name="cvv"
                        placeholder="123"
                        value={cardDetails.cvv}
                        onChange={handleCardInputChange}
                        maxLength="4"
                      />
                    </div>
                  </div>
                </div>
              )}
              
              {selectedPaymentMethod === 'gcash' && (
                <div className="mobile-wallet-instructions">
                  <p>You will be redirected to GCash to complete your payment after you click "Pay Now".</p>
                  <div className="wallet-info">
                    <i className="fas fa-info-circle"></i>
                    <span>Make sure you have an active GCash account and sufficient balance.</span>
                  </div>
                </div>
              )}
              
              {selectedPaymentMethod === 'paymaya' && (
                <div className="mobile-wallet-instructions">
                  <p>You will be redirected to PayMaya to complete your payment after you click "Pay Now".</p>
                  <div className="wallet-info">
                    <i className="fas fa-info-circle"></i>
                    <span>Make sure you have an active PayMaya account and sufficient balance.</span>
                  </div>
                </div>
              )}
              
              {selectedPaymentMethod === 'bank_transfer' && (
                <div className="bank-transfer-instructions">
                  <p>After clicking "Pay Now", you'll receive bank account details for the transfer.</p>
                  <div className="transfer-info">
                    <i className="fas fa-info-circle"></i>
                    <span>Please complete the transfer within 24 hours to secure your booking.</span>
                  </div>
                </div>
              )}
              
              <div className="form-actions">
                <button 
                  type="button" 
                  className="btn-secondary"
                  onClick={() => navigate(-1)}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-primary"
                  disabled={!selectedPaymentMethod || isSubmitting || countdown === 0}
                >
                  {isSubmitting ? (
                    <>
                      <div className="spinner-sm"></div>
                      Processing...
                    </>
                  ) : (
                    <>Pay Now ₱{booking.totalAmount?.toLocaleString() || '0'}</>
                  )}
                </button>
              </div>
              
              <div className="payment-security">
                <i className="fas fa-lock"></i>
                <p>All payments are secured with 256-bit SSL encryption.</p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;