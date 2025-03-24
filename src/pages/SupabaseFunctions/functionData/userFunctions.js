const userFunctions = [
  {
    id: 'get_user_profile',
    name: 'get_user_profile',
    description: 'Gets a user profile with related owner and renter profiles',
    security: 'INVOKER',
    parameters: ['user_id UUID'],
    returns: 'JSONB',
    sql: `CREATE OR REPLACE FUNCTION get_user_profile(user_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  user_data JSONB;
  owner_data JSONB;
  renter_data JSONB;
BEGIN
  -- Get basic user information
  SELECT json_build_object(
    'user_id', u.user_id,
    'email', u.email,
    'phone_number', u.phone_number,
    'first_name', u.first_name,
    'last_name', u.last_name,
    'user_type', u.user_type,
    'profile_image_url', u.profile_image_url,
    'date_of_birth', u.date_of_birth,
    'created_at', u.created_at,
    'is_active', u.is_active,
    'is_verified', u.is_verified,
    'bio', u.bio
  )::JSONB INTO user_data
  FROM users u
  WHERE u.user_id = get_user_profile.user_id;
  
  -- Check if user exists
  IF user_data IS NULL THEN
    RETURN NULL;
  END IF;
  
  -- Get car owner profile if exists
  SELECT json_build_object(
    'owner_profile_id', cop.owner_profile_id,
    'id_verification_status', cop.id_verification_status,
    'verification_date', cop.verification_date,
    'total_listings', cop.total_listings,
    'average_rating', cop.average_rating,
    'is_business', cop.is_business,
    'business_name', cop.business_name
  )::JSONB INTO owner_data
  FROM car_owner_profiles cop
  WHERE cop.user_id = get_user_profile.user_id;
  
  -- Get renter profile if exists
  SELECT json_build_object(
    'renter_profile_id', rp.renter_profile_id,
    'driver_license_number', rp.driver_license_number,
    'license_state', rp.license_state,
    'license_expiry', rp.license_expiry,
    'license_verification_status', rp.license_verification_status,
    'verification_date', rp.verification_date,
    'driving_history_verified', rp.driving_history_verified,
    'average_rating', rp.average_rating,
    'total_rentals', rp.total_rentals
  )::JSONB INTO renter_data
  FROM renter_profiles rp
  WHERE rp.user_id = get_user_profile.user_id;
  
  -- Combine all data
  user_data = user_data || 
    CASE WHEN owner_data IS NOT NULL THEN jsonb_build_object('owner_profile', owner_data) ELSE '{}'::JSONB END ||
    CASE WHEN renter_data IS NOT NULL THEN jsonb_build_object('renter_profile', renter_data) ELSE '{}'::JSONB END;
  
  RETURN user_data;
END;
$$;

COMMENT ON FUNCTION get_user_profile IS 'Gets a user profile with related owner and renter profiles';
GRANT EXECUTE ON FUNCTION get_user_profile TO authenticated;`
  },
  {
    id: 'create_or_update_user_profile',
    name: 'create_or_update_user_profile',
    description: 'Creates or updates a user profile with optional owner and renter profiles',
    security: 'DEFINER',
    parameters: ['user_data JSONB', 'owner_data JSONB DEFAULT NULL', 'renter_data JSONB DEFAULT NULL'],
    returns: 'JSONB',
    sql: `CREATE OR REPLACE FUNCTION create_or_update_user_profile(
  user_data JSONB,
  owner_data JSONB DEFAULT NULL,
  renter_data JSONB DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_id UUID;
  result JSONB;
BEGIN
  -- Extract user_id from input data
  user_id := (user_data->>'user_id')::UUID;
  
  -- Check if this is an update or create
  IF EXISTS (SELECT 1 FROM users WHERE user_id = user_id) THEN
    -- Update existing user
    UPDATE users
    SET
      email = COALESCE(user_data->>'email', email),
      phone_number = COALESCE(user_data->>'phone_number', phone_number),
      first_name = COALESCE(user_data->>'first_name', first_name),
      last_name = COALESCE(user_data->>'last_name', last_name),
      user_type = COALESCE(user_data->>'user_type', user_type),
      profile_image_url = COALESCE(user_data->>'profile_image_url', profile_image_url),
      bio = COALESCE(user_data->>'bio', bio),
      date_of_birth = COALESCE((user_data->>'date_of_birth')::DATE, date_of_birth),
      is_active = COALESCE((user_data->>'is_active')::BOOLEAN, is_active),
      is_verified = COALESCE((user_data->>'is_verified')::BOOLEAN, is_verified),
      updated_at = NOW()
    WHERE user_id = user_id;
  ELSE
    -- Create new user
    INSERT INTO users (
      user_id,
      email,
      phone_number,
      password_hash,
      first_name,
      last_name,
      user_type,
      profile_image_url,
      date_of_birth,
      created_at,
      updated_at,
      is_active,
      is_verified,
      bio
    ) VALUES (
      user_id,
      user_data->>'email',
      user_data->>'phone_number',
      user_data->>'password_hash',
      user_data->>'first_name',
      user_data->>'last_name',
      user_data->>'user_type',
      user_data->>'profile_image_url',
      (user_data->>'date_of_birth')::DATE,
      NOW(),
      NOW(),
      COALESCE((user_data->>'is_active')::BOOLEAN, TRUE),
      COALESCE((user_data->>'is_verified')::BOOLEAN, FALSE),
      user_data->>'bio'
    );
  END IF;
  
  -- Handle car owner profile if provided
  IF owner_data IS NOT NULL THEN
    IF EXISTS (SELECT 1 FROM car_owner_profiles WHERE user_id = user_id) THEN
      -- Update existing owner profile
      UPDATE car_owner_profiles
      SET
        id_verification_status = COALESCE(owner_data->>'id_verification_status', id_verification_status),
        verification_date = COALESCE((owner_data->>'verification_date')::DATE, verification_date),
        bank_account_number = COALESCE(owner_data->>'bank_account_number', bank_account_number),
        tax_id = COALESCE(owner_data->>'tax_id', tax_id),
        is_business = COALESCE((owner_data->>'is_business')::BOOLEAN, is_business),
        business_name = COALESCE(owner_data->>'business_name', business_name),
        business_registration_number = COALESCE(owner_data->>'business_registration_number', business_registration_number),
        updated_at = NOW()
      WHERE user_id = user_id;
    ELSE
      -- Create new owner profile
      INSERT INTO car_owner_profiles (
        owner_profile_id,
        user_id,
        id_verification_status,
        verification_date,
        bank_account_number,
        tax_id,
        total_listings,
        average_rating,
        is_business,
        business_name,
        business_registration_number,
        created_at,
        updated_at
      ) VALUES (
        uuid_generate_v4(),
        user_id,
        owner_data->>'id_verification_status',
        (owner_data->>'verification_date')::DATE,
        owner_data->>'bank_account_number',
        owner_data->>'tax_id',
        COALESCE((owner_data->>'total_listings')::INTEGER, 0),
        COALESCE((owner_data->>'average_rating')::DECIMAL, 0),
        COALESCE((owner_data->>'is_business')::BOOLEAN, FALSE),
        owner_data->>'business_name',
        owner_data->>'business_registration_number',
        NOW(),
        NOW()
      );
    END IF;
  END IF;
  
  -- Handle renter profile if provided
  IF renter_data IS NOT NULL THEN
    IF EXISTS (SELECT 1 FROM renter_profiles WHERE user_id = user_id) THEN
      -- Update existing renter profile
      UPDATE renter_profiles
      SET
        driver_license_number = COALESCE(renter_data->>'driver_license_number', driver_license_number),
        license_state = COALESCE(renter_data->>'license_state', license_state),
        license_expiry = COALESCE((renter_data->>'license_expiry')::DATE, license_expiry),
        license_verification_status = COALESCE(renter_data->>'license_verification_status', license_verification_status),
        verification_date = COALESCE((renter_data->>'verification_date')::DATE, verification_date),
        driving_history_verified = COALESCE((renter_data->>'driving_history_verified')::BOOLEAN, driving_history_verified),
        updated_at = NOW()
      WHERE user_id = user_id;
    ELSE
      -- Create new renter profile
      INSERT INTO renter_profiles (
        renter_profile_id,
        user_id,
        driver_license_number,
        license_state,
        license_expiry,
        license_verification_status,
        verification_date,
        driving_history_verified,
        average_rating,
        total_rentals,
        created_at,
        updated_at
      ) VALUES (
        uuid_generate_v4(),
        user_id,
        renter_data->>'driver_license_number',
        renter_data->>'license_state',
        (renter_data->>'license_expiry')::DATE,
        renter_data->>'license_verification_status',
        (renter_data->>'verification_date')::DATE,
        COALESCE((renter_data->>'driving_history_verified')::BOOLEAN, FALSE),
        COALESCE((renter_data->>'average_rating')::DECIMAL, 0),
        COALESCE((renter_data->>'total_rentals')::INTEGER, 0),
        NOW(),
        NOW()
      );
    END IF;
  END IF;
  
  -- Return the complete user profile
  RETURN get_user_profile(user_id);
END;
$$;

COMMENT ON FUNCTION create_or_update_user_profile IS 'Creates or updates a user profile with optional owner and renter profiles';
GRANT EXECUTE ON FUNCTION create_or_update_user_profile TO authenticated;`
  },
  {
    id: 'get_user_payment_methods',
    name: 'get_user_payment_methods',
    description: 'Gets all payment methods for a user',
    security: 'INVOKER',
    parameters: ['user_id UUID'],
    returns: 'JSONB',
    sql: `CREATE OR REPLACE FUNCTION get_user_payment_methods(user_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  result JSONB;
BEGIN
  SELECT json_agg(
    json_build_object(
      'payment_method_id', pm.payment_method_id,
      'type', pm.type,
      'is_default', pm.is_default,
      'provider', pm.provider,
      'last_four', pm.last_four,
      'expiry_month', pm.expiry_month,
      'expiry_year', pm.expiry_year,
      'is_verified', pm.is_verified,
      'created_at', pm.created_at
    )
  )::JSONB INTO result
  FROM payment_methods pm
  WHERE pm.user_id = get_user_payment_methods.user_id;
  
  RETURN COALESCE(result, '[]'::JSONB);
END;
$$;

COMMENT ON FUNCTION get_user_payment_methods IS 'Gets all payment methods for a user';
GRANT EXECUTE ON FUNCTION get_user_payment_methods TO authenticated;`
  }
];

export default userFunctions;
