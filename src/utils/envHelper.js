/**
 * Helper functions for environment variables
 */

/**
 * Checks if all required environment variables are set
 * @returns {Object} - Object with validation results
 */
export const validateEnv = () => {
  const required = {
    REACT_APP_SUPABASE_URL: process.env.REACT_APP_SUPABASE_URL,
    REACT_APP_SUPABASE_ANON_KEY: process.env.REACT_APP_SUPABASE_ANON_KEY,
    REACT_APP_API_PROVIDER: process.env.REACT_APP_API_PROVIDER
  };
  
  const missing = Object.entries(required)
    .filter(([_, value]) => !value)
    .map(([key]) => key);
  
  return {
    isValid: missing.length === 0,
    missing,
    provider: process.env.REACT_APP_API_PROVIDER || 'default',
    supabaseUrl: process.env.REACT_APP_SUPABASE_URL ? 'set' : 'missing',
    supabaseAnonKey: process.env.REACT_APP_SUPABASE_ANON_KEY ? 'set' : 'missing'
  };
};

/**
 * Logs environment validation status to console
 */
export const logEnvStatus = () => {
  const validation = validateEnv();
  
  if (validation.isValid) {
    console.log('✅ Environment variables: All required variables are set');
    console.log(`🔄 Using API provider: ${validation.provider}`);
  } else {
    console.warn(`⚠️ Environment variables: Missing ${validation.missing.join(', ')}`);
    console.log('Current status:');
    console.log(`- API Provider: ${validation.provider}`);
    console.log(`- Supabase URL: ${validation.supabaseUrl}`);
    console.log(`- Supabase Anon Key: ${validation.supabaseAnonKey}`);
  }
  
  return validation;
};

export default {
  validateEnv,
  logEnvStatus
};
