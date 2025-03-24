import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import dbConnection from '../database/connection';

const SupabaseConnectionTest = () => {
  const [status, setStatus] = useState('Loading...');
  const [providerType, setProviderType] = useState(null);
  const [error, setError] = useState(null);
  const [supabaseDirectTest, setSupabaseDirectTest] = useState(null);
  
  useEffect(() => {
    // Get the provider type from the database connection
    try {
      const provider = dbConnection.provider;
      setProviderType(provider);
      
      // Test the connection through the abstraction layer
      const testConnection = async () => {
        try {
          // Try to query a simple system table that should exist
          if (provider === 'supabase') {
            const client = dbConnection.getClient();
            const { data, error } = await client.from('vehicles').select('count(*)');
            
            if (error) {
              throw error;
            }
            
            setStatus('Connected successfully to Supabase!');
            console.log('Connection test result:', data);
          } else {
            setStatus('Using Xano provider. To test Supabase, change REACT_APP_API_PROVIDER.');
          }
        } catch (err) {
          setStatus('Connection failed');
          setError(err.message || 'Unknown error occurred');
          console.error('Connection test error:', err);
        }
      };
      
      testConnection();
      
      // Also try a direct connection if environment variables are available
      const testDirectConnection = async () => {
        const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
        const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
        
        if (supabaseUrl && supabaseKey) {
          try {
            const supabase = createClient(supabaseUrl, supabaseKey);
            const { data, error } = await supabase.from('vehicles').select('count(*)');
            
            if (error) {
              throw error;
            }
            
            setSupabaseDirectTest('Direct connection successful');
            console.log('Direct connection test result:', data);
          } catch (err) {
            setSupabaseDirectTest('Direct connection failed');
            console.error('Direct connection test error:', err);
          }
        } else {
          setSupabaseDirectTest('Supabase environment variables not configured');
        }
      };
      
      testDirectConnection();
    } catch (err) {
      setStatus('Error initializing');
      setError(err.message || 'Unknown error occurred');
      console.error('Initialization error:', err);
    }
  }, []);
  
  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Supabase Connection Test</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <h2>Connection Status</h2>
        <div style={{ 
          padding: '15px', 
          borderRadius: '4px',
          backgroundColor: status.includes('success') ? '#e6ffe6' : '#fff0f0',
          border: `1px solid ${status.includes('success') ? '#99e699' : '#ffcccc'}`
        }}>
          <p><strong>Status:</strong> {status}</p>
          <p><strong>Provider:</strong> {providerType || 'Unknown'}</p>
          {error && <p><strong>Error:</strong> {error}</p>}
        </div>
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <h2>Direct Supabase Connection</h2>
        <div style={{ 
          padding: '15px', 
          borderRadius: '4px',
          backgroundColor: supabaseDirectTest?.includes('successful') ? '#e6ffe6' : '#fff0f0',
          border: `1px solid ${supabaseDirectTest?.includes('successful') ? '#99e699' : '#ffcccc'}`
        }}>
          <p><strong>Status:</strong> {supabaseDirectTest || 'Not tested'}</p>
        </div>
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <h2>Environment Configuration</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f2f2f2' }}>
              <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #ddd' }}>Variable</th>
              <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #ddd' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '8px', border: '1px solid #ddd' }}>REACT_APP_API_PROVIDER</td>
              <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                {process.env.REACT_APP_API_PROVIDER ? `Set to: ${process.env.REACT_APP_API_PROVIDER}` : 'Not set (default: xano)'}
              </td>
            </tr>
            <tr>
              <td style={{ padding: '8px', border: '1px solid #ddd' }}>REACT_APP_SUPABASE_URL</td>
              <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                {process.env.REACT_APP_SUPABASE_URL ? 'Set' : 'Not set'}
              </td>
            </tr>
            <tr>
              <td style={{ padding: '8px', border: '1px solid #ddd' }}>REACT_APP_SUPABASE_ANON_KEY</td>
              <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                {process.env.REACT_APP_SUPABASE_ANON_KEY ? 'Set' : 'Not set'}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div>
        <h2>Next Steps</h2>
        <ol>
          <li>Configure Supabase environment variables in the <code>.env</code> file</li>
          <li>Set <code>REACT_APP_API_PROVIDER=supabase</code> to switch to Supabase backend</li>
          <li>Ensure the database schema is properly set up in Supabase</li>
          <li>Run the application with <code>npm start</code> and check this page again</li>
        </ol>
      </div>
    </div>
  );
};

export default SupabaseConnectionTest;
