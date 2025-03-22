/**
 * Database Schema for Drively
 * 
 * This file defines the database schema for the Drively application.
 * It includes tables, fields, relationships, and validation rules.
 */

/**
 * Field Types
 * Used for defining field data types and validation
 */
export const FieldTypes = {
  ID: 'id',
  UUID: 'uuid',
  STRING: 'string',
  TEXT: 'text',
  INT: 'integer',
  FLOAT: 'float',
  DECIMAL: 'decimal',
  BOOLEAN: 'boolean',
  DATE: 'date',
  DATETIME: 'datetime',
  TIMESTAMP: 'timestamp',
  EMAIL: 'email',
  PASSWORD: 'password',
  ENUM: 'enum',
  JSON: 'json',
  JSONB: 'jsonb',
  ARRAY: 'array',
  RELATION: 'relation',
  IMAGE_URL: 'image_url',
  FILE_URL: 'file_url',
  PHONE: 'phone'
};

/**
 * Database Schema Definitions
 * Defines all tables, their fields, and relationships
 */
const Schema = {
  users: {
    tableName: 'users',
    fields: {
      user_id: { type: FieldTypes.UUID, primaryKey: true },
      email: { type: FieldTypes.EMAIL, required: true, unique: true },
      phone_number: { type: FieldTypes.PHONE, required: true },
      password_hash: { type: FieldTypes.PASSWORD, required: true },
      first_name: { type: FieldTypes.STRING, required: true, maxLength: 100 },
      last_name: { type: FieldTypes.STRING, required: true, maxLength: 100 },
      user_type: { 
        type: FieldTypes.ENUM, 
        required: true, 
        options: ['renter', 'owner', 'admin', 'support', 'content_moderator', 'system_admin', 'super_admin']
      },
      profile_image_url: { type: FieldTypes.IMAGE_URL, required: false },
      date_of_birth: { type: FieldTypes.DATE, required: true },
      created_at: { type: FieldTypes.TIMESTAMP, required: true, defaultValue: 'CURRENT_TIMESTAMP' },
      updated_at: { type: FieldTypes.TIMESTAMP, required: true, defaultValue: 'CURRENT_TIMESTAMP' },
      last_login_at: { type: FieldTypes.TIMESTAMP, required: false },
      is_active: { type: FieldTypes.BOOLEAN, required: true, defaultValue: true },
      is_verified: { type: FieldTypes.BOOLEAN, required: true, defaultValue: false },
      verification_token: { type: FieldTypes.STRING, required: false },
      reset_token: { type: FieldTypes.STRING, required: false },
      device_token: { type: FieldTypes.STRING, required: false },
      bio: { type: FieldTypes.TEXT, required: false },
      address_id: { type: FieldTypes.UUID, required: false, references: { table: 'addresses', field: 'address_id' } }
    },
    relationships: {
      owner_profile: { type: 'hasOne', table: 'car_owner_profiles', foreignKey: 'user_id' },
      renter_profile: { type: 'hasOne', table: 'renter_profiles', foreignKey: 'user_id' },
      roles: { type: 'belongsToMany', table: 'roles', through: 'user_roles', foreignKey: 'user_id', otherKey: 'role_id' },
      address: { type: 'belongsTo', table: 'addresses', foreignKey: 'address_id' },
      vehicles: { type: 'hasMany', table: 'vehicles', foreignKey: 'owner_id' },
      bookings_as_renter: { type: 'hasMany', table: 'bookings', foreignKey: 'renter_id' },
      bookings_as_owner: { type: 'hasMany', table: 'bookings', foreignKey: 'owner_id' },
      payments_as_payer: { type: 'hasMany', table: 'payments', foreignKey: 'payer_id' },
      payments_as_payee: { type: 'hasMany', table: 'payments', foreignKey: 'payee_id' },
      ratings_given: { type: 'hasMany', table: 'ratings', foreignKey: 'rater_id' },
      ratings_received: { type: 'hasMany', table: 'ratings', foreignKey: 'ratee_id' }
    }
  },
  
  roles: {
    tableName: 'roles',
    fields: {
      role_id: { type: FieldTypes.UUID, primaryKey: true },
      name: { type: FieldTypes.STRING, required: true, maxLength: 50 },
      description: { type: FieldTypes.TEXT, required: false },
      is_active: { type: FieldTypes.BOOLEAN, required: true, defaultValue: true },
      created_at: { type: FieldTypes.TIMESTAMP, required: true, defaultValue: 'CURRENT_TIMESTAMP' },
      updated_at: { type: FieldTypes.TIMESTAMP, required: true, defaultValue: 'CURRENT_TIMESTAMP' }
    },
    relationships: {
      users: { type: 'belongsToMany', table: 'users', through: 'user_roles', foreignKey: 'role_id', otherKey: 'user_id' }
    }
  },
  
  user_roles: {
    tableName: 'user_roles',
    fields: {
      user_role_id: { type: FieldTypes.UUID, primaryKey: true },
      user_id: { type: FieldTypes.UUID, required: true, references: { table: 'users', field: 'user_id' } },
      role_id: { type: FieldTypes.UUID, required: true, references: { table: 'roles', field: 'role_id' } },
      is_primary: { type: FieldTypes.BOOLEAN, required: true, defaultValue: false },
      assigned_at: { type: FieldTypes.TIMESTAMP, required: true, defaultValue: 'CURRENT_TIMESTAMP' },
      assigned_by: { type: FieldTypes.UUID, required: false, references: { table: 'users', field: 'user_id' } }
    },
    relationships: {
      user: { type: 'belongsTo', table: 'users', foreignKey: 'user_id' },
      role: { type: 'belongsTo', table: 'roles', foreignKey: 'role_id' },
      assigner: { type: 'belongsTo', table: 'users', foreignKey: 'assigned_by' }
    }
  },
  
  car_owner_profiles: {
    tableName: 'car_owner_profiles',
    fields: {
      owner_profile_id: { type: FieldTypes.UUID, primaryKey: true },
      user_id: { type: FieldTypes.UUID, required: true, references: { table: 'users', field: 'user_id' } },
      id_verification_status: { 
        type: FieldTypes.ENUM, 
        required: true, 
        options: ['pending', 'approved', 'rejected'],
        defaultValue: 'pending'
      },
      verification_date: { type: FieldTypes.DATE, required: false },
      bank_account_number: { type: FieldTypes.STRING, required: false, maxLength: 50 },
      tax_id: { type: FieldTypes.STRING, required: false, maxLength: 50 },
      total_listings: { type: FieldTypes.INT, required: true, defaultValue: 0 },
      average_rating: { type: FieldTypes.DECIMAL, required: true, defaultValue: 0, precision: 3, scale: 2 },
      is_business: { type: FieldTypes.BOOLEAN, required: true, defaultValue: false },
      business_name: { type: FieldTypes.STRING, required: false, maxLength: 100 },
      business_registration_number: { type: FieldTypes.STRING, required: false, maxLength: 50 },
      created_at: { type: FieldTypes.TIMESTAMP, required: true, defaultValue: 'CURRENT_TIMESTAMP' },
      updated_at: { type: FieldTypes.TIMESTAMP, required: true, defaultValue: 'CURRENT_TIMESTAMP' }
    },
    relationships: {
      user: { type: 'belongsTo', table: 'users', foreignKey: 'user_id' }
    }
  },
  
  renter_profiles: {
    tableName: 'renter_profiles',
    fields: {
      renter_profile_id: { type: FieldTypes.UUID, primaryKey: true },
      user_id: { type: FieldTypes.UUID, required: true, references: { table: 'users', field: 'user_id' } },
      driver_license_number: { type: FieldTypes.STRING, required: true, maxLength: 50 },
      license_state: { type: FieldTypes.STRING, required: true, maxLength: 50 },
      license_expiry: { type: FieldTypes.DATE, required: true },
      license_verification_status: { 
        type: FieldTypes.ENUM, 
        required: true, 
        options: ['pending', 'approved', 'rejected'],
        defaultValue: 'pending'
      },
      verification_date: { type: FieldTypes.DATE, required: false },
      driving_history_verified: { type: FieldTypes.BOOLEAN, required: true, defaultValue: false },
      average_rating: { type: FieldTypes.DECIMAL, required: true, defaultValue: 0, precision: 3, scale: 2 },
      total_rentals: { type: FieldTypes.INT, required: true, defaultValue: 0 },
      preferred_payment_method_id: { type: FieldTypes.UUID, required: false, references: { table: 'payment_methods', field: 'payment_method_id' } },
      created_at: { type: FieldTypes.TIMESTAMP, required: true, defaultValue: 'CURRENT_TIMESTAMP' },
      updated_at: { type: FieldTypes.TIMESTAMP, required: true, defaultValue: 'CURRENT_TIMESTAMP' }
    },
    relationships: {
      user: { type: 'belongsTo', table: 'users', foreignKey: 'user_id' },
      preferred_payment_method: { type: 'belongsTo', table: 'payment_methods', foreignKey: 'preferred_payment_method_id' }
    }
  },
  
  addresses: {
    tableName: 'addresses',
    fields: {
      address_id: { type: FieldTypes.UUID, primaryKey: true },
      user_id: { type: FieldTypes.UUID, required: false, references: { table: 'users', field: 'user_id' } },
      address_type: { 
        type: FieldTypes.ENUM, 
        required: true, 
        options: ['home', 'work', 'billing', 'other'],
        defaultValue: 'home'
      },
      street_address: { type: FieldTypes.STRING, required: true, maxLength: 255 },
      city: { type: FieldTypes.STRING, required: true, maxLength: 100 },
      state: { type: FieldTypes.STRING, required: true, maxLength: 50 },
      postal_code: { type: FieldTypes.STRING, required: true, maxLength: 20 },
      country: { type: FieldTypes.STRING, required: true, maxLength: 50 },
      is_default: { type: FieldTypes.BOOLEAN, required: true, defaultValue: false },
      created_at: { type: FieldTypes.TIMESTAMP, required: true, defaultValue: 'CURRENT_TIMESTAMP' },
      updated_at: { type: FieldTypes.TIMESTAMP, required: true, defaultValue: 'CURRENT_TIMESTAMP' }
    },
    relationships: {
      user: { type: 'belongsTo', table: 'users', foreignKey: 'user_id' }
    }
  },
  
  vehicles: {
    tableName: 'vehicles',
    fields: {
      vehicle_id: { type: FieldTypes.UUID, primaryKey: true },
      owner_id: { type: FieldTypes.UUID, required: true, references: { table: 'users', field: 'user_id' } },
      make: { type: FieldTypes.STRING, required: true, maxLength: 50 },
      model: { type: FieldTypes.STRING, required: true, maxLength: 50 },
      year: { type: FieldTypes.INT, required: true },
      trim: { type: FieldTypes.STRING, required: false, maxLength: 50 },
      color: { type: FieldTypes.STRING, required: true, maxLength: 30 },
      license_plate: { type: FieldTypes.STRING, required: true, maxLength: 20 },
      vin: { type: FieldTypes.STRING, required: true, maxLength: 17 },
      registration_number: { type: FieldTypes.STRING, required: true, maxLength: 50 },
      registration_expiry: { type: FieldTypes.DATE, required: true },
      vehicle_type: { 
        type: FieldTypes.ENUM, 
        required: true, 
        options: ['sedan', 'suv', 'truck', 'convertible', 'van', 'coupe', 'wagon', 'hatchback', 'minivan', 'pickup']
      },
      transmission: { type: FieldTypes.ENUM, required: true, options: ['automatic', 'manual'] },
      fuel_type: { type: FieldTypes.ENUM, required: true, options: ['gasoline', 'diesel', 'electric', 'hybrid'] },
      seats: { type: FieldTypes.INT, required: true },
      doors: { type: FieldTypes.INT, required: true },
      mileage: { type: FieldTypes.INT, required: true },
      features: { type: FieldTypes.JSONB, required: false },
      description: { type: FieldTypes.TEXT, required: false },
      guidelines: { type: FieldTypes.TEXT, required: false },
      daily_rate: { type: FieldTypes.DECIMAL, required: true, precision: 10, scale: 2 },
      hourly_rate: { type: FieldTypes.DECIMAL, required: false, precision: 10, scale: 2 },
      weekly_rate: { type: FieldTypes.DECIMAL, required: false, precision: 10, scale: 2 },
      monthly_rate: { type: FieldTypes.DECIMAL, required: false, precision: 10, scale: 2 },
      security_deposit: { type: FieldTypes.DECIMAL, required: true, precision: 10, scale: 2 },
      min_rental_duration: { type: FieldTypes.INT, required: true },
      max_rental_duration: { type: FieldTypes.INT, required: false },
      location_id: { type: FieldTypes.UUID, required: true, references: { table: 'locations', field: 'location_id' } },
      is_available: { type: FieldTypes.BOOLEAN, required: true, defaultValue: true },
      availability_status: { 
        type: FieldTypes.ENUM, 
        required: true, 
        options: ['available', 'rented', 'maintenance', 'unlisted'],
        defaultValue: 'available'
      },
      is_approved: { type: FieldTypes.BOOLEAN, required: true, defaultValue: false },
      approval_date: { type: FieldTypes.DATE, required: false },
      is_featured: { type: FieldTypes.BOOLEAN, required: true, defaultValue: false },
      avg_rating: { type: FieldTypes.DECIMAL, required: true, defaultValue: 0, precision: 3, scale: 2 },
      total_rentals: { type: FieldTypes.INT, required: true, defaultValue: 0 },
      created_at: { type: FieldTypes.TIMESTAMP, required: true, defaultValue: 'CURRENT_TIMESTAMP' },
      updated_at: { type: FieldTypes.TIMESTAMP, required: true, defaultValue: 'CURRENT_TIMESTAMP' }
    },
    relationships: {
      owner: { type: 'belongsTo', table: 'users', foreignKey: 'owner_id' },
      location: { type: 'belongsTo', table: 'locations', foreignKey: 'location_id' },
      images: { type: 'hasMany', table: 'vehicle_images', foreignKey: 'vehicle_id' },
      bookings: { type: 'hasMany', table: 'bookings', foreignKey: 'vehicle_id' },
      ratings: { type: 'hasMany', table: 'ratings', foreignKey: 'vehicle_id' },
      documents: { type: 'hasMany', table: 'vehicle_documents', foreignKey: 'vehicle_id' },
      features: { type: 'belongsToMany', table: 'vehicle_features', through: 'vehicle_feature_links', foreignKey: 'vehicle_id', otherKey: 'feature_id' },
      availability_exceptions: { type: 'hasMany', table: 'availability_exceptions', foreignKey: 'vehicle_id' }
    }
  },
  
  vehicle_images: {
    tableName: 'vehicle_images',
    fields: {
      image_id: { type: FieldTypes.UUID, primaryKey: true },
      vehicle_id: { type: FieldTypes.UUID, required: true, references: { table: 'vehicles', field: 'vehicle_id' } },
      image_url: { type: FieldTypes.IMAGE_URL, required: true },
      image_type: { 
        type: FieldTypes.ENUM, 
        required: true, 
        options: ['exterior', 'interior', 'detail', 'damage', 'document'],
        defaultValue: 'exterior'
      },
      is_primary: { type: FieldTypes.BOOLEAN, required: true, defaultValue: false },
      caption: { type: FieldTypes.STRING, required: false, maxLength: 255 },
      order_index: { type: FieldTypes.INT, required: true, defaultValue: 0 },
      created_at: { type: FieldTypes.TIMESTAMP, required: true, defaultValue: 'CURRENT_TIMESTAMP' }
    },
    relationships: {
      vehicle: { type: 'belongsTo', table: 'vehicles', foreignKey: 'vehicle_id' }
    }
  },
  
  locations: {
    tableName: 'locations',
    fields: {
      location_id: { type: FieldTypes.UUID, primaryKey: true },
      owner_id: { type: FieldTypes.UUID, required: false, references: { table: 'users', field: 'user_id' } },
      address_line1: { type: FieldTypes.STRING, required: true, maxLength: 255 },
      address_line2: { type: FieldTypes.STRING, required: false, maxLength: 255 },
      city: { type: FieldTypes.STRING, required: true, maxLength: 100 },
      state: { type: FieldTypes.STRING, required: true, maxLength: 50 },
      postal_code: { type: FieldTypes.STRING, required: true, maxLength: 20 },
      country: { type: FieldTypes.STRING, required: true, maxLength: 50 },
      latitude: { type: FieldTypes.DECIMAL, required: true, precision: 10, scale: 7 },
      longitude: { type: FieldTypes.DECIMAL, required: true, precision: 10, scale: 7 },
      location_name: { type: FieldTypes.STRING, required: false, maxLength: 100 },
      is_exact: { type: FieldTypes.BOOLEAN, required: true, defaultValue: true },
      pickup_instructions: { type: FieldTypes.TEXT, required: false },
      created_at: { type: FieldTypes.TIMESTAMP, required: true, defaultValue: 'CURRENT_TIMESTAMP' },
      updated_at: { type: FieldTypes.TIMESTAMP, required: true, defaultValue: 'CURRENT_TIMESTAMP' }
    },
    relationships: {
      owner: { type: 'belongsTo', table: 'users', foreignKey: 'owner_id' },
      vehicles: { type: 'hasMany', table: 'vehicles', foreignKey: 'location_id' }
    }
  },
  
  bookings: {
    tableName: 'bookings',
    fields: {
      booking_id: { type: FieldTypes.UUID, primaryKey: true },
      vehicle_id: { type: FieldTypes.UUID, required: true, references: { table: 'vehicles', field: 'vehicle_id' } },
      renter_id: { type: FieldTypes.UUID, required: true, references: { table: 'users', field: 'user_id' } },
      owner_id: { type: FieldTypes.UUID, required: true, references: { table: 'users', field: 'user_id' } },
      start_date: { type: FieldTypes.DATETIME, required: true },
      end_date: { type: FieldTypes.DATETIME, required: true },
      pickup_location_id: { type: FieldTypes.UUID, required: true, references: { table: 'locations', field: 'location_id' } },
      dropoff_location_id: { type: FieldTypes.UUID, required: true, references: { table: 'locations', field: 'location_id' } },
      booking_status: { 
        type: FieldTypes.ENUM, 
        required: true, 
        options: ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'declined', 'disputed'],
        defaultValue: 'pending'
      },
      cancellation_reason: { type: FieldTypes.TEXT, required: false },
      cancellation_policy_id: { type: FieldTypes.UUID, required: false, references: { table: 'cancellation_policies', field: 'policy_id' } },
      cancelled_by: { type: FieldTypes.UUID, required: false, references: { table: 'users', field: 'user_id' } },
      cancelled_at: { type: FieldTypes.DATETIME, required: false },
      daily_rate: { type: FieldTypes.DECIMAL, required: true, precision: 10, scale: 2 },
      total_days: { type: FieldTypes.INT, required: true },
      subtotal: { type: FieldTypes.DECIMAL, required: true, precision: 10, scale: 2 },
      tax_amount: { type: FieldTypes.DECIMAL, required: true, precision: 10, scale: 2 },
      service_fee: { type: FieldTypes.DECIMAL, required: true, precision: 10, scale: 2 },
      insurance_fee: { type: FieldTypes.DECIMAL, required: true, precision: 10, scale: 2 },
      additional_fees: { type: FieldTypes.DECIMAL, required: true, precision: 10, scale: 2, defaultValue: 0 },
      discount_amount: { type: FieldTypes.DECIMAL, required: true, precision: 10, scale: 2, defaultValue: 0 },
      total_amount: { type: FieldTypes.DECIMAL, required: true, precision: 10, scale: 2 },
      security_deposit: { type: FieldTypes.DECIMAL, required: true, precision: 10, scale: 2 },
      deposit_status: { 
        type: FieldTypes.ENUM, 
        required: true, 
        options: ['pending', 'held', 'partially_refunded', 'fully_refunded', 'claimed'],
        defaultValue: 'pending'
      },
      payment_status: { 
        type: FieldTypes.ENUM, 
        required: true, 
        options: ['pending', 'authorized', 'paid', 'partially_refunded', 'refunded', 'failed'],
        defaultValue: 'pending'
      },
      payment_method_id: { type: FieldTypes.UUID, required: true, references: { table: 'payment_methods', field: 'payment_method_id' } },
      promotion_id: { type: FieldTypes.UUID, required: false, references: { table: 'promotions', field: 'promotion_id' } },
      special_requests: { type: FieldTypes.TEXT, required: false },
      contract_signed: { type: FieldTypes.BOOLEAN, required: true, defaultValue: false },
      contract_url: { type: FieldTypes.FILE_URL, required: false },
      created_at: { type: FieldTypes.TIMESTAMP, required: true, defaultValue: 'CURRENT_TIMESTAMP' },
      updated_at: { type: FieldTypes.TIMESTAMP, required: true, defaultValue: 'CURRENT_TIMESTAMP' }
    },
    relationships: {
      vehicle: { type: 'belongsTo', table: 'vehicles', foreignKey: 'vehicle_id' },
      renter: { type: 'belongsTo', table: 'users', foreignKey: 'renter_id' },
      owner: { type: 'belongsTo', table: 'users', foreignKey: 'owner_id' },
      canceller: { type: 'belongsTo', table: 'users', foreignKey: 'cancelled_by' },
      pickup_location: { type: 'belongsTo', table: 'locations', foreignKey: 'pickup_location_id' },
      dropoff_location: { type: 'belongsTo', table: 'locations', foreignKey: 'dropoff_location_id' },
      payment_method: { type: 'belongsTo', table: 'payment_methods', foreignKey: 'payment_method_id' },
      cancellation_policy: { type: 'belongsTo', table: 'cancellation_policies', foreignKey: 'cancellation_policy_id' },
      promotion: { type: 'belongsTo', table: 'promotions', foreignKey: 'promotion_id' },
      payments: { type: 'hasMany', table: 'payments', foreignKey: 'booking_id' },
      ratings: { type: 'hasMany', table: 'ratings', foreignKey: 'booking_id' },
      handovers: { type: 'hasMany', table: 'vehicle_handovers', foreignKey: 'booking_id' },
      insurance: { type: 'hasOne', table: 'booking_insurance', foreignKey: 'booking_id' }
    }
  },
  
  // Additional tables would be defined here...
  
  // This partial schema includes the core tables. Additional tables like:
  // - payments
  // - payment_methods
  // - ratings
  // - vehicle_handovers
  // - vehicle_condition_reports
  // - vehicle_documents
  // - user_documents
  // - insurance_policies
  // - booking_insurance
  // - cancellation_policies
  // - vehicle_features
  // - vehicle_feature_links
  // - promotions
  // - user_promotions
  // - availability_exceptions
  // - notifications
  // - support_tickets
  // - support_messages
  // would follow the same pattern
};

export default Schema;
