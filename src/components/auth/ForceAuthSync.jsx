// src/components/auth/ForceAuthSync.jsx

import React, { useEffect, useState } from 'react';
import supabase from '../../services/supabase/supabaseClient';
import { useAuth } from '../../context/AuthContext';

/**
 * ForceAuthSync Component
 * 
 * This component forces synchronization between Supabase's authentication state
 * and your application's auth context. It includes manual user-triggered sync
 * and auto-repair functionality.
 */
const ForceAuthSync = () => {
  const { user, setUser, setToken, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [supabaseStatus, setSupabaseStatus] = useState('checking');
  const [message, setMessage] = useState('');
  
  // Check Supabase auth status on mount
  useEffect(() => {
    checkSupabaseAuth();
  }, []);
  
  // Check Supabase authentication status
  const checkSupabaseAuth = async () => {
    try {
      setSupabaseStatus('checking');
      
      // Direct check with Supabase - first check for session
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error("Error checking Supabase session:", sessionError);
        setSupabaseStatus('error');
        setMessage(`Session Error: ${sessionError.message}`);
        return;
      }
      
      // If we have a valid session, we're authenticated
      if (sessionData?.session) {
        setSupabaseStatus('authenticated');
        setMessage(`Supabase session active for: ${sessionData.session.user.email}`);
        
        // If application doesn't know we're authenticated, there's a mismatch
        if (!isAuthenticated) {
          setMessage(`Auth mismatch detected! Supabase: Yes, App: No`);
        }
        return;
      }
      
      // No session, so try checking user directly as a fallback
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.error("Error checking Supabase user:", userError);
        setSupabaseStatus('error');
        setMessage(`Auth Error: ${userError.message}`);
        return;
      }
      
      if (userData?.user) {
        setSupabaseStatus('authenticated');
        setMessage(`Supabase user found: ${userData.user.email} (but no active session)`);
        
        // If application doesn't know we're authenticated, there's a mismatch
        if (!isAuthenticated) {
          setMessage(`Auth mismatch detected! Supabase has user but no session, App: No`);
        }
      } else {
        setSupabaseStatus('unauthenticated');
        setMessage('Not authenticated with Supabase');
      }
    } catch (err) {
      console.error("Exception checking auth:", err);
      setSupabaseStatus('error');
      setMessage(`Error: ${err.message}`);
    }
  };
  
  // Force synchronization with more reliable handling
  const forceSync = async () => {
    setLoading(true);
    setMessage('Forcing authentication sync...');
    
    try {
      // First, explicitly store any existing session in localStorage
      // This is a crucial step to ensure localStorage and Supabase are in sync
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        setMessage(`Session error: ${sessionError.message}`);
        setLoading(false);
        return;
      }
      
      if (!sessionData?.session) {
        // No active session in Supabase - try to get the user anyway
        const { data: userData } = await supabase.auth.getUser();
        
        if (userData?.user) {
          setMessage('User found but no active session. Creating new session...');
          
          // Try to refresh the session
          const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
          
          if (refreshError || !refreshData?.session) {
            setMessage(`Could not create session: ${refreshError?.message || 'Unknown error'}`);
            setLoading(false);
            return;
          }
          
          // Continue with the refreshed session
          sessionData.session = refreshData.session;
        } else {
          setMessage('No active session or user found');
          setLoading(false);
          return;
        }
      }
      
      // Manually persist session to all storage formats
      try {
        // Store in auth_token format (legacy)
        localStorage.setItem('auth_token', sessionData.session.access_token);
        
        // Store in supabase format
        localStorage.setItem('supabase.auth.token', JSON.stringify({
          currentSession: sessionData.session,
          expiresAt: Math.floor(Date.now() / 1000) + (sessionData.session.expires_in || 3600)
        }));
        
        // Store in our custom format
        localStorage.setItem('drivelyph.session', JSON.stringify({
          token: sessionData.session.access_token,
          refresh_token: sessionData.session.refresh_token,
          expires_at: new Date(Date.now() + ((sessionData.session.expires_in || 3600) * 1000)).toISOString(),
          user_id: sessionData.session.user?.id
        }));
        
        console.log('Session manually persisted to localStorage');
      } catch (storageError) {
        console.error('Error persisting session to localStorage:', storageError);
        setMessage(`Storage error: ${storageError.message}. Continuing anyway...`);
      }
      
      // Get user details directly from session to ensure consistency
      const userFromSession = sessionData.session.user;
      
      if (!userFromSession) {
        setMessage('No user data in session');
        setLoading(false);
        return;
      }
      
      // Set token in context
      setToken(sessionData.session.access_token);
      
      // Create a complete user object
      const completeUser = {
        ...userFromSession,
        user_id: userFromSession.id,
        email: userFromSession.email,
        first_name: userFromSession.user_metadata?.first_name || '',
        last_name: userFromSession.user_metadata?.last_name || '',
        user_type: userFromSession.user_metadata?.user_type || 'renter',
        is_verified: !!userFromSession.email_confirmed_at,
        profile_complete: true,
        // Force a timestamp to ensure React detects the change
        _timestamp: Date.now()
      };
      
      // Update user in context
      setUser(completeUser);
      
      setMessage(`Auth sync successful for ${userFromSession.email}`);
      
      // Perform a hard reload to ensure all components re-render with the new auth state
      window.location.reload();
    } catch (err) {
      console.error("Error during force sync:", err);
      setMessage(`Sync error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  // Logout from Supabase
  const handleLogout = async () => {
    setLoading(true);
    setMessage('Logging out...');
    
    try {
      await supabase.auth.signOut();
      localStorage.removeItem('supabase.auth.token');
      localStorage.removeItem('drivelyph.session');
      localStorage.removeItem('auth_token');
      
      setMessage('Logged out successfully');
      
      // Force reload after logout
      window.location.href = '/';
    } catch (err) {
      console.error("Error during logout:", err);
      setMessage(`Logout error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="force-auth-sync">
      <div className="auth-status">
        <h3>Authentication Status</h3>
        <div className="status-item">
          <span>Supabase Auth:</span>
          <span className={
            supabaseStatus === 'authenticated' ? 'status-positive' : 
            supabaseStatus === 'error' ? 'status-negative' : 
            'status-neutral'
          }>
            {supabaseStatus === 'authenticated' ? 'Authenticated' : 
             supabaseStatus === 'unauthenticated' ? 'Not authenticated' :
             supabaseStatus === 'error' ? 'Error' : 'Checking...'}
          </span>
        </div>
        <div className="status-item">
          <span>App Context:</span>
          <span className={isAuthenticated ? 'status-positive' : 'status-negative'}>
            {isAuthenticated ? 'Authenticated' : 'Not authenticated'}
          </span>
        </div>
        {user && (
          <div className="user-info">
            <p><strong>User:</strong> {user.email}</p>
            <p><strong>Type:</strong> {user.user_type || 'Not set'}</p>
          </div>
        )}
        {message && <div className="message">{message}</div>}
      </div>
      
      <div className="action-buttons">
        <button 
          onClick={checkSupabaseAuth} 
          disabled={loading}
          className="check-button"
        >
          Check Auth Status
        </button>
        
        <button 
          onClick={forceSync} 
          disabled={loading || supabaseStatus !== 'authenticated'}
          className="sync-button"
        >
          Force Auth Sync
        </button>
        
        <button 
          onClick={handleLogout} 
          disabled={loading}
          className="logout-button"
        >
          Force Logout
        </button>
      </div>
      
      <style jsx="true">{`
        .force-auth-sync {
          background-color: #f8f9fa;
          border: 1px solid #dee2e6;
          border-radius: 8px;
          padding: 20px;
          margin: 20px auto;
          max-width: 600px;
          font-family: -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        }
        
        h3 {
          margin-top: 0;
          color: #333;
          border-bottom: 1px solid #dee2e6;
          padding-bottom: 10px;
        }
        
        .auth-status {
          margin-bottom: 20px;
        }
        
        .status-item {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid #f2f2f2;
        }
        
        .status-positive {
          color: #28a745;
          font-weight: bold;
        }
        
        .status-negative {
          color: #dc3545;
          font-weight: bold;
        }
        
        .status-neutral {
          color: #6c757d;
        }
        
        .message {
          margin-top: 15px;
          padding: 10px;
          background-color: #f1f1f1;
          border-radius: 4px;
          color: #333;
          font-size: 0.9rem;
        }
        
        .user-info {
          margin-top: 15px;
          padding: 10px;
          background-color: #e9f7fd;
          border-radius: 4px;
        }
        
        .user-info p {
          margin: 5px 0;
        }
        
        .action-buttons {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }
        
        button {
          padding: 8px 16px;
          border-radius: 4px;
          border: none;
          cursor: pointer;
          font-weight: bold;
          transition: background-color 0.2s;
        }
        
        button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .check-button {
          background-color: #17a2b8;
          color: white;
        }
        
        .check-button:hover:not(:disabled) {
          background-color: #138496;
        }
        
        .sync-button {
          background-color: #28a745;
          color: white;
        }
        
        .sync-button:hover:not(:disabled) {
          background-color: #218838;
        }
        
        .logout-button {
          background-color: #dc3545;
          color: white;
        }
        
        .logout-button:hover:not(:disabled) {
          background-color: #c82333;
        }
      `}</style>
    </div>
  );
};

export default ForceAuthSync;
