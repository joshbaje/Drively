const paymentFunctions = [
  {
    id: 'create_payment',
    name: 'create_payment',
    description: 'Creates a new payment record',
    security: 'DEFINER',
    parameters: ['payment_data JSONB'],
    returns: 'JSONB',
    sql: `CREATE OR REPLACE FUNCTION create_payment(payment_data JSONB)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  payment_id UUID;
  result JSONB;
BEGIN
  -- Insert payment record
  INSERT INTO payments (
    payment_id,
    booking_id,
    payer_id,
    payee_id,
    payment_type,
    amount,
    currency,
    status,
    payment_method_id,
    transaction_id,
    processor,
    processor_fee,
    platform_fee,
    owner_payout,
    tax_amount,
    notes,
    created_at,
    updated_at
  ) VALUES (
    uuid_generate_v4(),
    (payment_data->>'booking_id')::UUID,
    (payment_data->>'payer_id')::UUID,
    (payment_data->>'payee_id')::UUID,
    payment_data->>'payment_type',
    (payment_data->>'amount')::DECIMAL,
    COALESCE(payment_data->>'currency', 'PHP'),
    COALESCE(payment_data->>'status', 'pending'),
    (payment_data->>'payment_method_id')::UUID,
    payment_data->>'transaction_id',
    payment_data->>'processor',
    (payment_data->>'processor_fee')::DECIMAL,
    (payment_data->>'platform_fee')::DECIMAL,
    (payment_data->>'owner_payout')::DECIMAL,
    (payment_data->>'tax_amount')::DECIMAL,
    payment_data->>'notes',
    NOW(),
    NOW()
  )
  RETURNING payment_id INTO payment_id;
  
  -- Update booking payment status if this is a booking payment
  IF (payment_data->>'payment_type') = 'booking' AND (payment_data->>'booking_id') IS NOT NULL THEN
    UPDATE bookings
    SET payment_status = COALESCE(payment_data->>'status', 'pending')
    WHERE booking_id = (payment_data->>'booking_id')::UUID;
  END IF;
  
  -- Update booking deposit status if this is a deposit payment
  IF (payment_data->>'payment_type') = 'deposit' AND (payment_data->>'booking_id') IS NOT NULL THEN
    UPDATE bookings
    SET deposit_status = COALESCE(payment_data->>'status', 'pending')
    WHERE booking_id = (payment_data->>'booking_id')::UUID;
  END IF;
  
  -- Return created payment
  SELECT json_build_object(
    'success', TRUE,
    'payment', json_build_object(
      'payment_id', p.payment_id,
      'booking_id', p.booking_id,
      'payer_id', p.payer_id,
      'payee_id', p.payee_id,
      'payment_type', p.payment_type,
      'amount', p.amount,
      'currency', p.currency,
      'status', p.status,
      'created_at', p.created_at
    )
  )::JSONB INTO result
  FROM payments p
  WHERE p.payment_id = payment_id;
  
  RETURN result;
END;
$$;

COMMENT ON FUNCTION create_payment IS 'Creates a new payment record';
GRANT EXECUTE ON FUNCTION create_payment TO authenticated;`
  },
  {
    id: 'update_payment_status',
    name: 'update_payment_status',
    description: 'Updates a payment status and related booking status',
    security: 'DEFINER',
    parameters: ['payment_id UUID', 'status TEXT', 'transaction_id TEXT DEFAULT NULL'],
    returns: 'JSONB',
    sql: `CREATE OR REPLACE FUNCTION update_payment_status(
  payment_id UUID,
  status TEXT,
  transaction_id TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  payment_record RECORD;
  booking_id UUID;
  payment_type TEXT;
  result JSONB;
BEGIN
  -- Get current payment info
  SELECT * INTO payment_record
  FROM payments
  WHERE payment_id = update_payment_status.payment_id;
  
  IF payment_record IS NULL THEN
    RETURN jsonb_build_object('success', FALSE, 'message', 'Payment not found');
  END IF;
  
  booking_id := payment_record.booking_id;
  payment_type := payment_record.payment_type;
  
  -- Update payment status
  UPDATE payments
  SET 
    status = update_payment_status.status,
    transaction_id = COALESCE(update_payment_status.transaction_id, transaction_id),
    updated_at = NOW()
  WHERE payment_id = update_payment_status.payment_id;
  
  -- Update booking payment or deposit status if applicable
  IF booking_id IS NOT NULL THEN
    IF payment_type = 'booking' THEN
      UPDATE bookings
      SET payment_status = update_payment_status.status
      WHERE booking_id = booking_id;
      
      -- If payment is completed, update booking status to confirmed
      IF update_payment_status.status = 'completed' THEN
        UPDATE bookings
        SET booking_status = 'confirmed'
        WHERE booking_id = booking_id AND booking_status = 'pending';
      END IF;
    ELSIF payment_type = 'deposit' THEN
      UPDATE bookings
      SET deposit_status = update_payment_status.status
      WHERE booking_id = booking_id;
    END IF;
  END IF;
  
  -- Return updated payment data
  SELECT json_build_object(
    'success', TRUE,
    'payment', json_build_object(
      'payment_id', p.payment_id,
      'booking_id', p.booking_id,
      'status', p.status,
      'transaction_id', p.transaction_id,
      'updated_at', p.updated_at
    )
  )::JSONB INTO result
  FROM payments p
  WHERE p.payment_id = update_payment_status.payment_id;
  
  RETURN result;
END;
$$;

COMMENT ON FUNCTION update_payment_status IS 'Updates a payment status and related booking status';
GRANT EXECUTE ON FUNCTION update_payment_status TO authenticated;`
  }
];

export default paymentFunctions;
