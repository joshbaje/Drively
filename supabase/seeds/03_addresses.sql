-- Seed data for addresses
DO $$
DECLARE
    owner_id UUID;
    renter_id UUID;
    agent_id UUID;
    test_user_id UUID;
BEGIN
    -- Get user IDs from database
    SELECT user_id INTO owner_id FROM users WHERE email = 'owner@example.com';
    SELECT user_id INTO renter_id FROM users WHERE email = 'renter@example.com';
    SELECT user_id INTO agent_id FROM users WHERE email = 'agent@example.com';
    SELECT user_id INTO test_user_id FROM users WHERE email = 'bajejosh@gmail.com';
    
    -- Insert address for owner user if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM addresses WHERE user_id = owner_id AND address_type = 'home') THEN
        INSERT INTO addresses (
            user_id,
            street_address,
            city,
            state,
            postal_code,
            country,
            address_type,
            is_default,
            created_at,
            updated_at
        ) VALUES (
            owner_id,
            '123 Main St',
            'Makati City',
            'Metro Manila',
            '1200',
            'Philippines',
            'home',
            true,
            CURRENT_TIMESTAMP,
            CURRENT_TIMESTAMP
        );
    END IF;
    
    -- Insert address for renter user if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM addresses WHERE user_id = renter_id AND address_type = 'work') THEN
        INSERT INTO addresses (
            user_id,
            street_address,
            city,
            state,
            postal_code,
            country,
            address_type,
            is_default,
            created_at,
            updated_at
        ) VALUES (
            renter_id,
            '456 Business Ave',
            'Taguig City',
            'Metro Manila',
            '1630',
            'Philippines',
            'work',
            false,
            CURRENT_TIMESTAMP,
            CURRENT_TIMESTAMP
        );
    END IF;
    
    -- Insert address for agent user if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM addresses WHERE user_id = agent_id AND address_type = 'home') THEN
        INSERT INTO addresses (
            user_id,
            street_address,
            city,
            state,
            postal_code,
            country,
            address_type,
            is_default,
            created_at,
            updated_at
        ) VALUES (
            agent_id,
            '789 Condo Lane',
            'Mandaluyong City',
            'Metro Manila',
            '1550',
            'Philippines',
            'home',
            true,
            CURRENT_TIMESTAMP,
            CURRENT_TIMESTAMP
        );
    END IF;
    
    -- Insert address for test user (bajejosh@gmail.com) if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM addresses WHERE user_id = test_user_id AND address_type = 'home') THEN
        INSERT INTO addresses (
            user_id,
            street_address,
            city,
            state,
            postal_code,
            country,
            address_type,
            is_default,
            created_at,
            updated_at
        ) VALUES (
            test_user_id,
            '101 Developer St',
            'Quezon City',
            'Metro Manila',
            '1101',
            'Philippines',
            'home',
            true,
            CURRENT_TIMESTAMP,
            CURRENT_TIMESTAMP
        );
    END IF;
END $$;
