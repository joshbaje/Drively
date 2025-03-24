import supabase from '../supabaseClient';

/**
 * Utility functions for working with the Supabase database
 */
const databaseUtils = {
  /**
   * Wait for a record to exist in a table
   * @param {string} table - Table name
   * @param {string} column - Column name to check
   * @param {any} value - Value to check for
   * @param {number} maxRetries - Maximum number of retries
   * @param {number} delay - Delay between retries in ms
   * @returns {Promise<boolean>} - Whether the record exists
   */
  async waitForRecord(table, column, value, maxRetries = 5, delay = 500) {
    let retries = 0;
    
    while (retries < maxRetries) {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .eq(column, value)
        .single();
        
      if (data) {
        console.log(`Record found in ${table} with ${column}=${value}`);
        return true;
      }
      
      console.log(`Waiting for record in ${table} with ${column}=${value}, attempt ${retries + 1}/${maxRetries}`);
      retries++;
      
      if (retries < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    console.warn(`Record not found in ${table} with ${column}=${value} after ${maxRetries} attempts`);
    return false;
  },
  
  /**
   * Check if a table exists and is accessible
   * @param {string} table - Table name
   * @returns {Promise<boolean>} - Whether the table exists and is accessible
   */
  async tableExists(table) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);
        
      return !error;
    } catch (error) {
      console.error(`Error checking if table ${table} exists:`, error.message);
      return false;
    }
  },
  
  /**
   * Get record by ID
   * @param {string} table - Table name
   * @param {string} idColumn - ID column name
   * @param {string} id - ID value
   * @returns {Promise<Object>} - Record data and error
   */
  async getById(table, idColumn, id) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .eq(idColumn, id)
        .single();
        
      return { data, error };
    } catch (error) {
      console.error(`Error getting record from ${table}:`, error.message);
      return { data: null, error };
    }
  },
  
  /**
   * Create record
   * @param {string} table - Table name
   * @param {Object} record - Record data
   * @returns {Promise<Object>} - Created record data and error
   */
  async create(table, record) {
    try {
      const { data, error } = await supabase
        .from(table)
        .insert([record])
        .select();
        
      return { data: data?.[0] || null, error };
    } catch (error) {
      console.error(`Error creating record in ${table}:`, error.message);
      return { data: null, error };
    }
  },
  
  /**
   * Update record
   * @param {string} table - Table name
   * @param {string} idColumn - ID column name
   * @param {string} id - ID value
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object>} - Updated record data and error
   */
  async update(table, idColumn, id, updates) {
    try {
      const { data, error } = await supabase
        .from(table)
        .update(updates)
        .eq(idColumn, id)
        .select();
        
      return { data: data?.[0] || null, error };
    } catch (error) {
      console.error(`Error updating record in ${table}:`, error.message);
      return { data: null, error };
    }
  },
  
  /**
   * Delete record
   * @param {string} table - Table name
   * @param {string} idColumn - ID column name
   * @param {string} id - ID value
   * @returns {Promise<Object>} - Error if any
   */
  async delete(table, idColumn, id) {
    try {
      const { error } = await supabase
        .from(table)
        .delete()
        .eq(idColumn, id);
        
      return { error };
    } catch (error) {
      console.error(`Error deleting record from ${table}:`, error.message);
      return { error };
    }
  },
  
  /**
   * Check if a user exists in the users table
   * @param {string} userId - User ID
   * @returns {Promise<boolean>} - Whether the user exists
   */
  async userExists(userId) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('user_id')
        .eq('user_id', userId)
        .single();
        
      return Boolean(data && !error);
    } catch (error) {
      console.error('Error checking if user exists:', error.message);
      return false;
    }
  },
  
  /**
   * Upload a file to Supabase Storage
   * @param {string} bucket - Storage bucket name
   * @param {string} path - File path in storage
   * @param {File} file - File to upload
   * @returns {Promise<Object>} - Upload result data and error
   */
  async uploadFile(bucket, path, file) {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(path, file, {
          cacheControl: '3600',
          upsert: false
        });
        
      return { data, error };
    } catch (error) {
      console.error(`Error uploading file to ${bucket}/${path}:`, error.message);
      return { data: null, error };
    }
  },
  
  /**
   * Get a public URL for a file in Storage
   * @param {string} bucket - Storage bucket name
   * @param {string} path - File path in storage
   * @returns {string} - Public URL
   */
  getPublicUrl(bucket, path) {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);
      
    return data.publicUrl;
  },
  
  /**
   * Create a record with retry functionality if it fails due to foreign key constraints
   * @param {string} table - Table name
   * @param {Object} record - Record data
   * @param {string} foreignKeyTable - Foreign key table to check for
   * @param {string} foreignKeyColumn - Foreign key column to check for
   * @param {any} foreignKeyValue - Foreign key value to check for
   * @param {number} maxRetries - Maximum number of retries
   * @param {number} delay - Delay between retries in ms
   * @returns {Promise<Object>} - Created record data and error
   */
  async createWithRetry(table, record, foreignKeyTable, foreignKeyColumn, foreignKeyValue, maxRetries = 5, delay = 500) {
    let retries = 0;
    
    while (retries < maxRetries) {
      // First ensure the foreign key exists
      if (foreignKeyTable && foreignKeyColumn && foreignKeyValue) {
        const exists = await this.waitForRecord(foreignKeyTable, foreignKeyColumn, foreignKeyValue, 1, 0);
        
        if (!exists) {
          // Wait before retrying
          await new Promise(resolve => setTimeout(resolve, delay));
          retries++;
          continue;
        }
      }
      
      // Try to create the record
      const { data, error } = await this.create(table, record);
      
      if (!error) {
        return { data, error: null };
      }
      
      // Check if error is due to foreign key constraint
      if (error.code === '23503' && error.message.includes('foreign key constraint')) {
        console.warn(`Foreign key constraint error when creating record in ${table}, retrying...`);
        retries++;
        
        if (retries < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      } else {
        // Different error, return immediately
        return { data: null, error };
      }
    }
    
    return { data: null, error: new Error(`Failed to create record in ${table} after ${maxRetries} attempts`) };
  }
};

export default databaseUtils;