import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './UserManagement.css';

const UserManagement = () => {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    // Fetch users data
    fetchUsers();
    fetchRoles();
  }, [token]);

  useEffect(() => {
    // Apply filters whenever filter criteria changes
    applyFilters();
  }, [searchTerm, selectedRole, selectedStatus, users]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      // In a real app, this would be an API call
      // For now, we'll use mock data
      setTimeout(() => {
        const mockUsers = Array.from({ length: 35 }, (_, i) => ({
          id: i + 1,
          first_name: ['John', 'Jane', 'Mark', 'Lisa', 'David', 'Sarah', 'Michael', 'Emily', 'Robert', 'Jessica'][i % 10],
          last_name: ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Martinez', 'Taylor'][i % 10],
          email: `user${i + 1}@example.com`,
          phone_number: `+63 9${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`,
          created_at: new Date(2025, 0, Math.floor(Math.random() * 90) + 1).getTime(),
          roles: [
            {
              id: Math.floor(Math.random() * 12) + 1,
              is_primary: true
            }
          ],
          is_active: Math.random() > 0.2, // 80% chance of being active
          last_login: Math.random() > 0.3 ? new Date(2025, 2, Math.floor(Math.random() * 20) + 1).getTime() : null // 70% chance of having logged in recently
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

  const fetchRoles = async () => {
    try {
      // In a real app, this would be an API call to get roles
      // For now, we'll use the roles data provided
      const rolesData = [
        {"id":1,"name":"renter","description":"Can search for vehicles and make bookings","is_active":true},
        {"id":2,"name":"owner","description":"Can list vehicles and manage their rentals","is_active":true},
        {"id":3,"name":"admin","description":"Full system administration access","is_active":true},
        {"id":4,"name":"support","description":"Customer service functionality","is_active":true},
        {"id":5,"name":"guest","description":"Limited access before registration","is_active":true},
        {"id":6,"name":"verified_renter","description":"Renter who has completed identity verification","is_active":true},
        {"id":7,"name":"verified_owner","description":"Owner who has completed identity verification","is_active":true},
        {"id":8,"name":"fleet_manager","description":"Manages multiple vehicles for a business account","is_active":true},
        {"id":9,"name":"finance_admin","description":"Access to financial reports and transactions","is_active":true},
        {"id":10,"name":"content_moderator","description":"Reviews vehicle listings and user content","is_active":true},
        {"id":11,"name":"system_admin","description":"Technical system administration","is_active":true},
        {"id":12,"name":"super_admin","description":"Highest level of access with all permissions","is_active":true}
      ];
      setRoles(rolesData);
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  const applyFilters = () => {
    let result = [...users];

    // Apply search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      result = result.filter(user => 
        user.first_name.toLowerCase().includes(search) ||
        user.last_name.toLowerCase().includes(search) ||
        user.email.toLowerCase().includes(search) ||
        user.phone_number.includes(search)
      );
    }

    // Apply role filter
    if (selectedRole !== 'all') {
      const roleId = parseInt(selectedRole);
      result = result.filter(user => 
        user.roles.some(role => role.id === roleId)
      );
    }

    // Apply status filter
    if (selectedStatus !== 'all') {
      const isActive = selectedStatus === 'active';
      result = result.filter(user => user.is_active === isActive);
    }

    setFilteredUsers(result);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleRoleFilter = (e) => {
    setSelectedRole(e.target.value);
  };

  const handleStatusFilter = (e) => {
    setSelectedStatus(e.target.value);
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Never';
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const getUserRoleName = (roleId) => {
    const role = roles.find(r => r.id === roleId);
    return role ? role.name : 'Unknown';
  };

  // Pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleToggleStatus = async (userId, currentStatus) => {
    try {
      // In a real app, this would be an API call
      // For demo purposes, we'll update the local state directly
      const updatedUsers = users.map(user => {
        if (user.id === userId) {
          return { ...user, is_active: !currentStatus };
        }
        return user;
      });
      
      setUsers(updatedUsers);
      // Reapply filters
      applyFilters();
    } catch (error) {
      console.error('Error toggling user status:', error);
    }
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
    <div className="user-management">
      <div className="admin-container">
        <div className="admin-header">
          <h1 className="admin-title">User Management</h1>
          <Link to="/admin/users/create" className="add-user-btn">
            <i className="fas fa-plus"></i> Add New User
          </Link>
        </div>

        {/* Filters */}
        <div className="users-filters">
          <div className="search-filter">
            <i className="fas fa-search search-icon"></i>
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={handleSearch}
              className="search-input"
            />
          </div>

          <div className="filter-group">
            <select 
              value={selectedRole} 
              onChange={handleRoleFilter}
              className="filter-select"
            >
              <option value="all">All Roles</option>
              {roles.map(role => (
                <option key={role.id} value={role.id}>{role.name}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <select 
              value={selectedStatus} 
              onChange={handleStatusFilter}
              className="filter-select"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Joined Date</th>
                <th>Last Login</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.length > 0 ? (
                currentUsers.map(user => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.first_name} {user.last_name}</td>
                    <td>{user.email}</td>
                    <td>{user.phone_number}</td>
                    <td>
                      <span className="role-badge">
                        {getUserRoleName(user.roles.find(role => role.is_primary)?.id)}
                      </span>
                    </td>
                    <td>{formatDate(user.created_at)}</td>
                    <td>{formatDate(user.last_login)}</td>
                    <td>
                      <span className={`status-badge ${user.is_active ? 'active' : 'inactive'}`}>
                        {user.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="actions-cell">
                      <div className="table-actions">
                        <Link to={`/admin/users/${user.id}`} className="action-button view">
                          <i className="fas fa-eye"></i>
                        </Link>
                        <Link to={`/admin/users/${user.id}/edit`} className="action-button edit">
                          <i className="fas fa-edit"></i>
                        </Link>
                        <button 
                          className="action-button status-toggle"
                          onClick={() => handleToggleStatus(user.id, user.is_active)}
                        >
                          {user.is_active ? (
                            <i className="fas fa-ban"></i>
                          ) : (
                            <i className="fas fa-check"></i>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="no-results">
                    <div className="no-results-content">
                      <i className="fas fa-search"></i>
                      <p>No users found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredUsers.length > 0 && (
          <div className="pagination">
            <button 
              className="pagination-button"
              disabled={currentPage === 1}
              onClick={() => paginate(currentPage - 1)}
            >
              <i className="fas fa-chevron-left"></i>
            </button>
            
            <div className="pagination-pages">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  className={`pagination-button ${currentPage === i + 1 ? 'active' : ''}`}
                  onClick={() => paginate(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            
            <button 
              className="pagination-button"
              disabled={currentPage === totalPages}
              onClick={() => paginate(currentPage + 1)}
            >
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;