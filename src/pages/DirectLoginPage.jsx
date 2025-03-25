import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Create a fresh Supabase client directly in this component
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

// Create a fresh client with no connection to any other instances
const freshSupabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
    // Use a unique storage key to avoid conflicts
    storageKey: 'direct.supabase.auth.token',
  }
});

const DirectLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Check for existing session on component mount
  useEffect(() => {
    const checkSession = async () => {
      // Get session from this specific client
      const { data, error } = await freshSupabase.auth.getSession();
      
      if (data?.session) {
        setSession(data.session);
        setUser(data.session.user);
        console.log('Found existing session:', data.session);
      } else {
        console.log('No session found');
      }
      
      if (error) {
        console.error('Session check error:', error);
      }
    };
    
    checkSession();
    
    // Listen for auth state changes
    const { data: authListener } = freshSupabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state change:', event, session);
      
      if (session) {
        setSession(session);
        setUser(session.user);
      } else {
        setSession(null);
        setUser(null);
      }
    });
    
    return () => {
      // Clean up listener
      if (authListener?.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  // Handle direct login
  const handleDirectLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage('');
    
    try {
      // Clear any existing tokens first
      await freshSupabase.auth.signOut();
      localStorage.removeItem('auth_token');
      localStorage.removeItem('supabase.auth.token');
      
      console.log('Attempting direct login with fresh client...');
      
      // Use the fresh client to sign in
      const { data, error } = await freshSupabase.auth.signInWithPassword({
        email: email,
        password: password
      });
      
      if (error) throw error;
      
      if (!data?.session) {
        throw new Error('Login succeeded but no session was returned');
      }
      
      // Store the token in both places for compatibility
      console.log('Login successful, storing tokens...');
      localStorage.setItem('auth_token', data.session.access_token);
      localStorage.setItem('supabase.auth.token', JSON.stringify({
        currentSession: data.session,
        expiresAt: Math.floor(Date.now() / 1000) + data.session.expires_in
      }));
      
      setSession(data.session);
      setUser(data.user);
      setSuccessMessage('Login successful! You can now navigate to protected routes.');
      
      console.log('Authentication successful:', data);
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    setLoading(true);
    try {
      // Sign out from the fresh client
      await freshSupabase.auth.signOut();
      
      // Clear all tokens
      localStorage.removeItem('auth_token');
      localStorage.removeItem('supabase.auth.token');
      localStorage.removeItem('direct.supabase.auth.token');
      
      setSession(null);
      setUser(null);
      setSuccessMessage('Logout successful');
    } catch (error) {
      console.error('Logout error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle checking storage
  const checkStorage = () => {
    try {
      const directToken = localStorage.getItem('direct.supabase.auth.token');
      const mainToken = localStorage.getItem('supabase.auth.token');
      const legacyToken = localStorage.getItem('auth_token');
      
      const status = {
        directTokenExists: Boolean(directToken),
        mainTokenExists: Boolean(mainToken),
        legacyTokenExists: Boolean(legacyToken),
        localStorage: {
          available: typeof localStorage !== 'undefined',
          writable: false
        }
      };
      
      // Test if localStorage is writable
      try {
        localStorage.setItem('test-storage', 'test');
        const testValue = localStorage.getItem('test-storage');
        status.localStorage.writable = testValue === 'test';
        localStorage.removeItem('test-storage');
      } catch (e) {
        status.localStorage.error = e.message;
      }
      
      console.log('Storage status:', status);
      alert(`Storage check complete. See console for details.`);
    } catch (error) {
      console.error('Storage check error:', error);
      alert(`Storage check error: ${error.message}`);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: '#333', marginBottom: '20px' }}>Direct Supabase Login</h1>
      <p>This page uses a completely isolated Supabase client for authentication.</p>
      
      {user ? (
        <div style={{ 
          marginBottom: '20px', 
          padding: '15px', 
          backgroundColor: '#f0f8ff', 
          borderRadius: '5px', 
          border: '1px solid #b8daff' 
        }}>
          <h2>Logged In as: {user.email}</h2>
          <div>
            <strong>User ID:</strong> {user.id}
          </div>
          {user.user_metadata && (
            <div>
              <strong>User Type:</strong> {user.user_metadata.user_type || 'Not set'}
            </div>
          )}
          <div>
            <strong>Created:</strong> {new Date(user.created_at).toLocaleString()}
          </div>
          
          <h3 style={{ marginTop: '20px' }}>Session Info</h3>
          {session && (
            <pre style={{ 
              backgroundColor: '#f5f5f5', 
              padding: '10px', 
              borderRadius: '5px', 
              overflow: 'auto',
              fontSize: '12px'
            }}>
              {JSON.stringify({
                access_token: session.access_token?.substring(0, 15) + '...',
                refresh_token: session.refresh_token?.substring(0, 15) + '...',
                expires_at: new Date(session.expires_at * 1000).toLocaleString()
              }, null, 2)}
            </pre>
          )}
          
          <button
            onClick={handleLogout}
            disabled={loading}
            style={{
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              padding: '10px 20px',
              fontSize: '16px',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginTop: '20px'
            }}
          >
            {loading ? 'Logging out...' : 'Log Out'}
          </button>
        </div>
      ) : (
        <form onSubmit={handleDirectLogin} style={{ marginBottom: '20px' }}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Email:
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '4px',
                border: '1px solid #ccc',
                fontSize: '16px'
              }}
              required
            />
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Password:
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '4px',
                border: '1px solid #ccc',
                fontSize: '16px'
              }}
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            style={{
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              padding: '12px 20px',
              fontSize: '16px',
              cursor: loading ? 'not-allowed' : 'pointer',
              width: '100%'
            }}
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>
      )}
      
      {error && (
        <div style={{
          backgroundColor: '#f8d7da',
          color: '#721c24',
          padding: '12px',
          borderRadius: '4px',
          marginBottom: '20px'
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}
      
      {successMessage && (
        <div style={{
          backgroundColor: '#d4edda',
          color: '#155724',
          padding: '12px',
          borderRadius: '4px',
          marginBottom: '20px'
        }}>
          <strong>Success:</strong> {successMessage}
        </div>
      )}
      
      <div style={{ marginTop: '30px' }}>
        <h3>Troubleshooting Tools</h3>
        <button
          onClick={checkStorage}
          style={{
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            padding: '10px 15px',
            fontSize: '14px',
            cursor: 'pointer',
            marginRight: '10px'
          }}
        >
          Check Local Storage
        </button>
        
        <button
          onClick={() => {
            localStorage.clear();
            alert('Local storage cleared. Refreshing page...');
            window.location.reload();
          }}
          style={{
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            padding: '10px 15px',
            fontSize: '14px',
            cursor: 'pointer'
          }}
        >
          Clear Storage & Refresh
        </button>
      </div>
      
      <div style={{ marginTop: '30px', fontSize: '14px', color: '#666' }}>
        <h3>Debugging Information</h3>
        <p>
          Supabase URL: {supabaseUrl ? supabaseUrl.substring(0, 20) + '...' : 'Not set'}<br />
          Supabase Key: {supabaseAnonKey ? 'Present (starts with ' + supabaseAnonKey.substring(0, 10) + '...)' : 'Not set'}<br />
          Local Storage: {typeof localStorage !== 'undefined' ? 'Available' : 'Not available'}<br />
          Environment: {process.env.NODE_ENV}
        </p>
        
        <p>
          <strong>Tip:</strong> If login fails, check the browser console for more detailed error messages.
        </p>
      </div>
    </div>
  );
};

export default DirectLoginPage;