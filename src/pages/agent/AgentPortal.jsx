import React, { useState, useContext } from 'react';
import { Routes, Route, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './AgentPortal.css';

// Import Agent Portal Pages
import AgentDashboard from './AgentDashboard';
import CustomerManagement from './CustomerManagement';
import BookingManagement from './BookingManagement';
import NewBooking from './NewBooking';
import CallLogs from './CallLogs';
import AgentSettings from './AgentSettings';

const AgentPortal = () => {
  const { user, logout } = useContext(AuthContext);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [agentStatus, setAgentStatus] = useState('online'); // online, busy, away
  const navigate = useNavigate();
  const location = useLocation();

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const changeAgentStatus = (status) => {
    setAgentStatus(status);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Helper to check if the current route matches the nav item
  const isActive = (path) => {
    return location.pathname === `/agent${path}`;
  };

  // Get current page title based on route
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/agent' || path === '/agent/dashboard') return 'Dashboard';
    if (path.includes('/customers')) return 'Customer Management';
    if (path.includes('/bookings') && !path.includes('/new')) return 'Booking Management';
    if (path.includes('/bookings/new')) return 'New Booking';
    if (path.includes('/calls')) return 'Call Logs';
    if (path.includes('/settings')) return 'Agent Settings';
    return 'Agent Portal';
  };

  return (
    <div className="agent-portal">
      <aside className={`agent-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <h3>Agent Portal</h3>
          <button className="sidebar-toggle" onClick={toggleSidebar}>
            <i className={`fas fa-${sidebarCollapsed ? 'chevron-right' : 'chevron-left'}`}></i>
          </button>
        </div>
        
        <div className="agent-logo">
          {!sidebarCollapsed && <img src="/assets/images/logo.png" alt="Drivelyph Logo" />}
        </div>
        
        <ul className="sidebar-menu">
          <li>
            <NavLink to="/agent/dashboard" className={isActive('/dashboard') ? 'active' : ''}>
              <span className="menu-icon"><i className="fas fa-tachometer-alt"></i></span>
              <span className="menu-text">Dashboard</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/agent/customers" className={isActive('/customers') ? 'active' : ''}>
              <span className="menu-icon"><i className="fas fa-users"></i></span>
              <span className="menu-text">Customers</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/agent/bookings" className={isActive('/bookings') ? 'active' : ''}>
              <span className="menu-icon"><i className="fas fa-calendar-check"></i></span>
              <span className="menu-text">Bookings</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/agent/bookings/new" className={isActive('/bookings/new') ? 'active' : ''}>
              <span className="menu-icon"><i className="fas fa-plus-circle"></i></span>
              <span className="menu-text">New Booking</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/agent/calls" className={isActive('/calls') ? 'active' : ''}>
              <span className="menu-icon"><i className="fas fa-phone-alt"></i></span>
              <span className="menu-text">Call Logs</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/agent/settings" className={isActive('/settings') ? 'active' : ''}>
              <span className="menu-icon"><i className="fas fa-cog"></i></span>
              <span className="menu-text">Settings</span>
            </NavLink>
          </li>
          <li>
            <a href="#" onClick={handleLogout}>
              <span className="menu-icon"><i className="fas fa-sign-out-alt"></i></span>
              <span className="menu-text">Logout</span>
            </a>
          </li>
        </ul>
      </aside>

      <main className={`agent-content ${sidebarCollapsed ? 'expanded' : ''}`}>
        <div className="agent-header">
          <div className="page-title">
            <h1>{getPageTitle()}</h1>
          </div>
          <div className="header-actions">
            <div className="agent-status">
              <div className={`status-indicator status-${agentStatus}`}></div>
              <select 
                value={agentStatus} 
                onChange={(e) => changeAgentStatus(e.target.value)}
                style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
              >
                <option value="online">Online</option>
                <option value="busy">Busy</option>
                <option value="away">Away</option>
              </select>
            </div>
            <div className="agent-user">
              <img 
                src={user?.profile_image_url || "/assets/images/default-avatar.png"} 
                alt="Agent" 
                className="agent-avatar" 
              />
              <div className="agent-info">
                <div className="agent-name">{user?.first_name} {user?.last_name}</div>
                <div className="agent-role">Agent</div>
              </div>
            </div>
          </div>
        </div>

        <Routes>
          <Route path="/" element={<AgentDashboard />} />
          <Route path="/dashboard" element={<AgentDashboard />} />
          <Route path="/customers" element={<CustomerManagement />} />
          <Route path="/customers/:id" element={<CustomerManagement showDetails={true} />} />
          <Route path="/bookings" element={<BookingManagement />} />
          <Route path="/bookings/:id" element={<BookingManagement showDetails={true} />} />
          <Route path="/bookings/new" element={<NewBooking />} />
          <Route path="/calls" element={<CallLogs />} />
          <Route path="/settings" element={<AgentSettings />} />
        </Routes>
      </main>
    </div>
  );
};

export default AgentPortal;