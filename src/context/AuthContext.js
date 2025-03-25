import { createContext, useState, useEffect, useContext } from 'react';
import ApiService from '../services/api';
import supabase from '../services/supabase/supabaseClient';
import authService from '../services/supabase/auth/authService';
import sessionManager from '../services/supabase/sessionManager';
import { checkSupabaseReady } from '../services/supabase/supabaseClient';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [authInitialized, setAuthInitialized] = useState(false);

  const fetchDirectUserData = async (supabaseUser) => {
    try {
      setLoading(true);
      
      if (!supabaseUser) {
        throw new Error('No Supabase user provided');
      }
      
      console.log('Fetching user data directly from Supabase auth user:', supabaseUser.email);
      
      // First try to get the user from our database using authService
      const { user: dbUser, error: dbError } = await authService.getCurrentUser();
      
      if (dbUser) {
        console.log('Complete user record found in database');
        setUser(dbUser);
        setError(null);
        return dbUser;
      }
      
      console.log('Creating minimal user object from Supabase Auth data');
      const minimalUser = {
        user_id: supabaseUser.id,
        email: supabaseUser.email,
        first_name: supabaseUser.user_metadata?.first_name || '',
        last_name: supabaseUser.user_metadata?.last_name || '',
        user_type: supabaseUser.user_metadata?.user_type || 'renter',
        is_verified: !!supabaseUser.email_confirmed_at,
        created_at: supabaseUser.created_at,
        is_minimal_record: true
      };
      
      setUser(minimalUser);
      setError(null);
      return minimalUser;
    } catch (err) {
      console.error('Error creating user data from Supabase auth:', err);
      setError(err.message || 'Authentication error');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentUser = async () => {
    try {
      setLoading(true);
      
      const userData = await ApiService.auth.getCurrentUser();
      
      if (!userData) {
        throw new Error('Failed to fetch user data');
      }
      
      console.log('User data retrieved successfully');
      setUser(userData);
      setError(null);
      return userData;
    } catch (err) {
      console.error('Error fetching current user:', err);
      setError(err.message || 'Authentication error');
      
      try {
        const { data } = await supabase.auth.getUser();
        if (data?.user) {
          console.log('Falling back to direct Supabase user data');
          return await fetchDirectUserData(data.user);
        }
      } catch (supabaseErr) {
        console.error('Supabase fallback also failed:', supabaseErr);
      }
      
      if (err.message?.includes('auth') || err.message?.includes('token') || err.status === 401) {
        await logout();
      }
      
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setLoading(true);
        
        if (!checkSupabaseReady()) {
          console.error('Supabase client not properly initialized');
          setError('Authentication service unavailable');
          setLoading(false);
          return;
        }
        
        console.log('Starting auth initialization...');
        
        const { data: directData } = await supabase.auth.getSession();
        
        if (directData?.session) {
          console.log('Active Supabase session found:', directData.session.user.email);
          
          sessionManager.persistSession(directData.session);
          
          const accessToken = directData.session.access_token;
          setToken(accessToken);
          
          await fetchDirectUserData(directData.session.user);
        } else {
          const session = await sessionManager.initializeSession();
          
          if (session) {
            console.log('Active session found');
            
            const accessToken = session.access_token;
            setToken(accessToken);
            
            await fetchCurrentUser();
          } else {
            console.log('No active session');
            setUser(null);
            setToken(null);
          }
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        setError(err.message);
        setUser(null);
        setToken(null);
        sessionManager.clearSession();
      } finally {
        setLoading(false);
        setAuthInitialized(true);
        console.log('Auth initialization completed');
      }
    };
    
    initializeAuth();
    
    let subscription = null;
    
    if (supabase && supabase.auth) {
      const { data } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          console.log(`Auth event: ${event}`, session);
          
          if (event === 'SIGNED_IN' && session) {
            setToken(session.access_token);
            sessionManager.persistSession(session);
            await fetchCurrentUser();
          } else if (event === 'SIGNED_OUT') {
            setUser(null);
            setToken(null);
            sessionManager.clearSession();
          } else if (event === 'TOKEN_REFRESHED' && session) {
            setToken(session.access_token);
            sessionManager.persistSession(session);
          } else if (event === 'USER_UPDATED' && session) {
            await fetchCurrentUser();
          }
        }
      );
      
      subscription = data.subscription;
    } else {
      console.error('Supabase auth is not available');
    }

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Login attempt:', email);
      
      const result = await sessionManager.login(email, password);
      
      if (!result.success) {
        throw new Error(result.error || 'Login failed');
      }
      
      console.log('Login successful');
      
      setToken(result.session.access_token);
      
      if (result.user) {
        setUser(result.user);
      } else {
        await fetchCurrentUser();
      }
      
      return result;
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      
      await sessionManager.logout();
      
      setUser(null);
      setToken(null);
      
      window.location.href = '/';
    } catch (err) {
      console.error('Logout error:', err);
      sessionManager.clearSession();
      setUser(null);
      setToken(null);
      
      window.location.href = '/';
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      const result = await ApiService.auth.register(userData);
      
      if (result.authToken) {
        localStorage.setItem('auth_token', result.authToken);
        setToken(result.authToken);
        
        if (result.user) {
          setUser(result.user);
        } else {
          await fetchCurrentUser();
        }
      }
      
      setError(null);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
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
        authInitialized,
        login,
        register,
        logout,
        updateUserProfile,
        resetPassword,
        isAuthenticated: !!user,
        isOwner: user?.user_type === 'owner' || user?.user_type === 'verified_owner' || user?.user_type === 'fleet_manager',
        isRenter: user?.user_type === 'renter' || user?.user_type === 'verified_renter',
        isAdmin: user?.user_type === 'admin' || user?.user_type === 'super_admin' || user?.user_type === 'system_admin',
        isAgent: user?.user_type === 'support' || user?.user_type === 'content_moderator',
        setUser,
        setToken,
        fetchCurrentUser,
        fetchDirectUserData
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthProvider;