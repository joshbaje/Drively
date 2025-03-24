const ratingFunctions = [
  {
    id: 'create_rating',
    name: 'create_rating',
    description: 'Creates a new rating and review for owner, renter, or vehicle',
    security: 'DEFINER',
    parameters: ['rating_data JSONB'],
    returns: 'JSONB',
    sql: `CREATE OR REPLACE FUNCTION create_rating(rating_data JSONB)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  rating_id UUID;
  auth_user_id UUID;
  booking_record RECORD;
  rating_type TEXT;
  ratee_id UUID;
  vehicle_id UUID;
  result JSONB;
BEGIN
  -- Get authenticated user
  auth_user_id := auth.uid();
  
  -- Extract data
  booking_record := (
    SELECT b.* 
    FROM bookings b
    WHERE b.booking_id = (rating_data->>'booking_id')::UUID
  );
  
  IF booking_record IS NULL THEN
    RETURN jsonb_build_object('success', FALSE, 'message', 'Booking not found');
  END IF;
  
  -- Determine rating type and validate permissions
  rating_type := rating_data->>'rating_type';
  
  CASE rating_type
    WHEN 'renter_to_owner' THEN
      IF auth_user_id != booking_record.renter_id THEN
        RETURN jsonb_build_object('success', FALSE, 'message', 'Only the renter can rate the owner');
      END IF;
      ratee_id := booking_record.owner_id;
      vehicle_id := NULL;
    
    WHEN 'owner_to_renter' THEN
      IF auth_user_id != booking_record.owner_id THEN
        RETURN jsonb_build_object('success', FALSE, 'message', 'Only the owner can rate the renter');
      END IF;
      ratee_id := booking_record.renter_id;
      vehicle_id := NULL;
    
    WHEN 'renter_to_vehicle' THEN
      IF auth_user_id != booking_record.renter_id THEN
        RETURN jsonb_build_object('success', FALSE, 'message', 'Only the renter can rate the vehicle');
      END IF;
      ratee_id := NULL;
      vehicle_id := booking_record.vehicle_id;
    
    ELSE
      RETURN jsonb_build_object('success', FALSE, 'message', 'Invalid rating type');
  END CASE;
  
  -- Check if rating already exists
  IF EXISTS (
    SELECT 1 FROM ratings
    WHERE booking_id = booking_record.booking_id
    AND rating_type = rating_data->>'rating_type'
  ) THEN
    RETURN jsonb_build_object('success', FALSE, 'message', 'Rating already exists for this booking');
  END IF;
  
  -- Create rating
  INSERT INTO ratings (
    rating_id,
    booking_id,
    rater_id,
    ratee_id,
    vehicle_id,
    rating_type,
    rating,
    comment,
    is_published,
    created_at,
    updated_at
  ) VALUES (
    uuid_generate_v4(),
    booking_record.booking_id,
    auth_user_id,
    ratee_id,
    vehicle_id,
    rating_type,
    (rating_data->>'rating')::INTEGER,
    rating_data->>'comment',
    TRUE,
    NOW(),
    NOW()
  )
  RETURNING rating_id INTO rating_id;
  
  -- Update average ratings based on type
  CASE rating_type
    WHEN 'renter_to_owner' THEN
      UPDATE car_owner_profiles
      SET average_rating = (
        SELECT AVG(rating)
        FROM ratings
        WHERE ratee_id = booking_record.owner_id
        AND rating_type = 'renter_to_owner'
        AND is_published = TRUE
      )
      WHERE user_id = booking_record.owner_id;
    
    WHEN 'owner_to_renter' THEN
      UPDATE renter_profiles
      SET average_rating = (
        SELECT AVG(rating)
        FROM ratings
        WHERE ratee_id = booking_record.renter_id
        AND rating_type = 'owner_to_renter'
        AND is_published = TRUE
      )
      WHERE user_id = booking_record.renter_id;
    
    WHEN 'renter_to_vehicle' THEN
      UPDATE vehicles
      SET avg_rating = (
        SELECT AVG(rating)
        FROM ratings
        WHERE vehicle_id = booking_record.vehicle_id
        AND rating_type = 'renter_to_vehicle'
        AND is_published = TRUE
      )
      WHERE vehicle_id = booking_record.vehicle_id;
  END CASE;
  
  -- Return created rating
  SELECT json_build_object(
    'success', TRUE,
    'rating', json_build_object(
      'rating_id', r.rating_id,
      'booking_id', r.booking_id,
      'rater_id', r.rater_id,
      'rating_type', r.rating_type,
      'rating', r.rating,
      'comment', r.comment,
      'created_at', r.created_at
    )
  )::JSONB INTO result
  FROM ratings r
  WHERE r.rating_id = rating_id;
  
  RETURN result;
END;
$$;

COMMENT ON FUNCTION create_rating IS 'Creates a new rating and review for owner, renter, or vehicle';
GRANT EXECUTE ON FUNCTION create_rating TO authenticated;`
  },
  {
    id: 'get_vehicle_ratings',
    name: 'get_vehicle_ratings',
    description: 'Gets all ratings and reviews for a vehicle',
    security: 'INVOKER',
    parameters: ['vehicle_id UUID'],
    returns: 'JSONB',
    sql: `CREATE OR REPLACE FUNCTION get_vehicle_ratings(vehicle_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  ratings_data JSONB;
  stats JSONB;
BEGIN
  -- Get ratings
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
  WHERE r.vehicle_id = get_vehicle_ratings.vehicle_id
    AND r.is_published = TRUE
    AND r.rating_type = 'renter_to_vehicle';
  
  -- Get rating statistics
  SELECT json_build_object(
    'average', AVG(r.rating),
    'total_count', COUNT(*),
    'five_star_count', COUNT(*) FILTER (WHERE r.rating = 5),
    'four_star_count', COUNT(*) FILTER (WHERE r.rating = 4),
    'three_star_count', COUNT(*) FILTER (WHERE r.rating = 3),
    'two_star_count', COUNT(*) FILTER (WHERE r.rating = 2),
    'one_star_count', COUNT(*) FILTER (WHERE r.rating = 1)
  )::JSONB INTO stats
  FROM ratings r
  WHERE r.vehicle_id = get_vehicle_ratings.vehicle_id
    AND r.is_published = TRUE
    AND r.rating_type = 'renter_to_vehicle';
  
  RETURN json_build_object(
    'ratings', COALESCE(ratings_data, '[]'::JSONB),
    'stats', stats
  );
END;
$$;

COMMENT ON FUNCTION get_vehicle_ratings IS 'Gets all ratings and reviews for a vehicle';
GRANT EXECUTE ON FUNCTION get_vehicle_ratings TO authenticated, anon;`
  }
];

export default ratingFunctions;
