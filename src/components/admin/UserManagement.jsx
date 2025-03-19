import React, { useState, useEffect } from 'react';
import './UserManagement.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(12);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    userType: 'all',
    status: 'all'
  });
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  useEffect(() => {
    // Fetch users from API
    // This is a placeholder - replace with actual API call
    const fetchUsers = async () => {
      try {
        setLoading(true);
        
        // Simulating API call with mock data
        // In a real implementation, you would fetch this from your backend
        setTimeout(() => {
          const mockUsers = Array.from({ length: 25 }, (_, i) => ({
            user_id: `user-${i + 1}`,
            first_name: ['John', 'Jane', 'Mike', 'Emily', 'David'][Math.floor(Math.random() * 5)],
            last_name: ['Smith', 'Johnson', 'Williams', 'Brown', 'Davis'][Math.floor(Math.random() * 5)],
            email: `user${i + 1}@example.com`,
            phone_number: `+63 9${Math.floor(Math.random() * 10000000000).toString().padStart(10, '0')}`,
            user_type: ['renter', 'owner', 'admin'][Math.floor(Math.random() * 3)],
            is_active: Math.random() > 0.2,
            is_verified: Math.random() > 0.3,
            date_of_birth: new Date(
              1970 + Math.floor(Math.random() * 30),
              Math.floor(Math.random() * 12),
              Math.floor(Math.random() * 28) + 1
            ).toISOString().split('T')[0],
            created_at: new Date(
              2023,
              Math.floor(Math.random() * 12),
              Math.floor(Math.random() * 28) + 1
            ).toISOString(),
            profile_image_url: i % 5 === 0 ? `https://randomuser.me/api/portraits/${i % 2 ? 'men' : 'women'}/${i % 10}.jpg` : null
          }));
          
          setUsers(mockUsers);
          setFilteredUsers(mockUsers);
          setLoading(false);
        }, 1000);
        
      } catch (error) {
        console.error('Error fetching users:', error);
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, []);
  
  useEffect(() => {
    // Filter users based on search term and filters
    const filtered = users.filter(user => {
      // Search by name or email
      const searchMatch = 
        `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone_number.includes(searchTerm);
      
      // Filter by user type
      const typeMatch = 
        filters.userType === 'all' || 
        user.user_type === filters.userType;
      
      // Filter by status
      let statusMatch = true;
      if (filters.status === 'active') {
        statusMatch = user.is_active;
      } else if (filters.status === 'inactive') {
        statusMatch = !user.is_active;
      } else if (filters.status === 'verified') {
        statusMatch = user.is_verified;
      } else if (filters.status === 'unverified') {
        statusMatch = !user.is_verified;
      }
      
      return searchMatch && typeMatch && statusMatch;
    });
    
    setFilteredUsers(filtered);
    setCurrentPage(1); // Reset to first page on filter change
  }, [searchTerm, filters, users]);
  
  // Get current users for pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  
  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleViewUser = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };
  
  const handleEditUser = (user) => {
    // Implement edit user functionality
    console.log('Edit user:', user);
  };
  
  const handleDeleteUser = (user) => {
    // Implement delete user functionality
    if (window.confirm(`Are you sure you want to delete user ${user.first_name} ${user.last_name}?`)) {
      console.log('Delete user:', user);
    }
  };
  
  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading users...</p>
      </div>
    );
  }
  
  return (
    <div className="users-container">
      <div className="users-header">
        <h2>User Management</h2>
        <div className="users-actions">
          <button className="btn-primary">
            <i className="fas fa-plus"></i> Add New User
          </button>
          <button className="btn-secondary">
            <i className="fas fa-download"></i> Export
          </button>
        </div>
      </div>
      
      <div className="users-filter">
        <div className="filter-group search-input">
          <label htmlFor="search">Search Users</label>
          <input
            type="text"
            id="search"
            placeholder="Search by name, email, or phone..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        
        <div className="filter-group">
          <label htmlFor="userType">User Type</label>
          <select
            id="userType"
            name="userType"
            value={filters.userType}
            onChange={handleFilterChange}
          >
            <option value="all">All Types</option>
            <option value="renter">Renters</option>
            <option value="owner">Car Owners</option>
            <option value="admin">Admins</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="verified">Verified</option>
            <option value="unverified">Unverified</option>
          </select>
        </div>
      </div>
      
      <div className="users-grid">
        {currentUsers.length > 0 ? (
          currentUsers.map(user => (
            <div key={user.user_id} className="user-card">
              <div className="user-header">
                <div className="user-avatar">
                  {user.profile_image_url ? (
                    <img src={user.profile_image_url} alt={`${user.first_name} ${user.last_name}`} />
                  ) : (
                    getInitials(user.first_name, user.last_name)
                  )}
                </div>
                <div className="user-info">
                  <h3 className="user-name">{user.first_name} {user.last_name}</h3>
                  <p className="user-email">{user.email}</p>
                  <div className={`user-status status-${user.is_active ? 'active' : 'inactive'}`}>
                    {user.is_active ? 'Active' : 'Inactive'}
                  </div>
                </div>
              </div>
              
              <div className="user-body">
                <div className="user-detail">
                  <div className="detail-label">Phone:</div>
                  <div className="detail-value">{user.phone_number}</div>
                </div>
                <div className="user-detail">
                  <div className="detail-label">Verified:</div>
                  <div className="detail-value">{user.is_verified ? 'Yes' : 'No'}</div>
                </div>
                <div className="user-detail">
                  <div className="detail-label">Joined:</div>
                  <div className="detail-value">{formatDate(user.created_at)}</div>
                </div>
              </div>
              
              <div className="user-footer">
                <div className={`user-type type-${user.user_type}`}>
                  {user.user_type.charAt(0).toUpperCase() + user.user_type.slice(1)}
                </div>
                <div className="user-actions">
                  <button 
                    className="action-icon action-view" 
                    onClick={() => handleViewUser(user)}
                    title="View User"
                  >
                    <i className="fas fa-eye"></i>
                  </button>
                  <button 
                    className="action-icon action-edit" 
                    onClick={() => handleEditUser(user)}
                    title="Edit User"
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                  <button 
                    className="action-icon action-delete" 
                    onClick={() => handleDeleteUser(user)}
                    title="Delete User"
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-results">
            <i className="fas fa-search"></i>
            <p>No users found matching your criteria.</p>
          </div>
        )}
      </div>
      
      {/* Pagination */}
      {filteredUsers.length > usersPerPage && (
        <div className="pagination">
          <button 
            onClick={() => paginate(currentPage - 1)} 
            disabled={currentPage === 1}
          >
            <i className="fas fa-chevron-left"></i>
          </button>
          
          {Array.from({ length: Math.ceil(filteredUsers.length / usersPerPage) }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => paginate(i + 1)}
              className={currentPage === i + 1 ? 'active' : ''}
            >
              {i + 1}
            </button>
          ))}
          
          <button 
            onClick={() => paginate(currentPage + 1)} 
            disabled={currentPage === Math.ceil(filteredUsers.length / usersPerPage)}
          >
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      )}
      
      {/* User Detail Modal */}
      {isModalOpen && selectedUser && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="user-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>User Details</h3>
              <button className="modal-close" onClick={closeModal}>×</button>
            </div>
            <div className="modal-body">
              <div className="user-modal-info">
                <div className="detail-section">
                  <h4>Personal Information</h4>
                  <div className="detail-row">
                    <div className="detail-label">Name:</div>
                    <div className="detail-value">{selectedUser.first_name} {selectedUser.last_name}</div>
                  </div>
                  <div className="detail-row">
                    <div className="detail-label">Email:</div>
                    <div className="detail-value">{selectedUser.email}</div>
                  </div>
                  <div className="detail-row">
                    <div className="detail-label">Phone:</div>
                    <div className="detail-value">{selectedUser.phone_number}</div>
                  </div>
                  <div className="detail-row">
                    <div className="detail-label">Date of Birth:</div>
                    <div className="detail-value">{formatDate(selectedUser.date_of_birth)}</div>
                  </div>
                </div>
                
                <div className="detail-section">
                  <h4>Account Information</h4>
                  <div className="detail-row">
                    <div className="detail-label">User Type:</div>
                    <div className="detail-value">{selectedUser.user_type.charAt(0).toUpperCase() + selectedUser.user_type.slice(1)}</div>
                  </div>
                  <div className="detail-row">
                    <div className="detail-label">Status:</div>
                    <div className="detail-value">{selectedUser.is_active ? 'Active' : 'Inactive'}</div>
                  </div>
                  <div className="detail-row">
                    <div className="detail-label">Verified:</div>
                    <div className="detail-value">{selectedUser.is_verified ? 'Yes' : 'No'}</div>
                  </div>
                  <div className="detail-row">
                    <div className="detail-label">Joined Date:</div>
                    <div className="detail-value">{formatDate(selectedUser.created_at)}</div>
                  </div>
                </div>
              </div>
              
              <div className="form-buttons">
                <button className="btn-secondary" onClick={closeModal}>Close</button>
                <button className="btn-primary" onClick={() => handleEditUser(selectedUser)}>Edit User</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
