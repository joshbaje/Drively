-- Seed data for users

-- Create system-level user for administrative actions
INSERT INTO users (
  user_id,
  email, 
  phone_number, 
  password_hash, 
  first_name, 
  last_name, 
  user_type, 
  date_of_birth,
  is_active, 
  is_verified,
  created_at,
  updated_at
)
VALUES (
  '11111111-1111-1111-1111-111111111111',
  'admin@drivelyph.com',
  '+639123456789',
  'system-generated-hash-to-be-changed',  -- This should be changed immediately after setup
  'System',
  'Administrator',
  'admin',
  '1990-01-01',
  true,
  true,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
) ON CONFLICT (email) DO NOTHING;

-- Create sample owner
INSERT INTO users (
  user_id,
  email, 
  phone_number, 
  password_hash, 
  first_name, 
  last_name, 
  user_type, 
  date_of_birth,
  is_active, 
  is_verified,
  created_at,
  updated_at
)
VALUES (
  '22222222-2222-2222-2222-222222222222',
  'owner@example.com',
  '+639171234567',
  'password-hash-1', -- This should be a hashed password
  'John',
  'Smith',
  'owner',
  '1985-06-15',
  true,
  true,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
) ON CONFLICT (email) DO NOTHING;

-- Create sample renter
INSERT INTO users (
  user_id,
  email, 
  phone_number, 
  password_hash, 
  first_name, 
  last_name, 
  user_type, 
  date_of_birth,
  is_active, 
  is_verified,
  created_at,
  updated_at
)
VALUES (
  '33333333-3333-3333-3333-333333333333',
  'renter@example.com',
  '+639189876543',
  'password-hash-2', -- This should be a hashed password
  'Maria',
  'Santos',
  'renter',
  '1990-09-23',
  true,
  true,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
) ON CONFLICT (email) DO NOTHING;

-- Create sample agent
INSERT INTO users (
  user_id,
  email, 
  phone_number, 
  password_hash, 
  first_name, 
  last_name, 
  user_type, 
  date_of_birth,
  is_active, 
  is_verified,
  created_at,
  updated_at
)
VALUES (
  '44444444-4444-4444-4444-444444444444',
  'agent@example.com',
  '+639167894561',
  'password-hash-3', -- This should be a hashed password
  'Alex',
  'Rivera',
  'admin',
  '1988-11-30',
  true,
  true,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
) ON CONFLICT (email) DO NOTHING;

-- Create test user that matches our login credentials
INSERT INTO users (
  user_id,
  email, 
  phone_number, 
  password_hash, 
  first_name, 
  last_name, 
  user_type, 
  date_of_birth,
  is_active, 
  is_verified,
  created_at,
  updated_at
)
VALUES (
  '55555555-5555-5555-5555-555555555555',
  'bajejosh@gmail.com',
  '+639171234567',
  '1', -- Simple password for testing
  'Josh',
  'Baje',
  'admin',
  '1985-06-15',
  true,
  true,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
) ON CONFLICT (email) DO NOTHING;

-- After inserting, get the actual UUIDs for users that might have already existed
DO $$
DECLARE
  admin_id UUID;
  owner_id UUID;
  renter_id UUID;
  agent_id UUID;
  test_user_id UUID;
BEGIN
  SELECT user_id INTO admin_id FROM users WHERE email = 'admin@drivelyph.com';
  SELECT user_id INTO owner_id FROM users WHERE email = 'owner@example.com';
  SELECT user_id INTO renter_id FROM users WHERE email = 'renter@example.com';
  SELECT user_id INTO agent_id FROM users WHERE email = 'agent@example.com';
  SELECT user_id INTO test_user_id FROM users WHERE email = 'bajejosh@gmail.com';

  -- Output user UUIDs for reference (useful for debugging)
  RAISE NOTICE 'User UUIDs for reference:';
  RAISE NOTICE 'admin@drivelyph.com: %', admin_id;
  RAISE NOTICE 'owner@example.com: %', owner_id;
  RAISE NOTICE 'renter@example.com: %', renter_id;
  RAISE NOTICE 'agent@example.com: %', agent_id;
  RAISE NOTICE 'bajejosh@gmail.com: %', test_user_id;
END $$;
