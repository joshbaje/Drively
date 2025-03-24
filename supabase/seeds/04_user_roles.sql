-- Assign roles to users
DO $$
DECLARE
    -- User IDs (look them up from the database)
    owner_id UUID;
    renter_id UUID;
    agent_id UUID;
    admin_id UUID;
    test_user_id UUID;
    
    -- Role IDs (look these up from the database)
    owner_role_id UUID;
    verified_owner_role_id UUID;
    renter_role_id UUID;
    verified_renter_role_id UUID;
    admin_role_id UUID;
    support_role_id UUID;
BEGIN
    -- Get user IDs
    SELECT user_id INTO owner_id FROM users WHERE email = 'owner@example.com';
    SELECT user_id INTO renter_id FROM users WHERE email = 'renter@example.com';
    SELECT user_id INTO agent_id FROM users WHERE email = 'agent@example.com';
    SELECT user_id INTO admin_id FROM users WHERE email = 'admin@drivelyph.com';
    SELECT user_id INTO test_user_id FROM users WHERE email = 'bajejosh@gmail.com';
    
    -- Get role IDs
    SELECT role_id INTO owner_role_id FROM roles WHERE name = 'owner';
    SELECT role_id INTO verified_owner_role_id FROM roles WHERE name = 'verified_owner';
    SELECT role_id INTO renter_role_id FROM roles WHERE name = 'renter';
    SELECT role_id INTO verified_renter_role_id FROM roles WHERE name = 'verified_renter';
    SELECT role_id INTO admin_role_id FROM roles WHERE name = 'admin';
    SELECT role_id INTO support_role_id FROM roles WHERE name = 'support';
    
    -- Debugging
    RAISE NOTICE 'Owner ID: %, Owner Role ID: %', owner_id, owner_role_id;
    
    -- Assign roles to owner user (using NOT EXISTS check)
    IF NOT EXISTS (SELECT 1 FROM user_roles WHERE user_id = owner_id AND role_id = owner_role_id) THEN
        INSERT INTO user_roles (user_id, role_id, is_primary, assigned_at)
        VALUES (owner_id, owner_role_id, false, CURRENT_TIMESTAMP);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM user_roles WHERE user_id = owner_id AND role_id = verified_owner_role_id) THEN
        INSERT INTO user_roles (user_id, role_id, is_primary, assigned_at)
        VALUES (owner_id, verified_owner_role_id, true, CURRENT_TIMESTAMP);
    END IF;
    
    -- Assign roles to renter user
    IF NOT EXISTS (SELECT 1 FROM user_roles WHERE user_id = renter_id AND role_id = renter_role_id) THEN
        INSERT INTO user_roles (user_id, role_id, is_primary, assigned_at)
        VALUES (renter_id, renter_role_id, false, CURRENT_TIMESTAMP);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM user_roles WHERE user_id = renter_id AND role_id = verified_renter_role_id) THEN
        INSERT INTO user_roles (user_id, role_id, is_primary, assigned_at)
        VALUES (renter_id, verified_renter_role_id, true, CURRENT_TIMESTAMP);
    END IF;
    
    -- Assign role to agent user
    IF NOT EXISTS (SELECT 1 FROM user_roles WHERE user_id = agent_id AND role_id = support_role_id) THEN
        INSERT INTO user_roles (user_id, role_id, is_primary, assigned_at)
        VALUES (agent_id, support_role_id, true, CURRENT_TIMESTAMP);
    END IF;
    
    -- Assign role to admin user
    IF NOT EXISTS (SELECT 1 FROM user_roles WHERE user_id = admin_id AND role_id = admin_role_id) THEN
        INSERT INTO user_roles (user_id, role_id, is_primary, assigned_at)
        VALUES (admin_id, admin_role_id, true, CURRENT_TIMESTAMP);
    END IF;
    
    -- Assign roles to test user (bajejosh@gmail.com)
    IF NOT EXISTS (SELECT 1 FROM user_roles WHERE user_id = test_user_id AND role_id = admin_role_id) THEN
        INSERT INTO user_roles (user_id, role_id, is_primary, assigned_at)
        VALUES (test_user_id, admin_role_id, true, CURRENT_TIMESTAMP);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM user_roles WHERE user_id = test_user_id AND role_id = owner_role_id) THEN
        INSERT INTO user_roles (user_id, role_id, is_primary, assigned_at)
        VALUES (test_user_id, owner_role_id, false, CURRENT_TIMESTAMP);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM user_roles WHERE user_id = test_user_id AND role_id = renter_role_id) THEN
        INSERT INTO user_roles (user_id, role_id, is_primary, assigned_at)
        VALUES (test_user_id, renter_role_id, false, CURRENT_TIMESTAMP);
    END IF;
END $$;
