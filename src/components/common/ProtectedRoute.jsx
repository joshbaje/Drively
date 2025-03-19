import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * A wrapper component for routes that require authentication
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - The component to render if authenticated
 * @param {string} [props.requiredRole] - Optional role requirement (e.g. 'owner', 'admin')
 */
const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();
  
  // If still loading authentication state, show loading indicator
  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }
  
  // If not authenticated, redirect to login with return path
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // Map of role IDs to role names
  const roleMap = {
    1: 'admin',
    2: 'super_admin',
    3: 'owner',
    4: 'verified_owner',
    5: 'premium_owner',
    6: 'business_owner',
    7: 'renter',
    8: 'verified_renter',
    9: 'premium_renter',
    10: 'support_agent',
    11: 'finance_admin',
    12: 'content_manager'
  };
  
  // If role is required but user doesn't have it, redirect to appropriate page
  if (requiredRole) {
    // Check if user has the required role directly
    if (user.user_type === requiredRole) {
      return children;
    }
    
    // If user has roles array, check there as well
    if (user.roles && user.roles.length > 0) {
      const hasRequiredRole = user.roles.some(role => {
        const roleName = roleMap[role.role_id];
        return roleName === requiredRole;
      });
      
      if (hasRequiredRole) {
        return children;
      }
    }
    
    // Handle redirects based on user type
    if (user.user_type === 'admin' || user.user_type === 'super_admin') {
      return <Navigate to="/admin" replace />;
    } else if (user.user_type === 'owner' || user.user_type.includes('owner')) {
      return <Navigate to="/owner-dashboard" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }
  
  // If authenticated (and no specific role required), render the children
  return children;
};

export default ProtectedRoute;