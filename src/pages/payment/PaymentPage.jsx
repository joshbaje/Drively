import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import './PaymentPage.css';

const PaymentPage = () => {
  const navigate = useNavigate();
  const { bookingId } = useParams();
  const location = useLocation();
  const [bookingDetails, setBookingDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [cardType, setCardType] = useState('');
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardholderName: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    savePaymentMethod: false,
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US'
  });

  // Get current year for expiry date options
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear + i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  useEffect(() => {
    // Check if we have booking details in location state
    if (location.state?.bookingDetails) {
      console.log('Booking details from state:', location.state.bookingDetails);
      setBookingDetails(location.state.bookingDetails);
      setLoading(false);
    } else {
      // If no booking details in state, use mock data (would fetch from API in real app)
      console.log('No booking details in state, using mock data');
      const mockBookingDetails = {
        vehicleId: 'v123',
        vehicleName: '2022 Toyota Camry',
        startDate: '2025-04-01',
        endDate: '2025-04-05',
        daysCount: 5,
        dailyRate: 59.99,
        subtotal: 299.95,
        serviceFee: 29.99,
        taxAmount: 33.00,
        insuranceFee: 39.95,
        totalAmount: 402.89,
        securityDeposit: 200.00
      };
      
      setBookingDetails(mockBookingDetails);
      setLoading(false);
    }
  }, [bookingId, location.state]);

  // Function to detect card type based on first digits
  const detectCardType = (cardNumber) => {
    const cleanNumber = cardNumber.replace(/\s+/g, '');
    
    if (/^4/.test(cleanNumber)) {
      return 'visa';
    } else if (/^5[1-5]/.test(cleanNumber)) {
      return 'mastercard';
    } else if (/^3[47]/.test(cleanNumber)) {
      return 'amex';
    } else if (/^6(?:011|5)/.test(cleanNumber)) {
      return 'discover';
    }
    return '';
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === 'cardNumber') {
      // Format card number with spaces for readability
      const cleanValue = value.replace(/\s+/g, '');
      let formattedValue = '';
      
      for (let i = 0; i < cleanValue.length; i++) {
        if (i > 0 && i % 4 === 0) {
          formattedValue += ' ';
        }
        formattedValue += cleanValue[i];
      }
      
      setCardType(detectCardType(cleanValue));
      
      setFormData({
        ...formData,
        [name]: formattedValue
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value
      });
    }
  };

  // Handle payment method selection
  const handlePaymentMethodSelect = (method) => {
    setPaymentMethod(method);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // In a real app, you would process the payment here through a payment gateway
    console.log('Processing payment with:', { paymentMethod, formData });
    
    // Simulate payment processing
    setLoading(true);
    setTimeout(() => {
      // Redirect to confirmation page after successful payment
      navigate(`/booking/confirmation/${bookingId}`, { 
        state: { 
          paymentSuccess: true,
          paymentDetails: {
            method: paymentMethod,
            amount: bookingDetails.totalAmount,
            date: new Date().toISOString()
          },
          bookingDetails
        } 
      });
    }, 2000);
  };

  // Go back to booking page
  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return <div className="payment-container">Loading payment details...</div>;
  }

  return (
    <div className="payment-container">
      <div className="payment-header">
        <h1>Complete Your Payment</h1>
        <p>Your reservation will be confirmed after successful payment</p>
      </div>

      <div className="payment-progress">
        <div className="progress-step">
          <div className="step-circle completed">1</div>
          <div className="step-text">Vehicle Selection</div>
        </div>
        <div className="progress-step">
          <div className="step-circle completed">2</div>
          <div className="step-text">Booking Details</div>
        </div>
        <div className="progress-step">
          <div className="step-circle active">3</div>
          <div className="step-text">Payment</div>
        </div>
        <div className="progress-step">
          <div className="step-circle">4</div>
          <div className="step-text">Confirmation</div>
        </div>
      </div>

      <div className="payment-summary">
        <h3>Booking Summary</h3>
        <div className="summary-row">
          <span>Vehicle</span>
          <span>{bookingDetails.vehicleName}</span>
        </div>
        <div className="summary-row">
          <span>Rental Period</span>
          <span>{bookingDetails.startDate} to {bookingDetails.endDate} ({bookingDetails.daysCount} days)</span>
        </div>
        <div className="summary-row">
          <span>Daily Rate</span>
          <span>${bookingDetails.dailyRate.toFixed(2)}</span>
        </div>
        <div className="summary-row">
          <span>Subtotal</span>
          <span>${bookingDetails.subtotal.toFixed(2)}</span>
        </div>
        <div className="summary-row">
          <span>Service Fee</span>
          <span>${bookingDetails.serviceFee.toFixed(2)}</span>
        </div>
        <div className="summary-row">
          <span>Insurance Fee</span>
          <span>${bookingDetails.insuranceFee.toFixed(2)}</span>
        </div>
        <div className="summary-row">
          <span>Tax</span>
          <span>${bookingDetails.taxAmount.toFixed(2)}</span>
        </div>
        <div className="summary-row">
          <span>Security Deposit (refundable)</span>
          <span>${bookingDetails.securityDeposit.toFixed(2)}</span>
        </div>
        <div className="summary-row">
          <span>Total</span>
          <span>${(bookingDetails.totalAmount + bookingDetails.securityDeposit).toFixed(2)}</span>
        </div>
      </div>

      <div className="payment-methods">
        <h3>Payment Method</h3>
        <div 
          className={`method-option ${paymentMethod === 'credit_card' ? 'selected' : ''}`}
          onClick={() => handlePaymentMethodSelect('credit_card')}
        >
          <div className="method-icon">
            <i className="fas fa-credit-card"></i>
          </div>
          <div>
            <strong>Credit/Debit Card</strong>
            <p>Pay securely with your card</p>
          </div>
        </div>
        <div 
          className={`method-option ${paymentMethod === 'paypal' ? 'selected' : ''}`}
          onClick={() => handlePaymentMethodSelect('paypal')}
        >
          <div className="method-icon">
            <i className="fab fa-paypal"></i>
          </div>
          <div>
            <strong>PayPal</strong>
            <p>Pay with your PayPal account</p>
          </div>
        </div>
      </div>

      {paymentMethod === 'credit_card' && (
        <form onSubmit={handleSubmit}>
          <div className="card-form">
            <div className="card-icons">
              <img 
                src="/assets/images/visa.png" 
                alt="Visa" 
                className={`card-icon ${cardType === 'visa' ? 'active' : ''}`}
              />
              <img 
                src="/assets/images/mastercard.png" 
                alt="Mastercard" 
                className={`card-icon ${cardType === 'mastercard' ? 'active' : ''}`}
              />
              <img 
                src="/assets/images/amex.png" 
                alt="American Express" 
                className={`card-icon ${cardType === 'amex' ? 'active' : ''}`}
              />
              <img 
                src="/assets/images/discover.png" 
                alt="Discover" 
                className={`card-icon ${cardType === 'discover' ? 'active' : ''}`}
              />
            </div>

            <div className="form-group">
              <label htmlFor="cardNumber">Card Number</label>
              <input
                type="text"
                id="cardNumber"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleChange}
                placeholder="1234 5678 9012 3456"
                maxLength="19"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="cardholderName">Cardholder Name</label>
              <input
                type="text"
                id="cardholderName"
                name="cardholderName"
                value={formData.cardholderName}
                onChange={handleChange}
                placeholder="John Doe"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="expiryMonth">Expiry Date</label>
                <div className="form-row">
                  <select
                    id="expiryMonth"
                    name="expiryMonth"
                    value={formData.expiryMonth}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Month</option>
                    {months.map((month) => (
                      <option key={month} value={month}>
                        {month.toString().padStart(2, '0')}
                      </option>
                    ))}
                  </select>
                  <select
                    id="expiryYear"
                    name="expiryYear"
                    value={formData.expiryYear}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Year</option>
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="cvv">CVV</label>
                <input
                  type="text"
                  id="cvv"
                  name="cvv"
                  value={formData.cvv}
                  onChange={handleChange}
                  placeholder="123"
                  maxLength="4"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <input
                type="checkbox"
                id="savePaymentMethod"
                name="savePaymentMethod"
                checked={formData.savePaymentMethod}
                onChange={handleChange}
              />
              <label htmlFor="savePaymentMethod">Save this card for future payments</label>
            </div>

            <div className="billing-address">
              <h3>Billing Address</h3>
              <div className="form-group">
                <label htmlFor="address">Address</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="123 Main St"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="city">City</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="City"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="state">State</label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="State"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="zipCode">Zip Code</label>
                  <input
                    type="text"
                    id="zipCode"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    placeholder="Zip Code"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="country">Country</label>
                  <select
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    required
                  >
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                    <option value="PH">Philippines</option>
                    {/* Add more countries as needed */}
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="payment-actions">
            <button type="button" className="btn-back" onClick={handleBack}>
              Back
            </button>
            <button type="submit" className="btn-pay">
              Pay ${(bookingDetails.totalAmount + bookingDetails.securityDeposit).toFixed(2)}
            </button>
          </div>
        </form>
      )}

      {paymentMethod === 'paypal' && (
        <div className="paypal-section">
          <p>You will be redirected to PayPal to complete your payment.</p>
          <div className="payment-actions">
            <button type="button" className="btn-back" onClick={handleBack}>
              Back
            </button>
            <button 
              type="button" 
              className="btn-pay"
              onClick={() => {
                // In a real app, you would redirect to PayPal here
                console.log('Redirecting to PayPal...');
                setTimeout(() => {
                  navigate(`/booking/confirmation/${bookingId}`, { 
                    state: { 
                      paymentSuccess: true,
                      paymentDetails: {
                        method: 'paypal',
                        amount: bookingDetails.totalAmount,
                        date: new Date().toISOString()
                      },
                      bookingDetails
                    } 
                  });
                }, 2000);
              }}
            >
              Continue to PayPal
            </button>
          </div>
        </div>
      )}

      <div className="payment-secure-info">
        <i className="fas fa-lock"></i>
        <span>Your payment information is secure and encrypted</span>
      </div>
    </div>
  );
};

export default PaymentPage;