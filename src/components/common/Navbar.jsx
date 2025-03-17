import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ isLoggedIn, userType }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <img src="/logo.svg" alt="Drivelyph" className="navbar-logo-img" />
          <span className="navbar-logo-text">Drivelyph</span>
        </Link>
        
        <div className="navbar-menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <span className="navbar-menu-toggle-icon"></span>
        </div>
        
        <ul className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          <li className="navbar-item">
            <Link to="/search" className="navbar-link">Find a Car</Link>
          </li>
          
          <li className="navbar-item">
            <Link to="/how-it-works" className="navbar-link">How It Works</Link>
          </li>
          
          {isLoggedIn && userType === 'owner' && (
            <li className="navbar-item">
              <Link to="/list-your-car" className="navbar-link">List Your Car</Link>
            </li>
          )}
          
          {isLoggedIn ? (
            <>
              <li className="navbar-item">
                <Link to="/bookings" className="navbar-link">My Bookings</Link>
              </li>
              
              <li className="navbar-item dropdown">
                <button className="navbar-link dropdown-toggle">
                  My Account
                </button>
                <div className="dropdown-menu">
                  <Link to="/profile" className="dropdown-item">Profile</Link>
                  {userType === 'owner' && (
                    <Link to="/owner-dashboard" className="dropdown-item">Owner Dashboard</Link>
                  )}
                  {userType === 'renter' && (
                    <Link to="/renter-dashboard" className="dropdown-item">Renter Dashboard</Link>
                  )}
                  <Link to="/settings" className="dropdown-item">Settings</Link>
                  <Link to="/logout" className="dropdown-item">Logout</Link>
                </div>
              </li>
            </>
          ) : (
            <>
              <li className="navbar-item">
                <Link to="/login" className="navbar-link">Log In</Link>
              </li>
              
              <li className="navbar-item">
                <Link to="/register" className="navbar-btn">Sign Up</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;