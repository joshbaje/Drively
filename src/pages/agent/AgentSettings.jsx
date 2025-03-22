import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import './AgentPortal.css';

const AgentSettings = () => {
  const { user } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState({
    notificationPreferences: {
      emailNotifications: true,
      desktopNotifications: true,
      callReminders: true,
      followUpReminders: true,
      bookingUpdates: true
    },
    displayPreferences: {
      darkMode: false,
      fontSize: 'medium',
      compactView: false,
      showCallDuration: true
    },
    defaultValues: {
      defaultCallOutcome: 'information_provided',
      defaultCallType: 'inquiry',
      defaultFollowUpDays: 3
    },
    quickResponses: [
      {
        id: 'qr1',
        title: 'Rental Terms',
        content: 'Thank you for your inquiry. Our standard rental terms include a security deposit of $200-$500 depending on the vehicle, and a minimum rental period of 24 hours. All rentals include basic insurance coverage, but we recommend considering our Premium package for complete peace of mind.'
      },
      {
        id: 'qr2',
        title: 'Booking Confirmation',
        content: 'Your booking has been confirmed. We look forward to seeing you on [DATE] at [TIME]. Please remember to bring your driver\'s license, the credit card used for booking, and a valid ID. If you have any questions before your pickup, feel free to contact us.'
      },
      {
        id: 'qr3',
        title: 'Cancellation Policy',
        content: 'Our cancellation policy allows for a full refund if cancelled 48 hours before the scheduled pickup time. Cancellations within 24-48 hours will receive a 50% refund, and cancellations within 24 hours are non-refundable.'
      }
    ]
  });
  const [editingResponse, setEditingResponse] = useState(null);
  const [showAddResponseModal, setShowAddResponseModal] = useState(false);
  const [newResponse, setNewResponse] = useState({
    title: '',
    content: ''
  });
  const [activeTab, setActiveTab] = useState('notifications');
  const [showSavedMessage, setShowSavedMessage] = useState(false);

  useEffect(() => {
    // In a real app, we would fetch the agent's settings from an API
    // For now, we'll simulate with a timeout
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  }, []);

  const handleSettingChange = (category, setting, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value
      }
    }));
  };

  const handleResponseChange = (id, field, value) => {
    setSettings(prev => ({
      ...prev,
      quickResponses: prev.quickResponses.map(response => 
        response.id === id ? { ...response, [field]: value } : response
      )
    }));
  };

  const handleDeleteResponse = (id) => {
    if (window.confirm('Are you sure you want to delete this quick response?')) {
      setSettings(prev => ({
        ...prev,
        quickResponses: prev.quickResponses.filter(response => response.id !== id)
      }));
    }
  };

  const handleEditResponse = (response) => {
    setEditingResponse(response);
  };

  const handleSaveResponseEdit = () => {
    if (!editingResponse.title || !editingResponse.content) {
      alert('Title and content are required');
      return;
    }
    
    setSettings(prev => ({
      ...prev,
      quickResponses: prev.quickResponses.map(response => 
        response.id === editingResponse.id ? editingResponse : response
      )
    }));
    
    setEditingResponse(null);
  };

  const handleNewResponseChange = (field, value) => {
    setNewResponse(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddNewResponse = () => {
    if (!newResponse.title || !newResponse.content) {
      alert('Title and content are required');
      return;
    }
    
    const newId = `qr${Date.now()}`;
    
    setSettings(prev => ({
      ...prev,
      quickResponses: [
        ...prev.quickResponses,
        {
          id: newId,
          title: newResponse.title,
          content: newResponse.content
        }
      ]
    }));
    
    setNewResponse({
      title: '',
      content: ''
    });
    
    setShowAddResponseModal(false);
  };

  const handleSaveSettings = () => {
    // In a real app, we would send settings to an API
    // For now, we'll just simulate with a timeout
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowSavedMessage(true);
      setTimeout(() => {
        setShowSavedMessage(false);
      }, 3000);
    }, 800);
  };

  const renderNotificationPreferences = () => {
    return (
      <div className="settings-section">
        <h3>Notification Preferences</h3>
        <div className="settings-form">
          <div className="setting-item">
            <div className="setting-label">Email Notifications</div>
            <div className="setting-control">
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={settings.notificationPreferences.emailNotifications}
                  onChange={(e) => handleSettingChange('notificationPreferences', 'emailNotifications', e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
          
          <div className="setting-item">
            <div className="setting-label">Desktop Notifications</div>
            <div className="setting-control">
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={settings.notificationPreferences.desktopNotifications}
                  onChange={(e) => handleSettingChange('notificationPreferences', 'desktopNotifications', e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
          
          <div className="setting-item">
            <div className="setting-label">Call Reminders</div>
            <div className="setting-control">
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={settings.notificationPreferences.callReminders}
                  onChange={(e) => handleSettingChange('notificationPreferences', 'callReminders', e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
          
          <div className="setting-item">
            <div className="setting-label">Follow-up Reminders</div>
            <div className="setting-control">
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={settings.notificationPreferences.followUpReminders}
                  onChange={(e) => handleSettingChange('notificationPreferences', 'followUpReminders', e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
          
          <div className="setting-item">
            <div className="setting-label">Booking Updates</div>
            <div className="setting-control">
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={settings.notificationPreferences.bookingUpdates}
                  onChange={(e) => handleSettingChange('notificationPreferences', 'bookingUpdates', e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderDisplayPreferences = () => {
    return (
      <div className="settings-section">
        <h3>Display Preferences</h3>
        <div className="settings-form">
          <div className="setting-item">
            <div className="setting-label">Dark Mode</div>
            <div className="setting-control">
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={settings.displayPreferences.darkMode}
                  onChange={(e) => handleSettingChange('displayPreferences', 'darkMode', e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
          
          <div className="setting-item">
            <div className="setting-label">Font Size</div>
            <div className="setting-control">
              <select
                value={settings.displayPreferences.fontSize}
                onChange={(e) => handleSettingChange('displayPreferences', 'fontSize', e.target.value)}
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </div>
          </div>
          
          <div className="setting-item">
            <div className="setting-label">Compact View</div>
            <div className="setting-control">
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={settings.displayPreferences.compactView}
                  onChange={(e) => handleSettingChange('displayPreferences', 'compactView', e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
          
          <div className="setting-item">
            <div className="setting-label">Show Call Duration</div>
            <div className="setting-control">
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={settings.displayPreferences.showCallDuration}
                  onChange={(e) => handleSettingChange('displayPreferences', 'showCallDuration', e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderDefaultValues = () => {
    return (
      <div className="settings-section">
        <h3>Default Values</h3>
        <div className="settings-form">
          <div className="setting-item">
            <div className="setting-label">Default Call Type</div>
            <div className="setting-control">
              <select
                value={settings.defaultValues.defaultCallType}
                onChange={(e) => handleSettingChange('defaultValues', 'defaultCallType', e.target.value)}
              >
                <option value="inquiry">Inquiry</option>
                <option value="support">Support</option>
                <option value="complaint">Complaint</option>
                <option value="cancellation">Cancellation</option>
                <option value="change_request">Change Request</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          
          <div className="setting-item">
            <div className="setting-label">Default Call Outcome</div>
            <div className="setting-control">
              <select
                value={settings.defaultValues.defaultCallOutcome}
                onChange={(e) => handleSettingChange('defaultValues', 'defaultCallOutcome', e.target.value)}
              >
                <option value="information_provided">Information Provided</option>
                <option value="booking_created">Booking Created</option>
                <option value="issue_resolved">Issue Resolved</option>
                <option value="booking_cancelled">Booking Cancelled</option>
                <option value="escalated">Escalated</option>
                <option value="follow_up_scheduled">Follow-up Scheduled</option>
              </select>
            </div>
          </div>
          
          <div className="setting-item">
            <div className="setting-label">Default Follow-up (Days)</div>
            <div className="setting-control">
              <input 
                type="number" 
                min="1" 
                max="14"
                value={settings.defaultValues.defaultFollowUpDays}
                onChange={(e) => handleSettingChange('defaultValues', 'defaultFollowUpDays', parseInt(e.target.value))}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderQuickResponses = () => {
    return (
      <div className="settings-section">
        <div className="section-header-with-action">
          <h3>Quick Responses</h3>
          <button 
            className="btn-secondary btn-sm"
            onClick={() => setShowAddResponseModal(true)}
          >
            <i className="fas fa-plus"></i> Add Response
          </button>
        </div>
        
        <div className="quick-responses-list">
          {settings.quickResponses.map(response => (
            <div key={response.id} className="quick-response-item">
              <div className="response-header">
                <h4>{response.title}</h4>
                <div className="response-actions">
                  <button 
                    className="btn-icon"
                    onClick={() => handleEditResponse(response)}
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                  <button 
                    className="btn-icon btn-danger"
                    onClick={() => handleDeleteResponse(response.id)}
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>
              <div className="response-content">
                {response.content}
              </div>
            </div>
          ))}
          
          {settings.quickResponses.length === 0 && (
            <div className="no-responses">
              <p>You don't have any quick responses yet.</p>
              <button 
                className="btn-secondary"
                onClick={() => setShowAddResponseModal(true)}
              >
                Create Your First Response
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderEditResponseModal = () => {
    if (!editingResponse) return null;
    
    return (
      <div className="modal-overlay">
        <div className="modal-container">
          <div className="modal-header">
            <h2>Edit Quick Response</h2>
            <button 
              className="modal-close" 
              onClick={() => setEditingResponse(null)}
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
          
          <div className="modal-body">
            <div className="form-group">
              <label>Title</label>
              <input 
                type="text" 
                value={editingResponse.title}
                onChange={(e) => setEditingResponse({...editingResponse, title: e.target.value})}
                placeholder="Enter a descriptive title"
              />
            </div>
            
            <div className="form-group">
              <label>Response Content</label>
              <textarea
                value={editingResponse.content}
                onChange={(e) => setEditingResponse({...editingResponse, content: e.target.value})}
                rows={6}
                placeholder="Enter the response template text"
              ></textarea>
              <div className="form-hint">
                Use placeholders like [DATE], [TIME], [CUSTOMER_NAME] that you can fill in later.
              </div>
            </div>
          </div>
          
          <div className="modal-footer">
            <button 
              className="btn-secondary" 
              onClick={() => setEditingResponse(null)}
            >
              Cancel
            </button>
            <button 
              className="btn-primary" 
              onClick={handleSaveResponseEdit}
            >
              Save Response
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderAddResponseModal = () => {
    if (!showAddResponseModal) return null;
    
    return (
      <div className="modal-overlay">
        <div className="modal-container">
          <div className="modal-header">
            <h2>Add Quick Response</h2>
            <button 
              className="modal-close" 
              onClick={() => setShowAddResponseModal(false)}
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
          
          <div className="modal-body">
            <div className="form-group">
              <label>Title</label>
              <input 
                type="text" 
                value={newResponse.title}
                onChange={(e) => handleNewResponseChange('title', e.target.value)}
                placeholder="Enter a descriptive title"
              />
            </div>
            
            <div className="form-group">
              <label>Response Content</label>
              <textarea
                value={newResponse.content}
                onChange={(e) => handleNewResponseChange('content', e.target.value)}
                rows={6}
                placeholder="Enter the response template text"
              ></textarea>
              <div className="form-hint">
                Use placeholders like [DATE], [TIME], [CUSTOMER_NAME] that you can fill in later.
              </div>
            </div>
          </div>
          
          <div className="modal-footer">
            <button 
              className="btn-secondary" 
              onClick={() => setShowAddResponseModal(false)}
            >
              Cancel
            </button>
            <button 
              className="btn-primary" 
              onClick={handleAddNewResponse}
            >
              Add Response
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="agent-settings">
      <div className="settings-header">
        <div className="agent-initials">
          {user?.first_name?.charAt(0) || ''}{user?.last_name?.charAt(0) || 'JM'}
        </div>
        <h2>Josh Macaraig</h2>
        <div className="agent-info-row">
          <div className="agent-info-label">Email:</div>
          <div>bajejosh@gmail.com</div>
        </div>
        <div className="agent-info-row">
          <div className="agent-info-label">Role:</div>
          <div>Customer Support Agent</div>
        </div>
      </div>

      <div className="tabs-container">
        <div className="tabs-header">
          <button 
            className={`tab-button ${activeTab === 'notifications' ? 'active' : ''}`}
            onClick={() => setActiveTab('notifications')}
          >
            <i className="fas fa-bell"></i> Notifications
          </button>
          <button 
            className={`tab-button ${activeTab === 'display' ? 'active' : ''}`}
            onClick={() => setActiveTab('display')}
          >
            <i className="fas fa-desktop"></i> Display
          </button>
          <button 
            className={`tab-button ${activeTab === 'defaults' ? 'active' : ''}`}
            onClick={() => setActiveTab('defaults')}
          >
            <i className="fas fa-sliders-h"></i> Defaults
          </button>
          <button 
            className={`tab-button ${activeTab === 'responses' ? 'active' : ''}`}
            onClick={() => setActiveTab('responses')}
          >
            <i className="fas fa-comment-dots"></i> Quick Responses
          </button>
        </div>

        <div className="tab-content">
          {isLoading ? (
            <div className="loading-indicator">Loading settings...</div>
          ) : activeTab === 'notifications' ? (
            <div className="notification-settings">
              <div className="settings-checkbox">
                <input type="checkbox" id="email-notifications" checked={settings.notificationPreferences.emailNotifications} 
                  onChange={(e) => handleSettingChange('notificationPreferences', 'emailNotifications', e.target.checked)} />
                <label htmlFor="email-notifications">Email Notifications</label>
              </div>
              <div className="settings-checkbox">
                <input type="checkbox" id="desktop-notifications" checked={settings.notificationPreferences.desktopNotifications} 
                  onChange={(e) => handleSettingChange('notificationPreferences', 'desktopNotifications', e.target.checked)} />
                <label htmlFor="desktop-notifications">Desktop Notifications</label>
              </div>
              <div className="settings-checkbox">
                <input type="checkbox" id="call-reminders" checked={settings.notificationPreferences.callReminders} 
                  onChange={(e) => handleSettingChange('notificationPreferences', 'callReminders', e.target.checked)} />
                <label htmlFor="call-reminders">Call Reminders</label>
              </div>
              <div className="settings-checkbox">
                <input type="checkbox" id="followup-reminders" checked={settings.notificationPreferences.followUpReminders} 
                  onChange={(e) => handleSettingChange('notificationPreferences', 'followUpReminders', e.target.checked)} />
                <label htmlFor="followup-reminders">Follow-up Reminders</label>
              </div>
              <div className="settings-checkbox">
                <input type="checkbox" id="booking-updates" checked={settings.notificationPreferences.bookingUpdates} 
                  onChange={(e) => handleSettingChange('notificationPreferences', 'bookingUpdates', e.target.checked)} />
                <label htmlFor="booking-updates">Booking Updates</label>
              </div>
            </div>
          ) : activeTab === 'display' ? (
            <div className="display-settings">
              <div className="settings-checkbox">
                <input type="checkbox" id="dark-mode" checked={settings.displayPreferences.darkMode} 
                  onChange={(e) => handleSettingChange('displayPreferences', 'darkMode', e.target.checked)} />
                <label htmlFor="dark-mode">Dark Mode</label>
              </div>
              <div className="settings-form-group">
                <label htmlFor="font-size">Font Size</label>
                <select id="font-size" value={settings.displayPreferences.fontSize}
                  onChange={(e) => handleSettingChange('displayPreferences', 'fontSize', e.target.value)}>
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
              </div>
              <div className="settings-checkbox">
                <input type="checkbox" id="compact-view" checked={settings.displayPreferences.compactView} 
                  onChange={(e) => handleSettingChange('displayPreferences', 'compactView', e.target.checked)} />
                <label htmlFor="compact-view">Compact View</label>
              </div>
              <div className="settings-checkbox">
                <input type="checkbox" id="show-duration" checked={settings.displayPreferences.showCallDuration} 
                  onChange={(e) => handleSettingChange('displayPreferences', 'showCallDuration', e.target.checked)} />
                <label htmlFor="show-duration">Show Call Duration</label>
              </div>
            </div>
          ) : (
            <div>
              <button className="settings-button btn-notifications">
                <i className="fas fa-bell"></i> Notifications
              </button>
              <button className="settings-button btn-display">
                <i className="fas fa-desktop"></i> Display
              </button>
              <button className="settings-button btn-defaults">
                <i className="fas fa-sliders-h"></i> Defaults
              </button>
              <button className="settings-button btn-quick-responses">
                <i className="fas fa-comment-dots"></i> Quick Responses
              </button>
            </div>
          )}
        </div>
      </div>

      <button className="save-settings-btn" onClick={handleSaveSettings}>
        Save Settings
      </button>

      {showSavedMessage && (
        <div className="save-confirmation">
          Settings saved successfully.
        </div>
      )}
    </div>
  );
};

export default AgentSettings;