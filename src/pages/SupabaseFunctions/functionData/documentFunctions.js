const documentFunctions = [
  {
    id: 'upload_user_document',
    name: 'upload_user_document',
    description: 'Uploads and saves a user document record',
    security: 'DEFINER',
    parameters: ['user_id UUID', 'document_type TEXT', 'file_url TEXT', 'expiry_date DATE DEFAULT NULL'],
    returns: 'JSONB',
    sql: `CREATE OR REPLACE FUNCTION upload_user_document(
  user_id UUID,
  document_type TEXT,
  file_url TEXT,
  expiry_date DATE DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  document_id UUID;
  result JSONB;
BEGIN
  -- Create document record
  INSERT INTO user_documents (
    document_id,
    user_id,
    document_type,
    file_url,
    status,
    expiry_date,
    created_at,
    updated_at
  ) VALUES (
    uuid_generate_v4(),
    upload_user_document.user_id,
    upload_user_document.document_type,
    upload_user_document.file_url,
    'pending',
    upload_user_document.expiry_date,
    NOW(),
    NOW()
  )
  RETURNING document_id INTO document_id;
  
  -- Return document data
  SELECT json_build_object(
    'success', TRUE,
    'document', json_build_object(
      'document_id', ud.document_id,
      'user_id', ud.user_id,
      'document_type', ud.document_type,
      'file_url', ud.file_url,
      'status', ud.status,
      'expiry_date', ud.expiry_date,
      'created_at', ud.created_at
    )
  )::JSONB INTO result
  FROM user_documents ud
  WHERE ud.document_id = document_id;
  
  RETURN result;
END;
$$;

COMMENT ON FUNCTION upload_user_document IS 'Uploads and saves a user document record';
GRANT EXECUTE ON FUNCTION upload_user_document TO authenticated;`
  },
  {
    id: 'upload_vehicle_document',
    name: 'upload_vehicle_document',
    description: 'Uploads and saves a vehicle document record',
    security: 'DEFINER',
    parameters: ['vehicle_id UUID', 'document_type TEXT', 'file_url TEXT', 'expiry_date DATE DEFAULT NULL'],
    returns: 'JSONB',
    sql: `CREATE OR REPLACE FUNCTION upload_vehicle_document(
  vehicle_id UUID,
  document_type TEXT,
  file_url TEXT,
  expiry_date DATE DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  document_id UUID;
  auth_user_id UUID;
  owner_id UUID;
  result JSONB;
BEGIN
  -- Get authenticated user
  auth_user_id := auth.uid();
  
  -- Get vehicle owner
  SELECT v.owner_id INTO owner_id
  FROM vehicles v
  WHERE v.vehicle_id = upload_vehicle_document.vehicle_id;
  
  -- Check if user owns the vehicle
  IF owner_id IS NULL THEN
    RETURN jsonb_build_object('success', FALSE, 'message', 'Vehicle not found');
  END IF;
  
  IF owner_id != auth_user_id THEN
    RETURN jsonb_build_object('success', FALSE, 'message', 'Not authorized to upload documents for this vehicle');
  END IF;
  
  -- Create document record
  INSERT INTO vehicle_documents (
    document_id,
    vehicle_id,
    document_type,
    file_url,
    status,
    expiry_date,
    created_at,
    updated_at
  ) VALUES (
    uuid_generate_v4(),
    upload_vehicle_document.vehicle_id,
    upload_vehicle_document.document_type,
    upload_vehicle_document.file_url,
    'pending',
    upload_vehicle_document.expiry_date,
    NOW(),
    NOW()
  )
  RETURNING document_id INTO document_id;
  
  -- Return document data
  SELECT json_build_object(
    'success', TRUE,
    'document', json_build_object(
      'document_id', vd.document_id,
      'vehicle_id', vd.vehicle_id,
      'document_type', vd.document_type,
      'file_url', vd.file_url,
      'status', vd.status,
      'expiry_date', vd.expiry_date,
      'created_at', vd.created_at
    )
  )::JSONB INTO result
  FROM vehicle_documents vd
  WHERE vd.document_id = document_id;
  
  RETURN result;
END;
$$;

COMMENT ON FUNCTION upload_vehicle_document IS 'Uploads and saves a vehicle document record';
GRANT EXECUTE ON FUNCTION upload_vehicle_document TO authenticated;`
  }
];

export default documentFunctions;
