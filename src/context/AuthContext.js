import { createContext, useState, useEffect, useContext } from 'react';
import ApiService from '../services/api';

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
      const userData = await ApiService.auth.getCurrentUser();
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
      const data = await ApiService.auth.login(email, password);
      
      if (data.authToken) {
        localStorage.setItem('auth_token', data.authToken);
        setToken(data.authToken);
      }
      
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
      const data = await ApiService.auth.register(userData);
      
      if (data.authToken) {
        localStorage.setItem('auth_token', data.authToken);
        setToken(data.authToken);
      }
      
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

  const logout = () => {
    ApiService.auth.logout();
    localStorage.removeItem('auth_token');
    setToken(null);
    setUser(null);
  };

  const updateUserProfile = async (profileData) => {
    try {
      setLoading(true);
      const data = await ApiService.auth.updateProfile(profileData);
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
      const response = await ApiService.auth.resetPasswordRequest(email);
      setError(null);
      return response;
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
        isOwner: user?.user_type === 'verified_owner' || user?.user_type === 'fleet_manager',
        isRenter: user?.user_type === 'verified_renter',
        isAdmin: user?.user_type === 'admin' || user?.user_type === 'super_admin' || user?.user_type === 'system_admin',
        isAgent: user?.user_type === 'support' || user?.user_type === 'content_moderator'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthProvider;