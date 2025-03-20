import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import './ConfirmationPage.css';

const ConfirmationPage = () => {
  const { bookingId } = useParams();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [confirmationData, setConfirmationData] = useState(null);

  useEffect(() => {
    // In a real app, you would fetch confirmation details from an API
    // For now, use mock data or data passed via location state
    const mockData = location.state || {
      paymentSuccess: true,
      paymentDetails: {
        method: 'credit_card',
        cardLast4: '4242',
        amount: 402.89,
        date: new Date().toISOString()
      },
      bookingDetails: {
        bookingId: bookingId || 'BK-' + Math.floor(100000 + Math.random() * 900000),
        vehicleId: 'v123',
        vehicleName: '2022 Toyota Camry',
        vehicleImage: '/assets/images/cars/camry.jpg',
        startDate: '2025-04-01',
        endDate: '2025-04-05',
        pickupTime: '10:00 AM',
        dropoffTime: '10:00 AM',
        daysCount: 5,
        pickupLocation: '123 Main St, Makati City',
        dropoffLocation: '123 Main St, Makati City',
        ownerName: 'John Smith',
        ownerPhone: '+63 912 345 6789',
        dailyRate: 59.99,
        subtotal: 299.95,
        serviceFee: 29.99,
        taxAmount: 33.00,
        insuranceFee: 39.95,
        totalAmount: 402.89,
        securityDeposit: 200.00
      }
    };

    setConfirmationData(mockData);
    setLoading(false);
  }, [bookingId, location.state]);

  // Format date to readable format
  const formatDate = (dateString) => {
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Format currency
  const formatCurrency = (amount) => {
    return `$${parseFloat(amount).toFixed(2)}`;
  };

  // Format method display
  const formatPaymentMethod = (method, last4 = null) => {
    if (method === 'credit_card') {
      return `Credit Card ${last4 ? `(**** **** **** ${last4})` : ''}`;
    } else if (method === 'paypal') {
      return 'PayPal';
    }
    return method;
  };

  // Download receipt as PDF (this would be implemented with a PDF library in a real app)
  const handleDownloadReceipt = () => {
    alert('In a real application, this would download a PDF receipt.');
    // This would use a library like jsPDF, react-pdf, or an API call to generate a proper PDF
  };

  if (loading) {
    return <div className="confirmation-container">Loading confirmation details...</div>;
  }

  const { paymentSuccess, paymentDetails, bookingDetails } = confirmationData;

  if (!paymentSuccess) {
    return (
      <div className="confirmation-container">
        <div className="confirmation-header">
          <div className="success-icon" style={{ backgroundColor: '#f44336' }}>
            <i className="fas fa-times"></i>
          </div>
          <h1>Payment Failed</h1>
          <p>Unfortunately, there was an issue processing your payment. Please try again or contact support.</p>
        </div>
        <div className="confirmation-actions">
          <Link to="/payment" className="btn-view-booking">Try Again</Link>
          <Link to="/" className="btn-back-home">Back to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="confirmation-container">
      <div className="confirmation-header">
        <div className="success-icon">
          <i className="fas fa-check"></i>
        </div>
        <h1>Booking Confirmed!</h1>
        <p>Your vehicle reservation has been successfully confirmed. Details of your booking are provided below.</p>
      </div>

      <div className="booking-reference">
        <h3>Booking Reference</h3>
        <div className="reference-number">{bookingDetails.bookingId}</div>
      </div>

      <div className="vehicle-info">
        <img 
          src={bookingDetails.vehicleImage || 'https://via.placeholder.com/100x70'} 
          alt={bookingDetails.vehicleName} 
          className="vehicle-image"
        />
        <div className="vehicle-details">
          <h4>{bookingDetails.vehicleName}</h4>
          <p><strong>Pickup:</strong> {formatDate(bookingDetails.startDate)} at {bookingDetails.pickupTime}</p>
          <p><strong>Return:</strong> {formatDate(bookingDetails.endDate)} at {bookingDetails.dropoffTime}</p>
        </div>
      </div>

      <div className="booking-details">
        <h3>Booking Details</h3>
        <div className="details-grid">
          <div className="detail-item">
            <span className="detail-label">Rental Period</span>
            <span className="detail-value">{bookingDetails.daysCount} days</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Pickup Location</span>
            <span className="detail-value">{bookingDetails.pickupLocation}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Dropoff Location</span>
            <span className="detail-value">{bookingDetails.dropoffLocation}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Car Owner</span>
            <span className="detail-value">{bookingDetails.ownerName}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Contact Number</span>
            <span className="detail-value">{bookingDetails.ownerPhone}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Booking Date</span>
            <span className="detail-value">{formatDate(paymentDetails.date)}</span>
          </div>
        </div>
      </div>

      <div className="payment-summary">
        <h3>Payment Summary</h3>
        <div className="summary-row">
          <span>Daily Rate</span>
          <span>{formatCurrency(bookingDetails.dailyRate)}</span>
        </div>
        <div className="summary-row">
          <span>Subtotal ({bookingDetails.daysCount} days)</span>
          <span>{formatCurrency(bookingDetails.subtotal)}</span>
        </div>
        <div className="summary-row">
          <span>Service Fee</span>
          <span>{formatCurrency(bookingDetails.serviceFee)}</span>
        </div>
        <div className="summary-row">
          <span>Insurance Fee</span>
          <span>{formatCurrency(bookingDetails.insuranceFee)}</span>
        </div>
        <div className="summary-row">
          <span>Tax</span>
          <span>{formatCurrency(bookingDetails.taxAmount)}</span>
        </div>
        <div className="summary-row">
          <span>Security Deposit (refundable)</span>
          <span>{formatCurrency(bookingDetails.securityDeposit)}</span>
        </div>
        <div className="summary-row">
          <span>Total Paid</span>
          <span>{formatCurrency(bookingDetails.totalAmount + bookingDetails.securityDeposit)}</span>
        </div>
      </div>

      <div className="payment-method">
        <h3>Payment Method</h3>
        <div className="method-info">
          <div className="method-icon">
            <i className={paymentDetails.method === 'paypal' ? 'fab fa-paypal' : 'fas fa-credit-card'}></i>
          </div>
          <div>
            <p><strong>{formatPaymentMethod(paymentDetails.method, paymentDetails.cardLast4)}</strong></p>
            <p>Transaction Date: {formatDate(paymentDetails.date)}</p>
          </div>
        </div>
      </div>

      <div className="next-steps">
        <h3>Next Steps</h3>
        <ul>
          <li>You will receive a confirmation email with all booking details.</li>
          <li>The car owner will contact you before the pickup date to coordinate the handover.</li>
          <li>Be sure to have your driver's license and a valid ID with you at pickup.</li>
          <li>Check the vehicle thoroughly before driving off and report any issues immediately.</li>
          <li>Contact support if you have any questions or need to modify your booking.</li>
        </ul>
      </div>

      <div className="receipt-section">
        <button className="btn-download-receipt" onClick={handleDownloadReceipt}>
          <i className="fas fa-download"></i> Download Receipt
        </button>
      </div>

      <div className="confirmation-actions">
        <Link to="/bookings" className="btn-view-booking">View My Bookings</Link>
        <Link to="/" className="btn-back-home">Back to Home</Link>
      </div>
    </div>
  );
};

export default ConfirmationPage;