import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalVehicles: 0,
    totalUsers: 0,
    totalRevenue: 0,
    pendingApprovals: 0,
    recentActivity: []
  });
  
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Fetch dashboard data from API
    // This is a placeholder - replace with actual API call
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Simulating API call with mock data
        // In a real implementation, you would fetch this from your backend
        setTimeout(() => {
          setStats({
            totalBookings: 243,
            totalVehicles: 128,
            totalUsers: 376,
            totalRevenue: 128750,
            pendingApprovals: 15,
            recentActivity: [
              {
                id: 1,
                type: 'booking',
                title: 'New booking created',
                user: 'John Doe',
                time: '10 minutes ago'
              },
              {
                id: 2,
                type: 'user',
                title: 'New user registered',
                user: 'Jane Smith',
                time: '25 minutes ago'
              },
              {
                id: 3,
                type: 'vehicle',
                title: 'Vehicle added',
                user: 'Mike Johnson',
                time: '1 hour ago'
              },
              {
                id: 4,
                type: 'payment',
                title: 'Payment processed',
                user: 'Alex Wilson',
                time: '2 hours ago'
              },
              {
                id: 5,
                type: 'approval',
                title: 'Vehicle approved',
                user: 'Admin',
                time: '3 hours ago'
              }
            ]
          });
          setLoading(false);
        }, 1000);
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);
  
  const getActivityIcon = (type) => {
    switch (type) {
      case 'booking':
        return <i className="fas fa-calendar-check"></i>;
      case 'user':
        return <i className="fas fa-user-plus"></i>;
      case 'vehicle':
        return <i className="fas fa-car"></i>;
      case 'payment':
        return <i className="fas fa-credit-card"></i>;
      case 'approval':
        return <i className="fas fa-check-circle"></i>;
      default:
        return <i className="fas fa-bell"></i>;
    }
  };
  
  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading dashboard data...</p>
      </div>
    );
  }
  
  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Welcome back, Admin! Here's what's happening with your platform today.</p>
      </div>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Bookings</h3>
          <div className="stat-value">{stats.totalBookings}</div>
          <div className="stat-change positive">
            <i className="fas fa-arrow-up"></i> 12% from last month
          </div>
        </div>
        
        <div className="stat-card">
          <h3>Total Vehicles</h3>
          <div className="stat-value">{stats.totalVehicles}</div>
          <div className="stat-change positive">
            <i className="fas fa-arrow-up"></i> 8% from last month
          </div>
        </div>
        
        <div className="stat-card">
          <h3>Total Users</h3>
          <div className="stat-value">{stats.totalUsers}</div>
          <div className="stat-change positive">
            <i className="fas fa-arrow-up"></i> 15% from last month
          </div>
        </div>
        
        <div className="stat-card">
          <h3>Total Revenue</h3>
          <div className="stat-value">₱{stats.totalRevenue.toLocaleString()}</div>
          <div className="stat-change positive">
            <i className="fas fa-arrow-up"></i> 10% from last month
          </div>
        </div>
      </div>
      
      <div className="admin-grid">
        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="action-buttons">
            <Link to="/admin/vehicles" className="action-button">
              <i className="fas fa-car"></i> All Vehicles
            </Link>
            <Link to="/admin/users" className="action-button">
              <i className="fas fa-users"></i> Manage Users
            </Link>
            <Link to="/admin/bookings" className="action-button">
              <i className="fas fa-calendar-alt"></i> Bookings
            </Link>
            <Link to="/admin/approvals" className="action-button">
              <i className="fas fa-check-circle"></i> Pending Approvals ({stats.pendingApprovals})
            </Link>
          </div>
        </div>
        
        <div className="recent-activity">
          <h2>Recent Activity</h2>
          <ul className="activity-list">
            {stats.recentActivity.map(activity => (
              <li key={activity.id} className="activity-item">
                <div className="activity-icon">{getActivityIcon(activity.type)}</div>
                <div className="activity-content">
                  <div className="activity-title">{activity.title}</div>
                  <div className="activity-meta">
                    <span className="activity-user">By {activity.user}</span>
                    <span className="activity-time">{activity.time}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      <div className="charts-row">
        <div className="chart-container">
          <h2>Booking Statistics</h2>
          <div className="chart-placeholder">
            Booking trend chart will be displayed here
          </div>
        </div>
        
        <div className="chart-container">
          <h2>Revenue Statistics</h2>
          <div className="chart-placeholder">
            Revenue trend chart will be displayed here
          </div>
        </div>
      </div>
      
      <div className="admin-footer">
        <div>© 2025 Drivelyph Admin Panel</div>
        <div>
          <a href="/help">Help</a> | <a href="/support">Support</a>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
