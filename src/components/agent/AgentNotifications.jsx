import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

const AgentNotifications = ({ notifications = [], onMarkAsRead, onViewAll }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Format relative time (e.g., "2 hours ago")
  const formatRelativeTime = (timestamp) => {
    const now = new Date();
    const date = new Date(timestamp);
    const diffSeconds = Math.floor((now - date) / 1000);
    
    if (diffSeconds < 60) return 'Just now';
    if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)} min ago`;
    if (diffSeconds < 86400) return `${Math.floor(diffSeconds / 3600)} hr ago`;
    if (diffSeconds < 604800) return `${Math.floor(diffSeconds / 86400)} day ago`;
    
    return date.toLocaleDateString();
  };
  
  // Get the icon based on notification type
  const getNotificationIcon = (type) => {
    const iconMap = {
      'booking_request': 'calendar-plus',
      'booking_confirmed': 'calendar-check',
      'booking_cancelled': 'calendar-times',
      'payment': 'money-check-alt',
      'message': 'comment',
      'reminder': 'bell',
      'system': 'info-circle'
    };
    
    return iconMap[type] || 'bell';
  };
  
  // Handle notification click
  const handleNotificationClick = (notification) => {
    // Mark notification as read
    if (!notification.is_read && onMarkAsRead) {
      onMarkAsRead(notification.notification_id);
    }
    
    // Navigate based on notification type and related entity
    switch (notification.type) {
      case 'booking_request':
      case 'booking_confirmed':
      case 'booking_cancelled':
        if (notification.related_id) {
          navigate(`/agent/bookings/${notification.related_id}`);
        } else {
          navigate('/agent/bookings');
        }
        break;
        
      case 'message':
        navigate('/agent/messages');
        break;
        
      case 'payment':
        if (notification.related_id) {
          navigate(`/agent/bookings/${notification.related_id}`);
        }
        break;
        
      default:
        // No navigation for other types
        break;
    }
    
    // Close dropdown
    setShowDropdown(false);
  };
  
  // Get the number of unread notifications
  const unreadCount = notifications.filter(n => !n.is_read).length;
  
  return (
    <div className="agent-notifications" ref={dropdownRef}>
      <button 
        className="notifications-toggle"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <i className="fas fa-bell"></i>
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount}</span>
        )}
      </button>
      
      {showDropdown && (
        <div className="notifications-dropdown">
          <div className="notifications-header">
            <h3>Notifications</h3>
            {unreadCount > 0 && (
              <span className="unread-count">{unreadCount} new</span>
            )}
          </div>
          
          <div className="notifications-list">
            {notifications.length > 0 ? (
              notifications.slice(0, 5).map((notification) => (
                <div 
                  key={notification.notification_id}
                  className={`notification-item ${!notification.is_read ? 'unread' : ''}`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className={`notification-icon ${notification.type}`}>
                    <i className={`fas fa-${getNotificationIcon(notification.type)}`}></i>
                  </div>
                  <div className="notification-content">
                    <div className="notification-title">{notification.title}</div>
                    <div className="notification-message">{notification.body}</div>
                    <div className="notification-time">{formatRelativeTime(notification.created_at)}</div>
                  </div>
                  {!notification.is_read && <div className="unread-indicator"></div>}
                </div>
              ))
            ) : (
              <div className="no-notifications">
                <i className="fas fa-check-circle"></i>
                <p>No new notifications</p>
              </div>
            )}
          </div>
          
          {notifications.length > 5 && (
            <div className="notifications-footer">
              <button 
                className="view-all-btn"
                onClick={() => {
                  onViewAll && onViewAll();
                  setShowDropdown(false);
                }}
              >
                View all notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

AgentNotifications.propTypes = {
  notifications: PropTypes.arrayOf(
    PropTypes.shape({
      notification_id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      body: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      is_read: PropTypes.bool.isRequired,
      created_at: PropTypes.string.isRequired,
      related_id: PropTypes.string
    })
  ),
  onMarkAsRead: PropTypes.func,
  onViewAll: PropTypes.func
};

export default AgentNotifications;