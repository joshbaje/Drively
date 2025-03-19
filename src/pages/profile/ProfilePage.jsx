import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './ProfilePage.css';

const ProfilePage = () => {
  const { user } = useAuth();
  const location = useLocation();
  
  const [activeTab, setActiveTab] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);
  
  // Simple form data for demo
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    date_of_birth: '',
    address: '',
    city: '',
    bio: ''
  });
  
  // Check for active tab in URL
  useEffect(() => {
    const hash = location.hash.replace('#', '');
    if (hash && ['personal', 'security', 'payment', 'notifications'].includes(hash)) {
      setActiveTab(hash);
    }
  }, [location]);
  
  // Populate form with user data if available
  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        phone_number: user.phone_number || '',
        date_of_birth: user.date_of_birth || '',
        address: user.address || '',
        city: user.city || '',
        bio: user.bio || ''
      });
    }
  }, [user]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    if (!isEditing) {
      setIsEditing(true);
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted with:', formData);
    setIsEditing(false);
    // Add success message or actual form submission logic here
  };
  
  const cancelEditing = () => {
    // Reset form to original values
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        phone_number: user.phone_number || '',
        date_of_birth: user.date_of_birth || '',
        address: user.address || '',
        city: user.city || '',
        bio: user.bio || ''
      });
    }
    setIsEditing(false);
  };
  
  return (
    <div className="profile-page" style={{backgroundColor: '#f8f9fa', padding: '40px 0', minHeight: 'calc(100vh - 80px)'}}>
      <div className="profile-container" style={{maxWidth: '1100px', margin: '0 auto', padding: '0 20px'}}>
        <div className="profile-grid" style={{display: 'grid', gridTemplateColumns: '280px 1fr', gap: '30px', width: '100%'}}>
          {/* Sidebar */}
          <div className="profile-sidebar" style={{backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', overflow: 'hidden', height: 'fit-content'}}>
            <div className="user-info" style={{padding: '25px', textAlign: 'center', borderBottom: '1px solid #eee'}}>
              <div className="user-avatar" style={{width: '100px', height: '100px', borderRadius: '50%', overflow: 'hidden', margin: '0 auto 15px', border: '3px solid #FB9EC6', backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <img 
                  src="https://via.placeholder.com/100" 
                  alt="User avatar" 
                />
              </div>
              <h3 className="user-name" style={{fontSize: '18px', fontWeight: 600, marginBottom: '5px', color: '#333'}}>
                {formData.first_name} {formData.last_name}
              </h3>
              <div className="user-type" style={{display: 'inline-block', backgroundColor: '#FB9EC6', color: 'white', fontSize: '12px', fontWeight: 500, padding: '3px 10px', borderRadius: '20px', marginBottom: '10px'}}>
                Renter
              </div>
              <p className="user-email">{formData.email || 'user@example.com'}</p>
              <p className="user-since">
                Member since March 2025
              </p>
            </div>
            
            <ul className="profile-nav" style={{listStyleType: 'none', padding: 0, margin: 0}}>
              <li className="profile-nav-item" style={{borderBottom: '1px solid #eee'}}>
                <Link 
                  to="/profile#personal" 
                  className={`profile-nav-link ${activeTab === 'personal' ? 'active' : ''}`}
                  onClick={() => setActiveTab('personal')}
                  style={{display: 'flex', alignItems: 'center', padding: '15px 20px', color: '#333', textDecoration: 'none', transition: 'all 0.3s'}}
                >
                  <i className="fas fa-user profile-nav-icon"></i>
                  Personal Information
                </Link>
              </li>
              
              <li className="profile-nav-item">
                <Link 
                  to="/profile#security" 
                  className={`profile-nav-link ${activeTab === 'security' ? 'active' : ''}`}
                  onClick={() => setActiveTab('security')}
                >
                  <i className="fas fa-lock profile-nav-icon"></i>
                  Security
                </Link>
              </li>
              
              <li className="profile-nav-item">
                <Link 
                  to="/profile#payment" 
                  className={`profile-nav-link ${activeTab === 'payment' ? 'active' : ''}`}
                  onClick={() => setActiveTab('payment')}
                >
                  <i className="fas fa-credit-card profile-nav-icon"></i>
                  Payment Methods
                </Link>
              </li>
              
              <li className="profile-nav-item">
                <Link 
                  to="/profile#notifications" 
                  className={`profile-nav-link ${activeTab === 'notifications' ? 'active' : ''}`}
                  onClick={() => setActiveTab('notifications')}
                >
                  <i className="fas fa-bell profile-nav-icon"></i>
                  Notifications
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Main Content */}
          <div className="profile-content" style={{backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', padding: '30px'}}>
            {/* Personal Information Tab */}
            {activeTab === 'personal' && (
              <div>
                <div className="profile-content-header">
                  <h2 className="profile-content-title">Personal Information</h2>
                  <p className="profile-content-subtitle">
                    Update your personal details and how information about you is displayed
                  </p>
                </div>
                
                <form className="profile-form" onSubmit={handleSubmit} style={{width: '100%'}}>
                  <div className="profile-avatar-upload">
                    <div className="avatar-preview">
                      <img 
                        src="https://via.placeholder.com/100" 
                        alt="Avatar Preview" 
                      />
                    </div>
                    <div>
                      <label htmlFor="avatar" className="avatar-upload-btn">
                        Change Photo
                      </label>
                      <p style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                        JPG or PNG, max 5MB
                      </p>
                    </div>
                  </div>
                  
                  <div className="form-row" style={{display: 'flex', gap: '20px'}}>
                    <div className="form-group" style={{flex: 1, marginBottom: '20px'}}>
                      <label htmlFor="first_name">First Name</label>
                      <input
                        type="text"
                        id="first_name"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        placeholder="Enter your first name"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="last_name">Last Name</label>
                      <input
                        type="text"
                        id="last_name"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        placeholder="Enter your last name"
                      />
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="email">Email</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="youremail@example.com"
                        disabled
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="phone_number">Phone Number</label>
                      <input
                        type="tel"
                        id="phone_number"
                        name="phone_number"
                        value={formData.phone_number}
                        onChange={handleChange}
                        placeholder="+1 (123) 456-7890"
                      />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="date_of_birth">Date of Birth</label>
                    <input
                      type="date"
                      id="date_of_birth"
                      name="date_of_birth"
                      value={formData.date_of_birth}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="address">Address</label>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="123 Main St"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="city">City</label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="New York"
                      />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="bio">Bio</label>
                    <textarea
                      id="bio"
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      rows="4"
                      placeholder="Tell us a little about yourself..."
                    ></textarea>
                  </div>
                  
                  {isEditing && (
                    <div className="profile-form-buttons">
                      <button 
                        type="button" 
                        className="cancel-button"
                        onClick={cancelEditing}
                      >
                        Cancel
                      </button>
                      
                      <button 
                        type="submit" 
                        className="save-button"
                      >
                        Save Changes
                      </button>
                    </div>
                  )}
                </form>
              </div>
            )}
            
            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="profile-content-header">
                <h2 className="profile-content-title">Security</h2>
                <p className="profile-content-subtitle">
                  Manage your password and account security settings
                </p>
                <p style={{ marginTop: '20px' }}>
                  This feature is coming soon. You'll be able to change your password and 
                  manage other security settings here.
                </p>
              </div>
            )}
            
            {/* Payment Methods Tab */}
            {activeTab === 'payment' && (
              <div className="profile-content-header">
                <h2 className="profile-content-title">Payment Methods</h2>
                <p className="profile-content-subtitle">
                  Manage your payment methods and billing information
                </p>
                <p style={{ marginTop: '20px' }}>
                  This feature is coming soon. You'll be able to add and manage your payment methods here.
                </p>
              </div>
            )}
            
            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="profile-content-header">
                <h2 className="profile-content-title">Notifications</h2>
                <p className="profile-content-subtitle">
                  Control what notifications you receive
                </p>
                <p style={{ marginTop: '20px' }}>
                  This feature is coming soon. You'll be able to configure your notification preferences here.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;