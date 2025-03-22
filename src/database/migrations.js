/**
 * Database Migrations for Drively
 * 
 * This file defines migrations for creating and updating database schema.
 * Each migration is numbered and can be run in sequence to set up or update the database.
 */

import dbConnection from './connection';
import config from './config';

/**
 * Migration Registry
 * 
 * Array of migration functions, each representing a version of the database schema.
 * Each migration should be idempotent (safe to run multiple times).
 */
const migrations = [
  // Migration 001: Initial schema setup
  {
    version: 1,
    name: 'initial_schema',
    up: async (client) => {
      if (config.getProviderType() === 'supabase') {
        // Supabase migrations use SQL
        // This would typically be in a .sql file, but for simplicity it's inline here
        
        // Users table
        await client.query(`
          CREATE TABLE IF NOT EXISTS users (
            user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            email VARCHAR(255) NOT NULL UNIQUE,
            phone_number VARCHAR(20) NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            first_name VARCHAR(100) NOT NULL,
            last_name VARCHAR(100) NOT NULL,
            user_type VARCHAR(20) NOT NULL,
            profile_image_url VARCHAR(255),
            date_of_birth DATE NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
            last_login_at TIMESTAMP WITH TIME ZONE,
            is_active BOOLEAN NOT NULL DEFAULT TRUE,
            is_verified BOOLEAN NOT NULL DEFAULT FALSE,
            verification_token VARCHAR(255),
            reset_token VARCHAR(255),
            device_token VARCHAR(255),
            bio TEXT,
            address_id UUID
          );
          
          -- Add RLS policies for users
          ALTER TABLE users ENABLE ROW LEVEL SECURITY;
          
          CREATE POLICY "Users can view own data" ON users
            FOR SELECT USING (auth.uid() = user_id);
            
          CREATE POLICY "Users can update own data" ON users
            FOR UPDATE USING (auth.uid() = user_id);
        `);
        
        // Roles table
        await client.query(`
          CREATE TABLE IF NOT EXISTS roles (
            role_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            name VARCHAR(50) NOT NULL,
            description TEXT,
            is_active BOOLEAN NOT NULL DEFAULT TRUE,
            created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
          );
          
          -- Insert default roles
          INSERT INTO roles (name, description)
          VALUES 
            ('admin', 'Administrator with full access'),
            ('super_admin', 'Super administrator with system access'),
            ('system_admin', 'System administrator for technical operations'),
            ('support', 'Customer support agent'),
            ('content_moderator', 'Content moderation agent'),
            ('renter', 'User who rents vehicles'),
            ('verified_renter', 'Verified user who rents vehicles'),
            ('owner', 'User who owns vehicles for rent'),
            ('verified_owner', 'Verified user who owns vehicles for rent'),
            ('fleet_manager', 'Manager of multiple vehicles'),
            ('guest', 'Unregistered or unverified user')
          ON CONFLICT (role_id) DO NOTHING;
        `);
        
        // User Roles junction table
        await client.query(`
          CREATE TABLE IF NOT EXISTS user_roles (
            user_role_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
            role_id UUID NOT NULL REFERENCES roles(role_id) ON DELETE CASCADE,
            is_primary BOOLEAN NOT NULL DEFAULT FALSE,
            assigned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
            assigned_by UUID REFERENCES users(user_id),
            UNIQUE(user_id, role_id)
          );
          
          -- Add RLS policies for user_roles
          ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
          
          CREATE POLICY "Users can view own roles" ON user_roles
            FOR SELECT USING (auth.uid() = user_id);
        `);
        
        // Car Owner Profiles table
        await client.query(`
          CREATE TABLE IF NOT EXISTS car_owner_profiles (
            owner_profile_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
            id_verification_status VARCHAR(20) NOT NULL DEFAULT 'pending',
            verification_date DATE,
            bank_account_number VARCHAR(50),
            tax_id VARCHAR(50),
            total_listings INTEGER NOT NULL DEFAULT 0,
            average_rating DECIMAL(3,2) NOT NULL DEFAULT 0,
            is_business BOOLEAN NOT NULL DEFAULT FALSE,
            business_name VARCHAR(100),
            business_registration_number VARCHAR(50),
            created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
            UNIQUE(user_id)
          );
          
          -- Add RLS policies for car_owner_profiles
          ALTER TABLE car_owner_profiles ENABLE ROW LEVEL SECURITY;
          
          CREATE POLICY "Users can view own owner profile" ON car_owner_profiles
            FOR SELECT USING (auth.uid() = user_id);
            
          CREATE POLICY "Users can update own owner profile" ON car_owner_profiles
            FOR UPDATE USING (auth.uid() = user_id);
        `);
        
        // Renter Profiles table
        await client.query(`
          CREATE TABLE IF NOT EXISTS renter_profiles (
            renter_profile_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
            driver_license_number VARCHAR(50) NOT NULL,
            license_state VARCHAR(50) NOT NULL,
            license_expiry DATE NOT NULL,
            license_verification_status VARCHAR(20) NOT NULL DEFAULT 'pending',
            verification_date DATE,
            driving_history_verified BOOLEAN NOT NULL DEFAULT FALSE,
            average_rating DECIMAL(3,2) NOT NULL DEFAULT 0,
            total_rentals INTEGER NOT NULL DEFAULT 0,
            preferred_payment_method_id UUID,
            created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
            UNIQUE(user_id)
          );
          
          -- Add RLS policies for renter_profiles
          ALTER TABLE renter_profiles ENABLE ROW LEVEL SECURITY;
          
          CREATE POLICY "Users can view own renter profile" ON renter_profiles
            FOR SELECT USING (auth.uid() = user_id);
            
          CREATE POLICY "Users can update own renter profile" ON renter_profiles
            FOR UPDATE USING (auth.uid() = user_id);
        `);
        
        // Add more table creation statements for other entities...
        
        // Stored procedures for common operations
        await client.query(`
          -- Increment owner total listings
          CREATE OR REPLACE FUNCTION increment_owner_listings(owner_id UUID)
          RETURNS void AS $$
          BEGIN
            UPDATE car_owner_profiles
            SET total_listings = total_listings + 1,
                updated_at = NOW()
            WHERE user_id = owner_id;
          END;
          $$ LANGUAGE plpgsql;
          
          -- Decrement owner total listings
          CREATE OR REPLACE FUNCTION decrement_owner_listings(owner_id UUID)
          RETURNS void AS $$
          BEGIN
            UPDATE car_owner_profiles
            SET total_listings = GREATEST(0, total_listings - 1),
                updated_at = NOW()
            WHERE user_id = owner_id;
          END;
          $$ LANGUAGE plpgsql;
          
          -- Increment renter total rentals
          CREATE OR REPLACE FUNCTION increment_renter_rentals(r_id UUID)
          RETURNS void AS $$
          BEGIN
            UPDATE renter_profiles
            SET total_rentals = total_rentals + 1,
                updated_at = NOW()
            WHERE user_id = r_id;
          END;
          $$ LANGUAGE plpgsql;
          
          -- Increment vehicle total rentals
          CREATE OR REPLACE FUNCTION increment_vehicle_rentals(v_id UUID)
          RETURNS INTEGER AS $$
          DECLARE
            new_total INTEGER;
          BEGIN
            UPDATE vehicles
            SET total_rentals = total_rentals + 1,
                updated_at = NOW()
            WHERE vehicle_id = v_id
            RETURNING total_rentals INTO new_total;
            
            RETURN new_total;
          END;
          $$ LANGUAGE plpgsql;
        `);
        
      } else {
        // For Xano, schema is defined through their interface
        // This could potentially use their API to create schema programmatically
        console.log('Xano migrations are managed through the Xano interface.');
        console.log('Please refer to the Xano documentation for schema management.');
      }
    },
    down: async (client) => {
      if (config.getProviderType() === 'supabase') {
        // Drop tables in reverse order to respect foreign key constraints
        await client.query(`
          DROP TABLE IF EXISTS user_roles;
          DROP TABLE IF EXISTS car_owner_profiles;
          DROP TABLE IF EXISTS renter_profiles;
          DROP TABLE IF EXISTS roles;
          DROP TABLE IF EXISTS users;
          
          DROP FUNCTION IF EXISTS increment_owner_listings;
          DROP FUNCTION IF EXISTS decrement_owner_listings;
          DROP FUNCTION IF EXISTS increment_renter_rentals;
          DROP FUNCTION IF EXISTS increment_vehicle_rentals;
        `);
      } else {
        console.log('Xano migrations are managed through the Xano interface.');
      }
    }
  },
  
  // Migration 002: Add vehicle-related tables
  {
    version: 2,
    name: 'vehicle_tables',
    up: async (client) => {
      if (config.getProviderType() === 'supabase') {
        // Locations table
        await client.query(`
          CREATE TABLE IF NOT EXISTS locations (
            location_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            owner_id UUID REFERENCES users(user_id),
            address_line1 VARCHAR(255) NOT NULL,
            address_line2 VARCHAR(255),
            city VARCHAR(100) NOT NULL,
            state VARCHAR(50) NOT NULL,
            postal_code VARCHAR(20) NOT NULL,
            country VARCHAR(50) NOT NULL,
            latitude DECIMAL(10,7) NOT NULL,
            longitude DECIMAL(10,7) NOT NULL,
            location_name VARCHAR(100),
            is_exact BOOLEAN NOT NULL DEFAULT TRUE,
            pickup_instructions TEXT,
            created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
          );
          
          -- Add RLS policies for locations
          ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
          
          CREATE POLICY "Users can view public locations" ON locations
            FOR SELECT USING (TRUE);
            
          CREATE POLICY "Users can manage own locations" ON locations
            FOR ALL USING (auth.uid() = owner_id);
        `);
        
        // Vehicles table
        await client.query(`
          CREATE TABLE IF NOT EXISTS vehicles (
            vehicle_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            owner_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
            make VARCHAR(50) NOT NULL,
            model VARCHAR(50) NOT NULL,
            year INTEGER NOT NULL,
            trim VARCHAR(50),
            color VARCHAR(30) NOT NULL,
            license_plate VARCHAR(20) NOT NULL,
            vin VARCHAR(17) NOT NULL,
            registration_number VARCHAR(50) NOT NULL,
            registration_expiry DATE NOT NULL,
            vehicle_type VARCHAR(20) NOT NULL,
            transmission VARCHAR(20) NOT NULL,
            fuel_type VARCHAR(20) NOT NULL,
            seats INTEGER NOT NULL,
            doors INTEGER NOT NULL,
            mileage INTEGER NOT NULL,
            features JSONB,
            description TEXT,
            guidelines TEXT,
            daily_rate DECIMAL(10,2) NOT NULL,
            hourly_rate DECIMAL(10,2),
            weekly_rate DECIMAL(10,2),
            monthly_rate DECIMAL(10,2),
            security_deposit DECIMAL(10,2) NOT NULL,
            min_rental_duration INTEGER NOT NULL,
            max_rental_duration INTEGER,
            location_id UUID NOT NULL REFERENCES locations(location_id),
            is_available BOOLEAN NOT NULL DEFAULT TRUE,
            availability_status VARCHAR(20) NOT NULL DEFAULT 'available',
            is_approved BOOLEAN NOT NULL DEFAULT FALSE,
            approval_date DATE,
            is_featured BOOLEAN NOT NULL DEFAULT FALSE,
            avg_rating DECIMAL(3,2) NOT NULL DEFAULT 0,
            total_rentals INTEGER NOT NULL DEFAULT 0,
            created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
          );
          
          -- Add RLS policies for vehicles
          ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
          
          CREATE POLICY "Users can view all available vehicles" ON vehicles
            FOR SELECT USING (is_available = TRUE AND is_approved = TRUE);
            
          CREATE POLICY "Users can manage own vehicles" ON vehicles
            FOR ALL USING (auth.uid() = owner_id);
            
          CREATE POLICY "Admins can manage all vehicles" ON vehicles
            FOR ALL USING (
              EXISTS (
                SELECT 1 FROM user_roles ur
                JOIN roles r ON ur.role_id = r.role_id
                WHERE ur.user_id = auth.uid()
                AND r.name IN ('admin', 'super_admin', 'system_admin')
              )
            );
        `);
        
        // Vehicle Images table
        await client.query(`
          CREATE TABLE IF NOT EXISTS vehicle_images (
            image_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            vehicle_id UUID NOT NULL REFERENCES vehicles(vehicle_id) ON DELETE CASCADE,
            image_url VARCHAR(255) NOT NULL,
            image_type VARCHAR(20) NOT NULL DEFAULT 'exterior',
            is_primary BOOLEAN NOT NULL DEFAULT FALSE,
            caption VARCHAR(255),
            order_index INTEGER NOT NULL DEFAULT 0,
            created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
          );
          
          -- Add RLS policies for vehicle_images
          ALTER TABLE vehicle_images ENABLE ROW LEVEL SECURITY;
          
          CREATE POLICY "Anyone can view vehicle images" ON vehicle_images
            FOR SELECT USING (
              EXISTS (
                SELECT 1 FROM vehicles v
                WHERE v.vehicle_id = vehicle_images.vehicle_id
                AND v.is_approved = TRUE
              )
            );
            
          CREATE POLICY "Owners can manage their vehicle images" ON vehicle_images
            FOR ALL USING (
              EXISTS (
                SELECT 1 FROM vehicles v
                WHERE v.vehicle_id = vehicle_images.vehicle_id
                AND v.owner_id = auth.uid()
              )
            );
        `);
        
        // Add more vehicle-related tables...
        
      } else {
        console.log('Xano migrations are managed through the Xano interface.');
      }
    },
    down: async (client) => {
      if (config.getProviderType() === 'supabase') {
        await client.query(`
          DROP TABLE IF EXISTS vehicle_images;
          DROP TABLE IF EXISTS vehicles;
          DROP TABLE IF EXISTS locations;
        `);
      } else {
        console.log('Xano migrations are managed through the Xano interface.');
      }
    }
  },
  
  // Additional migrations would be defined here...
];

