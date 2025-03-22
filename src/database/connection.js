/**
 * Database Connection Utilities for Drively
 * 
 * This file provides utilities for connecting to the database
 * and performing common operations. It abstracts the specific
 * database implementation (Xano or Supabase) from the application.
 */

import { createClient } from '@supabase/supabase-js';
import ApiClient from '../services/api/apiClient';
import config from './config';

class DatabaseConnection {
  constructor() {
    this.provider = config.getProviderType();
    this.config = config.getConfig();
    this.client = null;
    this.initialized = false;
    
    // Initialize the appropriate client based on provider
    if (this.provider === 'supabase') {
      this.initSupabase();
    } else {
      this.initXano();
    }
  }
  
  /**
   * Initialize Supabase client
   */
  initSupabase() {
    if (this.initialized) return;
    
    this.client = createClient(this.config.url, this.config.anonKey);
    this.initialized = true;
    
    if (this.config.debug) {
      console.log('Supabase client initialized:', this.config.url);
    }
  }
  
  /**
   * Initialize Xano client
   */
  initXano() {
    if (this.initialized) return;
    
    this.client = new ApiClient({
      baseUrl: this.config.baseUrl,
      tokenKey: this.config.tokenKey,
      debug: this.config.debug
    });
    this.initialized = true;
    
    if (this.config.debug) {
      console.log('Xano client initialized:', this.config.baseUrl);
    }
  }
  
  /**
   * Get the initialized database client
   */
  getClient() {
    if (!this.initialized) {
      if (this.provider === 'supabase') {
        this.initSupabase();
      } else {
        this.initXano();
      }
    }
    
    return this.client;
  }
  
  /**
   * Common database operations that work with either provider
   */
  
  /**
   * Execute a raw query (provider-specific)
   */
  async query(query, params) {
    if (this.provider === 'supabase') {
      // For Supabase, use the RPC interface
      const { data, error } = await this.client.rpc(query, params);
      if (error) throw error;
      return data;
    } else {
      // For Xano, use custom endpoint or API call
      throw new Error('Raw queries not supported in Xano');
    }
  }
  
  /**
   * Get a record by ID from any table
   */
  async getById(table, id, options = {}) {
    if (this.provider === 'supabase') {
      const query = this.client
        .from(table)
        .select(options.select || '*')
        .eq(options.idField || `${table.slice(0, -1)}_id`, id)
        .single();
        
      if (options.relations) {
        // Add foreign tables
        options.relations.forEach(relation => {
          query.select(`${relation}(*)`);
        });
      }
        
      const { data, error } = await query;
      if (error) throw error;
      return data;
    } else {
      // For Xano, use the appropriate API endpoint
      const endpoint = `${table}/${id}`;
      return this.client.get(endpoint);
    }
  }
  
  /**
   * Get filtered records from a table
   */
  async getMany(table, filters = {}, options = {}) {
    if (this.provider === 'supabase') {
      let query = this.client
        .from(table)
        .select(options.select || '*');
        
      // Add filters
      Object.entries(filters).forEach(([key, value]) => {
        if (typeof value === 'object' && value !== null) {
          // Handle special operators
          if (value.gt) query = query.gt(key, value.gt);
          if (value.gte) query = query.gte(key, value.gte);
          if (value.lt) query = query.lt(key, value.lt);
          if (value.lte) query = query.lte(key, value.lte);
          if (value.eq) query = query.eq(key, value.eq);
          if (value.neq) query = query.neq(key, value.neq);
          if (value.in) query = query.in(key, value.in);
          if (value.like) query = query.like(key, value.like);
          if (value.ilike) query = query.ilike(key, value.ilike);
        } else {
          // Simple equality
          query = query.eq(key, value);
        }
      });
        
      // Add pagination
      if (options.limit) query = query.limit(options.limit);
      if (options.offset) query = query.offset(options.offset);
        
      // Add ordering
      if (options.orderBy) {
        const [field, direction] = options.orderBy.split(':');
        query = query.order(field, { ascending: direction === 'asc' });
      }
        
      const { data, error, count } = await query;
      if (error) throw error;
      
      return {
        data,
        pagination: {
          page: options.offset ? Math.floor(options.offset / options.limit) + 1 : 1,
          limit: options.limit || 20,
          total: count,
          pages: count ? Math.ceil(count / (options.limit || 20)) : 1
        }
      };
    } else {
      // For Xano, use the appropriate API endpoint with query params
      const queryParams = new URLSearchParams();
      
      // Add filters to query params
      Object.entries(filters).forEach(([key, value]) => {
        queryParams.append(key, value);
      });
      
      // Add pagination
      if (options.limit) queryParams.append('limit', options.limit);
      if (options.offset) queryParams.append('offset', options.offset);
      
      // Add ordering
      if (options.orderBy) queryParams.append('order_by', options.orderBy);
      
      const endpoint = `${table}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      return this.client.get(endpoint);
    }
  }
  
  /**
   * Create a new record in a table
   */
  async create(table, data) {
    if (this.provider === 'supabase') {
      const { data: result, error } = await this.client
        .from(table)
        .insert([data])
        .select()
        .single();
        
      if (error) throw error;
      return result;
    } else {
      // For Xano, use the appropriate API endpoint
      return this.client.post(table, data);
    }
  }
  
  /**
   * Update a record in a table
   */
  async update(table, id, data, options = {}) {
    if (this.provider === 'supabase') {
      const { data: result, error } = await this.client
        .from(table)
        .update(data)
        .eq(options.idField || `${table.slice(0, -1)}_id`, id)
        .select()
        .single();
        
      if (error) throw error;
      return result;
    } else {
      // For Xano, use the appropriate API endpoint
      return this.client.put(`${table}/${id}`, data);
    }
  }
  
  /**
   * Delete a record from a table
   */
  async delete(table, id, options = {}) {
    if (this.provider === 'supabase') {
      const { error } = await this.client
        .from(table)
        .delete()
        .eq(options.idField || `${table.slice(0, -1)}_id`, id);
        
      if (error) throw error;
      return { success: true };
    } else {
      // For Xano, use the appropriate API endpoint
      return this.client.delete(`${table}/${id}`);
    }
  }
  
  /**
   * Execute a transaction (multiple operations as a single unit)
   */
  async transaction(operations) {
    if (this.provider === 'supabase') {
      // For Supabase, use single-query transactions
      // Note: This is a simplified version. Real implementation would depend on your needs.
      const { data, error } = await this.client.rpc('execute_transaction', { operations });
      if (error) throw error;
      return data;
    } else {
      // For Xano, transactions may not be directly supported
      // You might need to implement rollback logic manually
      throw new Error('Transactions not directly supported in Xano');
    }
  }
  
  /**
   * Upload a file to storage
   */
  async uploadFile(bucket, path, file) {
    if (this.provider === 'supabase') {
      const { data, error } = await this.client.storage
        .from(bucket)
        .upload(path, file);
        
      if (error) throw error;
      
      // Get the public URL
      const { data: { publicUrl } } = this.client.storage
        .from(bucket)
        .getPublicUrl(data.path);
        
      return { ...data, url: publicUrl };
    } else {
      // For Xano, use file upload endpoint
      // This is a placeholder - actual implementation depends on Xano's file API
      return this.client.uploadFile(`files/${bucket}`, file, { path });
    }
  }
}

// Create a singleton instance
const dbConnection = new DatabaseConnection();

export default dbConnection;
