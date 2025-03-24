const vehicleFunctions = [
  {
    id: 'create_vehicle_listing',
    name: 'create_vehicle_listing',
    description: 'Creates a new vehicle listing with location',
    security: 'DEFINER',
    parameters: ['vehicle_data JSONB', 'location_data JSONB', 'features JSONB DEFAULT NULL'],
    returns: 'JSONB',
    sql: `CREATE OR REPLACE FUNCTION create_vehicle_listing(
  vehicle_data JSONB,
  location_data JSONB,
  features JSONB DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  vehicle_id UUID;
  location_id UUID;
  owner_id UUID;
  result JSONB;
BEGIN
  -- Extract owner_id
  owner_id := (vehicle_data->>'owner_id')::UUID;
  
  -- Validate owner exists and is an owner
  IF NOT EXISTS (
    SELECT 1 FROM users u 
    JOIN car_owner_profiles cop ON u.user_id = cop.user_id
    WHERE u.user_id = owner_id
  ) THEN
    RETURN jsonb_build_object(
      'success', FALSE,
      'message', 'User is not a registered owner'
    );
  END IF;
  
  -- Create location first
  INSERT INTO locations (
    location_id,
    owner_id,
    address_line1,
    address_line2,
    city,
    state,
    postal_code,
    country,
    latitude,
    longitude,
    location_name,
    is_exact,
    pickup_instructions,
    created_at,
    updated_at
  ) VALUES (
    uuid_generate_v4(),
    owner_id,
    location_data->>'address_line1',
    location_data->>'address_line2',
    location_data->>'city',
    location_data->>'state',
    location_data->>'postal_code',
    location_data->>'country',
    (location_data->>'latitude')::DECIMAL,
    (location_data->>'longitude')::DECIMAL,
    location_data->>'location_name',
    COALESCE((location_data->>'is_exact')::BOOLEAN, FALSE),
    location_data->>'pickup_instructions',
    NOW(),
    NOW()
  )
  RETURNING location_id INTO location_id;
  
  -- Create the vehicle listing
  INSERT INTO vehicles (
    vehicle_id,
    owner_id,
    make,
    model,
    year,
    trim,
    color,
    license_plate,
    vin,
    registration_number,
    registration_expiry,
    vehicle_type,
    transmission,
    fuel_type,
    seats,
    doors,
    mileage,
    features,
    description,
    guidelines,
    daily_rate,
    hourly_rate,
    weekly_rate,
    monthly_rate,
    security_deposit,
    min_rental_duration,
    max_rental_duration,
    location_id,
    is_available,
    availability_status,
    is_approved,
    is_featured,
    avg_rating,
    total_rentals,
    created_at,
    updated_at
  ) VALUES (
    uuid_generate_v4(),
    owner_id,
    vehicle_data->>'make',
    vehicle_data->>'model',
    (vehicle_data->>'year')::INTEGER,
    vehicle_data->>'trim',
    vehicle_data->>'color',
    vehicle_data->>'license_plate',
    vehicle_data->>'vin',
    vehicle_data->>'registration_number',
    (vehicle_data->>'registration_expiry')::DATE,
    vehicle_data->>'vehicle_type',
    vehicle_data->>'transmission',
    vehicle_data->>'fuel_type',
    (vehicle_data->>'seats')::INTEGER,
    (vehicle_data->>'doors')::INTEGER,
    (vehicle_data->>'mileage')::INTEGER,
    COALESCE(features, '[]'::JSONB),
    vehicle_data->>'description',
    vehicle_data->>'guidelines',
    (vehicle_data->>'daily_rate')::DECIMAL,
    (vehicle_data->>'hourly_rate')::DECIMAL,
    (vehicle_data->>'weekly_rate')::DECIMAL,
    (vehicle_data->>'monthly_rate')::DECIMAL,
    (vehicle_data->>'security_deposit')::DECIMAL,
    (vehicle_data->>'min_rental_duration')::INTEGER,
    (vehicle_data->>'max_rental_duration')::INTEGER,
    location_id,
    COALESCE((vehicle_data->>'is_available')::BOOLEAN, TRUE),
    COALESCE(vehicle_data->>'availability_status', 'available'),
    COALESCE((vehicle_data->>'is_approved')::BOOLEAN, FALSE),
    COALESCE((vehicle_data->>'is_featured')::BOOLEAN, FALSE),
    0.0,
    0,
    NOW(),
    NOW()
  )
  RETURNING vehicle_id INTO vehicle_id;
  
  -- Return created vehicle data with location
  SELECT json_build_object(
    'success', TRUE,
    'vehicle', json_build_object(
      'vehicle_id', v.vehicle_id,
      'owner_id', v.owner_id,
      'make', v.make,
      'model', v.model,
      'year', v.year,
      'color', v.color,
      'vehicle_type', v.vehicle_type,
      'transmission', v.transmission,
      'fuel_type', v.fuel_type,
      'seats', v.seats,
      'daily_rate', v.daily_rate,
      'location', json_build_object(
        'location_id', l.location_id,
        'city', l.city,
        'state', l.state,
        'country', l.country
      ),
      'is_approved', v.is_approved,
      'created_at', v.created_at
    )
  )::JSONB INTO result
  FROM vehicles v
  JOIN locations l ON v.location_id = l.location_id
  WHERE v.vehicle_id = vehicle_id;
  
  RETURN result;
END;
$$;

COMMENT ON FUNCTION create_vehicle_listing IS 'Creates a new vehicle listing with location';
GRANT EXECUTE ON FUNCTION create_vehicle_listing TO authenticated;`
  },
  {
    id: 'get_vehicle_details',
    name: 'get_vehicle_details',
    description: 'Gets detailed vehicle information including features, images, location, owner, and ratings',
    security: 'INVOKER',
    parameters: ['vehicle_id UUID'],
    returns: 'JSONB',
    sql: `CREATE OR REPLACE FUNCTION get_vehicle_details(vehicle_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  result JSONB;
  features_data JSONB;
  images_data JSONB;
  owner_data JSONB;
  ratings_data JSONB;
BEGIN
  -- Get vehicle features
  SELECT json_agg(
    json_build_object(
      'feature_id', vf.feature_id,
      'name', vf.name,
      'description', vf.description,
      'icon', vf.icon,
      'category', vf.category
    )
  )::JSONB INTO features_data
  FROM vehicle_feature_links vfl
  JOIN vehicle_features vf ON vfl.feature_id = vf.feature_id
  WHERE vfl.vehicle_id = get_vehicle_details.vehicle_id;
  
  -- Get vehicle images
  SELECT json_agg(
    json_build_object(
      'image_id', vi.image_id,
      'image_url', vi.image_url,
      'image_type', vi.image_type,
      'is_primary', vi.is_primary,
      'caption', vi.caption,
      'order_index', vi.order_index
    )
    ORDER BY 
      CASE WHEN vi.is_primary THEN 0 ELSE 1 END,
      vi.order_index
  )::JSONB INTO images_data
  FROM vehicle_images vi
  WHERE vi.vehicle_id = get_vehicle_details.vehicle_id;
  
  -- Get owner information
  SELECT json_build_object(
    'user_id', u.user_id,
    'first_name', u.first_name,
    'last_name', u.last_name,
    'profile_image_url', u.profile_image_url,
    'average_rating', cop.average_rating,
    'total_listings', cop.total_listings,
    'is_business', cop.is_business,
    'business_name', cop.business_name
  )::JSONB INTO owner_data
  FROM vehicles v
  JOIN users u ON v.owner_id = u.user_id
  JOIN car_owner_profiles cop ON u.user_id = cop.user_id
  WHERE v.vehicle_id = get_vehicle_details.vehicle_id;
  
  -- Get ratings and reviews
  SELECT json_agg(
    json_build_object(
      'rating_id', r.rating_id,
      'rating', r.rating,
      'comment', r.comment,
      'rater', json_build_object(
        'user_id', u.user_id,
        'first_name', u.first_name,
        'profile_image_url', u.profile_image_url
      ),
      'created_at', r.created_at
    )
    ORDER BY r.created_at DESC
  )::JSONB INTO ratings_data
  FROM ratings r
  JOIN users u ON r.rater_id = u.user_id
  WHERE r.vehicle_id = get_vehicle_details.vehicle_id
    AND r.is_published = TRUE;
  
  -- Get vehicle data with all related information
  SELECT json_build_object(
    'vehicle_id', v.vehicle_id,
    'owner_id', v.owner_id,
    'make', v.make,
    'model', v.model,
    'year', v.year,
    'trim', v.trim,
    'color', v.color,
    'vehicle_type', v.vehicle_type,
    'transmission', v.transmission,
    'fuel_type', v.fuel_type,
    'seats', v.seats,
    'doors', v.doors,
    'mileage', v.mileage,
    'description', v.description,
    'guidelines', v.guidelines,
    'daily_rate', v.daily_rate,
    'hourly_rate', v.hourly_rate,
    'weekly_rate', v.weekly_rate,
    'monthly_rate', v.monthly_rate,
    'security_deposit', v.security_deposit,
    'min_rental_duration', v.min_rental_duration,
    'max_rental_duration', v.max_rental_duration,
    'is_available', v.is_available,
    'availability_status', v.availability_status,
    'is_approved', v.is_approved,
    'is_featured', v.is_featured,
    'avg_rating', v.avg_rating,
    'total_rentals', v.total_rentals,
    'created_at', v.created_at,
    'location', json_build_object(
      'location_id', l.location_id,
      'address_line1', l.address_line1,
      'address_line2', l.address_line2,
      'city', l.city,
      'state', l.state,
      'postal_code', l.postal_code,
      'country', l.country,
      'latitude', l.latitude,
      'longitude', l.longitude,
      'location_name', l.location_name,
      'is_exact', l.is_exact,
      'pickup_instructions', l.pickup_instructions
    ),
    'features', COALESCE(features_data, '[]'::JSONB),
    'images', COALESCE(images_data, '[]'::JSONB),
    'owner', owner_data,
    'ratings', COALESCE(ratings_data, '[]'::JSONB)
  )::JSONB INTO result
  FROM vehicles v
  JOIN locations l ON v.location_id = l.location_id
  WHERE v.vehicle_id = get_vehicle_details.vehicle_id;
  
  RETURN result;
END;
$$;

COMMENT ON FUNCTION get_vehicle_details IS 'Gets detailed vehicle information including features, images, location, owner, and ratings';
GRANT EXECUTE ON FUNCTION get_vehicle_details TO authenticated, anon;`
  },
  {
    id: 'check_vehicle_availability',
    name: 'check_vehicle_availability',
    description: 'Checks if a vehicle is available for a given date range',
    security: 'INVOKER',
    parameters: ['vehicle_id UUID', 'start_date TIMESTAMP', 'end_date TIMESTAMP'],
    returns: 'JSONB',
    sql: `CREATE OR REPLACE FUNCTION check_vehicle_availability(
  vehicle_id UUID,
  start_date TIMESTAMP,
  end_date TIMESTAMP
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  is_available BOOLEAN;
  conflicts JSONB;
BEGIN
  -- Check if vehicle exists and is available
  IF NOT EXISTS (
    SELECT 1 FROM vehicles v
    WHERE v.vehicle_id = check_vehicle_availability.vehicle_id
      AND v.is_available = TRUE
      AND v.availability_status = 'available'
  ) THEN
    RETURN jsonb_build_object(
      'is_available', FALSE,
      'message', 'Vehicle is not available for booking'
    );
  END IF;
  
  -- Check for booking conflicts
  SELECT json_agg(
    json_build_object(
      'booking_id', b.booking_id,
      'start_date', b.start_date,
      'end_date', b.end_date
    )
  )::JSONB INTO conflicts
  FROM bookings b
  WHERE b.vehicle_id = check_vehicle_availability.vehicle_id
    AND b.booking_status IN ('confirmed', 'in_progress')
    AND (
      (b.start_date <= check_vehicle_availability.end_date AND b.end_date >= check_vehicle_availability.start_date)
    );
  
  -- Check for availability exceptions
  IF conflicts IS NULL THEN
    SELECT json_agg(
      json_build_object(
        'exception_id', ac.exception_id,
        'start_date', ac.start_date,
        'end_date', ac.end_date,
        'reason', ac.reason
      )
    )::JSONB INTO conflicts
    FROM availability_calendar ac
    WHERE ac.vehicle_id = check_vehicle_availability.vehicle_id
      AND (
        (ac.start_date <= check_vehicle_availability.end_date AND ac.end_date >= check_vehicle_availability.start_date)
      );
  END IF;
  
  is_available := conflicts IS NULL;
  
  RETURN jsonb_build_object(
    'is_available', is_available,
    'conflicts', COALESCE(conflicts, '[]'::JSONB)
  );
END;
$$;

COMMENT ON FUNCTION check_vehicle_availability IS 'Checks if a vehicle is available for a given date range';
GRANT EXECUTE ON FUNCTION check_vehicle_availability TO authenticated, anon;`
  }
];

export default vehicleFunctions;
