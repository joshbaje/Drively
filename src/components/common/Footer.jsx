import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-column">
            <div className="footer-logo">
              <img src="/public/logo.svg" alt="Drively" className="footer-logo-img" />
              <span className="footer-logo-text">Drively</span>
            </div>
            <p className="footer-description">
              The modern way to rent a car. Connect with car owners directly and
              enjoy a seamless rental experience.
            </p>
            <div className="social-links">
              <a href="https://www.facebook.com/drivelyph" target="_blank" rel="noopener noreferrer" className="social-link">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="https://twitter.com/drivelyph" target="_blank" rel="noopener noreferrer" className="social-link">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="https://www.instagram.com/drivelyph" target="_blank" rel="noopener noreferrer" className="social-link">
                <i className="fab fa-instagram"></i>
              </a>
            </div>
          </div>
          
          <div className="footer-column">
            <h3 className="footer-heading">Quick Links</h3>
            <ul className="footer-links">
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/how-it-works">How It Works</Link></li>
              <li><Link to="/terms">Terms of Service</Link></li>
              <li><Link to="/privacy">Privacy Policy</Link></li>
              <li><Link to="/faq">FAQs</Link></li>
            </ul>
          </div>
          
          <div className="footer-column">
            <h3 className="footer-heading">Services</h3>
            <ul className="footer-links">
              <li><Link to="/search">Find a Car</Link></li>
              <li><Link to="/list-your-car">List Your Car</Link></li>
              <li><Link to="/insurance">Insurance</Link></li>
              <li><Link to="/customer-support">Customer Support</Link></li>
              <li><Link to="/blog">Blog</Link></li>
            </ul>
          </div>
          
          <div className="footer-column">
            <h3 className="footer-heading">Contact Us</h3>
            <ul className="footer-contact">
              <li>
                <i className="fas fa-map-marker-alt"></i>
                <span>123 Main Street, Makati City, Philippines 1200</span>
              </li>
              <li>
                <i className="fas fa-phone"></i>
                <span>+63 (2) 8123 4567</span>
              </li>
              <li>
                <i className="fas fa-envelope"></i>
                <span>support@drivelyph.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p className="copyright">&copy; {new Date().getFullYear()} Drively. All rights reserved.</p>
          <div className="payment-methods">
            <img src="/images/payment/visa.png" alt="Visa" />
            <img src="/images/payment/mastercard.png" alt="Mastercard" />
            <img src="/images/payment/amex.png" alt="American Express" />
            <img src="/images/payment/paypal.png" alt="PayPal" />
            <img src="/images/payment/gcash.png" alt="GCash" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;