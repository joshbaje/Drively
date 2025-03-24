import supabase from '../supabaseClient';
import databaseUtils from '../utils/databaseUtils';

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

      if (error) throw error;

      // Create profile record in the appropriate table based on user type
      if (data?.user) {
        // Create a user record manually to ensure it exists before profile creation
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
        
        // Insert the user record directly to ensure it exists before profile creation
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
        
        // Wait a short time to ensure the user record is available
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Now create the profile
        if (metadata.user_type === 'owner') {
          await this.createOwnerProfile(data.user.id);
        } else {
          await this.createRenterProfile(data.user.id);
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
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Update last login timestamp
      if (data?.user) {
        await supabase
          .from('users')
          .update({ last_login_at: new Date().toISOString() })
          .eq('user_id', data.user.id);
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
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
      });

      if (error) throw error;
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
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
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
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;
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
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;
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
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
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
      const { data: sessionData } = await this.getSession();
      
      if (!sessionData?.session?.user) {
        return { user: null, error: null };
      }
      
      const userId = sessionData.session.user.id;
      
      // Get user details including profile data
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('user_id', userId)
        .single();
        
      if (userError) throw userError;
      
      // Get user profile (owner or renter)
      let profileData = null;
      const userType = userData.user_type;
      
      if (userType === 'owner') {
        const { data: ownerData, error: ownerError } = await supabase
          .from('car_owner_profiles')
          .select('*')
          .eq('user_id', userId)
          .single();
          
        if (ownerError && ownerError.code !== 'PGRST116') throw ownerError;
        profileData = ownerData;
      } else if (userType === 'renter') {
        const { data: renterData, error: renterError } = await supabase
          .from('renter_profiles')
          .select('*')
          .eq('user_id', userId)
          .single();
          
        if (renterError && renterError.code !== 'PGRST116') throw renterError;
        profileData = renterData;
      }
      
      return { 
        user: { 
          ...userData, 
          profile: profileData,
          session: sessionData.session
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
      // Use the database utilities to create profile with retry logic
      const profileData = {
        user_id: userId,
        id_verification_status: 'pending',
        total_listings: 0,
        average_rating: 0,
        is_business: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // This will retry if the user record is not yet available in the users table
      const { data, error } = await databaseUtils.createWithRetry(
        'car_owner_profiles',
        profileData,
        'users',
        'user_id',
        userId,
        10, // Max retries
        500  // Delay between retries in ms
      );

      if (error) throw error;
      return { data, error: null };
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
      // Use the database utilities to create profile with retry logic
      const profileData = {
        user_id: userId,
        license_verification_status: 'pending',
        driving_history_verified: false,
        average_rating: 0,
        total_rentals: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // This will retry if the user record is not yet available in the users table
      const { data, error } = await databaseUtils.createWithRetry(
        'renter_profiles',
        profileData,
        'users',
        'user_id',
        userId,
        10, // Max retries
        500  // Delay between retries in ms
      );

      if (error) throw error;
      return { data, error: null };
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
      const { user_id, user_type, ...profileData } = userData;
      
      // Update user table
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
        
      if (userError) throw userError;
      
      // Update profile table based on user type
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
          
        if (ownerError) throw ownerError;
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
          
        if (renterError) throw renterError;
      }
      
      return { error: null };
    } catch (error) {
      console.error('Error updating user profile:', error.message);
      return { error };
    }
  },
};

export default authService;