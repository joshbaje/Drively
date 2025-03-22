/**
 * Database Module for Drively
 * 
 * This module exports all database-related utilities and configurations.
 */

import dbConnection from './connection';
import config from './config';
import Schema, { FieldTypes } from './schema';
import migrations, { migrateUp, migrateDown } from './migrations';

// Database helper functions
const db = {
  // Core connection and client
  connection: dbConnection,
  getClient: () => dbConnection.getClient(),
  
  // Configuration
  config,
  getProviderType: config.getProviderType,
  getCurrentEnv: () => config.currentEnv,
  
  // Schema
  schema: Schema,
  fieldTypes: FieldTypes,
  
  // Migrations
  migrations,
  migrateUp,
  migrateDown,
  
  // Convenience methods that use the database connection
  getById: (table, id, options) => dbConnection.getById(table, id, options),
  getMany: (table, filters, options) => dbConnection.getMany(table, filters, options),
  create: (table, data) => dbConnection.create(table, data),
  update: (table, id, data, options) => dbConnection.update(table, id, data, options),
  delete: (table, id, options) => dbConnection.delete(table, id, options),
  query: (query, params) => dbConnection.query(query, params),
  transaction: (operations) => dbConnection.transaction(operations),
  uploadFile: (bucket, path, file) => dbConnection.uploadFile(bucket, path, file)
};

export default db;
