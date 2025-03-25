/**
 * Supabase User Database Service
 * 
 * This service handles operations related to user records in the Supabase database
 * including creating user records if they don't exist after authentication.
 */

import supabase from '../supabaseClient';

/**
 * Ensures a user record exists in the users table
 * @param {Object} authUser - User object from Supabase Auth
 * @returns {Promise<Object>} Created or existing user record
 */
export const ensureUserRecord = async (authUser) => {
  if (!authUser || !authUser.id) {
    throw new Error('Invalid auth user provided');
  }
  
  try {
    console.log(`Checking if user record exists for ID: ${authUser.id}`);
    
    // Try to get the user record first
    const { data: existingUser, error } = await supabase
      .from('users')
      .select('*')
      .eq('user_id', authUser.id)
      .single();
      
    // If the user exists, return it
    if (existingUser) {
      console.log('User record found in database');
      return existingUser;
    }
    
    // If the error is not PGRST116 (no rows), it's an unexpected error
    if (error && error.code !== 'PGRST116') {
      console.error('Error checking for user record:', error.message);
      throw error;
    }
    
    // User doesn't exist, create a new record with minimal data
    console.log('Creating new user record in database');
    const userData = {
      user_id: authUser.id,
      email: authUser.email,
      first_name: authUser.user_metadata?.first_name || '',
      last_name: authUser.user_metadata?.last_name || '',
      user_type: authUser.user_metadata?.user_type || 'renter', // Default to renter
      is_active: true,
      is_verified: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert([userData])
      .select('*')
      .single();
      
    if (insertError) {
      console.error('Error creating user record:', insertError.message);
      throw insertError;
    }
    
    console.log('Created new user record successfully');
    
    // Create appropriate profile record
    if (userData.user_type === 'owner') {
      await createOwnerProfile(authUser.id);
    } else {
      await createRenterProfile(authUser.id);
    }
    
    return newUser;
  } catch (error) {
    console.error('Error in ensureUserRecord:', error.message);
    throw error;
  }
};

/**
 * Creates an owner profile for a user
 * @param {string} userId - User ID to create profile for
 * @returns {Promise<Object>} Created profile
 */
export const createOwnerProfile = async (userId) => {
  try {
    const profileData = {
      user_id: userId,
      id_verification_status: 'pending',
      total_listings: 0,
      average_rating: 0,
      is_business: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from('car_owner_profiles')
      .insert([profileData])
      .select();
      
    if (error) {
      console.error('Error creating owner profile:', error.message);
      throw error;
    }
    
    return data[0];
  } catch (error) {
    console.error('Error in createOwnerProfile:', error.message);
    throw error;
  }
};

/**
 * Creates a renter profile for a user
 * @param {string} userId - User ID to create profile for
 * @returns {Promise<Object>} Created profile
 */
export const createRenterProfile = async (userId) => {
  try {
    const profileData = {
      user_id: userId,
      license_verification_status: 'pending',
      driving_history_verified: false,
      average_rating: 0,
      total_rentals: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from('renter_profiles')
      .insert([profileData])
      .select();
      
    if (error) {
      console.error('Error creating renter profile:', error.message);
      throw error;
    }
    
    return data[0];
  } catch (error) {
    console.error('Error in createRenterProfile:', error.message);
    throw error;
  }
};

/**
 * Reconciles a user record with auth data
 * This is particularly useful during migration when auth and database might be out of sync
 * @param {Object} authUser - User object from Supabase Auth
 * @returns {Promise<Object>} Updated user record
 */
export const reconcileUserRecord = async (authUser) => {
  if (!authUser || !authUser.id) {
    throw new Error('Invalid auth user provided');
  }
  
  try {
    // First check if any user record exists with the same email
    const { data: emailUsers, error: emailError } = await supabase
      .from('users')
      .select('*')
      .eq('email', authUser.email);
      
    if (emailError) {
      console.error('Error finding users with matching email:', emailError.message);
      // Continue execution - this is non-fatal
    }
    
    // If we found users with the same email but different user_id
    if (emailUsers && emailUsers.length > 0) {
      const nonMatchingUsers = emailUsers.filter(user => user.user_id !== authUser.id);
      
      if (nonMatchingUsers.length > 0) {
        console.warn(`Found ${nonMatchingUsers.length} user records with email ${authUser.email} but different user_id`);
        // We could implement merging logic here if needed
      }
    }
    
    // Then try to get or create the user with the correct user_id
    return await ensureUserRecord(authUser);
  } catch (error) {
    console.error('Error in reconcileUserRecord:', error.message);
    throw error;
  }
};

/**
 * Fixes user_id mismatch issues
 * Call this when a user can authenticate but their user_id doesn't match records
 * @param {Object} authUser - User object from Supabase Auth
 * @returns {Promise<boolean>} Success status
 */
export const fixUserIdMismatch = async (authUser) => {
  if (!authUser || !authUser.id || !authUser.email) {
    throw new Error('Invalid auth user provided');
  }
  
  try {
    // Find any user records with the same email but different user_id
    const { data: emailUsers, error: emailError } = await supabase
      .from('users')
      .select('*')
      .eq('email', authUser.email);
      
    if (emailError) {
      console.error('Error finding users with matching email:', emailError.message);
      return false;
    }
    
    // If no matching email records, create a new one
    if (!emailUsers || emailUsers.length === 0) {
      await ensureUserRecord(authUser);
      return true;
    }
    
    // Check if any have the correct user_id already
    const matchingIdUser = emailUsers.find(user => user.user_id === authUser.id);
    if (matchingIdUser) {
      console.log('User record with matching ID and email already exists');
      return true;
    }
    
    // Update the first user record with matching email to have the correct user_id
    const userToUpdate = emailUsers[0];
    console.log(`Updating user record for ${userToUpdate.email} to have correct user_id ${authUser.id}`);
    
    const { error: updateError } = await supabase
      .from('users')
      .update({ user_id: authUser.id, updated_at: new Date().toISOString() })
      .eq('user_id', userToUpdate.user_id);
      
    if (updateError) {
      console.error('Error updating user record:', updateError.message);
      return false;
    }
    
    // Also update any profile records
    await updateProfileUserId(userToUpdate.user_id, authUser.id, userToUpdate.user_type || 'renter');
    
    return true;
  } catch (error) {
    console.error('Error in fixUserIdMismatch:', error.message);
    return false;
  }
};

/**
 * Updates user_id in profile tables
 * @param {string} oldUserId - Previous user_id
 * @param {string} newUserId - New user_id
 * @param {string} userType - User type (owner or renter)
 * @returns {Promise<void>}
 */
async function updateProfileUserId(oldUserId, newUserId, userType) {
  try {
    if (userType === 'owner') {
      const { error } = await supabase
        .from('car_owner_profiles')
        .update({ user_id: newUserId, updated_at: new Date().toISOString() })
        .eq('user_id', oldUserId);
        
      if (error) {
        console.error('Error updating owner profile:', error.message);
      }
    } else {
      const { error } = await supabase
        .from('renter_profiles')
        .update({ user_id: newUserId, updated_at: new Date().toISOString() })
        .eq('user_id', oldUserId);
        
      if (error) {
        console.error('Error updating renter profile:', error.message);
      }
    }
  } catch (error) {
    console.error('Error updating profile user_id:', error.message);
  }
}

export default {
  ensureUserRecord,
  createOwnerProfile,
  createRenterProfile,
  reconcileUserRecord,
  fixUserIdMismatch
};
