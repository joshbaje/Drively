import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user, loading, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalVehicles: 0,
    activeBookings: 0,
    pendingVerifications: 0,
    totalRevenue: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Redirect if user is not admin
    if (!loading && user && !isAdmin) {
      navigate('/');
    }

    // Fetch dashboard data
    fetchDashboardData();
  }, [loading, user, isAdmin, navigate]);

  const fetchDashboardData = async () => {
    // In a real app, this would be an API call
    // For now, we'll use mock data
    setTimeout(() => {
      // Mock statistics
      setStats({
        totalUsers: 324,
        totalVehicles: 187,
        activeBookings: 42,
        pendingVerifications: 15,
        totalRevenue: 276500
      });

      // Mock recent activity
      setRecentActivity([
        {
          id: 1,
          type: 'new_user',
          user: 'Mark Johnson',
          timestamp: '2025-03-19T14:32:00',
          details: 'Registered as a new renter'
        },
        {
          id: 2,
          type: 'new_vehicle',
          user: 'Sarah Williams',
          timestamp: '2025-03-19T13:15:00',
          details: 'Listed a new Honda Civic 2023'
        },
        {
          id: 3,
          type: 'new_booking',
          user: 'David Lee',
          timestamp: '2025-03-19T12:45:00',
          details: 'Booked Toyota Fortuner for Mar 25-30'
        },
        {
          id: 4,
          type: 'verification_request',
          user: 'Lisa Garcia',
          timestamp: '2025-03-19T10:20:00',
          details: 'Submitted identity verification documents'
        },
        {
          id: 5,
          type: 'payment',
          user: 'John Smith',
          timestamp: '2025-03-19T09:05:00',
          details: 'Payment received for booking #12345'
        }
      ]);

      setIsLoading(false);
    }, 1000);
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'new_user':
        return 'fas fa-user-plus';
      case 'new_vehicle':
        return 'fas fa-car';
      case 'new_booking':
        return 'fas fa-calendar-check';
      case 'verification_request':
        return 'fas fa-id-card';
      case 'payment':
        return 'fas fa-money-bill-wave';
      default:
        return 'fas fa-bell';
    }
  };

  if (loading || isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-container">
        <div className="admin-header">
          <h1 className="admin-title">Admin Dashboard</h1>
          <div className="admin-welcome">
            <p>Welcome back, {user?.first_name}!</p>
            <p className="admin-date">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon users">
              <i className="fas fa-users"></i>
            </div>
            <div className="stat-content">
              <h3 className="stat-title">Total Users</h3>
              <p className="stat-value">{stats.totalUsers}</p>
              <Link to="/admin/users" className="stat-link">View Details</Link>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon vehicles">
              <i className="fas fa-car"></i>
            </div>
            <div className="stat-content">
              <h3 className="stat-title">Total Vehicles</h3>
              <p className="stat-value">{stats.totalVehicles}</p>
              <Link to="/admin/vehicles" className="stat-link">View Details</Link>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon bookings">
              <i className="fas fa-calendar-check"></i>
            </div>
            <div className="stat-content">
              <h3 className="stat-title">Active Bookings</h3>
              <p className="stat-value">{stats.activeBookings}</p>
              <Link to="/admin/bookings" className="stat-link">View Details</Link>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon verifications">
              <i className="fas fa-id-card"></i>
            </div>
            <div className="stat-content">
              <h3 className="stat-title">Pending Verifications</h3>
              <p className="stat-value">{stats.pendingVerifications}</p>
              <Link to="/admin/verifications" className="stat-link">View Details</Link>
            </div>
          </div>

          <div className="stat-card wide revenue">
            <div className="stat-icon">
              <i className="fas fa-money-bill-wave"></i>
            </div>
            <div className="stat-content">
              <h3 className="stat-title">Total Revenue</h3>
              <p className="stat-value">₱{stats.totalRevenue.toLocaleString()}</p>
              <Link to="/admin/finance" className="stat-link">View Details</Link>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <h2 className="section-title">Quick Actions</h2>
          <div className="actions-grid">
            <Link to="/admin/users/create" className="action-card">
              <div className="action-icon">
                <i className="fas fa-user-plus"></i>
              </div>
              <span className="action-label">Add User</span>
            </Link>
            
            <Link to="/admin/vehicles/review" className="action-card">
              <div className="action-icon">
                <i className="fas fa-clipboard-check"></i>
              </div>
              <span className="action-label">Review Listings</span>
            </Link>
            
            <Link to="/admin/verifications" className="action-card">
              <div className="action-icon">
                <i className="fas fa-id-card"></i>
              </div>
              <span className="action-label">Verify Users</span>
            </Link>
            
            <Link to="/admin/reports" className="action-card">
              <div className="action-icon">
                <i className="fas fa-chart-bar"></i>
              </div>
              <span className="action-label">Generate Reports</span>
            </Link>
            
            <Link to="/admin/support" className="action-card">
              <div className="action-icon">
                <i className="fas fa-headset"></i>
              </div>
              <span className="action-label">Support Tickets</span>
            </Link>
            
            <Link to="/admin/settings" className="action-card">
              <div className="action-icon">
                <i className="fas fa-cog"></i>
              </div>
              <span className="action-label">Settings</span>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="recent-activity">
          <h2 className="section-title">Recent Activity</h2>
          <div className="activity-list">
            {recentActivity.map(activity => (
              <div key={activity.id} className="activity-item">
                <div className={`activity-icon ${activity.type}`}>
                  <i className={getActivityIcon(activity.type)}></i>
                </div>
                <div className="activity-content">
                  <h4 className="activity-title">
                    {activity.user} <span className="activity-type">{activity.details}</span>
                  </h4>
                  <p className="activity-time">{formatTimestamp(activity.timestamp)}</p>
                </div>
                <div className="activity-actions">
                  <button className="action-button">
                    <i className="fas fa-eye"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="view-all-activity">
            <Link to="/admin/activity" className="view-all-link">View All Activity</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;