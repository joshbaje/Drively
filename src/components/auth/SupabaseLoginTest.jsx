import React, { useState, useEffect } from 'react';
import supabase from '../../services/supabase/supabaseClient';
import { isSupabaseReady } from '../../services/supabase/supabaseClient';

/**
 * Supabase Login Test Component
 * 
 * This component provides a simple interface to test Supabase authentication
 * independently of the main application flow. It's useful for debugging and
 * verifying that the Supabase configuration is working correctly.
 */
const SupabaseLoginTest = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [supabaseStatus, setSupabaseStatus] = useState({
    ready: false,
    url: null,
    anon_key: null
  });

  // Check Supabase client initialization
  useEffect(() => {
    const checkSupabase = () => {
      const ready = isSupabaseReady();
      setSupabaseStatus({
        ready,
        url: process.env.REACT_APP_SUPABASE_URL ? 'Configured' : 'Missing',
        anon_key: process.env.REACT_APP_SUPABASE_ANON_KEY ? 'Configured' : 'Missing'
      });

      // Check current session
      const checkSession = async () => {
        try {
          const { data, error } = await supabase.auth.getSession();
          if (error) {
            console.error('Session error:', error);
            return;
          }
          
          if (data?.session?.user) {
            setUser(data.session.user);
            setStatus('authenticated');
          }
        } catch (err) {
          console.error('Failed to check session:', err);
        }
      };

      if (ready) {
        checkSession();
      }
    };

    checkSupabase();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      setStatus('loading');
      setError(null);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        throw error;
      }

      setUser(data.user);
      setStatus('authenticated');
      console.log('Login successful:', data);
    } catch (err) {
      setError(err.message);
      setStatus('error');
      console.error('Login failed:', err);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    
    try {
      setStatus('loading');
      setError(null);

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            user_type: 'renter',
            first_name: 'Test',
            last_name: 'User',
            created_at: new Date().toISOString()
          }
        }
      });

      if (error) {
        throw error;
      }

      if (data.user && !data.session) {
        setStatus('email_confirmation_required');
      } else if (data.user && data.session) {
        setUser(data.user);
        setStatus('authenticated');
      }
      
      console.log('Signup successful:', data);
    } catch (err) {
      setError(err.message);
      setStatus('error');
      console.error('Signup failed:', err);
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      setUser(null);
      setStatus('idle');
    } catch (err) {
      setError(err.message);
      console.error('Logout failed:', err);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
      <h2>Supabase Authentication Test</h2>
      
      <div style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}>
        <h3>Supabase Status</h3>
        <p><strong>Ready:</strong> {supabaseStatus.ready ? '✅ Yes' : '❌ No'}</p>
        <p><strong>URL:</strong> {supabaseStatus.url}</p>
        <p><strong>Anon Key:</strong> {supabaseStatus.anon_key}</p>
      </div>

      {user ? (
        <div style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}>
          <h3>Authenticated User</h3>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>ID:</strong> {user.id}</p>
          <p><strong>Created At:</strong> {new Date(user.created_at).toLocaleString()}</p>
          <p><strong>User Type:</strong> {user.user_metadata?.user_type || 'Not specified'}</p>
          <button 
            onClick={handleLogout}
            style={{ padding: '8px 16px', background: '#f44336', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Log Out
          </button>
        </div>
      ) : (
        <form style={{ marginBottom: '20px' }} onSubmit={handleLogin}>
          <div style={{ marginBottom: '10px' }}>
            <label htmlFor="email" style={{ display: 'block', marginBottom: '5px' }}>Email:</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
              required
            />
          </div>
          
          <div style={{ marginBottom: '10px' }}>
            <label htmlFor="password" style={{ display: 'block', marginBottom: '5px' }}>Password:</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
              required
            />
          </div>
          
          {error && (
            <div style={{ padding: '10px', background: '#ffebee', color: '#c62828', borderRadius: '4px', marginBottom: '10px' }}>
              {error}
            </div>
          )}
          
          {status === 'email_confirmation_required' && (
            <div style={{ padding: '10px', background: '#e8f5e9', color: '#2e7d32', borderRadius: '4px', marginBottom: '10px' }}>
              Registration successful! Please check your email to confirm your account.
            </div>
          )}
          
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              type="submit" 
              disabled={status === 'loading'}
              style={{ 
                padding: '8px 16px', 
                background: '#2196f3', 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px', 
                cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                opacity: status === 'loading' ? 0.7 : 1
              }}
            >
              {status === 'loading' ? 'Loading...' : 'Log In'}
            </button>
            
            <button 
              type="button" 
              onClick={handleSignup}
              disabled={status === 'loading'}
              style={{ 
                padding: '8px 16px', 
                background: '#4caf50', 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px', 
                cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                opacity: status === 'loading' ? 0.7 : 1
              }}
            >
              {status === 'loading' ? 'Loading...' : 'Sign Up'}
            </button>
          </div>
        </form>
      )}
      
      <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
        <p>This component tests Supabase authentication independently of the main application.</p>
        <p>It's useful for verifying that your Supabase configuration is working correctly.</p>
      </div>
    </div>
  );
};

export default SupabaseLoginTest;
