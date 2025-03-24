-- Main seed file that runs all individual seed files in the correct order

-- First, let's clean up the database tables (for development environments only)
DO $$
BEGIN
    -- Disable triggers temporarily
    SET session_replication_role = 'replica';
    
    -- Delete data from tables in reverse order to avoid foreign key constraint errors
    TRUNCATE system_settings CASCADE;
    TRUNCATE promotions CASCADE;
    TRUNCATE cancellation_policies CASCADE;
    TRUNCATE insurance_policies CASCADE;
    TRUNCATE payment_methods CASCADE;
    TRUNCATE vehicle_feature_links CASCADE;
    TRUNCATE vehicle_features CASCADE;
    TRUNCATE vehicle_images CASCADE;
    TRUNCATE vehicles CASCADE;
    TRUNCATE locations CASCADE;
    TRUNCATE renter_profiles CASCADE;
    TRUNCATE car_owner_profiles CASCADE;
    TRUNCATE user_roles CASCADE;
    TRUNCATE addresses CASCADE;
    TRUNCATE users WHERE email != 'admin@drivelyph.com';
    TRUNCATE roles CASCADE;
    
    -- Re-enable triggers
    SET session_replication_role = 'origin';
END $$;

-- Now run all seed files in order
\i 01_roles.sql
\i 02_users.sql
\i 03_addresses.sql
\i 04_user_roles.sql
\i 05_profiles.sql
\i 06_locations.sql
\i 07_vehicles.sql
\i 08_vehicle_images.sql
\i 09_vehicle_features.sql
\i 10_payment_methods.sql
\i 11_insurance_policies.sql
\i 12_cancellation_policies.sql
\i 13_promotions.sql
\i 14_system_settings.sql

-- Set sequence values to continue after our inserted data
SELECT setval(pg_get_serial_sequence('users', 'id'), coalesce(max(id), 0) + 1, false) FROM users;
SELECT setval(pg_get_serial_sequence('roles', 'id'), coalesce(max(id), 0) + 1, false) FROM roles;
SELECT setval(pg_get_serial_sequence('addresses', 'id'), coalesce(max(id), 0) + 1, false) FROM addresses;
SELECT setval(pg_get_serial_sequence('vehicles', 'id'), coalesce(max(id), 0) + 1, false) FROM vehicles;
