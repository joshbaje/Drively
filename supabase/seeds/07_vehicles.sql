-- Seed data for vehicles
DO $$
DECLARE
    owner_id UUID;
    location1_id UUID;
    location2_id UUID;
BEGIN
    -- Get owner ID
    SELECT user_id INTO owner_id FROM users WHERE email = 'owner@example.com' LIMIT 1;
    
    -- Get location IDs
    SELECT location_id INTO location1_id FROM locations WHERE location_name = 'Makati Central' LIMIT 1;
    SELECT location_id INTO location2_id FROM locations WHERE location_name = 'BGC Main' LIMIT 1;
    
    -- Insert vehicles
    INSERT INTO vehicles (
        owner_id,
        make,
        model,
        year,
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
        description,
        guidelines,
        daily_rate,
        weekly_rate,
        monthly_rate,
        security_deposit,
        min_rental_duration,
        location_id,
        is_available,
        availability_status,
        is_approved,
        approval_date,
        is_featured
    ) VALUES (
        owner_id,
        'Toyota',
        'Vios',
        2022,
        'White',
        'ABC 1234',
        '1HGCM82633A123456',
        'REG-123-456-789',
        CURRENT_DATE + INTERVAL '1 year',
        'sedan',
        'automatic',
        'gasoline',
        5,
        4,
        15000,
        'Well-maintained Toyota Vios 2022 model. Perfect for city driving and short trips.',
        'No smoking inside the car. Please return with the same fuel level.',
        2500.00,
        16000.00,
        60000.00,
        10000.00,
        1,
        location1_id,
        true,
        'available',
        true,
        CURRENT_DATE - INTERVAL '60 days',
        true
    );
    
    INSERT INTO vehicles (
        owner_id,
        make,
        model,
        year,
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
        description,
        guidelines,
        daily_rate,
        weekly_rate,
        monthly_rate,
        security_deposit,
        min_rental_duration,
        location_id,
        is_available,
        availability_status,
        is_approved,
        approval_date,
        is_featured
    ) VALUES (
        owner_id,
        'Honda',
        'CR-V',
        2023,
        'Gray',
        'XYZ 5678',
        '2HKRM4H59GH123456',
        'REG-987-654-321',
        CURRENT_DATE + INTERVAL '2 years',
        'suv',
        'automatic',
        'gasoline',
        7,
        5,
        8000,
        'Spacious Honda CR-V 2023 model. Great for family trips and adventures.',
        'No pets allowed. Please return clean and with full tank.',
        3500.00,
        22000.00,
        85000.00,
        15000.00,
        2,
        location2_id,
        true,
        'available',
        true,
        CURRENT_DATE - INTERVAL '45 days',
        true
    );
    
    -- Update owner profile with total listings
    UPDATE car_owner_profiles
    SET total_listings = 2
    WHERE user_id = owner_id;
END $$;
