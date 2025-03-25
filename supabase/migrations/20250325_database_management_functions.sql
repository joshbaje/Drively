-- Database Management Functions for Drivelyph Admin
-- These functions are used by the DatabaseManager component

-- Function to get table information including record counts
CREATE OR REPLACE FUNCTION get_tables_info()
RETURNS TABLE (
    table_name text,
    record_count bigint
) LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
    RETURN QUERY
    SELECT 
        tables.tablename::text,
        (SELECT COUNT(*) FROM information_schema.columns WHERE table_name=tables.tablename)::bigint
    FROM 
        pg_tables tables
    WHERE 
        schemaname = 'public'
    ORDER BY 
        tables.tablename;
END;
$$;

-- Function to truncate a specific table
CREATE OR REPLACE FUNCTION truncate_table(table_name text)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
    truncate_statement text;
BEGIN
    -- Check if table exists
    IF NOT EXISTS (
        SELECT FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename = table_name
    ) THEN
        RAISE EXCEPTION 'Table % does not exist', table_name;
    END IF;
    
    -- Disable triggers temporarily
    SET session_replication_role = 'replica';
    
    -- Build and execute truncate statement
    truncate_statement := 'TRUNCATE TABLE public.' || quote_ident(table_name) || ' CASCADE';
    EXECUTE truncate_statement;
    
    -- Re-enable triggers
    SET session_replication_role = 'origin';
END;
$$;

-- Function to truncate all tables in the public schema
CREATE OR REPLACE FUNCTION truncate_all_tables()
RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
    r RECORD;
    cmd TEXT;
BEGIN
    -- Disable all triggers temporarily
    SET session_replication_role = 'replica';
    
    -- Get all tables in the public schema
    FOR r IN (
        SELECT tablename 
        FROM pg_tables 
        WHERE schemaname = 'public'
        ORDER BY tablename
    ) LOOP
        -- Build and execute truncate command for each table
        cmd := 'TRUNCATE TABLE public.' || quote_ident(r.tablename) || ' CASCADE';
        EXECUTE cmd;
    END LOOP;
    
    -- Re-enable triggers
    SET session_replication_role = 'origin';
END;
$$;

-- Function to run an arbitrary SQL script
-- Note: This is potentially dangerous and should only be available to admin users
CREATE OR REPLACE FUNCTION run_sql_script(sql_script text)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
    EXECUTE sql_script;
END;
$$;

-- Function to run the full seed data script
CREATE OR REPLACE FUNCTION run_full_seed_script()
RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
    -- This is a placeholder. In production, you would include the actual seed script here
    -- or call an external stored procedure that contains the seed script
    
    -- For example:
    -- EXECUTE load_seed_data();
    
    -- For now, we'll include a minimal version
    -- Insert initial roles if they don't exist
    INSERT INTO roles (name, description, is_active)
    SELECT * FROM (
        VALUES 
            ('admin', 'Full system administration access', true),
            ('support', 'Customer support agent access', true),
            ('content_moderator', 'Content moderation privileges', true),
            ('owner', 'Vehicle owner access', true),
            ('verified_owner', 'Verified vehicle owner with ID and profile checks', true),
            ('renter', 'Basic vehicle renter access', true),
            ('verified_renter', 'Verified renter with ID and license checks', true)
    ) AS new_roles(name, description, is_active)
    WHERE NOT EXISTS (
        SELECT 1 FROM roles WHERE roles.name = new_roles.name
    );
    
    -- Insert admin user if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin@drivelyph.com') THEN
        INSERT INTO users (
            email, 
            phone_number, 
            password_hash, 
            first_name, 
            last_name, 
            user_type, 
            is_active, 
            is_verified
        )
        VALUES (
            'admin@drivelyph.com',
            '+639123456789',
            'system-generated-hash-to-be-changed',
            'System',
            'Administrator',
            'admin',
            true,
            true
        );
        
        -- Assign admin role to the system user
        INSERT INTO user_roles (user_id, role_id, is_primary)
        SELECT 
            (SELECT user_id FROM users WHERE email = 'admin@drivelyph.com'),
            (SELECT role_id FROM roles WHERE name = 'admin'),
            true;
    END IF;
    
    -- Note: For the complete seed script, consider executing the contents of 02_seed_data.sql here
END;
$$;
