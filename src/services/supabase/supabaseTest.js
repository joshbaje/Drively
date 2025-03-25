/**
 * Supabase Configuration Test
 * This file performs a quick test of Supabase configuration when imported
 */

import supabase from './supabaseClient';
import { checkSupabaseReady } from './supabaseClient';

// Run immediate test
(async function testSupabaseConfig() {
  console.log('======= SUPABASE CONFIGURATION TEST =======');
  
  // Check if Supabase client is properly initialized
  const ready = checkSupabaseReady();
  console.log(`Supabase client initialized: ${ready ? 'YES' : 'NO'}`);
  
  // Attempt to get current session
  const { data, error } = await supabase.auth.getSession();
  
  if (error) {
    console.error('Error getting session:', error.message);
  } else {
    console.log(`Session found: ${data.session ? 'YES' : 'NO'}`);
    if (data.session) {
      console.log(`User ID: ${data.session.user.id}`);
      console.log(`Session expires: ${new Date(data.session.expires_at * 1000).toLocaleString()}`);
    }
  }
  
  // Check localStorage for tokens
  const authToken = localStorage.getItem('auth_token');
  const supabaseToken = localStorage.getItem('supabase.auth.token');
  
  console.log(`Auth token in localStorage: ${authToken ? 'YES' : 'NO'}`);
  console.log(`Supabase token in localStorage: ${supabaseToken ? 'YES' : 'NO'}`);
  
  // Output configuration summary
  console.log('=========================================');
})();

export default {
  testAuth: async () => {
    const { data } = await supabase.auth.getSession();
    return {
      hasSession: !!data.session,
      session: data.session || null
    };
  }
};