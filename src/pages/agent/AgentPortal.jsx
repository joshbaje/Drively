import React, { useState, useContext, useEffect } from 'react';
import { Routes, Route, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './AgentPortal.css';

// Import Agent Portal Pages
import AgentDashboard from './AgentDashboard';
import CustomerManagement from './CustomerManagement';
import BookingManagement from './BookingManagement';
import NewBooking from './NewBooking';
import CarManagement from './CarManagement';
import CallLogs from './CallLogs';
import AgentSettings from './AgentSettings';
import AgentBookingBadge from '../../components/agent/AgentBookingBadge';
import NewBookingModal from '../../components/agent/NewBookingModal';
import FleetCalendarPage from './FleetCalendarPage';
import VehicleCalendarPage from './calendar/VehicleCalendarPage';

const AgentPortal = () => {
  const { user, logout } = useContext(AuthContext);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [agentStatus, setAgentStatus] = useState('online'); // online, busy, away
  // State for success message display
  const [successMessage, setSuccessMessage] = useState(null);
  const [showBookingBadge, setShowBookingBadge] = useState(false);
  const [currentBooking, setCurrentBooking] = useState({
    startDate: '3/10/2025',
    endDate: '3/25/2025',
    status: 'Confirmed'
  });
  const [showNewBookingModal, setShowNewBookingModal] = useState(false);
  const [selectedVehicleId, setSelectedVehicleId] = useState(null);
  
  // Function to open booking modal
  const openBookingModal = (vehicleId = null) => {
    setSelectedVehicleId(vehicleId);
    setShowNewBookingModal(true);
  };
  
  // Function to close booking modal
  const closeBookingModal = () => {
    setShowNewBookingModal(false);
    setSelectedVehicleId(null);
  };
  const navigate = useNavigate();
  const location = useLocation();

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const changeAgentStatus = (status) => {
    setAgentStatus(status);
    // Show booking badge when status changes
    setShowBookingBadge(true);
    
    // Hide booking badge after 5 seconds
    setTimeout(() => {
      setShowBookingBadge(false);
    }, 5000);
  };
  
  // Effect to show booking badge on page load
  // Effect to handle custom events from child components
  useEffect(() => {
    // Event listener for opening new booking modal from child components
    const handleOpenNewBookingModal = () => {
      openBookingModal();
    };
    
    // Event listener for opening new booking modal with a specific vehicle
    const handleOpenNewBookingWithVehicle = (event) => {
      const { vehicleId } = event.detail;
      console.log('Event received in AgentPortal, opening modal with vehicle ID:', vehicleId);
      openBookingModal(vehicleId);
    };
    
    // Event listener for booking created success message
    const handleBookingCreated = (event) => {
      const { message, bookingId } = event.detail;
      setSuccessMessage(message);
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
    };
    
    // Add event listeners
    window.addEventListener('openNewBookingModal', handleOpenNewBookingModal);
    window.addEventListener('openNewBookingWithVehicle', handleOpenNewBookingWithVehicle);
    window.addEventListener('bookingCreated', handleBookingCreated);
    
    // Clean up event listeners
    return () => {
      window.removeEventListener('openNewBookingModal', handleOpenNewBookingModal);
      window.removeEventListener('openNewBookingWithVehicle', handleOpenNewBookingWithVehicle);
      window.removeEventListener('bookingCreated', handleBookingCreated);
    };
  }, []);
  
  useEffect(() => {
    // Show booking badge initially
    setShowBookingBadge(true);
    
    // Hide booking badge after 5 seconds
    const timer = setTimeout(() => {
      setShowBookingBadge(false);
    }, 5000);
    
    return () => clearTimeout(timer);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Helper to check if the current route matches the nav item
  const isActive = (path) => {
    return location.pathname === `/agent${path}`;
  };

  // Get current page title based on route with role prefix
  const getPageTitle = () => {
    const rolePrefix = user?.user_type === 'content_moderator' ? 'Content Moderator | ' : 'Support Agent | ';
    const path = location.pathname;
    
    if (path === '/agent' || path === '/agent/dashboard') return `${rolePrefix}Dashboard`;
    if (path.includes('/customers')) return `${rolePrefix}Customer Management`;
    if (path.includes('/bookings') && !path.includes('/new')) return `${rolePrefix}Booking Management`;
    if (path.includes('/bookings/new')) return `${rolePrefix}New Booking`;
    if (path.includes('/calls')) return `${rolePrefix}Call Logs`;
    if (path.includes('/settings')) return `${rolePrefix}Settings`;
    
    return user?.user_type === 'content_moderator' ? 'Content Moderator Portal' : 'Support Agent Portal';
  };

  return (
    <div className="agent-portal">
      {/* Mobile menu button */}
      <button className="mobile-menu-btn" onClick={toggleSidebar}>
        <i className={`fas fa-${sidebarCollapsed ? 'bars' : 'times'}`}></i>
      </button>
      <aside className={`agent-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <h3>{user?.user_type === 'content_moderator' ? 'Content Portal' : 'Agent Portal'}</h3>
          <button className="sidebar-toggle" onClick={toggleSidebar}>
            <i className={`fas fa-${sidebarCollapsed ? 'chevron-right' : 'chevron-left'}`}></i>
          </button>
        </div>
        
        <div className="agent-logo">
          {!sidebarCollapsed && <img src={`${process.env.PUBLIC_URL}/logo.svg`} alt="Drivelyph Logo" />}
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
            <a href="#" onClick={() => openBookingModal()} className={location.pathname === '/agent/bookings/new' ? 'active' : ''}>
              <span className="menu-icon"><i className="fas fa-plus-circle"></i></span>
              <span className="menu-text">New Booking</span>
            </a>
          </li>
          <li>
            <NavLink to="/agent/cars" className={isActive('/cars') ? 'active' : ''}>
              <span className="menu-icon"><i className="fas fa-car"></i></span>
              <span className="menu-text">Car Management</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/agent/fleet-calendar" className={isActive('/fleet-calendar') ? 'active' : ''}>
              <span className="menu-icon"><i className="fas fa-calendar-alt"></i></span>
              <span className="menu-text">Fleet Calendar</span>
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
                className="agent-status-select"
              >
                <option value="online">Online</option>
                <option value="busy">Busy</option>
                <option value="away">Away</option>
              </select>
              {showBookingBadge && (
                <AgentBookingBadge 
                  startDate={currentBooking.startDate}
                  endDate={currentBooking.endDate}
                  status={currentBooking.status}
                />
              )}
            </div>
            <div className="agent-user">
              <img 
                src={user?.profile_image_url || "https://ui-avatars.com/api/?name=Agent&background=FB9EC6&color=fff"} 
                alt="Agent" 
                className="agent-avatar" 
              />
              <div className="agent-info">
                <div className="agent-name">{user?.first_name} {user?.last_name}</div>
                <div className="agent-role">{user?.user_type === 'content_moderator' ? 'Content Moderator' : 'Support Agent'}</div>
              </div>
            </div>
          </div>
        </div>
        
        {successMessage && (
          <div className="success-message">
            <i className="fas fa-check-circle"></i>
            <span>{successMessage}</span>
          </div>
        )}

        <Routes>
          <Route path="/" element={<AgentDashboard />} />
          <Route path="/dashboard" element={<AgentDashboard />} />
          <Route path="/customers" element={<CustomerManagement />} />
          <Route path="/customers/:id" element={<CustomerManagement showDetails={true} />} />
          <Route path="/bookings" element={<BookingManagement />} />
          <Route path="/bookings/:id" element={<BookingManagement showDetails={true} />} />
          <Route path="/cars" element={<CarManagement />} />
          <Route path="/cars/:id" element={<CarManagement showDetails={true} />} />
          <Route path="/cars/:vehicleId/calendar" element={<VehicleCalendarPage />} />
          <Route path="/fleet-calendar" element={<FleetCalendarPage />} />
          <Route path="/calls" element={<CallLogs />} />
          <Route path="/settings" element={<AgentSettings />} />
        </Routes>
        
        {/* New Booking Modal */}
        <NewBookingModal 
          isOpen={showNewBookingModal} 
          onClose={closeBookingModal} 
          selectedVehicleId={selectedVehicleId} 
        />
      </main>
    </div>
  );
};

export default AgentPortal;