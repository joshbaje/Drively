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
    3: 'admin',
    4: 'support',
    5: 'guest',
    6: 'verified_renter',
    7: 'verified_owner',
    8: 'fleet_manager',
    9: 'finance_admin',
    10: 'content_moderator',
    11: 'system_admin',
    12: 'super_admin'
  };
  
  // If role is required but user doesn't have it, redirect to appropriate page
  if (requiredRole) {
    // Check if requiredRole is an array
    const requiredRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    
    // Check if user has any of the required roles directly
    if (requiredRoles.includes(user.user_type)) {
      return children;
    }
    
    // If user has roles array, check there as well
    if (user.roles && user.roles.length > 0) {
      const hasRequiredRole = user.roles.some(role => {
        const roleName = roleMap[role.role_id];
        return requiredRoles.includes(roleName);
      });
      
      if (hasRequiredRole) {
        return children;
      }
    }
    
    // Handle redirects based on user type
    if (user.user_type === 'admin' || user.user_type === 'super_admin' || user.user_type === 'system_admin') {
      return <Navigate to="/admin" replace />;
    } else if (user.user_type === 'verified_owner' || user.user_type === 'fleet_manager' || user.user_type.includes('owner')) {
      return <Navigate to="/owner/dashboard" replace />;
    } else if (user.user_type === 'support' || user.user_type === 'content_moderator') {
      return <Navigate to="/agent/dashboard" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }
  
  // If authenticated (and no specific role required), render the children
  return children;
};

export default ProtectedRoute;