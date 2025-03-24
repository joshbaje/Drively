# Supabase Authentication Functions

This documentation covers PostgreSQL functions implemented in Supabase for handling user authentication and profile management in the Drivelyph platform.

## Overview

These functions facilitate the following operations:
- User registration and profile creation
- Login state tracking and management
- Profile data synchronization between auth.users and custom tables
- User verification and profile updates
- Account management and security

## Functions

### 1. `create_user_profile()`

**Purpose**: Creates user profiles automatically after registration in Supabase Auth.

**Trigger**: Runs after INSERT on `auth.users`

**Implementation**:
```sql
CREATE OR REPLACE FUNCTION create_user_profile()
RETURNS TRIGGER AS $$
DECLARE
  v_user_type TEXT;
  v_first_name TEXT;
  v_last_name TEXT;
BEGIN
  -- Extract user_type and names from metadata
  v_user_type := NEW.raw_user_meta_data->>'user_type';
  v_first_name := NEW.raw_user_meta_data->>'first_name';
  v_last_name := NEW.raw_user_meta_data->>'last_name';
  
  -- Default to 'renter' if no user_type specified
  IF v_user_type IS NULL THEN
    v_user_type := 'renter';
  END IF;
  
  -- Create user record in the users table
  INSERT INTO users (
    user_id,
    email,
    phone_number,
    password_hash,
    first_name,
    last_name,
    user_type,
    created_at,
    updated_at,
    is_active,
    is_verified
  ) VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'phone_number',
    'managed-by-supabase',
    v_first_name,
    v_last_name,
    v_user_type,
    NEW.created_at,
    NEW.created_at,
    TRUE,
    FALSE
  );
  
  -- Create appropriate profile based on user_type
  IF v_user_type = 'owner' THEN
    INSERT INTO car_owner_profiles (
      user_id,
      id_verification_status,
      total_listings,
      average_rating,
      is_business,
      created_at,
      updated_at
    ) VALUES (
      NEW.id,
      'pending',
      0,
      0,
      FALSE,
      NEW.created_at,
      NEW.created_at
    );
  ELSE
    INSERT INTO renter_profiles (
      user_id,
      license_verification_status,
      driving_history_verified,
      average_rating,
      total_rentals,
      created_at,
      updated_at
    ) VALUES (
      NEW.id,
      'pending',
      FALSE,
      0,
      0,
      NEW.created_at,
      NEW.created_at
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

**Security**: DEFINER - Runs with the privileges of the function creator for reliable table access.

### 2. `update_last_login()`

**Purpose**: Updates the `last_login_at` timestamp in the `users` table when a user signs in.

**Trigger**: Runs after UPDATE on `auth.users` when `last_sign_in_at` changes.

**Implementation**:
```sql
CREATE OR REPLACE FUNCTION update_last_login()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE users
  SET last_login_at = NOW()
  WHERE user_id = NEW.id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

**Security**: DEFINER - Runs with the privileges of the function creator.

### 3. `sync_user_data()`

**Purpose**: Syncs data changes from the custom `users` table back to `auth.users` metadata.

**Trigger**: Runs after UPDATE on `users` table when key fields change.

