const bookingFunctions = [
  {
    id: 'create_booking',
    name: 'create_booking',
    description: 'Creates a new booking with initial payment',
    security: 'DEFINER',
    parameters: ['booking_data JSONB'],
    returns: 'JSONB',
    sql: `CREATE OR REPLACE FUNCTION create_booking(booking_data JSONB)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  booking_id UUID;
  vehicle_id UUID;
  renter_id UUID;
  owner_id UUID;
  result JSONB;
  availability_check JSONB;
BEGIN
  -- Extract required data
  vehicle_id := (booking_data->>'vehicle_id')::UUID;
  renter_id := (booking_data->>'renter_id')::UUID;
  
  -- Get vehicle owner
  SELECT v.owner_id INTO owner_id
  FROM vehicles v
  WHERE v.vehicle_id = vehicle_id;
  
  IF owner_id IS NULL THEN
    RETURN jsonb_build_object('success', FALSE, 'message', 'Vehicle not found');
  END IF;
  
  -- Check if vehicle is available for the requested period
  SELECT * INTO availability_check
  FROM check_vehicle_availability(
    vehicle_id,
    (booking_data->>'start_date')::TIMESTAMP,
    (booking_data->>'end_date')::TIMESTAMP
  );
  
  IF NOT (availability_check->>'is_available')::BOOLEAN THEN
    RETURN jsonb_build_object(
      'success', FALSE,
      'message', 'Vehicle is not available for the selected dates',
      'conflicts', availability_check->'conflicts'
    );
  END IF;
  
  -- Create the booking
  INSERT INTO bookings (
    booking_id,
    vehicle_id,
    renter_id,
    owner_id,
    start_date,
    end_date,
    pickup_location_id,
    dropoff_location_id,
    booking_status,
    daily_rate,
    total_days,
    subtotal,
    tax_amount,
    service_fee,
    insurance_fee,
    additional_fees,
    discount_amount,
    total_amount,
    security_deposit,
    deposit_status,
    payment_status,
    payment_method_id,
    special_requests,
    created_at,
    updated_at
  ) VALUES (
    uuid_generate_v4(),
    vehicle_id,
    renter_id,
    owner_id,
    (booking_data->>'start_date')::TIMESTAMP,
    (booking_data->>'end_date')::TIMESTAMP,
    (booking_data->>'pickup_location_id')::UUID,
    (booking_data->>'dropoff_location_id')::UUID,
    'pending',
    (booking_data->>'daily_rate')::DECIMAL,
    (booking_data->>'total_days')::INTEGER,
    (booking_data->>'subtotal')::DECIMAL,
    (booking_data->>'tax_amount')::DECIMAL,
    (booking_data->>'service_fee')::DECIMAL,
    (booking_data->>'insurance_fee')::DECIMAL,
    (booking_data->>'additional_fees')::DECIMAL,
    (booking_data->>'discount_amount')::DECIMAL,
    (booking_data->>'total_amount')::DECIMAL,
    (booking_data->>'security_deposit')::DECIMAL,
    'pending',
    'pending',
    (booking_data->>'payment_method_id')::UUID,
    booking_data->>'special_requests',
    NOW(),
    NOW()
  )
  RETURNING booking_id INTO booking_id;
  
  -- Get complete booking data
  SELECT json_build_object(
    'success', TRUE,
    'booking', json_build_object(
      'booking_id', b.booking_id,
      'vehicle', json_build_object(
        'vehicle_id', v.vehicle_id,
        'make', v.make,
        'model', v.model,
        'year', v.year
      ),
      'renter', json_build_object(
        'user_id', u_renter.user_id,
        'first_name', u_renter.first_name,
        'last_name', u_renter.last_name
      ),
      'owner', json_build_object(
        'user_id', u_owner.user_id,
        'first_name', u_owner.first_name,
        'last_name', u_owner.last_name
      ),
      'start_date', b.start_date,
      'end_date', b.end_date,
      'booking_status', b.booking_status,
      'total_amount', b.total_amount,
      'security_deposit', b.security_deposit,
      'created_at', b.created_at
    )
  )::JSONB INTO result
  FROM bookings b
  JOIN vehicles v ON b.vehicle_id = v.vehicle_id
  JOIN users u_renter ON b.renter_id = u_renter.user_id
  JOIN users u_owner ON b.owner_id = u_owner.user_id
  WHERE b.booking_id = booking_id;
  
  RETURN result;
END;
$$;

COMMENT ON FUNCTION create_booking IS 'Creates a new booking with initial payment';
GRANT EXECUTE ON FUNCTION create_booking TO authenticated;`
  },
  {
    id: 'get_booking_details',
    name: 'get_booking_details',
    description: 'Gets complete booking details including vehicle, renter, and owner information',
    security: 'INVOKER',
    parameters: ['booking_id UUID'],
    returns: 'JSONB',
    sql: `CREATE OR REPLACE FUNCTION get_booking_details(booking_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  result JSONB;
  auth_user_id UUID;
  payments_data JSONB;
  handovers_data JSONB;
BEGIN
  -- Get authenticated user
  auth_user_id := auth.uid();
  
  -- Check if user is authorized to view this booking
  IF NOT EXISTS (
    SELECT 1 FROM bookings b
    WHERE b.booking_id = get_booking_details.booking_id
    AND (b.renter_id = auth_user_id OR b.owner_id = auth_user_id)
  ) THEN
    RETURN NULL;
  END IF;
  
  -- Get payments information
  SELECT json_agg(
    json_build_object(
      'payment_id', p.payment_id,
      'payment_type', p.payment_type,
      'amount', p.amount,
      'status', p.status,
      'created_at', p.created_at
    )
  )::JSONB INTO payments_data
  FROM payments p
  WHERE p.booking_id = get_booking_details.booking_id;
  
  -- Get handover information
  SELECT json_agg(
    json_build_object(
      'handover_id', vh.handover_id,
      'handover_type', vh.handover_type,
      'status', vh.status,
      'scheduled_time', vh.scheduled_time,
      'actual_time', vh.actual_time,
      'fuel_level', vh.fuel_level,
      'mileage', vh.mileage,
      'completed_by_owner', vh.completed_by_owner,
      'completed_by_renter', vh.completed_by_renter
    )
  )::JSONB INTO handovers_data
  FROM vehicle_handovers vh
  WHERE vh.booking_id = get_booking_details.booking_id;
  
  -- Get booking with all related information
  SELECT json_build_object(
    'booking_id', b.booking_id,
    'vehicle', json_build_object(
      'vehicle_id', v.vehicle_id,
      'make', v.make,
      'model', v.model,
      'year', v.year,
      'color', v.color,
      'vehicle_type', v.vehicle_type,
      'image', (
        SELECT vi.image_url
        FROM vehicle_images vi
        WHERE vi.vehicle_id = v.vehicle_id AND vi.is_primary = TRUE
        LIMIT 1
      )
    ),
    'renter', json_build_object(
      'user_id', u_renter.user_id,
      'first_name', u_renter.first_name,
      'last_name', u_renter.last_name,
      'profile_image_url', u_renter.profile_image_url,
      'phone_number', u_renter.phone_number
    ),
    'owner', json_build_object(
      'user_id', u_owner.user_id,
      'first_name', u_owner.first_name,
      'last_name', u_owner.last_name,
      'profile_image_url', u_owner.profile_image_url,
      'phone_number', u_owner.phone_number
    ),
    'start_date', b.start_date,
    'end_date', b.end_date,
    'pickup_location', json_build_object(
      'location_id', pl.location_id,
      'address_line1', pl.address_line1,
      'city', pl.city,
      'state', pl.state,
      'postal_code', pl.postal_code,
      'pickup_instructions', pl.pickup_instructions
    ),
    'dropoff_location', json_build_object(
      'location_id', dl.location_id,
      'address_line1', dl.address_line1,
      'city', dl.city,
      'state', dl.state,
      'postal_code', dl.postal_code
    ),
    'booking_status', b.booking_status,
    'daily_rate', b.daily_rate,
    'total_days', b.total_days,
    'subtotal', b.subtotal,
    'tax_amount', b.tax_amount,
    'service_fee', b.service_fee,
    'insurance_fee', b.insurance_fee,
    'discount_amount', b.discount_amount,
    'total_amount', b.total_amount,
    'security_deposit', b.security_deposit,
    'deposit_status', b.deposit_status,
    'payment_status', b.payment_status,
    'special_requests', b.special_requests,
    'created_at', b.created_at,
    'payments', COALESCE(payments_data, '[]'::JSONB),
    'handovers', COALESCE(handovers_data, '[]'::JSONB)
  )::JSONB INTO result
  FROM bookings b
  JOIN vehicles v ON b.vehicle_id = v.vehicle_id
  JOIN users u_renter ON b.renter_id = u_renter.user_id
  JOIN users u_owner ON b.owner_id = u_owner.user_id
  JOIN locations pl ON b.pickup_location_id = pl.location_id
  JOIN locations dl ON b.dropoff_location_id = dl.location_id
  WHERE b.booking_id = get_booking_details.booking_id;
  
  RETURN result;
END;
$$;

COMMENT ON FUNCTION get_booking_details IS 'Gets complete booking details including vehicle, renter, and owner information';
GRANT EXECUTE ON FUNCTION get_booking_details TO authenticated;`
  }
];

export default bookingFunctions;
