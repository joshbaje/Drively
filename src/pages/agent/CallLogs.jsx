import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AgentPortal.css';

const CallLogs = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [callLogs, setCallLogs] = useState([]);
  const [filteredCallLogs, setFilteredCallLogs] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [showNewCallModal, setShowNewCallModal] = useState(false);
  const [newCallData, setNewCallData] = useState({
    customerName: '',
    customerPhone: '',
    callType: 'inquiry',
    callNotes: '',
    callOutcome: 'information_provided'
  });
  const [selectedCall, setSelectedCall] = useState(null);
  const [showCallDetailModal, setShowCallDetailModal] = useState(false);

  useEffect(() => {
    loadMockCallLogs();
  }, []);

  useEffect(() => {
    filterCallLogs();
  }, [callLogs, searchText, statusFilter, dateFilter]);

  const loadMockCallLogs = () => {
    setIsLoading(true);
    setTimeout(() => {
      const mockCallLogs = [
        {
          call_id: 'call-1',
          customer: {
            name: 'John Doe',
            phone: '555-123-4567',
            email: 'john.doe@example.com'
          },
          agent_id: 'agent-1',
          agent_name: 'Alex Johnson',
          call_time: '2025-03-20T09:30:00',
          call_duration: '00:15:32',
          call_type: 'inquiry',
          call_status: 'completed',
          call_outcome: 'booking_created',
          booking_id: 'booking-1001',
          call_notes: 'Customer inquired about renting a mid-size SUV for a family vacation. Provided information on available vehicles and created a booking for a Honda CR-V.',
          follow_up_required: false
        },
        {
          call_id: 'call-2',
          customer: {
            name: 'Jane Smith',
            phone: '555-987-6543',
            email: 'jane.smith@example.com'
          },
          agent_id: 'agent-1',
          agent_name: 'Alex Johnson',
          call_time: '2025-03-19T14:45:00',
          call_duration: '00:08:17',
          call_type: 'support',
          call_status: 'completed',
          call_outcome: 'issue_resolved',
          booking_id: 'booking-985',
          call_notes: 'Customer called regarding extending their current rental for an additional 3 days. Processed the extension request and updated the booking.',
          follow_up_required: false
        },
        {
          call_id: 'call-3',
          customer: {
            name: 'Michael Johnson',
            phone: '555-456-7890',
            email: 'michael.johnson@example.com'
          },
          agent_id: 'agent-1',
          agent_name: 'Alex Johnson',
          call_time: '2025-03-18T11:20:00',
          call_duration: '00:12:05',
          call_type: 'complaint',
          call_status: 'follow_up_required',
          call_outcome: 'escalated',
          booking_id: 'booking-972',
          call_notes: 'Customer called to report an issue with vehicle cleanliness. Escalated to management team for review. Need to follow up with customer on resolution.',
          follow_up_required: true,
          follow_up_date: '2025-03-21T10:00:00'
        },
        {
          call_id: 'call-4',
          customer: {
            name: 'Sarah Williams',
            phone: '555-789-0123',
            email: 'sarah.williams@example.com'
          },
          agent_id: 'agent-1',
          agent_name: 'Alex Johnson',
          call_time: '2025-03-18T09:10:00',
          call_duration: '00:05:48',
          call_type: 'inquiry',
          call_status: 'completed',
          call_outcome: 'information_provided',
          booking_id: null,
          call_notes: 'Potential customer inquired about available luxury vehicles for a wedding. Provided information on Tesla Model 3 and BMW 5 Series availability and pricing.',
          follow_up_required: true,
          follow_up_date: '2025-03-22T14:00:00'
        },
        {
          call_id: 'call-5',
          customer: {
            name: 'Robert Brown',
            phone: '555-234-5678',
            email: 'robert.brown@example.com'
          },
          agent_id: 'agent-1',
          agent_name: 'Alex Johnson',
          call_time: '2025-03-17T16:35:00',
          call_duration: '00:10:22',
          call_type: 'cancellation',
          call_status: 'completed',
          call_outcome: 'booking_cancelled',
          booking_id: 'booking-965',
          call_notes: 'Customer called to cancel their upcoming rental due to a change in travel plans. Processed cancellation and issued refund according to policy.',
          follow_up_required: false
        }
      ];
      
      setCallLogs(mockCallLogs);
      setFilteredCallLogs(mockCallLogs);
      setIsLoading(false);
    }, 800);
  };

  const filterCallLogs = () => {
    if (!callLogs.length) return;
    
    let filtered = [...callLogs];
    
    // Apply search filter
    if (searchText) {
      const searchLower = searchText.toLowerCase();
      filtered = filtered.filter(call => 
        call.call_id.toLowerCase().includes(searchLower) ||
        call.customer.name.toLowerCase().includes(searchLower) ||
        call.customer.phone.includes(searchLower) ||
        call.customer.email.toLowerCase().includes(searchLower) ||
        (call.booking_id && call.booking_id.toLowerCase().includes(searchLower))
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(call => call.call_status === statusFilter);
    }
    
    // Apply date filter
    if (dateFilter !== 'all') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const lastWeek = new Date(today);
      lastWeek.setDate(lastWeek.getDate() - 7);
      
      filtered = filtered.filter(call => {
        const callDate = new Date(call.call_time);
        
        switch (dateFilter) {
          case 'today':
            return callDate >= today;
          case 'yesterday':
            return callDate >= yesterday && callDate < today;
          case 'last_week':
            return callDate >= lastWeek;
          default:
            return true;
        }
      });
    }
    
    setFilteredCallLogs(filtered);
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const handleDateFilterChange = (e) => {
    setDateFilter(e.target.value);
  };

  const handleNewCallClick = () => {
    setNewCallData({
      customerName: '',
      customerPhone: '',
      callType: 'inquiry',
      callNotes: '',
      callOutcome: 'information_provided'
    });
    setShowNewCallModal(true);
  };

  const handleNewCallInputChange = (field, value) => {
    setNewCallData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveNewCall = () => {
    // Validate required fields
    if (!newCallData.customerName || !newCallData.customerPhone || !newCallData.callNotes) {
      alert('Please fill in all required fields.');
      return;
    }
    
    // In a real app, this would be an API call
    // For now, we'll create a mock call log entry
    const newCall = {
      call_id: `call-${Date.now()}`,
      customer: {
        name: newCallData.customerName,
        phone: newCallData.customerPhone,
        email: ''
      },
      agent_id: 'agent-1',
      agent_name: 'Alex Johnson',
      call_time: new Date().toISOString(),
      call_duration: '00:00:00', // Would be calculated in a real system
      call_type: newCallData.callType,
      call_status: newCallData.follow_up_required ? 'follow_up_required' : 'completed',
      call_outcome: newCallData.callOutcome,
      booking_id: newCallData.bookingId || null,
      call_notes: newCallData.callNotes,
      follow_up_required: newCallData.follow_up_required || false,
      follow_up_date: newCallData.follow_up_date || null
    };
    
    setCallLogs(prev => [newCall, ...prev]);
    setShowNewCallModal(false);
  };

  const handleViewCallDetails = (call) => {
    setSelectedCall(call);
    setShowCallDetailModal(true);
  };

  const handleCreateBookingFromCall = (call) => {
    // Navigate to the new booking page with the customer info
    navigate('/agent/bookings/new', {
      state: {
        fromCall: true,
        callId: call.call_id,
        customerName: call.customer.name,
        customerPhone: call.customer.phone,
        customerEmail: call.customer.email
      }
    });
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleString('en-US', options);
  };

  const renderCallStatusBadge = (status) => {
    const statusClasses = {
      completed: 'status-completed',
      follow_up_required: 'status-pending',
      escalated: 'status-declined'
    };
    
    const statusLabels = {
      completed: 'Completed',
      follow_up_required: 'Follow-up Required',
      escalated: 'Escalated'
    };
    
    return (
      <span className={`status-badge ${statusClasses[status] || ''}`}>
        {statusLabels[status] || status.replace('_', ' ')}
      </span>
    );
  };

  const renderCallOutcomeBadge = (outcome) => {
    const outcomeClasses = {
      information_provided: 'outcome-info',
      booking_created: 'outcome-success',
      issue_resolved: 'outcome-success',
      booking_cancelled: 'outcome-warning',
      escalated: 'outcome-danger',
      follow_up_scheduled: 'outcome-info'
    };
    
    const outcomeLabels = {
      information_provided: 'Info Provided',
      booking_created: 'Booking Created',
      issue_resolved: 'Issue Resolved',
      booking_cancelled: 'Booking Cancelled',
      escalated: 'Escalated',
      follow_up_scheduled: 'Follow-up Scheduled'
    };
    
    return (
      <span className={`outcome-badge ${outcomeClasses[outcome] || ''}`}>
        {outcomeLabels[outcome] || outcome.replace('_', ' ')}
      </span>
    );
  };

  const renderNewCallModal = () => {
    if (!showNewCallModal) return null;
    
    return (
      <div className="modal-overlay">
        <div className="modal-container">
          <div className="modal-header">
            <h2>Log New Call</h2>
            <button 
              className="modal-close" 
              onClick={() => setShowNewCallModal(false)}
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
          
          <div className="modal-body">
            <div className="form-section">
              <h3>Customer Information</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Customer Name*</label>
                  <input 
                    type="text"
                    value={newCallData.customerName}
                    onChange={(e) => handleNewCallInputChange('customerName', e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Phone Number*</label>
                  <input 
                    type="tel"
                    value={newCallData.customerPhone}
                    onChange={(e) => handleNewCallInputChange('customerPhone', e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
            
            <div className="form-section">
              <h3>Call Details</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Call Type</label>
                  <select
                    value={newCallData.callType}
                    onChange={(e) => handleNewCallInputChange('callType', e.target.value)}
                  >
                    <option value="inquiry">Inquiry</option>
                    <option value="support">Support</option>
                    <option value="complaint">Complaint</option>
                    <option value="cancellation">Cancellation</option>
                    <option value="change_request">Change Request</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Call Outcome</label>
                  <select
                    value={newCallData.callOutcome}
                    onChange={(e) => handleNewCallInputChange('callOutcome', e.target.value)}
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
              
              <div className="form-group">
                <label>Related Booking ID (if applicable)</label>
                <input 
                  type="text"
                  value={newCallData.bookingId || ''}
                  onChange={(e) => handleNewCallInputChange('bookingId', e.target.value)}
                  placeholder="Enter booking ID if relevant"
                />
              </div>
              
              <div className="form-group">
                <label>Call Notes*</label>
                <textarea
                  value={newCallData.callNotes}
                  onChange={(e) => handleNewCallInputChange('callNotes', e.target.value)}
                  rows={5}
                  placeholder="Enter detailed notes about the call"
                  required
                ></textarea>
              </div>
              
              <div className="form-group checkbox-group">
                <input 
                  type="checkbox"
                  id="follow-up-required"
                  checked={newCallData.follow_up_required || false}
                  onChange={(e) => handleNewCallInputChange('follow_up_required', e.target.checked)}
                />
                <label htmlFor="follow-up-required">Follow-up Required</label>
              </div>
              
              {newCallData.follow_up_required && (
                <div className="form-group">
                  <label>Follow-up Date</label>
                  <input 
                    type="datetime-local"
                    value={newCallData.follow_up_date || ''}
                    onChange={(e) => handleNewCallInputChange('follow_up_date', e.target.value)}
                  />
                </div>
              )}
            </div>
          </div>
          
          <div className="modal-footer">
            <button 
              className="btn-secondary" 
              onClick={() => setShowNewCallModal(false)}
            >
              Cancel
            </button>
            <button 
              className="btn-primary" 
              onClick={handleSaveNewCall}
            >
              Save Call Log
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderCallDetailModal = () => {
    if (!showCallDetailModal || !selectedCall) return null;
    
    return (
      <div className="modal-overlay">
        <div className="modal-container">
          <div className="modal-header">
            <h2>Call Details</h2>
            <button 
              className="modal-close" 
              onClick={() => setShowCallDetailModal(false)}
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
          
          <div className="modal-body">
            <div className="call-detail-header">
              <div className="call-id">Call ID: {selectedCall.call_id}</div>
              <div className="call-date">
                <i className="far fa-calendar-alt"></i> {formatDate(selectedCall.call_time)}
              </div>
              <div className="call-duration">
                <i className="far fa-clock"></i> Duration: {selectedCall.call_duration}
              </div>
            </div>
            
            <div className="detail-section">
              <h3>Customer Information</h3>
              <div className="customer-detail-card">
                <div className="customer-name">{selectedCall.customer.name}</div>
                <div className="customer-contact">
                  <div><i className="fas fa-phone"></i> {selectedCall.customer.phone}</div>
                  {selectedCall.customer.email && (
                    <div><i className="fas fa-envelope"></i> {selectedCall.customer.email}</div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="detail-section">
              <h3>Call Information</h3>
              <div className="detail-grid">
                <div className="detail-row">
                  <div className="detail-label">Agent:</div>
                  <div className="detail-value">{selectedCall.agent_name}</div>
                </div>
                <div className="detail-row">
                  <div className="detail-label">Call Type:</div>
                  <div className="detail-value">{selectedCall.call_type.replace('_', ' ')}</div>
                </div>
                <div className="detail-row">
                  <div className="detail-label">Status:</div>
                  <div className="detail-value">{renderCallStatusBadge(selectedCall.call_status)}</div>
                </div>
                <div className="detail-row">
                  <div className="detail-label">Outcome:</div>
                  <div className="detail-value">{renderCallOutcomeBadge(selectedCall.call_outcome)}</div>
                </div>
                {selectedCall.booking_id && (
                  <div className="detail-row">
                    <div className="detail-label">Related Booking:</div>
                    <div className="detail-value">
                      <a 
                        href="#" 
                        onClick={(e) => {
                          e.preventDefault();
                          navigate(`/agent/bookings/${selectedCall.booking_id}`);
                        }}
                      >
                        {selectedCall.booking_id}
                      </a>
                    </div>
                  </div>
                )}
                {selectedCall.follow_up_required && (
                  <div className="detail-row">
                    <div className="detail-label">Follow-up Date:</div>
                    <div className="detail-value">{formatDate(selectedCall.follow_up_date)}</div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="detail-section">
              <h3>Call Notes</h3>
              <div className="call-notes">
                {selectedCall.call_notes}
              </div>
            </div>
          </div>
          
          <div className="modal-footer">
            <button 
              className="btn-secondary" 
              onClick={() => setShowCallDetailModal(false)}
            >
              Close
            </button>
            {!selectedCall.booking_id && selectedCall.call_type === 'inquiry' && (
              <button 
                className="btn-primary" 
                onClick={() => {
                  setShowCallDetailModal(false);
                  handleCreateBookingFromCall(selectedCall);
                }}
              >
                Create Booking
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="call-logs-container">
      <div className="call-logs-header">
        <div className="header-title">
          <h2>Call Logs</h2>
          <span className="call-count">{filteredCallLogs.length} calls</span>
        </div>
        <button 
          className="btn-primary"
          onClick={handleNewCallClick}
        >
          <i className="fas fa-phone-plus"></i> Log New Call
        </button>
      </div>
      
      <div className="filters-bar">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by customer, phone, or booking ID..."
            value={searchText}
            onChange={handleSearch}
            className="search-input"
          />
          <i className="fas fa-search search-icon"></i>
        </div>
        
        <div className="filter-group">
          <label>Status:</label>
          <select 
            value={statusFilter}
            onChange={handleStatusFilterChange}
            className="filter-select"
          >
            <option value="all">All Statuses</option>
            <option value="completed">Completed</option>
            <option value="follow_up_required">Follow-up Required</option>
            <option value="escalated">Escalated</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label>Date:</label>
          <select 
            value={dateFilter}
            onChange={handleDateFilterChange}
            className="filter-select"
          >
            <option value="all">All Dates</option>
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="last_week">Last 7 Days</option>
          </select>
        </div>
      </div>
      
      {isLoading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading call logs...</p>
        </div>
      ) : (
        <>
          {filteredCallLogs.length > 0 ? (
            <div className="call-logs-table">
              <table>
                <thead>
                  <tr>
                    <th>Date & Time</th>
                    <th>Customer</th>
                    <th>Call Type</th>
                    <th>Status</th>
                    <th>Outcome</th>
                    <th>Duration</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCallLogs.map(call => (
                    <tr key={call.call_id}>
                      <td className="call-time">{formatDate(call.call_time)}</td>
                      <td className="customer-info">
                        <div className="customer-name">{call.customer.name}</div>
                        <div className="customer-phone">{call.customer.phone}</div>
                      </td>
                      <td className="call-type">{call.call_type.replace('_', ' ')}</td>
                      <td className="call-status">
                        {renderCallStatusBadge(call.call_status)}
                      </td>
                      <td className="call-outcome">
                        {renderCallOutcomeBadge(call.call_outcome)}
                      </td>
                      <td className="call-duration">{call.call_duration}</td>
                      <td className="call-actions">
                        <button 
                          className="btn-view"
                          onClick={() => handleViewCallDetails(call)}
                        >
                          <i className="fas fa-eye"></i> View
                        </button>
                        {!call.booking_id && call.call_type === 'inquiry' && (
                          <button 
                            className="btn-action"
                            onClick={() => handleCreateBookingFromCall(call)}
                          >
                            <i className="fas fa-calendar-plus"></i> Book
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="no-results">
              <i className="fas fa-phone-slash"></i>
              <h3>No Call Logs Found</h3>
              <p>Try adjusting your search or filters to find call logs.</p>
              <button 
                className="btn-secondary"
                onClick={() => {
                  setSearchText('');
                  setStatusFilter('all');
                  setDateFilter('all');
                }}
              >
                Clear Filters
              </button>
            </div>
          )}
        </>
      )}
      
      {renderNewCallModal()}
      {renderCallDetailModal()}
    </div>
  );
};

export default CallLogs;