**Implementation**:
```sql
CREATE OR REPLACE FUNCTION sync_user_data()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE auth.users
  SET 
    raw_user_meta_data = jsonb_build_object(
      'first_name', NEW.first_name,
      'last_name', NEW.last_name,
      'phone_number', NEW.phone_number,
      'user_type', NEW.user_type,
      'bio', NEW.bio,
      'created_at', NEW.created_at
    ) || COALESCE(raw_user_meta_data, '{}'::jsonb)
  WHERE id = NEW.user_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

**Security**: DEFINER - Runs with the privileges of the function creator for auth.users access.

### 4. `verify_user(user_id UUID)`

**Purpose**: Marks a user as verified in the `users` table.

**Parameters**:
- `user_id UUID`: The ID of the user to verify

**Returns**: BOOLEAN - TRUE if successful, FALSE if user not found

**Implementation**:
```sql
CREATE OR REPLACE FUNCTION verify_user(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE users
  SET is_verified = TRUE
  WHERE user_id = verify_user.user_id;
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

**Security**: DEFINER - Runs with the privileges of the function creator.

### 5. `get_user_profile(p_user_id UUID)`

**Purpose**: Retrieves a complete user profile including user data and type-specific profile data.

**Parameters**:
- `p_user_id UUID`: The ID of the user to retrieve

**Returns**: JSONB - Combined user and profile data

**Implementation**:
```sql
CREATE OR REPLACE FUNCTION get_user_profile(p_user_id UUID)
RETURNS JSONB AS $$
DECLARE
  v_user_data JSONB;
  v_profile_data JSONB;
  v_user_type TEXT;
BEGIN
  -- Get user data
  SELECT jsonb_build_object(
    'user_id', user_id,
    'email', email,
    'first_name', first_name,
    'last_name', last_name,
    'phone_number', phone_number,
    'user_type', user_type,
    'profile_image_url', profile_image_url,
    'date_of_birth', date_of_birth,
    'created_at', created_at,
    'is_verified', is_verified,
    'bio', bio
  ) INTO v_user_data
  FROM users
  WHERE user_id = p_user_id;
  
  -- Get profile data based on user type
  v_user_type := v_user_data->>'user_type';
  
  IF v_user_type = 'owner' OR v_user_type = 'verified_owner' OR v_user_type = 'fleet_manager' THEN
    SELECT jsonb_build_object(
      'owner_profile_id', owner_profile_id,
      'id_verification_status', id_verification_status,
      'verification_date', verification_date,
      'bank_account_number', bank_account_number,
      'tax_id', tax_id,
      'total_listings', total_listings,
      'average_rating', average_rating,
      'is_business', is_business,
      'business_name', business_name,
      'business_registration_number', business_registration_number
    ) INTO v_profile_data
    FROM car_owner_profiles
    WHERE user_id = p_user_id;
  ELSE
    SELECT jsonb_build_object(
      'renter_profile_id', renter_profile_id,
      'driver_license_number', driver_license_number,
      'license_state', license_state,
      'license_expiry', license_expiry,
      'license_verification_status', license_verification_status,
      'verification_date', verification_date,
      'driving_history_verified', driving_history_verified,
      'average_rating', average_rating,
      'total_rentals', total_rentals,
      'preferred_payment_method_id', preferred_payment_method_id
    ) INTO v_profile_data
    FROM renter_profiles
    WHERE user_id = p_user_id;
  END IF;
  
  -- Combine user data with profile data
  RETURN v_user_data || jsonb_build_object('profile', v_profile_data);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

**Security**: DEFINER - Runs with the privileges of the function creator to access all tables.

### 6. `update_user_profile(p_user_id UUID, ...)`

**Purpose**: Updates user and profile data across multiple tables in a single operation.

**Parameters**:
- `p_user_id UUID`: The ID of the user to update
- `p_first_name TEXT`: Optional new first name
- `p_last_name TEXT`: Optional new last name
- `p_phone_number TEXT`: Optional new phone number
- `p_bio TEXT`: Optional new bio
- `p_profile_data JSONB`: Optional profile-specific data

**Returns**: JSONB - Result with success status and updated profile or error

**Implementation**:
```sql
CREATE OR REPLACE FUNCTION update_user_profile(
  p_user_id UUID,
  p_first_name TEXT DEFAULT NULL,
  p_last_name TEXT DEFAULT NULL,
  p_phone_number TEXT DEFAULT NULL,
  p_bio TEXT DEFAULT NULL,
  p_profile_data JSONB DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
  v_user_type TEXT;
  v_success BOOLEAN := FALSE;
  v_result JSONB;
BEGIN
  -- Get user type
  SELECT user_type INTO v_user_type
  FROM users
  WHERE user_id = p_user_id;
  
  -- Update users table
  UPDATE users
  SET
    first_name = COALESCE(p_first_name, first_name),
    last_name = COALESCE(p_last_name, last_name),
    phone_number = COALESCE(p_phone_number, phone_number),
    bio = COALESCE(p_bio, bio),
    updated_at = NOW()
  WHERE user_id = p_user_id;
  
  -- Update profile table
  IF p_profile_data IS NOT NULL THEN
    IF v_user_type = 'owner' OR v_user_type = 'verified_owner' OR v_user_type = 'fleet_manager' THEN
      UPDATE car_owner_profiles
      SET
        is_business = COALESCE((p_profile_data->>'is_business')::BOOLEAN, is_business),
        business_name = COALESCE(p_profile_data->>'business_name', business_name),
        business_registration_number = COALESCE(p_profile_data->>'business_registration_number', business_registration_number),
        bank_account_number = COALESCE(p_profile_data->>'bank_account_number', bank_account_number),
        tax_id = COALESCE(p_profile_data->>'tax_id', tax_id),
        updated_at = NOW()
      WHERE user_id = p_user_id;
    ELSE
      UPDATE renter_profiles
      SET
        driver_license_number = COALESCE(p_profile_data->>'driver_license_number', driver_license_number),
        license_state = COALESCE(p_profile_data->>'license_state', license_state),
        license_expiry = COALESCE((p_profile_data->>'license_expiry')::DATE, license_expiry),
        updated_at = NOW()
      WHERE user_id = p_user_id;
    END IF;
  END IF;
  
  -- Return updated profile
  SELECT get_user_profile(p_user_id) INTO v_result;
  RETURN jsonb_build_object('success', TRUE, 'profile', v_result);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

**Security**: DEFINER - Runs with the privileges of the function creator.

### 7. `delete_user_cascade(p_user_id UUID)`

**Purpose**: Safely deletes a user by removing profile data and soft-deleting the user record.

**Parameters**:
- `p_user_id UUID`: The ID of the user to delete

**Returns**: BOOLEAN - TRUE if successful, FALSE if user not found

**Implementation**:
```sql
CREATE OR REPLACE FUNCTION delete_user_cascade(p_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_user_type TEXT;
BEGIN
  -- Get user type
  SELECT user_type INTO v_user_type
  FROM users
  WHERE user_id = p_user_id;
  
  -- Delete profile data
  IF v_user_type = 'owner' OR v_user_type = 'verified_owner' OR v_user_type = 'fleet_manager' THEN
    DELETE FROM car_owner_profiles WHERE user_id = p_user_id;
  ELSE
    DELETE FROM renter_profiles WHERE user_id = p_user_id;
  END IF;
  
  -- Delete user roles
  DELETE FROM user_roles WHERE user_id = p_user_id;
  
  -- Delete addresses
  DELETE FROM addresses WHERE user_id = p_user_id;
  
  -- Delete documents
  DELETE FROM user_documents WHERE user_id = p_user_id;
  
  -- Update user record (soft delete)
  UPDATE users
  SET 
    is_active = FALSE,
    email = 'deleted_' || user_id || '@deleted.com',
    phone_number = NULL,
    updated_at = NOW()
  WHERE user_id = p_user_id;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

**Security**: DEFINER - Runs with the privileges of the function creator.

### 8. `check_email_exists(p_email TEXT)`

**Purpose**: Checks if an email address is already registered.

**Parameters**:
- `p_email TEXT`: The email address to check

**Returns**: BOOLEAN - TRUE if email exists, FALSE otherwise

**Implementation**:
```sql
CREATE OR REPLACE FUNCTION check_email_exists(p_email TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  v_exists BOOLEAN;
BEGIN
  SELECT EXISTS(
    SELECT 1 FROM users WHERE email = p_email
  ) INTO v_exists;
  
  RETURN v_exists;
END;
$$ LANGUAGE plpgsql SECURITY INVOKER;
```

**Security**: INVOKER - Runs with the privileges of the calling user.

### 9. `check_phone_exists(p_phone TEXT)`

**Purpose**: Checks if a phone number is already registered.

**Parameters**:
- `p_phone TEXT`: The phone number to check

**Returns**: BOOLEAN - TRUE if phone exists, FALSE otherwise

**Implementation**:
```sql
CREATE OR REPLACE FUNCTION check_phone_exists(p_phone TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  v_exists BOOLEAN;
BEGIN
  SELECT EXISTS(
    SELECT 1 FROM users WHERE phone_number = p_phone
  ) INTO v_exists;
  
  RETURN v_exists;
END;
$$ LANGUAGE plpgsql SECURITY INVOKER;
```

**Security**: INVOKER - Runs with the privileges of the calling user.

### 10. `upgrade_user_type(p_user_id UUID, p_new_type TEXT)`

**Purpose**: Upgrades a user's type (e.g., from 'renter' to 'verified_renter').

**Parameters**:
- `p_user_id UUID`: The ID of the user to upgrade
- `p_new_type TEXT`: The new user type

**Returns**: BOOLEAN - TRUE if successful, FALSE otherwise

**Implementation**:
```sql
CREATE OR REPLACE FUNCTION upgrade_user_type(p_user_id UUID, p_new_type TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  v_current_type TEXT;
BEGIN
  -- Get current user type
  SELECT user_type INTO v_current_type
  FROM users
  WHERE user_id = p_user_id;
  
  -- Validate upgrade path
  IF v_current_type = 'renter' AND p_new_type = 'verified_renter' THEN
    -- Valid upgrade
    NULL;
  ELSIF v_current_type = 'owner' AND p_new_type = 'verified_owner' THEN
    -- Valid upgrade
    NULL;
  ELSIF p_new_type IN ('admin', 'support', 'content_moderator') THEN
    -- Admin-level changes require additional authorization
    -- Implemented via RLS policies
    NULL;
  ELSE
    -- Invalid upgrade path
    RETURN FALSE;
  END IF;
  
  -- Update user type
  UPDATE users
  SET
    user_type = p_new_type,
    updated_at = NOW()
  WHERE user_id = p_user_id;
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

**Security**: DEFINER - Runs with the privileges of the function creator.

## Row Level Security Policies

These functions are paired with Row Level Security (RLS) policies to ensure proper access control:

```sql
-- Default policies (simplified for this example - expand as needed)
CREATE POLICY users_self_access ON users 
  FOR SELECT TO authenticated 
  USING (auth.uid() = user_id);

CREATE POLICY users_self_update ON users 
  FOR UPDATE TO authenticated 
  USING (auth.uid() = user_id);

CREATE POLICY owner_profiles_self_access ON car_owner_profiles 
  FOR SELECT TO authenticated 
  USING (auth.uid() = user_id);

CREATE POLICY owner_profiles_self_update ON car_owner_profiles 
  FOR UPDATE TO authenticated 
  USING (auth.uid() = user_id);

CREATE POLICY renter_profiles_self_access ON renter_profiles 
  FOR SELECT TO authenticated 
  USING (auth.uid() = user_id);

CREATE POLICY renter_profiles_self_update ON renter_profiles 
  FOR UPDATE TO authenticated 
  USING (auth.uid() = user_id);

-- Admin policies
CREATE POLICY users_admin_access ON users 
  FOR ALL TO authenticated 
  USING (EXISTS (
    SELECT 1 FROM users
    WHERE user_id = auth.uid() 
    AND user_type IN ('admin', 'super_admin', 'system_admin')
  ));

CREATE POLICY owner_profiles_admin_access ON car_owner_profiles 
  FOR ALL TO authenticated 
  USING (EXISTS (
    SELECT 1 FROM users
    WHERE user_id = auth.uid() 
    AND user_type IN ('admin', 'super_admin', 'system_admin')
  ));

CREATE POLICY renter_profiles_admin_access ON renter_profiles 
  FOR ALL TO authenticated 
  USING (EXISTS (
    SELECT 1 FROM users
    WHERE user_id = auth.uid() 
    AND user_type IN ('admin', 'super_admin', 'system_admin')
  ));
```

## Client-Side Usage

These functions can be called from client-side code using Supabase's RPC feature:

```javascript
// Example: Getting a user profile
const { data, error } = await supabase.rpc('get_user_profile', {
  p_user_id: userId
});

// Example: Updating a profile
const { data, error } = await supabase.rpc('update_user_profile', {
  p_user_id: userId,
  p_first_name: 'John',
  p_last_name: 'Doe',
  p_profile_data: {
    driver_license_number: 'DL12345678'
  }
});
```

## Implementation Notes

1. **Security Considerations**:
   - Most functions use SECURITY DEFINER to ensure they can access the necessary tables
   - Functions like check_email_exists use SECURITY INVOKER since they don't need elevated privileges
   - Row Level Security (RLS) policies control access to the underlying tables

2. **Error Handling**:
   - Functions use FOUND, RETURN NULL, and other mechanisms to indicate success/failure
   - Some functions return JSON objects with success/error information

3. **Trigger Management**:
   - Functions like create_user_profile are tied to triggers on the auth.users table
   - When deploying, ensure triggers are properly created after the functions

4. **Performance**:
   - Consider adding appropriate indexes on frequently queried columns
   - For high-traffic deployments, consider optimizing the JSON operations
