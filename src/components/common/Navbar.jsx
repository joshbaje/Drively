import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import supabase from '../../services/supabase/supabaseClient';
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const dropdownRef = useRef(null);
  
  // Add state for direct Supabase auth check
  const [directAuth, setDirectAuth] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  
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
  
  // Force a check of the auth state directly from Supabase
  useEffect(() => {
    const checkDirectAuth = async () => {
      try {
        console.log("[NAVBAR] Checking direct auth with Supabase");
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("[NAVBAR] Error checking Supabase session:", error);
          setDirectAuth(false);
        } else if (data?.session) {
          console.log("[NAVBAR] Supabase reports active session for:", data.session.user.email);
          setDirectAuth(true);
          
          if (!isAuthenticated) {
            console.log("[NAVBAR] Session exists but UI doesn't show authenticated - this is a sync issue");
          }
        } else {
          console.log("[NAVBAR] No active Supabase session found");
          setDirectAuth(false);
        }
        
        setAuthChecked(true);
      } catch (err) {
        console.error("[NAVBAR] Exception checking direct auth:", err);
        setAuthChecked(true);
        setDirectAuth(false);
      }
    };
    
    checkDirectAuth();
  }, [isAuthenticated]);
  
  // Add this check to help debug
  useEffect(() => {
    console.log("[NAVBAR] Auth state:", { 
      isAuthenticated, 
      hasUser: !!user, 
      email: user?.email,
      directAuth,
      authChecked
    });
  }, [user, isAuthenticated, directAuth, authChecked]);
  
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
  
  // Use either the context auth state OR the direct Supabase check
  const showAuthenticatedUI = isAuthenticated || directAuth;
  
  // Auth state mismatch detected
  const hasAuthMismatch = directAuth && !isAuthenticated;
  
  return (
    <nav className="navbar">
      {/* Debug info - remove in production */}
      <div style={{ fontSize: '10px', color: 'gray', position: 'absolute', top: '0', right: '0', padding: '2px' }}>
        Auth: {isAuthenticated ? 'Yes' : 'No'} | Supabase: {directAuth ? 'Yes' : 'No'} | Checked: {authChecked ? 'Yes' : 'No'}
      </div>
      
      {/* Auth mismatch warning - only show when there's a mismatch */}
      {hasAuthMismatch && (
        <div style={{ 
          background: '#FFF3CD', 
          color: '#856404', 
          padding: '5px 15px', 
          fontSize: '14px',
          position: 'absolute',
          top: '20px',
          right: '10px',
          zIndex: 1000,
          borderRadius: '4px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <span>Auth sync issue detected</span>
          <Link 
            to="/auth-sync"
            style={{
              backgroundColor: '#FFC107',
              color: '#212529',
              padding: '3px 10px',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: 'bold',
              textDecoration: 'none'
            }}
          >
            Fix Now
          </Link>
        </div>
      )}
      
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
          {showAuthenticatedUI && hasInternalRole() && (
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
          
          {/* Always show Auth Sync link when there's a mismatch */}
          {hasAuthMismatch && (
            <li className="navbar-item" style={{ fontWeight: 'bold' }}>
              <Link to="/auth-sync" className="navbar-link" style={{ color: '#FFC107' }}>
                Fix Auth Sync
              </Link>
            </li>
          )}
          
          {showAuthenticatedUI && (user?.user_type === 'verified_owner' || user?.user_type === 'fleet_manager') && (
            <li className="navbar-item">
              <Link to="/list-your-car" className="navbar-link">List Your Car</Link>
            </li>
          )}
          
          {showAuthenticatedUI || directAuth ? (
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
                  <Link to="/auth-sync" className="dropdown-item">Auth Sync</Link>
                  <Link to="/supabase-auth-test" className="dropdown-item">Auth Debug</Link>
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
              {/* Show Auth Sync link in menu when direct auth detected but UI doesn't reflect it */}
              {hasAuthMismatch && (
                <li className="navbar-item">
                  <Link to="/auth-sync" className="navbar-btn" style={{ backgroundColor: '#FFC107', color: '#212529' }}>
                    Fix Auth
                  </Link>
                </li>
              )}
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;