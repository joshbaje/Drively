-- Seed data for roles

-- First, try inserting with ON CONFLICT (name) DO NOTHING to handle existing roles
INSERT INTO roles (name, description, is_active, created_at, updated_at)
VALUES 
  ('owner', 'Vehicle owner access', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('verified_owner', 'Verified vehicle owner with ID and profile checks', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('renter', 'Basic vehicle renter access', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('verified_renter', 'Verified renter with ID and license checks', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('admin', 'Full system administration access', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('support', 'Customer support agent access', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('content_moderator', 'Content moderation privileges', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (name) DO NOTHING;

-- Now get the UUIDs for each role for use in referencing tables
DO $$
DECLARE
  owner_id UUID;
  verified_owner_id UUID;
  renter_id UUID;
  verified_renter_id UUID;
  admin_id UUID;
  support_id UUID;
  content_moderator_id UUID;
BEGIN
  -- Get the actual UUIDs from the database
  SELECT role_id INTO owner_id FROM roles WHERE name = 'owner';
  SELECT role_id INTO verified_owner_id FROM roles WHERE name = 'verified_owner';
  SELECT role_id INTO renter_id FROM roles WHERE name = 'renter';
  SELECT role_id INTO verified_renter_id FROM roles WHERE name = 'verified_renter';
  SELECT role_id INTO admin_id FROM roles WHERE name = 'admin';
  SELECT role_id INTO support_id FROM roles WHERE name = 'support';
  SELECT role_id INTO content_moderator_id FROM roles WHERE name = 'content_moderator';
  
  -- Output UUIDs for reference (useful for debugging)
  RAISE NOTICE 'Role UUIDs for reference:';
  RAISE NOTICE 'owner: %', owner_id;
  RAISE NOTICE 'verified_owner: %', verified_owner_id;
  RAISE NOTICE 'renter: %', renter_id;
  RAISE NOTICE 'verified_renter: %', verified_renter_id;
  RAISE NOTICE 'admin: %', admin_id;
  RAISE NOTICE 'support: %', support_id;
  RAISE NOTICE 'content_moderator: %', content_moderator_id;
END $$;
