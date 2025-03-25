import supabase from '../supabaseClient';

/**
 * Supabase Authentication Service
 * Handles user authentication flows including signup, login, password reset, etc.
 */
const authService = {
  /**
   * Register a new user
   * @param {string} email - User's email
   * @param {string} password - User's password
   * @param {Object} metadata - Additional user metadata (first_name, last_name, etc.)
   * @returns {Promise} - Registration result
   */
  async signUp(email, password, metadata = {}) {
    try {
      if (!supabase || !supabase.auth) {
        return { data: null, error: { message: 'Supabase client not properly initialized' } };
      }

      console.log('Attempting to sign up user:', email);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            ...metadata,
            user_type: metadata.user_type || 'renter',
            created_at: new Date().toISOString(),
          },
        },
      });

      if (error) {
        console.error('Supabase sign up error:', error.message);
        return { data: null, error };
      }

      console.log('User signed up successfully:', data.user.id);

      // Create profile record in the appropriate table based on user type
      if (data?.user) {
        // Create a user record manually to ensure it exists before profile creation
        try {
          const userData = {
            user_id: data.user.id,
            email,
            phone_number: metadata.phone_number || '',
            password_hash: 'managed-by-supabase', // This is just a placeholder, Supabase Auth manages the actual password
            first_name: metadata.first_name || '',
            last_name: metadata.last_name || '',
            user_type: metadata.user_type || 'renter',
            date_of_birth: metadata.date_of_birth || null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            is_active: true,
            is_verified: false
          };
          
          console.log('Creating user record in database...');
          const { error: userInsertError } = await supabase
            .from('users')
            .upsert([userData], { onConflict: 'user_id', ignoreDuplicates: false });

          if (userInsertError) {
            console.warn('Error creating user record:', userInsertError.message);
            // If we get a duplicate error, it means the user record already exists, so we can continue
            if (!userInsertError.message.includes('duplicate')) {
              throw userInsertError;
            }
          }
        } catch (dbError) {
          console.error('Database error during user creation:', dbError.message);
          // We can still continue with authentication even if the database record creation failed
          // The user can retry profile creation later
        }
        
        // Wait a short time to ensure the user record is available
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Now create the profile based on user type
        try {
          console.log('Creating user profile...');
          if (metadata.user_type === 'owner') {
            await this.createOwnerProfile(data.user.id);
          } else {
            await this.createRenterProfile(data.user.id);
          }
        } catch (profileError) {
          console.error('Error creating user profile:', profileError.message);
          // We can still continue with authentication even if profile creation failed
        }
      }

      return { data, error: null };
    } catch (error) {
      console.error('Error signing up:', error.message);
      return { data: null, error };
    }
  },

  /**
   * Sign in a user
   * @param {string} email - User's email
   * @param {string} password - User's password
   * @returns {Promise} - Sign in result
   */
  async signIn(email, password) {
    try {
      if (!supabase || !supabase.auth) {
        return { data: null, error: { message: 'Supabase client not properly initialized' } };
      }

      console.log('Attempting to sign in with Supabase:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log('Supabase sign in response:', data ? 'Data received' : 'No data', error ? `Error: ${error.message}` : 'No error');
      
      if (error) {
        return { data: null, error };
      }

      // Update last login timestamp
      if (data?.user) {
        console.log('User authenticated successfully, updating last login timestamp');
        try {
          await supabase
            .from('users')
            .update({ last_login_at: new Date().toISOString() })
            .eq('user_id', data.user.id);
        } catch (updateError) {
          console.warn('Could not update last login timestamp:', updateError.message);
          // Non-critical error, so we continue
        }
          
        // Manually persist session to local storage as a backup
        if (data.session) {
          console.log('Manually persisting session to localStorage');
          try {
            localStorage.setItem('supabase.auth.token', JSON.stringify({
              currentSession: data.session,
              expiresAt: Math.floor(Date.now() / 1000) + data.session.expires_in
            }));
          } catch (storageError) {
            console.warn('Could not store session in localStorage:', storageError.message);
            // Non-critical error, so we continue
          }
        }
      }

      return { data, error: null };
    } catch (error) {
      console.error('Error signing in:', error.message);
      return { data: null, error };
    }
  },

  /**
   * Sign in with social provider
   * @param {string} provider - Provider name ('google', 'facebook', etc.)
   * @returns {Promise} - Sign in result
   */
  async signInWithSocialProvider(provider) {
    try {
      if (!supabase || !supabase.auth) {
        return { data: null, error: { message: 'Supabase client not properly initialized' } };
      }

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
      });

      if (error) return { data: null, error };
      return { data, error: null };
    } catch (error) {
      console.error(`Error signing in with ${provider}:`, error.message);
      return { data: null, error };
    }
  },

  /**
   * Sign out the current user
   * @returns {Promise} - Sign out result
   */
  async signOut() {
    try {
      if (!supabase || !supabase.auth) {
        return { error: { message: 'Supabase client not properly initialized' } };
      }

      const { error } = await supabase.auth.signOut();
      if (error) return { error };
      return { error: null };
    } catch (error) {
      console.error('Error signing out:', error.message);
      return { error };
    }
  },

  /**
   * Reset password
   * @param {string} email - User's email
   * @returns {Promise} - Password reset result
   */
  async resetPassword(email) {
    try {
      if (!supabase || !supabase.auth) {
        return { data: null, error: { message: 'Supabase client not properly initialized' } };
      }

      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) return { data: null, error };
      return { data, error: null };
    } catch (error) {
      console.error('Error resetting password:', error.message);
      return { data: null, error };
    }
  },

  /**
   * Update password
   * @param {string} newPassword - New password
   * @returns {Promise} - Password update result
   */
  async updatePassword(newPassword) {
    try {
      if (!supabase || !supabase.auth) {
        return { data: null, error: { message: 'Supabase client not properly initialized' } };
      }

      const { data, error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) return { data: null, error };
      return { data, error: null };
    } catch (error) {
      console.error('Error updating password:', error.message);
      return { data: null, error };
    }
  },

  /**
   * Get the current session
   * @returns {Promise} - Current session
   */
  async getSession() {
    try {
      if (!supabase || !supabase.auth) {
        return { data: null, error: { message: 'Supabase client not properly initialized' } };
      }

      const { data, error } = await supabase.auth.getSession();
      if (error) return { data: null, error };
      return { data, error: null };
    } catch (error) {
      console.error('Error getting session:', error.message);
      return { data: null, error };
    }
  },

  /**
   * Get the current user
   * @returns {Promise} - Current user
   */
  async getCurrentUser() {
    try {
      if (!supabase || !supabase.auth) {
        return { user: null, error: { message: 'Supabase client not properly initialized' } };
      }

      // Get the current session
      const { data: sessionData, error: sessionError } = await this.getSession();
      
      if (sessionError) {
        return { user: null, error: sessionError };
      }
      
      if (!sessionData?.session?.user) {
        return { user: null, error: { message: 'No active session found' } };
      }
      
      const userId = sessionData.session.user.id;
      
      // Get user details including profile data
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('user_id', userId)
        .single();
        
      if (userError) {
        console.error('Error fetching user record:', userError.message);
        
        // If the user doesn't exist in our database table yet, we can still return basic auth info
        if (userError.code === 'PGRST116') { // Record not found
          return {
            user: {
              user_id: userId,
              email: sessionData.session.user.email,
              created_at: sessionData.session.user.created_at,
              user_type: sessionData.session.user.user_metadata?.user_type || 'renter',
              is_active: true,
              is_verified: sessionData.session.user.email_confirmed_at ? true : false,
              // Add other fields from user_metadata if needed
              first_name: sessionData.session.user.user_metadata?.first_name || '',
              last_name: sessionData.session.user.user_metadata?.last_name || '',
            },
            error: null
          };
        }
        
        return { user: null, error: userError };
      }
      
      // Get user profile (owner or renter)
      let profileData = null;
      const userType = userData.user_type;
      
      if (userType === 'owner') {
        try {
          const { data: ownerData, error: ownerError } = await supabase
            .from('car_owner_profiles')
            .select('*')
            .eq('user_id', userId)
            .single();
            
          if (ownerError && ownerError.code !== 'PGRST116') {
            console.warn('Error fetching owner profile:', ownerError.message);
            // Non-critical error, continue with null profile
          } else {
            profileData = ownerData;
          }
        } catch (profileError) {
          console.warn('Error in owner profile fetch:', profileError.message);
          // Non-critical error, continue with null profile
        }
      } else if (userType === 'renter') {
        try {
          const { data: renterData, error: renterError } = await supabase
            .from('renter_profiles')
            .select('*')
            .eq('user_id', userId)
            .single();
            
          if (renterError && renterError.code !== 'PGRST116') {
            console.warn('Error fetching renter profile:', renterError.message);
            // Non-critical error, continue with null profile
          } else {
            profileData = renterData;
          }
        } catch (profileError) {
          console.warn('Error in renter profile fetch:', profileError.message);
          // Non-critical error, continue with null profile
        }
      }
      
      // If we couldn't get a user record from the database, use the session data
      if (!userData) {
        return {
          user: {
            user_id: userId,
            email: sessionData.session.user.email,
            created_at: sessionData.session.user.created_at,
            user_type: sessionData.session.user.user_metadata?.user_type || 'renter',
            is_active: true,
            is_verified: sessionData.session.user.email_confirmed_at ? true : false,
            profile: profileData
          },
          error: null
        };
      }
      
      return { 
        user: { 
          ...userData, 
          profile: profileData,
          // Add session user data that might not be in the database
          email_confirmed_at: sessionData.session.user.email_confirmed_at,
          user_metadata: sessionData.session.user.user_metadata,
        }, 
        error: null 
      };
    } catch (error) {
      console.error('Error getting current user:', error.message);
      return { user: null, error };
    }
  },

  /**
   * Create owner profile
   * @param {string} userId - User ID
   * @returns {Promise} - Profile creation result
   */
  async createOwnerProfile(userId) {
    try {
      if (!supabase) {
        return { data: null, error: { message: 'Supabase client not properly initialized' } };
      }

      // First check if profile already exists
      const { data: existingProfile, error: checkError } = await supabase
        .from('car_owner_profiles')
        .select('owner_profile_id')
        .eq('user_id', userId)
        .maybeSingle();
      
      if (checkError && checkError.code !== 'PGRST116') {
        return { data: null, error: checkError };
      }
      
      // If profile already exists, return it
      if (existingProfile) {
        return { data: existingProfile, error: null };
      }
      
      // Create new profile
      const profileData = {
        user_id: userId,
        id_verification_status: 'pending',
        total_listings: 0,
        average_rating: 0,
        is_business: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      const { data, error } = await supabase
        .from('car_owner_profiles')
        .insert([profileData])
        .select();
      
      if (error) return { data: null, error };
      return { data: data[0], error: null };
    } catch (error) {
      console.error('Error creating owner profile:', error.message);
      return { data: null, error };
    }
  },

  /**
   * Create renter profile
   * @param {string} userId - User ID
   * @returns {Promise} - Profile creation result
   */
  async createRenterProfile(userId) {
    try {
      if (!supabase) {
        return { data: null, error: { message: 'Supabase client not properly initialized' } };
      }

      // First check if profile already exists
      const { data: existingProfile, error: checkError } = await supabase
        .from('renter_profiles')
        .select('renter_profile_id')
        .eq('user_id', userId)
        .maybeSingle();
      
      if (checkError && checkError.code !== 'PGRST116') {
        return { data: null, error: checkError };
      }
      
      // If profile already exists, return it
      if (existingProfile) {
        return { data: existingProfile, error: null };
      }
      
      // Create new profile with minimal required fields
      const profileData = {
        user_id: userId,
        license_verification_status: 'pending',
        driving_history_verified: false,
        average_rating: 0,
        total_rentals: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      const { data, error } = await supabase
        .from('renter_profiles')
        .insert([profileData])
        .select();
      
      if (error) return { data: null, error };
      return { data: data[0], error: null };
    } catch (error) {
      console.error('Error creating renter profile:', error.message);
      return { data: null, error };
    }
  },

  /**
   * Update user profile
   * @param {Object} userData - User data to update
   * @returns {Promise} - Update result
   */
  async updateUserProfile(userData) {
    try {
      if (!supabase) {
        return { error: { message: 'Supabase client not properly initialized' } };
      }

      const { user_id, user_type, ...profileData } = userData;
      
      if (!user_id) {
        return { error: { message: 'User ID is required' } };
      }
      
      // Update user table with basic info
      try {
        const { error: userError } = await supabase
          .from('users')
          .update({
            first_name: userData.first_name,
            last_name: userData.last_name,
            phone_number: userData.phone_number,
            bio: userData.bio,
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', user_id);
          
        if (userError) {
          console.error('Error updating user:', userError.message);
          return { error: userError };
        }
      } catch (updateError) {
        console.error('Exception during user update:', updateError.message);
        return { error: { message: updateError.message } };
      }
      
      // Update profile table based on user type
      try {
        if (user_type === 'owner') {
          const { error: ownerError } = await supabase
            .from('car_owner_profiles')
            .update({
              is_business: profileData.is_business,
              business_name: profileData.business_name,
              business_registration_number: profileData.business_registration_number,
              bank_account_number: profileData.bank_account_number,
              tax_id: profileData.tax_id,
              updated_at: new Date().toISOString(),
            })
            .eq('user_id', user_id);
            
          if (ownerError) {
            console.error('Error updating owner profile:', ownerError.message);
            return { error: ownerError };
          }
        } else if (user_type === 'renter') {
          const { error: renterError } = await supabase
            .from('renter_profiles')
            .update({
              driver_license_number: profileData.driver_license_number,
              license_state: profileData.license_state,
              license_expiry: profileData.license_expiry,
              updated_at: new Date().toISOString(),
            })
            .eq('user_id', user_id);
            
          if (renterError) {
            console.error('Error updating renter profile:', renterError.message);
            return { error: renterError };
          }
        }
      } catch (profileError) {
        console.error('Exception during profile update:', profileError.message);
        // We still consider the update partially successful if the user data was updated
        return { error: { message: 'User updated but profile update failed: ' + profileError.message } };
      }
      
      return { error: null };
    } catch (error) {
      console.error('Error updating user profile:', error.message);
      return { error };
    }
  },
  
  /**
   * Check if email exists in Supabase Auth
   * @param {string} email - Email to check
   * @returns {Promise<boolean>} - Whether the email exists
   */
  async checkEmailExists(email) {
    try {
      // This is a workaround since Supabase doesn't have a direct method to check if email exists
      // We attempt to send a password reset and check the response
      const { error } = await this.resetPassword(email);
      
      // If there's no error, the email exists
      // If there's an error about the email not existing, the email doesn't exist
      // If there's another error, we assume the email might exist but can't confirm
      
      if (!error) {
        return { exists: true, error: null };
      }
      
      if (error.message && error.message.toLowerCase().includes('email not found')) {
        return { exists: false, error: null };
      }
      
      // Other error, can't confirm
      console.warn('Could not determine if email exists:', error.message);
      return { exists: null, error };
    } catch (error) {
      console.error('Error checking if email exists:', error.message);
      return { exists: null, error };
    }
  }
};

export default authService;