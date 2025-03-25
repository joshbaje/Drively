import { createClient } from '@supabase/supabase-js';

// Validate environment variables
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

// Initialize a flag for Supabase readiness
let isSupabaseReady = false;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase configuration. Check your .env file.');
  throw new Error('Supabase URL and Anon Key must be provided');
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  // Optional configuration
  auth: {
    persistSession: true
  }
});

// Function to check if Supabase is ready
function checkSupabaseReady() {
  return isSupabaseReady;
}

// Once client is created, set readiness flag
isSupabaseReady = true;

export default supabase;
export { checkSupabaseReady };