import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './AgentPortal.css';

const AgentDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalBookings: 0,
    totalCalls: 0,
    totalCustomers: 0,
    totalRevenue: 0,
    recentActivity: [],
    upcomingBookings: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real application, this would be an API call
    fetchDashboardData();
  }, []);

  const fetchDashboardData = () => {
    // Simulate API call with mock data
    setTimeout(() => {
      const mockData = {
        totalBookings: 128,
        totalCalls: 237,
        totalCustomers: 93,
        totalRevenue: 28450.75,
        recentActivity: [
          {
            id: 'act1',
            type: 'booking',
            description: 'New booking created for John Smith - Toyota Camry (5 days)',
            time: '2025-03-20T15:30:00',
            agent: 'Maria Johnson'
          },
          {
            id: 'act2',
            type: 'call',
            description: 'Incoming call from Emily Brown regarding booking #BK12348',
            time: '2025-03-20T14:15:00',
            agent: 'You'
          },
          {
            id: 'act3',
            type: 'customer',
            description: 'New customer registration - Michael Wilson',
            time: '2025-03-20T12:45:00',
            agent: 'David Lee'
          },
          {
            id: 'act4',
            type: 'booking',
            description: 'Booking #BK12346 modified - Extended rental period by 2 days',
            time: '2025-03-20T11:20:00',
            agent: 'You'
          },
          {
            id: 'act5',
            type: 'call',
            description: 'Outgoing call to Robert Johnson regarding vehicle pickup',
            time: '2025-03-20T10:05:00',
            agent: 'You'
          }
        ],
        upcomingBookings: [
          {
            id: 'bk12345',
            customer: 'John Smith',
            vehicle: '2022 Toyota Camry',
            startDate: '2025-04-01',
            endDate: '2025-04-05',
            status: 'confirmed'
          },
          {
            id: 'bk12346',
            customer: 'Jane Smith',
            vehicle: '2023 Honda Civic',
            startDate: '2025-04-10',
            endDate: '2025-04-15',
            status: 'pending'
          },
          {
            id: 'bk12349',
            customer: 'Michael Wilson',
            vehicle: '2023 Honda Civic',
            startDate: '2025-04-20',
            endDate: '2025-04-25',
            status: 'pending'
          }
        ]
      };
      
      setDashboardData(mockData);
      setIsLoading(false);
    }, 1000);
  };

  // Format currency
  const formatCurrency = (amount) => {
    return `$${parseFloat(amount).toFixed(2)}`;
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Format time for activity
  const formatActivityTime = (timeString) => {
    const time = new Date(timeString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - time) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} min ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)} hr ago`;
    } else {
      return formatDate(timeString);
    }
  };

  if (isLoading) {
    return <div>Loading dashboard data...</div>;
  }

  return (
    <div className="agent-dashboard">
      {/* Dashboard Stats */}
      <div className="dashboard-cards">
        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <h3 className="dashboard-card-title">Total Bookings</h3>
            <div className="dashboard-card-icon bookings">
              <i className="fas fa-calendar-check"></i>
            </div>
          </div>
          <div className="dashboard-card-value">{dashboardData.totalBookings}</div>
          <div className="dashboard-card-change positive">
            <i className="fas fa-arrow-up"></i> 8% from last month
          </div>
        </div>
        
        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <h3 className="dashboard-card-title">Total Calls</h3>
            <div className="dashboard-card-icon calls">
              <i className="fas fa-phone-alt"></i>
            </div>
          </div>
          <div className="dashboard-card-value">{dashboardData.totalCalls}</div>
          <div className="dashboard-card-change positive">
            <i className="fas fa-arrow-up"></i> 12% from last month
          </div>
        </div>
        
        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <h3 className="dashboard-card-title">Total Customers</h3>
            <div className="dashboard-card-icon customers">
              <i className="fas fa-users"></i>
            </div>
          </div>
          <div className="dashboard-card-value">{dashboardData.totalCustomers}</div>
          <div className="dashboard-card-change positive">
            <i className="fas fa-arrow-up"></i> 5% from last month
          </div>
        </div>
        
        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <h3 className="dashboard-card-title">Total Revenue</h3>
            <div className="dashboard-card-icon revenue">
              <i className="fas fa-dollar-sign"></i>
            </div>
          </div>
          <div className="dashboard-card-value">{formatCurrency(dashboardData.totalRevenue)}</div>
          <div className="dashboard-card-change positive">
            <i className="fas fa-arrow-up"></i> 15% from last month
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <Link to="/agent/bookings/new" className="quick-action-btn">
          <span className="quick-action-icon"><i className="fas fa-plus-circle"></i></span>
          <span className="quick-action-text">New Booking</span>
        </Link>
        <Link to="/agent/customers" className="quick-action-btn">
          <span className="quick-action-icon"><i className="fas fa-user-plus"></i></span>
          <span className="quick-action-text">Add Customer</span>
        </Link>
        <Link to="/agent/calls" className="quick-action-btn">
          <span className="quick-action-icon"><i className="fas fa-phone-alt"></i></span>
          <span className="quick-action-text">Log Call</span>
        </Link>
        <Link to="/agent/bookings" className="quick-action-btn">
          <span className="quick-action-icon"><i className="fas fa-search"></i></span>
          <span className="quick-action-text">Find Booking</span>
        </Link>
      </div>

      {/* Global Search */}
      <div className="search-container">
        <div className="global-search">
          <i className="fas fa-search"></i>
          <input 
            type="text" 
            placeholder="Search customers, bookings, vehicles..." 
          />
        </div>
        <button className="advanced-search-btn">
          <i className="fas fa-sliders-h"></i>
          <span>Filters</span>
        </button>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-row">
          {/* Recent Activity */}
          <div className="recent-activity">
            <div className="section-header">
              <h3 className="section-title">Recent Activity</h3>
              <Link to="/agent/activity" className="section-action">View All</Link>
            </div>
            
            <div className="activity-list">
              {dashboardData.recentActivity.map(activity => (
                <div key={activity.id} className="activity-item">
                  <div className={`activity-icon ${activity.type}`}>
                    <i className={`fas fa-${
                      activity.type === 'booking' ? 'calendar-check' : 
                      activity.type === 'call' ? 'phone-alt' : 'user-plus'
                    }`}></i>
                  </div>
                  <div className="activity-content">
                    <div className="activity-text">{activity.description}</div>
                    <div className="activity-meta">
                      <div className="activity-time">
                        <i className="far fa-clock"></i> {formatActivityTime(activity.time)}
                      </div>
                      <div className="activity-agent">{activity.agent}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Upcoming Bookings */}
        <div className="recent-activity">
          <div className="section-header">
            <h3 className="section-title">Upcoming Bookings</h3>
            <Link to="/agent/bookings" className="section-action">View All</Link>
          </div>
          
          <table className="data-table">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Customer</th>
                <th>Vehicle</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {dashboardData.upcomingBookings.map(booking => (
                <tr key={booking.id}>
                  <td>{booking.id}</td>
                  <td>{booking.customer}</td>
                  <td>{booking.vehicle}</td>
                  <td>{formatDate(booking.startDate)}</td>
                  <td>{formatDate(booking.endDate)}</td>
                  <td>
                    <span className={`table-status ${booking.status === 'confirmed' ? 'active' : 'pending'}`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </td>
                  <td>
                    <div className="table-actions">
                      <Link to={`/agent/bookings/${booking.id}`} className="table-action-btn">
                        <i className="fas fa-eye"></i>
                      </Link>
                      <Link to={`/agent/bookings/${booking.id}/edit`} className="table-action-btn">
                        <i className="fas fa-edit"></i>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AgentDashboard;