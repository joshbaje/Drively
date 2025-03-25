import React from 'react';
import ForceAuthSync from '../components/auth/ForceAuthSync';

const AuthSyncPage = () => {
  return (
    <div className="auth-sync-page">
      <h2>Authentication Synchronization</h2>
      <p>
        Use this page to fix authentication state synchronization issues.
        If you see the "Auth mismatch detected" message, click the "Force Auth Sync" button below.
      </p>
      
      <ForceAuthSync />
      
      <div className="auth-sync-info">
        <h3>How This Works</h3>
        <p>
          Sometimes the application's authentication state can get out of sync with Supabase.
          This tool directly checks your authentication status with Supabase and forces your
          application state to match.
        </p>
        
        <h4>When to Use This:</h4>
        <ul>
          <li>If you're logged in with Supabase but still see login/signup buttons</li>
          <li>If protected pages aren't accessible even though you're logged in</li>
          <li>After logging in with Supabase but before the UI updates</li>
        </ul>
        
        <h4>What It Does:</h4>
        <ul>
          <li>Checks your current authentication status with Supabase</li>
          <li>Updates your application's authentication context</li>
          <li>Resolves mismatches between Supabase and the application</li>
        </ul>
      </div>
      
      <style jsx="true">{`
        .auth-sync-page {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        
        h2 {
          color: #333;
          border-bottom: 2px solid #4a6cf7;
          padding-bottom: 10px;
        }
        
        .auth-sync-info {
          margin-top: 30px;
          background-color: #f8f9fa;
          border: 1px solid #dee2e6;
          border-radius: 8px;
          padding: 20px;
        }
        
        h3 {
          color: #333;
          margin-top: 0;
        }
        
        h4 {
          color: #555;
          margin-bottom: 5px;
        }
        
        ul {
          margin-top: 5px;
        }
        
        li {
          margin-bottom: 5px;
        }
      `}</style>
    </div>
  );
};

export default AuthSyncPage;
