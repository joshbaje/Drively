import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const dropdownRef = useRef(null);
  
  // Function to determine if the user has an internal role
  const hasInternalRole = () => {
    if (!user) return false;
    return ['admin', 'super_admin', 'system_admin', 'support', 'content_moderator', 'finance_admin', 'fleet_manager'].includes(user.user_type);
  };
  
  // Function to get role display text
  const getRoleDisplay = () => {
    if (!user) return '';
    
    switch(user.user_type) {
      case 'admin':
      case 'super_admin':
      case 'system_admin':
        return '(Admin)';
      case 'support':
        return '(Support)';
      case 'content_moderator':
        return '(Moderator)';
      case 'finance_admin':
        return '(Finance)';
      case 'fleet_manager':
        return '(Fleet)';
      default:
        return '';
    }
  };
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <img src={`${process.env.PUBLIC_URL}/logo.svg`}  alt="" className="navbar-logo-img" />
          <span className="navbar-logo-text">Drively</span>
        </Link>
        
        <div className="navbar-menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <span className="navbar-menu-toggle-icon"></span>
        </div>
        
        <ul className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          {/* Show special links for internal users */}
          {isAuthenticated && hasInternalRole() && (
            <li className="navbar-item">
              <Link 
                to={
                  user?.user_type === 'admin' || user?.user_type === 'super_admin' || user?.user_type === 'system_admin' 
                    ? '/admin' 
                    : user?.user_type === 'support' || user?.user_type === 'content_moderator'
                      ? '/agent/dashboard'
                      : '/'
                } 
                className="navbar-link internal-link"
              >
                {user?.user_type === 'admin' || user?.user_type === 'super_admin' || user?.user_type === 'system_admin' 
                  ? 'Admin Portal' 
                  : user?.user_type === 'content_moderator'
                    ? 'Content Portal'
                    : user?.user_type === 'support'
                      ? 'Agent Portal'
                      : 'Dashboard'
                }
              </Link>
            </li>
          )}
          
          <li className="navbar-item">
            <Link to="/search" className="navbar-link">Find a Car</Link>
          </li>
          
          <li className="navbar-item">
            <Link to="/how-it-works" className="navbar-link">How It Works</Link>
          </li>
          
          {isAuthenticated && (user?.user_type === 'verified_owner' || user?.user_type === 'fleet_manager') && (
            <li className="navbar-item">
              <Link to="/list-your-car" className="navbar-link">List Your Car</Link>
            </li>
          )}
          
          {isAuthenticated ? (
            <>
              <li className="navbar-item">
                <Link to="/bookings" className="navbar-link">My Bookings</Link>
              </li>
              
              <li className="navbar-item dropdown" ref={dropdownRef}>
                <button 
                  className="navbar-link dropdown-toggle"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  My Account {hasInternalRole() && <span className="role-indicator">{getRoleDisplay()}</span>}
                </button>
                <div className={`dropdown-menu ${isDropdownOpen ? 'show' : ''}`} onClick={(e) => e.stopPropagation()}>
                  <Link to="/profile" className="dropdown-item">Profile</Link>
                  {(user?.user_type === 'verified_owner' || user?.user_type === 'fleet_manager') && (
                    <Link to="/owner/dashboard" className="dropdown-item">Owner Dashboard</Link>
                  )}
                  {user?.user_type === 'verified_renter' && (
                    <Link to="/renter-dashboard" className="dropdown-item">Renter Dashboard</Link>
                  )}
                  {(user?.user_type === 'support' || user?.user_type === 'content_moderator') && (
                    <Link to="/agent/dashboard" className="dropdown-item">{user?.user_type === 'content_moderator' ? 'Content Portal' : 'Agent Portal'}</Link>
                  )}
                  {(user?.user_type === 'admin' || user?.user_type === 'super_admin' || user?.user_type === 'system_admin') && (
                    <Link to="/admin" className="dropdown-item">Admin Portal</Link>
                  )}
                  <Link to="/settings" className="dropdown-item">Settings</Link>
                  <div className="dropdown-divider"></div>
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      logout();
                      setIsDropdownOpen(false);
                    }} 
                    className="dropdown-item logout-btn"
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