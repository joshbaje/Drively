/**
 * Database Configuration for Drively
 * 
 * This file contains configuration settings for different database environments.
 * It provides connection parameters and settings for both Xano and Supabase backends.
 */

const ENVIRONMENTS = {
  development: 'development',
  production: 'production',
  test: 'test'
};

const currentEnv = process.env.NODE_ENV || ENVIRONMENTS.development;

// Xano configuration
const xanoConfig = {
  development: {
    baseUrl: 'https://x8ki-letl-twmt.n7.xano.io/api:scA8Isc8',
    tokenKey: 'auth_token',
    debug: true
  },
  production: {
    baseUrl: 'https://x8ki-letl-twmt.n7.xano.io/api:scA8Isc8',
    tokenKey: 'auth_token',
    debug: false
  },
  test: {
    baseUrl: 'https://x8ki-letl-twmt.n7.xano.io/api:scA8Isc8',
    tokenKey: 'auth_token',
    debug: true
  }
};

// Supabase configuration
const supabaseConfig = {
  development: {
    url: process.env.REACT_APP_SUPABASE_URL || 'https://your-supabase-project.supabase.co',
    anonKey: process.env.REACT_APP_SUPABASE_ANON_KEY || 'your-supabase-anon-key',
    debug: true
  },
  production: {
    url: process.env.REACT_APP_SUPABASE_URL,
    anonKey: process.env.REACT_APP_SUPABASE_ANON_KEY,
    debug: false
  },
  test: {
    url: process.env.REACT_APP_SUPABASE_TEST_URL || 'https://your-test-project.supabase.co',
    anonKey: process.env.REACT_APP_SUPABASE_TEST_ANON_KEY || 'your-test-anon-key',
    debug: true
  }
};

// Determine which provider to use
const getProviderType = () => {
  return process.env.REACT_APP_API_PROVIDER || 'xano';
};

// Get configuration for the current environment and provider
const getConfig = () => {
  const provider = getProviderType();
  
  if (provider === 'supabase') {
    return supabaseConfig[currentEnv];
  }
  
  return xanoConfig[currentEnv];
};

export default {
  ENVIRONMENTS,
  currentEnv,
  getConfig,
  getProviderType
};
