const searchFunctions = [
  {
    id: 'search_vehicles',
    name: 'search_vehicles',
    description: 'Searches for vehicles based on various filters',
    security: 'INVOKER',
    parameters: ['filters JSONB'],
    returns: 'JSONB',
    sql: `CREATE OR REPLACE FUNCTION search_vehicles(filters JSONB)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  location TEXT;
  start_date TIMESTAMP;
  end_date TIMESTAMP;
  min_price DECIMAL;
  max_price DECIMAL;
  vehicle_types TEXT[];
  fuel_types TEXT[];
  transmission TEXT;
  min_seats INTEGER;
  features UUID[];
  sort_by TEXT;
  sort_order TEXT;
  limit_val INTEGER;
  offset_val INTEGER;
  result_count INTEGER;
  results JSONB;
BEGIN
  -- Extract filter parameters
  location := filters->>'location';
  start_date := (filters->>'start_date')::TIMESTAMP;
  end_date := (filters->>'end_date')::TIMESTAMP;
  min_price := (filters->>'min_price')::DECIMAL;
  max_price := (filters->>'max_price')::DECIMAL;
  vehicle_types := ARRAY(SELECT jsonb_array_elements_text(filters->'vehicle_types'));
  fuel_types := ARRAY(SELECT jsonb_array_elements_text(filters->'fuel_types'));
  transmission := filters->>'transmission';
  min_seats := (filters->>'min_seats')::INTEGER;
  features := ARRAY(SELECT (jsonb_array_elements_text(filters->'features'))::UUID);
  sort_by := COALESCE(filters->>'sort_by', 'created_at');
  sort_order := COALESCE(filters->>'sort_order', 'desc');
  limit_val := COALESCE((filters->>'limit')::INTEGER, 10);
  offset_val := COALESCE((filters->>'offset')::INTEGER, 0);
  
  -- Build search query
  WITH filtered_vehicles AS (
    SELECT 
      v.*,
      l.city,
      l.state,
      l.country,
      u.first_name as owner_first_name,
      u.last_name as owner_last_name,
      cop.average_rating as owner_rating,
      (
        SELECT image_url 
        FROM vehicle_images vi 
        WHERE vi.vehicle_id = v.vehicle_id AND vi.is_primary = TRUE 
        LIMIT 1
      ) as primary_image
    FROM vehicles v
    JOIN locations l ON v.location_id = l.location_id
    JOIN users u ON v.owner_id = u.user_id
    JOIN car_owner_profiles cop ON u.user_id = cop.user_id
    WHERE v.is_available = TRUE
    AND v.is_approved = TRUE
    AND v.availability_status = 'available'
    
    -- Location filter
    AND (location IS NULL OR l.city ILIKE '%' || location || '%' OR l.state ILIKE '%' || location || '%')
    
    -- Price range filter
    AND (min_price IS NULL OR v.daily_rate >= min_price)
    AND (max_price IS NULL OR v.daily_rate <= max_price)
    
    -- Vehicle type filter
    AND (array_length(vehicle_types, 1) IS NULL OR v.vehicle_type = ANY(vehicle_types))
    
    -- Fuel type filter
    AND (array_length(fuel_types, 1) IS NULL OR v.fuel_type = ANY(fuel_types))
    
    -- Transmission filter
    AND (transmission IS NULL OR v.transmission = transmission)
    
    -- Seats filter
    AND (min_seats IS NULL OR v.seats >= min_seats)
    
    -- Features filter (using subquery to check if vehicle has all requested features)
    AND (
      array_length(features, 1) IS NULL
      OR (
        SELECT COUNT(*)
        FROM vehicle_feature_links vfl
        WHERE vfl.vehicle_id = v.vehicle_id
        AND vfl.feature_id = ANY(features)
      ) = array_length(features, 1)
    )
    
    -- Date availability filter
    AND (
      start_date IS NULL
      OR end_date IS NULL
      OR NOT EXISTS (
        SELECT 1 FROM bookings b
        WHERE b.vehicle_id = v.vehicle_id
        AND b.booking_status IN ('confirmed', 'in_progress')
        AND (b.start_date <= end_date AND b.end_date >= start_date)
      )
    )
    AND (
      start_date IS NULL
      OR end_date IS NULL
      OR NOT EXISTS (
        SELECT 1 FROM availability_calendar ac
        WHERE ac.vehicle_id = v.vehicle_id
        AND (ac.start_date <= end_date AND ac.end_date >= start_date)
      )
    )
  )
  
  -- Get total count
  SELECT COUNT(*) INTO result_count FROM filtered_vehicles;
  
  -- Get results with sorting and pagination
  SELECT json_agg(
    json_build_object(
      'vehicle_id', fv.vehicle_id,
      'make', fv.make,
      'model', fv.model,
      'year', fv.year,
      'vehicle_type', fv.vehicle_type,
      'transmission', fv.transmission,
      'fuel_type', fv.fuel_type,
      'seats', fv.seats,
      'daily_rate', fv.daily_rate,
      'avg_rating', fv.avg_rating,
      'total_rentals', fv.total_rentals,
      'location', json_build_object(
        'city', fv.city,
        'state', fv.state,
        'country', fv.country
      ),
      'owner', json_build_object(
        'first_name', fv.owner_first_name,
        'last_name', fv.owner_last_name,
        'average_rating', fv.owner_rating
      ),
      'primary_image', fv.primary_image,
      'created_at', fv.created_at
    )
  )::JSONB INTO results
  FROM filtered_vehicles fv
  ORDER BY 
    CASE WHEN sort_by = 'daily_rate' AND sort_order = 'asc' THEN fv.daily_rate END ASC,
    CASE WHEN sort_by = 'daily_rate' AND sort_order = 'desc' THEN fv.daily_rate END DESC,
    CASE WHEN sort_by = 'avg_rating' AND sort_order = 'asc' THEN fv.avg_rating END ASC,
    CASE WHEN sort_by = 'avg_rating' AND sort_order = 'desc' THEN fv.avg_rating END DESC,
    CASE WHEN sort_by = 'created_at' AND sort_order = 'asc' THEN fv.created_at END ASC,
    CASE WHEN sort_by = 'created_at' AND sort_order = 'desc' THEN fv.created_at END DESC
  LIMIT limit_val
  OFFSET offset_val;
  
  RETURN json_build_object(
    'results', COALESCE(results, '[]'::JSONB),
    'total_count', result_count,
    'limit', limit_val,
    'offset', offset_val
  );
END;
$$;

COMMENT ON FUNCTION search_vehicles IS 'Searches for vehicles based on various filters';
GRANT EXECUTE ON FUNCTION search_vehicles TO authenticated, anon;`
  },
  {
    id: 'get_featured_vehicles',
    name: 'get_featured_vehicles',
    description: 'Gets featured vehicles for homepage display',
    security: 'INVOKER',
    parameters: ['result_limit INTEGER DEFAULT 10'],
    returns: 'JSONB',
    sql: `CREATE OR REPLACE FUNCTION get_featured_vehicles(result_limit INTEGER DEFAULT 10)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  featured_vehicles JSONB;
BEGIN
  SELECT json_agg(
    json_build_object(
      'vehicle_id', v.vehicle_id,
      'make', v.make,
      'model', v.model,
      'year', v.year,
      'daily_rate', v.daily_rate,
      'avg_rating', v.avg_rating,
      'image', (
        SELECT image_url
        FROM vehicle_images vi
        WHERE vi.vehicle_id = v.vehicle_id AND vi.is_primary = TRUE
        LIMIT 1
      ),
      'location', json_build_object(
        'city', l.city,
        'state', l.state
      )
    )
  )::JSONB INTO featured_vehicles
  FROM vehicles v
  JOIN locations l ON v.location_id = l.location_id
  WHERE v.is_available = TRUE
    AND v.is_approved = TRUE
    AND v.is_featured = TRUE
  ORDER BY v.avg_rating DESC NULLS LAST, v.total_rentals DESC
  LIMIT get_featured_vehicles.result_limit;
  
  RETURN COALESCE(featured_vehicles, '[]'::JSONB);
END;
$$;

COMMENT ON FUNCTION get_featured_vehicles IS 'Gets featured vehicles for homepage display';
GRANT EXECUTE ON FUNCTION get_featured_vehicles TO authenticated, anon;`
  }
];

export default searchFunctions;
