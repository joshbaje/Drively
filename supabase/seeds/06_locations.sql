-- Seed data for locations
DO $$
DECLARE
    owner_id UUID;
BEGIN
    -- Get owner ID
    SELECT user_id INTO owner_id FROM users WHERE email = 'owner@example.com' LIMIT 1;
    
    -- Insert locations
    INSERT INTO locations (
        owner_id,
        address_line1,
        city,
        state,
        postal_code,
        country,
        latitude,
        longitude,
        location_name,
        is_exact,
        pickup_instructions
    ) VALUES (
        owner_id,
        '123 Main St',
        'Makati City',
        'Metro Manila',
        '1200',
        'Philippines',
        14.5547,
        121.0244,
        'Makati Central',
        true,
        'Park in the visitor area and call me when you arrive.'
    );
    
    INSERT INTO locations (
        owner_id,
        address_line1,
        city,
        state,
        postal_code,
        country,
        latitude,
        longitude,
        location_name,
        is_exact,
        pickup_instructions
    ) VALUES (
        owner_id,
        '456 Business Ave',
        'Taguig City',
        'Metro Manila',
        '1630',
        'Philippines',
        14.5339,
        121.0508,
        'BGC Main',
        true,
        'I will meet you at the lobby of the building.'
    );
END $$;
