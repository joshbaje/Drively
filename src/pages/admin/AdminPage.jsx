import React, { useState, useEffect } from 'react';
import { Link, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './AdminPage.css';

// Admin Routes
import AdminRoutes from '../../components/admin/AdminRoutes';

const AdminPage = () => {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Use useEffect to determine active tab from URL path
  // This is placed before any conditional returns to follow React Hooks rules
  useEffect(() => {
    const path = location.pathname;
    if (path.includes('/admin/users')) {
      setActiveTab('users');
    } else if (path.includes('/admin/vehicles')) {
      setActiveTab('vehicles');
    } else if (path.includes('/admin/bookings')) {
      setActiveTab('bookings');
    } else {
      setActiveTab('dashboard');
    }
  }, [location.pathname]);
  
  // If not authenticated or not an admin, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }
  
  // We no longer need the renderContent function since we're using AdminRoutes
  
  return (
    <div className="admin-page">
      <div className="admin-sidebar">
        <div className="sidebar-header">
          <h1>
            <i className="fas fa-car-side"></i> Drivelyph
          </h1>
          <h2>Admin Panel</h2>
        </div>
        
        <nav className="sidebar-nav">
          <Link 
            to="/admin" 
            className={`nav-link ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <i className="fas fa-tachometer-alt"></i> Dashboard
          </Link>
          
          <Link 
            to="/admin/users" 
            className={`nav-link ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <i className="fas fa-users"></i> Users
          </Link>
          
          <Link 
            to="/admin/vehicles" 
            className={`nav-link ${activeTab === 'vehicles' ? 'active' : ''}`}
            onClick={() => setActiveTab('vehicles')}
          >
            <i className="fas fa-car"></i> Vehicles
          </Link>
          
          <Link 
            to="/admin/bookings" 
            className={`nav-link ${activeTab === 'bookings' ? 'active' : ''}`}
            onClick={() => setActiveTab('bookings')}
          >
            <i className="fas fa-calendar-alt"></i> Bookings
          </Link>
          
          <div className="nav-section">
            <h3>Advanced</h3>
            <Link 
              to="/admin/settings" 
              className={`nav-link ${activeTab === 'settings' ? 'active' : ''}`}
            >
              <i className="fas fa-cog"></i> Settings
            </Link>
            <Link 
              to="/admin/reports" 
              className={`nav-link ${activeTab === 'reports' ? 'active' : ''}`}
            >
              <i className="fas fa-chart-bar"></i> Reports
            </Link>
          </div>
        </nav>
        
        <div className="sidebar-footer">
          <div className="admin-profile">
            <div className="profile-image">
              {user?.profile_image_url ? (
                <img src={user.profile_image_url} alt={`${user.first_name} ${user.last_name}`} />
              ) : (
                <div className="profile-initials">
                  {`${user?.first_name?.charAt(0) || ''}${user?.last_name?.charAt(0) || ''}`}
                </div>
              )}
            </div>
            <div className="profile-info">
              <div className="profile-name">{user?.first_name} {user?.last_name}</div>
              <div className="profile-role">Administrator</div>
            </div>
          </div>
          
          <Link to="/" className="back-to-site">
            <i className="fas fa-external-link-alt"></i> Back to Site
          </Link>
        </div>
      </div>
      
      <div className="admin-content">
        <div className="content-header">
          <div className="header-search">
            <input 
              type="text" 
              placeholder="Search..." 
              className="search-input"
            />
            <button className="search-button">
              <i className="fas fa-search"></i>
            </button>
          </div>
          
          <div className="header-actions">
            <div className="notifications">
              <button className="icon-button">
                <i className="fas fa-bell"></i>
                <span className="notification-badge">3</span>
              </button>
            </div>
            
            <div className="user-menu">
              <button className="icon-button">
                <i className="fas fa-user-circle"></i>
              </button>
            </div>
          </div>
        </div>
        
        <div className="content-body">
          <AdminRoutes />
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
