-- Drively Database Schema for Supabase

-- 1. Core User Management Tables

-- Create the users table
CREATE TABLE IF NOT EXISTS users (
  user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  phone_number VARCHAR(20),
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  user_type VARCHAR(50) CHECK (user_type IN ('renter', 'owner', 'admin')),
  profile_image_url VARCHAR(255),
  date_of_birth DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  last_login_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT TRUE,
  is_verified BOOLEAN DEFAULT FALSE,
  verification_token VARCHAR(255),
  reset_token VARCHAR(255),
  device_token VARCHAR(255),
  bio TEXT,
  address_id UUID
);

-- Create the roles table
CREATE TABLE IF NOT EXISTS roles (
  role_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) NOT NULL UNIQUE,
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create the user_roles junction table
CREATE TABLE IF NOT EXISTS user_roles (
  user_role_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(user_id),
  role_id UUID REFERENCES roles(role_id),
  is_primary BOOLEAN DEFAULT FALSE,
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  assigned_by UUID REFERENCES users(user_id)
);

-- Create the addresses table
CREATE TABLE IF NOT EXISTS addresses (
  address_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(user_id),
  address_type VARCHAR(50) CHECK (address_type IN ('home', 'work', 'billing', 'other')),
  street_address VARCHAR(255) NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(50) NOT NULL,
  postal_code VARCHAR(20) NOT NULL,
  country VARCHAR(50) NOT NULL DEFAULT 'Philippines',
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add foreign key constraint from users to addresses
ALTER TABLE users
ADD CONSTRAINT fk_user_address
FOREIGN KEY (address_id) REFERENCES addresses(address_id);

-- Create the car_owner_profiles table
CREATE TABLE IF NOT EXISTS car_owner_profiles (
  owner_profile_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(user_id) NOT NULL,
  id_verification_status VARCHAR(50) CHECK (id_verification_status IN ('pending', 'approved', 'rejected')),
  verification_date DATE,
  bank_account_number VARCHAR(50),
  tax_id VARCHAR(50),
  total_listings INTEGER DEFAULT 0,
  average_rating DECIMAL(3,2) DEFAULT 0,
  is_business BOOLEAN DEFAULT FALSE,
  business_name VARCHAR(100),
  business_registration_number VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create the renter_profiles table
CREATE TABLE IF NOT EXISTS renter_profiles (
  renter_profile_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(user_id) NOT NULL,
  driver_license_number VARCHAR(50),
  license_state VARCHAR(50),
  license_expiry DATE,
  license_verification_status VARCHAR(50) CHECK (license_verification_status IN ('pending', 'approved', 'rejected')),
  verification_date DATE,
  driving_history_verified BOOLEAN DEFAULT FALSE,
  average_rating DECIMAL(3,2) DEFAULT 0,
  total_rentals INTEGER DEFAULT 0,
  preferred_payment_method_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 2. Vehicle Management Tables

-- Create the locations table first (needed for vehicles)
CREATE TABLE IF NOT EXISTS locations (
  location_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES users(user_id),
  address_line1 VARCHAR(255) NOT NULL,
  address_line2 VARCHAR(255),
  city VARCHAR(100) NOT NULL,
  state VARCHAR(50) NOT NULL,
  postal_code VARCHAR(20) NOT NULL,
  country VARCHAR(50) NOT NULL DEFAULT 'Philippines',
  latitude DECIMAL(10,7),
  longitude DECIMAL(10,7),
  location_name VARCHAR(100),
  is_exact BOOLEAN DEFAULT TRUE,
  pickup_instructions TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create the vehicles table
CREATE TABLE IF NOT EXISTS vehicles (
  vehicle_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES users(user_id) NOT NULL,
  make VARCHAR(50) NOT NULL,
  model VARCHAR(50) NOT NULL,
  year INTEGER NOT NULL,
  trim VARCHAR(50),
  color VARCHAR(30) NOT NULL,
  license_plate VARCHAR(20) NOT NULL,
  vin VARCHAR(17),
  registration_number VARCHAR(50),
  registration_expiry DATE,
  vehicle_type VARCHAR(50) CHECK (vehicle_type IN ('sedan', 'suv', 'truck', 'convertible', 'van')),
  transmission VARCHAR(20) CHECK (transmission IN ('automatic', 'manual')),
  fuel_type VARCHAR(20) CHECK (fuel_type IN ('gasoline', 'diesel', 'electric', 'hybrid')),
  seats INTEGER,
  doors INTEGER,
  mileage INTEGER,
  features JSONB,
  description TEXT,
  guidelines TEXT,
  daily_rate DECIMAL(10,2) NOT NULL,
  hourly_rate DECIMAL(10,2),
  weekly_rate DECIMAL(10,2),
  monthly_rate DECIMAL(10,2),
  security_deposit DECIMAL(10,2),
  min_rental_duration INTEGER,
  max_rental_duration INTEGER,
  location_id UUID REFERENCES locations(location_id),
  is_available BOOLEAN DEFAULT TRUE,
  availability_status VARCHAR(50) CHECK (availability_status IN ('available', 'rented', 'maintenance', 'unlisted')),
  is_approved BOOLEAN DEFAULT FALSE,
  approval_date DATE,
  is_featured BOOLEAN DEFAULT FALSE,
  avg_rating DECIMAL(3,2) DEFAULT 0,
  total_rentals INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create the vehicle_images table
CREATE TABLE IF NOT EXISTS vehicle_images (
  image_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID REFERENCES vehicles(vehicle_id) NOT NULL,
  image_url VARCHAR(255) NOT NULL,
  image_type VARCHAR(50) CHECK (image_type IN ('exterior', 'interior', 'detail', 'damage', 'document')),
  is_primary BOOLEAN DEFAULT FALSE,
  caption VARCHAR(255),
  order_index INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create the vehicle_features table
CREATE TABLE IF NOT EXISTS vehicle_features (
  feature_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  description VARCHAR(255),
  icon VARCHAR(50),
  category VARCHAR(50) CHECK (category IN ('comfort', 'safety', 'performance', 'convenience')),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create the vehicle_feature_links junction table
CREATE TABLE IF NOT EXISTS vehicle_feature_links (
  link_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID REFERENCES vehicles(vehicle_id) NOT NULL,
  feature_id UUID REFERENCES vehicle_features(feature_id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create the availability_calendar table
CREATE TABLE IF NOT EXISTS availability_calendar (
  exception_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID REFERENCES vehicles(vehicle_id) NOT NULL,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  reason VARCHAR(50) CHECK (reason IN ('maintenance', 'personal_use', 'other')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 3. Booking Management Tables

-- Create the payment_methods table (needed for bookings)
CREATE TABLE IF NOT EXISTS payment_methods (
  payment_method_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(user_id) NOT NULL,
  type VARCHAR(50) CHECK (type IN ('credit_card', 'debit_card', 'paypal')),
  is_default BOOLEAN DEFAULT FALSE,
  provider VARCHAR(50),
  last_four VARCHAR(4),
  expiry_month INTEGER,
  expiry_year INTEGER,
  billing_address_id UUID REFERENCES addresses(address_id),
  token VARCHAR(255),
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Update renter_profiles to reference payment_methods now that it exists
ALTER TABLE renter_profiles
ADD CONSTRAINT fk_preferred_payment_method
FOREIGN KEY (preferred_payment_method_id) REFERENCES payment_methods(payment_method_id);

-- Create the cancellation_policies table
CREATE TABLE IF NOT EXISTS cancellation_policies (
  policy_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  hours_before_full_refund INTEGER,
  hours_before_partial_refund INTEGER,
  partial_refund_percentage INTEGER,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create the bookings table
CREATE TABLE IF NOT EXISTS bookings (
  booking_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID REFERENCES vehicles(vehicle_id) NOT NULL,
  renter_id UUID REFERENCES users(user_id) NOT NULL,
  owner_id UUID REFERENCES users(user_id) NOT NULL,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  pickup_location_id UUID REFERENCES locations(location_id),
  dropoff_location_id UUID REFERENCES locations(location_id),
  booking_status VARCHAR(50) CHECK (booking_status IN ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'declined')),
  cancellation_reason TEXT,
  cancellation_policy_id UUID REFERENCES cancellation_policies(policy_id),
  cancelled_by UUID REFERENCES users(user_id),
  cancelled_at TIMESTAMP WITH TIME ZONE,
  daily_rate DECIMAL(10,2) NOT NULL,
  total_days INTEGER NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  tax_amount DECIMAL(10,2),
  service_fee DECIMAL(10,2),
  insurance_fee DECIMAL(10,2),
  additional_fees DECIMAL(10,2),
  discount_amount DECIMAL(10,2),
  total_amount DECIMAL(10,2) NOT NULL,
  security_deposit DECIMAL(10,2),
  deposit_status VARCHAR(50) CHECK (deposit_status IN ('pending', 'held', 'partially_refunded', 'fully_refunded', 'claimed')),
  payment_status VARCHAR(50) CHECK (payment_status IN ('pending', 'authorized', 'paid', 'partially_refunded', 'refunded', 'failed')),
  payment_method_id UUID REFERENCES payment_methods(payment_method_id),
  promotion_id UUID,
  special_requests TEXT,
  contract_signed BOOLEAN DEFAULT FALSE,
  contract_url VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create the vehicle_handovers table
CREATE TABLE IF NOT EXISTS vehicle_handovers (
  handover_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES bookings(booking_id) NOT NULL,
  handover_type VARCHAR(50) CHECK (handover_type IN ('pickup', 'return')),
  status VARCHAR(50) CHECK (status IN ('pending', 'completed', 'disputed')),
  scheduled_time TIMESTAMP WITH TIME ZONE,
  actual_time TIMESTAMP WITH TIME ZONE,
  fuel_level DECIMAL(3,2),
  mileage INTEGER,
  notes TEXT,
  completed_by_owner BOOLEAN DEFAULT FALSE,
  completed_by_renter BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create the vehicle_condition_reports table
CREATE TABLE IF NOT EXISTS vehicle_condition_reports (
  report_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  handover_id UUID REFERENCES vehicle_handovers(handover_id) NOT NULL,
  reported_by UUID REFERENCES users(user_id) NOT NULL,
  exterior_condition JSONB,
  interior_condition JSONB,
  mechanical_condition JSONB,
  fuel_level DECIMAL(3,2),
  mileage INTEGER,
  damages_found BOOLEAN DEFAULT FALSE,
  damage_description TEXT,
  damage_images JSONB,
  cleanliness VARCHAR(50) CHECK (cleanliness IN ('very_clean', 'clean', 'acceptable', 'dirty', 'very_dirty')),
  additional_notes TEXT,
  signature_url VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create the payments table
CREATE TABLE IF NOT EXISTS payments (
  payment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES bookings(booking_id) NOT NULL,
  payer_id UUID REFERENCES users(user_id) NOT NULL,
  payee_id UUID REFERENCES users(user_id),
  payment_type VARCHAR(50) CHECK (payment_type IN ('booking', 'deposit', 'damage', 'extension', 'refund', 'fee')),
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'PHP',
  status VARCHAR(50) CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'refunded', 'disputed')),
  payment_method_id UUID REFERENCES payment_methods(payment_method_id),
  transaction_id VARCHAR(255),
  processor VARCHAR(50),
  processor_fee DECIMAL(10,2),
  platform_fee DECIMAL(10,2),
  owner_payout DECIMAL(10,2),
  tax_amount DECIMAL(10,2),
  receipt_url VARCHAR(255),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create the owner_payouts table
CREATE TABLE IF NOT EXISTS owner_payouts (
  payout_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES users(user_id) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'PHP',
  status VARCHAR(50) CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  payout_method VARCHAR(50),
  booking_ids JSONB,
  transaction_id VARCHAR(255),
  payout_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 4. Ratings and Communication Tables

-- Create the ratings table
CREATE TABLE IF NOT EXISTS ratings (
  rating_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES bookings(booking_id) NOT NULL,
  rater_id UUID REFERENCES users(user_id) NOT NULL,
  ratee_id UUID REFERENCES users(user_id),
  vehicle_id UUID REFERENCES vehicles(vehicle_id),
  rating_type VARCHAR(50) CHECK (rating_type IN ('owner_to_renter', 'renter_to_owner', 'renter_to_vehicle')),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  response TEXT,
  response_date TIMESTAMP WITH TIME ZONE,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create the messages table
CREATE TABLE IF NOT EXISTS messages (
  message_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL,
  sender_id UUID REFERENCES users(user_id) NOT NULL,
  recipient_id UUID REFERENCES users(user_id) NOT NULL,
  message_content TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_read BOOLEAN DEFAULT FALSE,
  read_timestamp TIMESTAMP WITH TIME ZONE,
  booking_id UUID REFERENCES bookings(booking_id)
);

-- 5. Documents and Insurance Tables

-- Create the vehicle_documents table
CREATE TABLE IF NOT EXISTS vehicle_documents (
  document_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID REFERENCES vehicles(vehicle_id) NOT NULL,
  document_type VARCHAR(50) CHECK (document_type IN ('registration', 'insurance', 'inspection', 'permit')),
  file_url VARCHAR(255) NOT NULL,
  status VARCHAR(50) CHECK (status IN ('pending', 'approved', 'rejected')),
  verification_notes TEXT,
  verified_by UUID REFERENCES users(user_id),
  verified_at TIMESTAMP WITH TIME ZONE,
  expiry_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create the user_documents table
CREATE TABLE IF NOT EXISTS user_documents (
  document_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(user_id) NOT NULL,
  document_type VARCHAR(50) CHECK (document_type IN ('driver_license', 'id_card', 'passport')),
  file_url VARCHAR(255) NOT NULL,
  status VARCHAR(50) CHECK (status IN ('pending', 'approved', 'rejected')),
  verification_notes TEXT,
  verified_by UUID REFERENCES users(user_id),
  verified_at TIMESTAMP WITH TIME ZONE,
  expiry_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create the insurance_policies table
CREATE TABLE IF NOT EXISTS insurance_policies (
  policy_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  coverage_details JSONB,
  daily_rate DECIMAL(10,2) NOT NULL,
  deductible DECIMAL(10,2),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create the booking_insurance table
CREATE TABLE IF NOT EXISTS booking_insurance (
  booking_insurance_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES bookings(booking_id) NOT NULL,
  policy_id UUID REFERENCES insurance_policies(policy_id) NOT NULL,
  daily_rate DECIMAL(10,2) NOT NULL,
  total_cost DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 6. Promotional and Additional Feature Tables

-- Create the promotions table
CREATE TABLE IF NOT EXISTS promotions (
  promotion_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) NOT NULL UNIQUE,
  description TEXT,
  discount_type VARCHAR(50) CHECK (discount_type IN ('percentage', 'fixed_amount')),
  discount_value DECIMAL(10,2) NOT NULL,
  min_booking_amount DECIMAL(10,2),
  max_discount DECIMAL(10,2),
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  usage_limit INTEGER,
  usage_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  user_type VARCHAR(50) CHECK (user_type IN ('new_user', 'existing_user', 'all')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Update the bookings table to reference promotions now that it exists
ALTER TABLE bookings
ADD CONSTRAINT fk_booking_promotion
FOREIGN KEY (promotion_id) REFERENCES promotions(promotion_id);

-- Create the user_promotions table
CREATE TABLE IF NOT EXISTS user_promotions (
  user_promotion_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(user_id) NOT NULL,
  promotion_id UUID REFERENCES promotions(promotion_id) NOT NULL,
  booking_id UUID REFERENCES bookings(booking_id),
  applied_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  discount_amount DECIMAL(10,2) NOT NULL
);

-- Create the notifications table
CREATE TABLE IF NOT EXISTS notifications (
  notification_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(user_id) NOT NULL,
  type VARCHAR(50) CHECK (type IN ('booking_request', 'booking_confirmed', 'payment', 'message', 'reminder', 'system')),
  title VARCHAR(255) NOT NULL,
  body TEXT NOT NULL,
  data JSONB,
  is_read BOOLEAN DEFAULT FALSE,
  related_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  sent_at TIMESTAMP WITH TIME ZONE,
  read_at TIMESTAMP WITH TIME ZONE
);

-- Create the favorites table
CREATE TABLE IF NOT EXISTS favorites (
  favorite_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(user_id) NOT NULL,
  vehicle_id UUID REFERENCES vehicles(vehicle_id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create the system_settings table
CREATE TABLE IF NOT EXISTS system_settings (
  setting_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key VARCHAR(100) NOT NULL UNIQUE,
  value TEXT NOT NULL,
  description VARCHAR(255),
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create the support_tickets table
CREATE TABLE IF NOT EXISTS support_tickets (
  ticket_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(user_id) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  booking_id UUID REFERENCES bookings(booking_id),
  status VARCHAR(50) CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  priority VARCHAR(50) CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  assigned_to UUID REFERENCES users(user_id),
  resolution TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- Create the support_messages table
CREATE TABLE IF NOT EXISTS support_messages (
  message_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID REFERENCES support_tickets(ticket_id) NOT NULL,
  sender_id UUID REFERENCES users(user_id) NOT NULL,
  message TEXT NOT NULL,
  attachments JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for common query patterns

-- User search
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_names ON users(first_name, last_name);

-- Vehicle search
CREATE INDEX IF NOT EXISTS idx_vehicles_owner ON vehicles(owner_id);
CREATE INDEX IF NOT EXISTS idx_vehicles_location ON vehicles(location_id);
CREATE INDEX IF NOT EXISTS idx_vehicles_status ON vehicles(availability_status);
CREATE INDEX IF NOT EXISTS idx_vehicles_type ON vehicles(vehicle_type);
CREATE INDEX IF NOT EXISTS idx_vehicles_price ON vehicles(daily_rate);
CREATE INDEX IF NOT EXISTS idx_vehicles_search ON vehicles(make, model, year);

-- Booking search
CREATE INDEX IF NOT EXISTS idx_bookings_renter ON bookings(renter_id);
CREATE INDEX IF NOT EXISTS idx_bookings_owner ON bookings(owner_id);
CREATE INDEX IF NOT EXISTS idx_bookings_vehicle ON bookings(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(booking_status);
CREATE INDEX IF NOT EXISTS idx_bookings_dates ON bookings(start_date, end_date);

-- Rating lookups
CREATE INDEX IF NOT EXISTS idx_ratings_booking ON ratings(booking_id);
CREATE INDEX IF NOT EXISTS idx_ratings_vehicle ON ratings(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_ratings_users ON ratings(rater_id, ratee_id);

-- Message lookups
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_users ON messages(sender_id, recipient_id);
CREATE INDEX IF NOT EXISTS idx_messages_unread ON messages(recipient_id, is_read);

-- Insert initial roles
INSERT INTO roles (name, description, is_active)
VALUES 
  ('admin', 'Full system administration access', true),
  ('support', 'Customer support agent access', true),
  ('content_moderator', 'Content moderation privileges', true),
  ('owner', 'Vehicle owner access', true),
  ('verified_owner', 'Verified vehicle owner with ID and profile checks', true),
  ('renter', 'Basic vehicle renter access', true),
  ('verified_renter', 'Verified renter with ID and license checks', true);

-- Create system-level user for administrative actions
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
  'system-generated-hash-to-be-changed',  -- This should be changed immediately after setup
  'System',
  'Administrator',
  'admin',
  true,
  true
);