/**
 * Run migrations up to a specific version
 * @param {number} targetVersion - Version number to migrate to
 */
export const migrateUp = async (targetVersion = Infinity) => {
  const client = dbConnection.getClient();
  
  try {
    console.log(`Starting migrations up to version ${targetVersion}`);
    
    for (const migration of migrations) {
      if (migration.version <= targetVersion) {
        console.log(`Running migration ${migration.version}: ${migration.name}`);
        await migration.up(client);
        console.log(`Completed migration ${migration.version}`);
      }
    }
    
    console.log('Migrations completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
};

/**
 * Roll back migrations down to a specific version
 * @param {number} targetVersion - Version number to roll back to
 */
export const migrateDown = async (targetVersion = 0) => {
  const client = dbConnection.getClient();
  
  try {
    console.log(`Rolling back migrations to version ${targetVersion}`);
    
    // Sort migrations in reverse order
    const reversedMigrations = [...migrations].sort((a, b) => b.version - a.version);
    
    for (const migration of reversedMigrations) {
      if (migration.version > targetVersion) {
        console.log(`Rolling back migration ${migration.version}: ${migration.name}`);
        await migration.down(client);
        console.log(`Completed rollback of migration ${migration.version}`);
      }
    }
    
    console.log('Migration rollback completed successfully');
  } catch (error) {
    console.error('Migration rollback failed:', error);
    throw error;
  }
};

export default {
  migrations,
  migrateUp,
  migrateDown
};
