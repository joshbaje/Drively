// src/components/auth/SyncAuthState.jsx

import { useEffect } from 'react';
import supabase from '../../services/supabase/supabaseClient';
import { useAuth } from '../../context/AuthContext';

/**
 * SyncAuthState Component
 * 
 * This component ensures synchronization between Supabase's authentication
 * state and your application's auth context. It should be included near
 * the top of your component tree to ensure auth state is properly initialized.
 */
function SyncAuthState() {
  const { setUser, setToken, user, token } = useAuth();
  
  useEffect(() => {
    // Check initial auth state when component mounts
    const checkAuthState = async () => {
      try {
        console.log("[SYNC] Checking initial auth state...");
        
        // Get current session
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("[SYNC] Error checking auth state:", error);
          return;
        }
        
        const session = data?.session;
        console.log("[SYNC] Session check result:", session ? "FOUND" : "NONE");
        
        if (session) {
          console.log("[SYNC] Found active session, setting user state");
          
          // Set token in auth context
          setToken(session.access_token);
          
          // Get full user details
          const { data: userData, error: userError } = await supabase.auth.getUser();
          
          if (userError) {
            console.error("[SYNC] Error getting user:", userError);
            return;
          }
          
          if (userData?.user) {
            // Add any application-specific user fields
            const appUser = {
              ...userData.user,
              user_id: userData.user.id,
              user_type: userData.user.user_metadata?.user_type || 'renter',
              first_name: userData.user.user_metadata?.first_name || '',
              last_name: userData.user.user_metadata?.last_name || '',
              email: userData.user.email
            };
            
            // If no existing user in context, or different user, update it
            if (!user || user.user_id !== appUser.user_id) {
              console.log("[SYNC] Setting user in context:", appUser.email);
              setUser(appUser);
            }
          }
        } else if (user || token) {
          console.log("[SYNC] No active session but user in context - clearing");
          setUser(null);
          setToken(null);
        } else {
          console.log("[SYNC] No active session found");
        }
      } catch (err) {
        console.error("[SYNC] Exception checking auth state:", err);
      }
    };
    
    // Perform initial check
    checkAuthState();
    
    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log(`[SYNC] Auth state change: ${event}`);
      
      if (event === 'SIGNED_IN' && session) {
        console.log("[SYNC] Signed in event detected");
        setToken(session.access_token);
        
        // Get user details and update context
        supabase.auth.getUser().then(({ data, error }) => {
          if (error) {
            console.error("[SYNC] Error getting user after sign in:", error);
            return;
          }
          
          if (data?.user) {
            const appUser = {
              ...data.user,
              user_id: data.user.id,
              user_type: data.user.user_metadata?.user_type || 'renter',
              first_name: data.user.user_metadata?.first_name || '',
              last_name: data.user.user_metadata?.last_name || '',
              email: data.user.email
            };
            
            console.log("[SYNC] Setting user after sign in:", appUser.email);
            setUser(appUser);
          }
        });
      } else if (event === 'SIGNED_OUT') {
        console.log("[SYNC] Signed out event detected");
        setUser(null);
        setToken(null);
      } else if (event === 'TOKEN_REFRESHED' && session) {
        console.log("[SYNC] Token refreshed event detected");
        setToken(session.access_token);
      }
    });
    
    // Check auth state every minute to ensure it stays in sync
    const intervalId = setInterval(() => {
      checkAuthState();
    }, 60000);
    
    // Cleanup listener and interval
    return () => {
      console.log("[SYNC] Cleaning up auth listener");
      authListener?.subscription?.unsubscribe();
      clearInterval(intervalId);
    };
  }, [setUser, setToken, user, token]);
  
  // This component doesn't render anything
  return null;
}

export default SyncAuthState;