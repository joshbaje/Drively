import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client with environment variables
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://your-project-url.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'your-anon-key';

// Add check to ensure variables are available
if (supabaseUrl === 'https://your-project-url.supabase.co' || 
    supabaseAnonKey === 'your-anon-key') {
  console.error('Missing Supabase environment variables. Using placeholder values, authentication will not work properly.');
}

// Create a single instance of the Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  }
});

// Add a helper to check if Supabase is properly initialized
export const isSupabaseReady = () => {
  return Boolean(supabaseUrl && supabaseAnonKey && supabase);
};

// Add listener for auth state changes to help with debugging
supabase.auth.onAuthStateChange((event, session) => {
  console.log(`Supabase Auth event: ${event}`, session ? `User: ${session.user.id}` : 'No session');
});

// Add a helper function to check if a table exists and has the expected columns
export const validateTable = async (tableName, requiredColumns = []) => {
  try {
    // Check if the table exists by attempting to select a single row
    const { data, error } = await supabase
      .from(tableName)
      .select(requiredColumns.join(', '))
      .limit(1);
    
    if (error) {
      console.error(`Table validation error for ${tableName}:`, error.message);
      return { valid: false, error: error.message };
    }
    
    return { valid: true, error: null };
  } catch (err) {
    console.error(`Table validation failed for ${tableName}:`, err.message);
    return { valid: false, error: err.message };
  }
};

// Export a helper function to handle API responses consistently
export const handleSupabaseResponse = (data, error) => {
  if (error) {
    console.error('Supabase error:', error);
    throw new Error(error.message || 'An error occurred with the Supabase operation');
  }
  return data;
};

export default supabase;
