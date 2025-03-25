import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { logEnvStatus } from './utils/envHelper';
// Initialize sessionManager
import sessionManager from './services/supabase/sessionManager';
// Import Font Awesome for icons
import '@fortawesome/fontawesome-free/css/all.min.css';
// Import Supabase test to check configuration on startup
import './services/supabase/supabaseTest';

// Check for existing session on startup
sessionManager.initializeSession().then(session => {
  if (session) {
    console.log('Session pre-initialized successfully');
  } else {
    console.log('No pre-existing session found');
  }
});

// Log environment status on startup
logEnvStatus();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);