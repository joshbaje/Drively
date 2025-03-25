import React, { useState, useEffect } from 'react';
import supabase from '../../services/supabase/supabaseClient';
import { useAuth } from '../../context/AuthContext';

/**
 * Component to display all test users and allow quick login
 */
const TestUsersList = () => {
  const [testUsers, setTestUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loginStatus, setLoginStatus] = useState({ loading: false, message: null, isError: false });
  const [manualCredentials, setManualCredentials] = useState({
    email: '',
    password: ''
  });
  
  const { login, logout, user: currentUser } = useAuth();

  // Fetch all test users on component mount
  useEffect(() => {
    fetchTestUsers();
  }, []);

  // Function to fetch all test users from the database
  const fetchTestUsers = async () => {
    try {
      setLoading(true);
      
      // Fetch users with test email addresses
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .or('email.ilike.%test%@drivelyph.com%, email.eq.bajejosh@gmail.com')
        .order('user_type', { ascending: true });
      
      if (error) {
        throw error;
      }
      
      console.log('Fetched users:', data);
      
      // If no test users are found, show some default entries
      if (!data || data.length === 0) {
        const defaultUsers = [
          {
            user_id: '1',
            email: 'test.renter@drivelyph.com',
            first_name: 'Test',
            last_name: 'Renter',
            user_type: 'renter',
            created_at: new Date().toISOString()
          },
          {
            user_id: '2',
            email: 'test.owner@drivelyph.com',
            first_name: 'Test',
            last_name: 'Owner',
            user_type: 'owner',
            created_at: new Date().toISOString()
          },
          {
            user_id: '3',
            email: 'test.admin@drivelyph.com',
            first_name: 'Test',
            last_name: 'Admin',
            user_type: 'admin',
            created_at: new Date().toISOString()
          },
          {
            user_id: '4',
            email: 'bajejosh@gmail.com',
            first_name: 'Josh',
            last_name: 'Baje',
            user_type: 'admin',
            created_at: new Date().toISOString()
          }
        ];
        
        // Group default users by role
        const grouped = defaultUsers.reduce((acc, user) => {
          const role = user.user_type || 'unknown';
          if (!acc[role]) {
            acc[role] = [];
          }
          acc[role].push(user);
          return acc;
        }, {});
        
        // Convert to array format for rendering
        const usersByRole = Object.entries(grouped).map(([role, users]) => ({
          role,
          users
        }));
        
        setTestUsers(usersByRole);
        setError('No test users found in database. Showing default test users.');
        return;
      }
      
      // Group users by role
      const grouped = data.reduce((acc, user) => {
        const role = user.user_type || 'unknown';
        if (!acc[role]) {
          acc[role] = [];
        }
        acc[role].push(user);
        return acc;
      }, {});
      
      // Convert to array format for rendering
      const usersByRole = Object.entries(grouped).map(([role, users]) => ({
        role,
        users
      }));
      
      setTestUsers(usersByRole);
    } catch (err) {
      console.error('Error fetching test users:', err);
      setError(err.message);
      
      // Show some default entries anyway
      const defaultUsers = [
        {
          user_id: '1',
          email: 'test.renter@drivelyph.com',
          first_name: 'Test',
          last_name: 'Renter',
          user_type: 'renter',
          created_at: new Date().toISOString()
        },
        {
          user_id: '2',
          email: 'test.owner@drivelyph.com',
          first_name: 'Test',
          last_name: 'Owner',
          user_type: 'owner',
          created_at: new Date().toISOString()
        },
        {
          user_id: '3',
          email: 'test.admin@drivelyph.com',
          first_name: 'Test',
          last_name: 'Admin',
          user_type: 'admin',
          created_at: new Date().toISOString()
        },
        {
          user_id: '4',
          email: 'bajejosh@gmail.com',
          first_name: 'Josh',
          last_name: 'Baje',
          user_type: 'admin',
          created_at: new Date().toISOString()
        }
      ];
      
      // Group default users by role
      const grouped = defaultUsers.reduce((acc, user) => {
        const role = user.user_type || 'unknown';
        if (!acc[role]) {
          acc[role] = [];
        }
        acc[role].push(user);
        return acc;
      }, {});
      
      // Convert to array format for rendering
      const usersByRole = Object.entries(grouped).map(([role, users]) => ({
        role,
        users
      }));
      
      setTestUsers(usersByRole);
    } finally {
      setLoading(false);
    }
  };

  // Handle manual login form
  const handleManualLogin = async (e) => {
    e.preventDefault();
    try {
      setLoginStatus({ loading: true, message: `Manually logging in as ${manualCredentials.email}...`, isError: false });
      
      // First logout if currently logged in
      if (currentUser) {
        await logout();
      }
      
      console.log('Attempting manual login with:', manualCredentials);
      await login(manualCredentials.email, manualCredentials.password);
      
      setLoginStatus({
        loading: false,
        message: `Successfully logged in as ${manualCredentials.email}`,
        isError: false
      });
      
      // Clear the success message after 3 seconds
      setTimeout(() => {
        setLoginStatus(prev => prev.message === `Successfully logged in as ${manualCredentials.email}` ?
          { loading: false, message: null, isError: false } : prev);
      }, 3000);
    } catch (err) {
      console.error('Manual login error:', err);
      setLoginStatus({
        loading: false,
        message: `Login failed: ${err.message}`,
        isError: true
      });
    }
  };
  
  const handleManualInputChange = (e) => {
    const { name, value } = e.target;
    setManualCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Function to handle login with a test user
  const handleLogin = async (email, password) => {
    try {
      setLoginStatus({ loading: true, message: `Logging in as ${email}...`, isError: false });
      
      // First logout if currently logged in
      if (currentUser) {
        await logout();
      }
      
      // Login with the selected test user
      // Using the pre-set passwords for test users
      const passwordMapping = {
        'test.renter@drivelyph.com': 'TestRenter123!',
        'test.owner@drivelyph.com': 'TestOwner123!',
        'test.admin@drivelyph.com': 'TestAdmin123!',
        'test.support@drivelyph.com': 'TestSupport123!',
        'test.verifiedrenter@drivelyph.com': 'TestVRenter123!',
        'test.verifiedowner@drivelyph.com': 'TestVOwner123!',
        'bajejosh@gmail.com': 'joshua31M**'
      };
      
      const userPassword = passwordMapping[email] || 'TestUser123!';
      
      // For default users shown when no actual users exist,
      // simulate login by updating UI only
      if (!testUsers.some(group => group.users.some(u => u.email === email && u.user_id.length > 5))) {
        // This is likely a default user - we'll simulate login
        const foundUser = testUsers.flatMap(group => group.users).find(u => u.email === email);
        
        if (foundUser) {
          // Simulate login by updating state directly
          setLoginStatus({
            loading: false,
            message: `Simulated login as ${email} (demo mode)`,
            isError: false
          });
          
          // Clear the success message after 5 seconds
          setTimeout(() => {
            setLoginStatus(prev => prev.message === `Simulated login as ${email} (demo mode)` ?
              { loading: false, message: null, isError: false } : prev);
          }, 5000);
          
          return;
        }
      }
      
      // Regular login for actual users
      await login(email, userPassword);
      
      setLoginStatus({
        loading: false,
        message: `Successfully logged in as ${email}`,
        isError: false
      });
      
      // Clear the success message after 3 seconds
      setTimeout(() => {
        setLoginStatus(prev => prev.message === `Successfully logged in as ${email}` ?
          { loading: false, message: null, isError: false } : prev);
      }, 3000);
    } catch (err) {
      console.error('Login error:', err);
      setLoginStatus({
        loading: false,
        message: `Login failed: ${err.message}`,
        isError: true
      });
    }
  };

  // Function to handle logout
  const handleLogout = async () => {
    try {
      setLoginStatus({ loading: true, message: 'Logging out...', isError: false });
      await logout();
      setLoginStatus({ 
        loading: false, 
        message: 'Successfully logged out', 
        isError: false 
      });
      
      // Clear the success message after 3 seconds
      setTimeout(() => {
        setLoginStatus(prev => prev.message === 'Successfully logged out' ? 
          { loading: false, message: null, isError: false } : prev);
      }, 3000);
    } catch (err) {
      console.error('Logout error:', err);
      setLoginStatus({ 
        loading: false, 
        message: `Logout failed: ${err.message}`, 
        isError: true 
      });
    }
  };

  // Get color for role badge
  const getRoleColor = (role) => {
    if (!role) return '#e0e0e0';
    
    if (typeof role === 'string') {
      if (role.includes('admin')) return '#d1c4e9';
      if (role.includes('owner')) return '#bbdefb';
      if (role.includes('renter')) return '#c8e6c9';
      if (role.includes('support')) return '#ffecb3';
    }
    
    return '#e0e0e0';
  };

  return (
    <div style={{ maxWidth: '800px', margin: '20px auto', padding: '20px', border: '1px solid #eee', borderRadius: '8px' }}>
      <h2>Test Users</h2>
      
      {/* Current Auth Status */}
      <div style={{ 
        padding: '15px', 
        backgroundColor: currentUser ? '#d4edda' : '#f8f9fa', 
        borderRadius: '4px',
        marginBottom: '20px',
        color: currentUser ? '#155724' : '#6c757d'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <strong>Current User:</strong> {currentUser ? (
              <span>
                {currentUser.email} 
                <span style={{ 
                  display: 'inline-block',
                  marginLeft: '10px',
                  padding: '4px 8px', 
                  borderRadius: '4px', 
                  fontSize: '12px',
                  backgroundColor: getRoleColor(currentUser.user_type)
                }}>
                  {currentUser.user_type}
                </span>
              </span>
            ) : 'Not logged in'}
          </div>
          
          {currentUser && (
            <button 
              onClick={handleLogout}
              disabled={loginStatus.loading}
              style={{ 
                padding: '8px 16px', 
                backgroundColor: '#dc3545', 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px', 
                cursor: 'pointer' 
              }}
            >
              Logout
            </button>
          )}
        </div>
      </div>
      
      {/* Manual Login Form */}
      <div style={{ 
        marginBottom: '20px', 
        padding: '15px', 
        backgroundColor: '#f8f9fa', 
        borderRadius: '4px' 
      }}>
        <h3>Manual Login</h3>
        <form onSubmit={handleManualLogin} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{ flex: 1 }}>
              <label htmlFor="email" style={{ display: 'block', marginBottom: '5px' }}>Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={manualCredentials.email}
                onChange={handleManualInputChange}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                required
              />
            </div>
            <div style={{ flex: 1 }}>
              <label htmlFor="password" style={{ display: 'block', marginBottom: '5px' }}>Password:</label>
              <input
                type="password"
                id="password"
                name="password"
                value={manualCredentials.password}
                onChange={handleManualInputChange}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                required
              />
            </div>
          </div>
          <div>
            <button 
              type="submit"
              disabled={loginStatus.loading}
              style={{ 
                padding: '8px 16px', 
                backgroundColor: '#28a745', 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px', 
                cursor: 'pointer',
                width: '100%'
              }}
            >
              {loginStatus.loading ? 'Logging in...' : 'Login Manually'}
            </button>
          </div>
        </form>
        <div style={{ marginTop: '10px', fontSize: '0.9em', color: '#6c757d' }}>
          <strong>Tip:</strong> Use this form to try your real credentials (bajejosh@gmail.com / joshua31M**)
        </div>
      </div>
      
      {/* Login Status Messages */}
      {loginStatus.message && (
        <div style={{ 
          padding: '15px', 
          backgroundColor: loginStatus.isError ? '#f8d7da' : '#d4edda', 
          borderRadius: '4px',
          marginBottom: '20px',
          color: loginStatus.isError ? '#721c24' : '#155724'
        }}>
          {loginStatus.loading ? (
            <div>
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> {loginStatus.message}
            </div>
          ) : (
            <div>{loginStatus.message}</div>
          )}
        </div>
      )}
      
      {/* Error Message */}
      {error && (
        <div style={{ padding: '15px', backgroundColor: '#fff3cd', borderRadius: '4px', marginBottom: '20px', color: '#856404' }}>
          <strong>Note:</strong> {error}
        </div>
      )}
      
      {/* Loading Indicator */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <div>Loading test users...</div>
        </div>
      ) : (
        <div>
          {testUsers.length === 0 ? (
            <div style={{ padding: '15px', backgroundColor: '#fff3cd', borderRadius: '4px', color: '#856404' }}>
              <strong>No test users found.</strong> Make sure you have created test users with email addresses containing "test." and "@drivelyph.com".
            </div>
          ) : (
            <div>
              {testUsers.map(roleGroup => (
                <div key={roleGroup.role} style={{ marginBottom: '20px' }}>
                  <h3 style={{ 
                    padding: '10px', 
                    backgroundColor: getRoleColor(roleGroup.role), 
                    borderRadius: '4px 4px 0 0',
                    margin: '0'
                  }}>
                    {roleGroup.role.charAt(0).toUpperCase() + roleGroup.role.slice(1)} ({roleGroup.users.length})
                  </h3>
                  
                  <table style={{ width: '100%', borderCollapse: 'collapse', border: `1px solid ${getRoleColor(roleGroup.role)}` }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f8f9fa' }}>
                        <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Name</th>
                        <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Email</th>
                        <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Created</th>
                        <th style={{ padding: '10px', textAlign: 'center', borderBottom: '1px solid #dee2e6' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {roleGroup.users.map(user => (
                        <tr key={user.user_id} style={{ 
                          backgroundColor: currentUser?.email === user.email ? '#f8f9fa' : 'white',
                          borderLeft: currentUser?.email === user.email ? '4px solid #28a745' : 'none',
                        }}>
                          <td style={{ padding: '10px', borderBottom: '1px solid #dee2e6' }}>
                            {user.first_name} {user.last_name}
                          </td>
                          <td style={{ padding: '10px', borderBottom: '1px solid #dee2e6' }}>
                            {user.email}
                          </td>
                          <td style={{ padding: '10px', borderBottom: '1px solid #dee2e6' }}>
                            {new Date(user.created_at).toLocaleDateString()}
                          </td>
                          <td style={{ padding: '10px', borderBottom: '1px solid #dee2e6', textAlign: 'center' }}>
                            <button 
                              onClick={() => handleLogin(user.email)}
                              disabled={loginStatus.loading || currentUser?.email === user.email}
                              style={{ 
                                padding: '6px 12px', 
                                backgroundColor: currentUser?.email === user.email ? '#6c757d' : '#007bff', 
                                color: 'white', 
                                border: 'none', 
                                borderRadius: '4px', 
                                cursor: currentUser?.email === user.email ? 'default' : 'pointer',
                                opacity: currentUser?.email === user.email ? 0.65 : 1
                              }}
                            >
                              {currentUser?.email === user.email ? 'Current User' : 'Login'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      
      {/* How to Use Section */}
      <div style={{ marginTop: '40px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
        <h3>How to Use This Page</h3>
        <ol style={{ paddingLeft: '20px' }}>
          <li>Click the "Login" button next to any test user to authenticate as that user</li>
          <li>Or use the Manual Login form to enter specific credentials</li>
          <li>The current user will be highlighted and show a "Current User" button</li>
          <li>Click "Logout" at the top to sign out of the current account</li>
          <li>Once logged in, you can navigate to other pages to test role-based access</li>
        </ol>
        <p>All test users have predefined passwords based on the following pattern:</p>
        <ul style={{ paddingLeft: '20px' }}>
          <li>Renter: <code>TestRenter123!</code></li>
          <li>Owner: <code>TestOwner123!</code></li>
          <li>Admin: <code>TestAdmin123!</code></li>
          <li>Support: <code>TestSupport123!</code></li>
          <li>Other roles follow similar patterns</li>
        </ul>
        <p>Your actual user: <code>bajejosh@gmail.com</code> / <code>joshua31M**</code></p>
      </div>
    </div>
  );
};

export default TestUsersList;