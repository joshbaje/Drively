import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './NotificationCenter.css';

const NotificationCenter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch notifications from API in a real app
    // Mock data for now
    const mockNotifications = [
      {
        id: 1,
        type: 'booking',
        title: 'Booking Confirmed',
        message: 'Your booking for Toyota Camry has been confirmed. Pickup on April 1, 2025.',
        time: '2025-03-20T10:30:00',
        isRead: false,
        relatedId: 'bk12345'
      },
      {
        id: 2,
        type: 'payment',
        title: 'Payment Successful',
        message: 'Your payment of $402.89 for booking #BK12345 was successful.',
        time: '2025-03-20T10:28:00',
        isRead: false,
        relatedId: 'pay67890'
      },
      {
        id: 3,
        type: 'system',
        title: 'Verify Your Email',
        message: 'Please verify your email address to fully activate your account.',
        time: '2025-03-19T14:15:00',
        isRead: true,
        relatedId: null
      },
      {
        id: 4,
        type: 'booking',
        title: 'Upcoming Rental',
        message: 'Your rental of Honda Civic starts tomorrow. Don\'t forget your ID and driver\'s license!',
        time: '2025-03-18T09:45:00',
        isRead: true,
        relatedId: 'bk45678'
      },
      {
        id: 5,
        type: 'system',
        title: 'New Feature Available',
        message: 'You can now compare multiple vehicles side by side before making a booking.',
        time: '2025-03-17T16:22:00',
        isRead: true,
        relatedId: null
      }
    ];

    setNotifications(mockNotifications);
    
    // Calculate unread count
    const unread = mockNotifications.filter(notification => !notification.isRead).length;
    setUnreadCount(unread);

    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Format the time to display
  const formatTime = (timeString) => {
    const now = new Date();
    const time = new Date(timeString);
    const diffInHours = Math.floor((now - time) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now - time) / (1000 * 60));
      return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return time.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  // Get filtered notifications based on the active tab
  const getFilteredNotifications = () => {
    if (activeTab === 'all') {
      return notifications;
    } else {
      return notifications.filter(notification => notification.type === activeTab);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(notification => ({
      ...notification,
      isRead: true
    }));
    setNotifications(updatedNotifications);
    setUnreadCount(0);
  };

  // Mark a specific notification as read and navigate if needed
  const handleNotificationClick = (notification) => {
    // Mark as read
    if (!notification.isRead) {
      const updatedNotifications = notifications.map(n => 
        n.id === notification.id ? { ...n, isRead: true } : n
      );
      setNotifications(updatedNotifications);
      setUnreadCount(prev => prev - 1);
    }

    // Navigate based on notification type
    if (notification.type === 'booking' && notification.relatedId) {
      navigate(`/bookings/${notification.relatedId}`);
    } else if (notification.type === 'payment' && notification.relatedId) {
      navigate(`/payment/history/${notification.relatedId}`);
    }

    setIsOpen(false);
  };

  // Delete all notifications
  const clearAllNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  // Get icon based on notification type
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'booking':
        return <i className="fas fa-calendar-check"></i>;
      case 'payment':
        return <i className="fas fa-credit-card"></i>;
      case 'system':
        return <i className="fas fa-bell"></i>;
      default:
        return <i className="fas fa-bell"></i>;
    }
  };

  return (
    <div className="notification-center" ref={dropdownRef}>
      <div className="notification-icon" onClick={() => setIsOpen(!isOpen)}>
        <i className="fas fa-bell"></i>
        {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
      </div>

      {isOpen && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <h3>Notifications</h3>
            <div className="notification-actions">
              {unreadCount > 0 && (
                <button className="action-button" onClick={markAllAsRead}>Mark all as read</button>
              )}
              {notifications.length > 0 && (
                <button className="action-button" onClick={clearAllNotifications}>Clear all</button>
              )}
            </div>
          </div>

          <div className="notification-tabs">
            <div 
              className={`notification-tab ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              All
            </div>
            <div 
              className={`notification-tab ${activeTab === 'booking' ? 'active' : ''}`}
              onClick={() => setActiveTab('booking')}
            >
              Bookings
            </div>
            <div 
              className={`notification-tab ${activeTab === 'payment' ? 'active' : ''}`}
              onClick={() => setActiveTab('payment')}
            >
              Payments
            </div>
            <div 
              className={`notification-tab ${activeTab === 'system' ? 'active' : ''}`}
              onClick={() => setActiveTab('system')}
            >
              System
            </div>
          </div>

          <div className="notification-list">
            {getFilteredNotifications().length === 0 ? (
              <div className="notification-empty">
                <i className="fas fa-bell-slash"></i>
                <p>No notifications yet</p>
              </div>
            ) : (
              getFilteredNotifications().map(notification => (
                <div 
                  key={notification.id} 
                  className={`notification-item ${!notification.isRead ? 'unread' : ''}`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className={`notification-icon-wrapper ${notification.type}`}>
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="notification-content">
                    <div className="notification-title">{notification.title}</div>
                    <div className="notification-message">{notification.message}</div>
                    <div className="notification-time">{formatTime(notification.time)}</div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="notification-footer">
            <button 
              className="view-all-button"
              onClick={() => {
                navigate('/notifications');
                setIsOpen(false);
              }}
            >
              View All Notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;