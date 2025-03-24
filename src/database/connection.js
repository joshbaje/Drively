/**
 * Supabase Connection Utilities for Drively
 * 
 * This file provides utilities for connecting to the Supabase database
 * and performing common operations.
 */

import { createClient } from '@supabase/supabase-js';
import config from './config';

class DatabaseConnection {
  constructor() {
    this.config = config.getConfig();
    this.client = null;
    this.initialized = false;
    
    // Initialize Supabase client
    this.initSupabase();
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
   * Get the initialized Supabase client
   */
  getClient() {
    if (!this.initialized) {
      this.initSupabase();
    }
    
    return this.client;
  }
  
  /**
   * Common database operations that work with either provider
   */
  
  /**
   * Execute a raw query using Supabase RPC
   */
  async query(query, params) {
    const { data, error } = await this.client.rpc(query, params);
    if (error) throw error;
    return data;
  }
  
  /**
   * Get a record by ID from any table
   */
  async getById(table, id, options = {}) {
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
  }
  
  /**
   * Get filtered records from a table
   */
  async getMany(table, filters = {}, options = {}) {
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
  }
  
  /**
   * Create a new record in a table
   */
  async create(table, data) {
    const { data: result, error } = await this.client
      .from(table)
      .insert([data])
      .select()
      .single();
      
    if (error) throw error;
    return result;
  }
  
  /**
   * Update a record in a table
   */
  async update(table, id, data, options = {}) {
    const { data: result, error } = await this.client
      .from(table)
      .update(data)
      .eq(options.idField || `${table.slice(0, -1)}_id`, id)
      .select()
      .single();
      
    if (error) throw error;
    return result;
  }
  
  /**
   * Delete a record from a table
   */
  async delete(table, id, options = {}) {
    const { error } = await this.client
      .from(table)
      .delete()
      .eq(options.idField || `${table.slice(0, -1)}_id`, id);
      
    if (error) throw error;
    return { success: true };
  }
  
  /**
   * Execute a transaction (multiple operations as a single unit)
   */
  async transaction(operations) {
    // For Supabase, use single-query transactions
    // Note: This is a simplified version. Real implementation would depend on your needs.
    const { data, error } = await this.client.rpc('execute_transaction', { operations });
    if (error) throw error;
    return data;
  }
  
  /**
   * Upload a file to storage
   */
  async uploadFile(bucket, path, file) {
    const { data, error } = await this.client.storage
      .from(bucket)
      .upload(path, file);
      
    if (error) throw error;
    
    // Get the public URL
    const { data: { publicUrl } } = this.client.storage
      .from(bucket)
      .getPublicUrl(data.path);
      
    return { ...data, url: publicUrl };
  }
}

// Create a singleton instance
const dbConnection = new DatabaseConnection();

export default dbConnection;
