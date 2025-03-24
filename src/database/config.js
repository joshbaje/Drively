/**
 * Supabase Configuration for Drively
 * 
 * This file contains configuration settings for different Supabase environments.
 * It provides connection parameters and settings for the Supabase backend.
 */

const ENVIRONMENTS = {
  development: 'development',
  production: 'production',
  test: 'test'
};

const currentEnv = process.env.NODE_ENV || ENVIRONMENTS.development;

// Supabase configuration for each environment
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

// Get configuration for the current environment
const getConfig = () => {
  return supabaseConfig[currentEnv];
};

export default {
  ENVIRONMENTS,
  currentEnv,
  getConfig
};
