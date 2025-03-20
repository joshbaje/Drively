import { createContext, useState, useEffect, useContext } from 'react';

const API_BASE_URL = 'https://x8ki-letl-twmt.n7.xano.io/api:scA8Isc8';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('auth_token'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if token exists and verify it
    if (token) {
      fetchCurrentUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchCurrentUser = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Session expired or invalid');
      }

      const userData = await response.json();
      
      // Map role_id to user_type
      if (userData.roles && userData.roles.length > 0) {
        const primaryRole = userData.roles.find(role => role.is_primary) || userData.roles[0];
        // Map role_id to user_type (adjust the mapping according to your role IDs)
        const roleMap = {
          1: 'admin',
          2: 'owner',
          3: 'renter'
        };
        userData.user_type = roleMap[primaryRole.role_id] || 'renter';
      }
      
      setUser(userData);
      setError(null);
    } catch (err) {
      console.error('Authentication error:', err);
      setError(err.message);
      logout(); // Clear invalid token
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await response.json();
      
      // Save the token to local storage
      localStorage.setItem('auth_token', data.authToken);
      setToken(data.authToken);
      setUser(data.user);
      setError(null);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      
      // Transform userData to match the new API requirements
      const apiData = {
        first_name: userData.first_name,
        last_name: userData.last_name,
        email: userData.email,
        password: userData.password,
        date_of_birth: userData.date_of_birth || null,
        phone: userData.phone_number, // Map phone_number to phone
        type: userData.user_type === 'owner' ? 'car_owner' : 'renter' // Transform user_type to type
      };
      
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(apiData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      const data = await response.json();
      
      // Auto-login after registration if API returns a token
      if (data.authToken) {
        localStorage.setItem('auth_token', data.authToken);
        setToken(data.authToken);
        setUser(data.user);
      }
      
      setError(null);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setToken(null);
    setUser(null);
  };

  const updateUserProfile = async (profileData) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/auth/update-profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Profile update failed');
      }

      const data = await response.json();
      setUser(prevUser => ({ ...prevUser, ...data }));
      setError(null);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Password reset request failed');
      }

      setError(null);
      return await response.json();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        login,
        register,
        logout,
        updateUserProfile,
        resetPassword,
        isAuthenticated: !!user,
        isOwner: user?.user_type === 'owner',
        isRenter: user?.user_type === 'renter',
        isAdmin: user?.user_type === 'admin'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthProvider;