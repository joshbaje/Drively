/**
 * Session Manager for Supabase Authentication
 * This module provides reliable session management and persistence
 */

import supabase from './supabaseClient';

// Store token information in a centralized location
let currentSession = null;

/**
 * Persist session to localStorage using multiple formats for compatibility
 * @param {Object} session - Supabase session object
 */
export const persistSession = (session) => {
  if (!session) return false;
  
  try {
    console.log('Persisting session to localStorage...');
    
    // Store in auth_token format (legacy)
    localStorage.setItem('auth_token', session.access_token);
    
    // Store in supabase format
    localStorage.setItem('supabase.auth.token', JSON.stringify({
      currentSession: session,
      expiresAt: Math.floor(Date.now() / 1000) + session.expires_in
    }));
    
    // Store in our custom format
    localStorage.setItem('drivelyph.session', JSON.stringify({
      token: session.access_token,
      refresh_token: session.refresh_token,
      expires_at: new Date(Date.now() + (session.expires_in * 1000)).toISOString(),
      user_id: session.user?.id
    }));
    
    // Update in-memory session
    currentSession = session;
    
    return true;
  } catch (error) {
    console.error('Error persisting session:', error);
    return false;
  }
};

/**
 * Retrieve session from localStorage
 * This attempts multiple formats and fallbacks
 * @returns {Object|null} - Session object or null if not found
 */
export const retrieveSession = () => {
  try {
    // If we have an in-memory session, use that
    if (currentSession) {
      return currentSession;
    }
    
    console.log('Retrieving session from storage...');
    
    // Try supabase format first
    const supabaseRaw = localStorage.getItem('supabase.auth.token');
    if (supabaseRaw) {
      try {
        const parsed = JSON.parse(supabaseRaw);
        if (parsed?.currentSession) {
          currentSession = parsed.currentSession;
          console.log('Retrieved session from supabase format');
          return currentSession;
        }
      } catch (e) {
        console.warn('Error parsing supabase token', e);
      }
    }
    
    // Try our custom format
    const customRaw = localStorage.getItem('drivelyph.session');
    if (customRaw) {
      try {
        const parsed = JSON.parse(customRaw);
        if (parsed?.token) {
          // Create a session-like object
          currentSession = {
            access_token: parsed.token,
            refresh_token: parsed.refresh_token,
            user: { id: parsed.user_id }
          };
          console.log('Retrieved session from custom format');
          return currentSession;
        }
      } catch (e) {
        console.warn('Error parsing custom token', e);
      }
    }
    
    // Try legacy format as last resort
    const legacyToken = localStorage.getItem('auth_token');
    if (legacyToken) {
      // We only have the token, not the full session
      console.log('Retrieved legacy token only - limited functionality');
      return { access_token: legacyToken };
    }
    
    console.log('No session found in storage');
    return null;
  } catch (error) {
    console.error('Error retrieving session:', error);
    return null;
  }
};

/**
 * Clear all session data from storage
 */
export const clearSession = () => {
  try {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('supabase.auth.token');
    localStorage.removeItem('drivelyph.session');
    currentSession = null;
    return true;
  } catch (error) {
    console.error('Error clearing session:', error);
    return false;
  }
};

/**
 * Initialize the session on app startup
 * This handles checking, refreshing, and setting up the session
 */
export const initializeSession = async () => {
  try {
    console.log('Initializing session...');
    
    // Check directly with Supabase first (bypassing localStorage)
    const { data: directSessionData, error: directSessionError } = await supabase.auth.getSession();
    
    // If Supabase has a valid session regardless of localStorage, use it
    if (directSessionData?.session) {
      console.log('Found active Supabase session, using it directly');
      persistSession(directSessionData.session);
      return directSessionData.session;
    }
    
    // If direct check failed but wasn't a serious error, try localStorage fallback
    if (!directSessionError || directSessionError.status !== 401) {
      // Try to retrieve from storage
      const storedSession = retrieveSession();
      
      // If we have a stored session, try to validate it
      if (storedSession?.access_token) {
        console.log('Found stored session, validating with Supabase...');
        
        // Set the session in Supabase
        await supabase.auth.setSession({
          access_token: storedSession.access_token,
          refresh_token: storedSession.refresh_token || ''
        });
        
        // Get the current session to validate
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session validation error:', error);
          clearSession();
          return null;
        }
        
        if (data?.session) {
          console.log('Session validated successfully');
          persistSession(data.session);
          return data.session;
        } else {
          console.log('Session invalid or expired');
          clearSession();
          return null;
        }
      }
    } else {
      console.error('Direct session check error:', directSessionError);
    }
    
    // No active session found
    console.log('No active session found');
    return null;
  } catch (error) {
    console.error('Session initialization error:', error);
    return null;
  }
};

/**
 * Login with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} - Login result
 */
export const login = async (email, password) => {
  try {
    // First clear any existing sessions
    clearSession();
    
    // Sign in with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      throw error;
    }
    
    if (!data?.session) {
      throw new Error('Login succeeded but no session was returned');
    }
    
    // Persist the session
    persistSession(data.session);
    
    return {
      success: true,
      session: data.session,
      user: data.user
    };
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Logout user and clear session
 */
export const logout = async () => {
  try {
    await supabase.auth.signOut();
    clearSession();
    return { success: true };
  } catch (error) {
    console.error('Logout error:', error);
    clearSession(); // Still clear session even if API fails
    return { 
      success: false,
      error: error.message
    };
  }
};

/**
 * Check if user is authenticated
 * @returns {boolean} - Whether user is authenticated
 */
export const isAuthenticated = () => {
  const session = retrieveSession();
  return !!session?.access_token;
};

/**
 * Get current user information
 * @returns {Promise<Object>} - User data
 */
export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) throw error;
    
    return { user, error: null };
  } catch (error) {
    console.error('Get current user error:', error);
    return { user: null, error };
  }
};

export default {
  persistSession,
  retrieveSession,
  clearSession,
  initializeSession,
  login,
  logout,
  isAuthenticated,
  getCurrentUser
};