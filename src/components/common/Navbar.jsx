import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <img src='/public/logo.svg' alt="Drively" className="navbar-logo-img" />
          <span className="navbar-logo-text">Drively</span>
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
          
          {isAuthenticated && user?.user_type === 'owner' && (
            <li className="navbar-item">
              <Link to="/list-your-car" className="navbar-link">List Your Car</Link>
            </li>
          )}
          
          {isAuthenticated ? (
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
                  {user?.user_type === 'owner' && (
                    <Link to="/owner-dashboard" className="dropdown-item">Owner Dashboard</Link>
                  )}
                  {user?.user_type === 'renter' && (
                    <Link to="/renter-dashboard" className="dropdown-item">Renter Dashboard</Link>
                  )}
                  <Link to="/settings" className="dropdown-item">Settings</Link>
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      logout();
                    }} 
                    className="dropdown-item"
                  >
                    Logout
                  </button>
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