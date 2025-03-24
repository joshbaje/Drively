-- Sample data for testing and development

-- First, let's get the admin user ID
DO $$
DECLARE
    admin_id UUID;
    address1_id UUID;
    address2_id UUID;
    address3_id UUID;
    owner_id UUID;
    renter_id UUID;
    agent_id UUID;
    location1_id UUID;
    location2_id UUID;
    vehicle1_id UUID;
    vehicle2_id UUID;
    payment_method_id UUID;
BEGIN
    SELECT user_id INTO admin_id FROM users WHERE email = 'admin@drivelyph.com' LIMIT 1;
    
    -- Add addresses
    INSERT INTO addresses (
        street_address,
        city,
        state,
        postal_code,
        country,
        address_type,
        is_default
    ) VALUES
    ('123 Main St', 'Makati City', 'Metro Manila', '1200', 'Philippines', 'home', true)
    RETURNING address_id INTO address1_id;
    
    INSERT INTO addresses (
        street_address,
        city,
        state,
        postal_code,
        country,
        address_type,
        is_default
    ) VALUES
    ('456 Business Ave', 'Taguig City', 'Metro Manila', '1630', 'Philippines', 'work', false)
    RETURNING address_id INTO address2_id;
    
    INSERT INTO addresses (
        street_address,
        city,
        state,
        postal_code,
        country,
        address_type,
        is_default
    ) VALUES
    ('789 Condo Lane', 'Mandaluyong City', 'Metro Manila', '1550', 'Philippines', 'home', true)
    RETURNING address_id INTO address3_id;
    
    -- Add sample users
    INSERT INTO users (
        email,
        phone_number,
        password_hash,
        first_name,
        last_name,
        user_type,
        date_of_birth,
        is_active,
        is_verified,
        address_id
    ) VALUES
    ('owner@example.com', '+639171234567', 'password-hash-1', 'John', 'Smith', 'owner', '1985-06-15', true, true, address1_id)
    RETURNING user_id INTO owner_id;
    
    INSERT INTO users (
        email,
        phone_number,
        password_hash,
        first_name,
        last_name,
        user_type,
        date_of_birth,
        is_active,
        is_verified,
        address_id
    ) VALUES
    ('renter@example.com', '+639189876543', 'password-hash-2', 'Maria', 'Santos', 'renter', '1990-09-23', true, true, address2_id)
    RETURNING user_id INTO renter_id;
    
    INSERT INTO users (
        email,
        phone_number,
        password_hash,
        first_name,
        last_name,
        user_type,
        date_of_birth,
        is_active,
        is_verified,
        address_id
    ) VALUES
    ('agent@example.com', '+639167894561', 'password-hash-3', 'Alex', 'Rivera', 'admin', '1988-11-30', true, true, address3_id)
    RETURNING user_id INTO agent_id;
    
    -- Assign roles to users
    INSERT INTO user_roles (user_id, role_id, is_primary)
    SELECT owner_id, role_id, true FROM roles WHERE name = 'verified_owner' LIMIT 1;
    
    INSERT INTO user_roles (user_id, role_id, is_primary)
    SELECT renter_id, role_id, true FROM roles WHERE name = 'verified_renter' LIMIT 1;
    
    INSERT INTO user_roles (user_id, role_id, is_primary)
    SELECT agent_id, role_id, true FROM roles WHERE name = 'support' LIMIT 1;
    
    -- Create owner profile
    INSERT INTO car_owner_profiles (
        user_id,
        id_verification_status,
        verification_date,
        bank_account_number,
        tax_id,
        is_business,
        average_rating
    ) VALUES (
        owner_id,
        'approved',
        CURRENT_DATE - INTERVAL '30 days',
        '1234567890',
        'TAX-123-456-789',
        false,
        4.8
    );
    
    -- Create renter profile
    INSERT INTO renter_profiles (
        user_id,
        driver_license_number,
        license_state,
        license_expiry,
        license_verification_status,
        verification_date,
        driving_history_verified,
        average_rating
    ) VALUES (
        renter_id,
        'N04-12-123456',
        'Metro Manila',
        CURRENT_DATE + INTERVAL '2 years',
        'approved',
        CURRENT_DATE - INTERVAL '15 days',
        true,
        4.9
    );
    
    -- Create locations
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
    ) RETURNING location_id INTO location1_id;
    
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
    ) RETURNING location_id INTO location2_id;
    
    -- Create vehicles
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
    ) RETURNING vehicle_id INTO vehicle1_id;
    
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
    ) RETURNING vehicle_id INTO vehicle2_id;
    
    -- Add vehicle images
    INSERT INTO vehicle_images (
        vehicle_id,
        image_url,
        image_type,
        is_primary,
        caption,
        order_index
    ) VALUES (
        vehicle1_id,
        'https://example.com/images/toyota-vios-exterior.jpg',
        'exterior',
        true,
        'Toyota Vios 2022 - Front View',
        1
    );
    
    INSERT INTO vehicle_images (
        vehicle_id,
        image_url,
        image_type,
        is_primary,
        caption,
        order_index
    ) VALUES (
        vehicle1_id,
        'https://example.com/images/toyota-vios-interior.jpg',
        'interior',
        false,
        'Toyota Vios 2022 - Interior',
        2
    );
    
    INSERT INTO vehicle_images (
        vehicle_id,
        image_url,
        image_type,
        is_primary,
        caption,
        order_index
    ) VALUES (
        vehicle2_id,
        'https://example.com/images/honda-crv-exterior.jpg',
        'exterior',
        true,
        'Honda CR-V 2023 - Front View',
        1
    );
    
    INSERT INTO vehicle_images (
        vehicle_id,
        image_url,
        image_type,
        is_primary,
        caption,
        order_index
    ) VALUES (
        vehicle2_id,
        'https://example.com/images/honda-crv-interior.jpg',
        'interior',
        false,
        'Honda CR-V 2023 - Interior',
        2
    );
    
    -- Add some vehicle features
    WITH inserted_features AS (
        INSERT INTO vehicle_features (
            name,
            description,
            icon,
            category
        ) VALUES
        ('Bluetooth', 'Bluetooth connectivity for phone and media', 'bluetooth', 'comfort'),
        ('Backup Camera', 'Rear view camera for parking assistance', 'camera', 'safety'),
        ('GPS Navigation', 'Built-in GPS navigation system', 'map', 'convenience'),
        ('Sunroof', 'Panoramic sunroof', 'sun', 'comfort'),
        ('Cruise Control', 'Adaptive cruise control', 'dashboard', 'performance')
        RETURNING *
    )
    
    -- Link features to vehicles
    INSERT INTO vehicle_feature_links (
        vehicle_id,
        feature_id
    )
    SELECT 
        vehicle1_id, 
        feature_id 
    FROM 
        inserted_features 
    WHERE 
        name IN ('Bluetooth', 'Backup Camera', 'GPS Navigation');
    
    INSERT INTO vehicle_feature_links (
        vehicle_id,
        feature_id
    )
    SELECT 
        vehicle2_id, 
        feature_id 
    FROM 
        vehicle_features 
    WHERE 
        name IN ('Bluetooth', 'Backup Camera', 'GPS Navigation', 'Sunroof', 'Cruise Control');
    
    -- Add payment methods
    INSERT INTO payment_methods (
        user_id,
        type,
        is_default,
        provider,
        last_four,
        expiry_month,
        expiry_year,
        is_verified
    ) VALUES (
        renter_id,
        'credit_card',
        true,
        'visa',
        '4321',
        12,
        2026,
        true
    )
    RETURNING payment_method_id INTO payment_method_id;
    
    -- Update renter profile with payment method
    UPDATE renter_profiles
    SET preferred_payment_method_id = payment_method_id
    WHERE user_id = renter_id;
    
    -- Add insurance policies
    INSERT INTO insurance_policies (
        name,
        description,
        coverage_details,
        daily_rate,
        deductible,
        is_active
    ) VALUES (
        'Basic Coverage',
        'Basic insurance covering liability and collisions',
        '{"liability": true, "collision": true, "comprehensive": false, "personal_injury": false}',
        350.00,
        5000.00,
        true
    );
    
    INSERT INTO insurance_policies (
        name,
        description,
        coverage_details,
        daily_rate,
        deductible,
        is_active
    ) VALUES (
        'Premium Coverage',
        'Comprehensive insurance with additional benefits',
        '{"liability": true, "collision": true, "comprehensive": true, "personal_injury": true, "roadside_assistance": true}',
        750.00,
        2500.00,
        true
    );
    
    -- Add a cancellation policy
    INSERT INTO cancellation_policies (
        name,
        description,
        hours_before_full_refund,
        hours_before_partial_refund,
        partial_refund_percentage,
        is_active
    ) VALUES (
        'Standard Cancellation',
        'Standard cancellation policy with graduated refunds',
        72,
        24,
        50,
        true
    );
    
    -- Add promotions
    INSERT INTO promotions (
        code,
        description,
        discount_type,
        discount_value,
        min_booking_amount,
        start_date,
        end_date,
        usage_limit,
        is_active,
        user_type
    ) VALUES (
        'WELCOME20',
        'Welcome discount for new users - 20% off',
        'percentage',
        20.00,
        1000.00,
        CURRENT_DATE - INTERVAL '30 days',
        CURRENT_DATE + INTERVAL '60 days',
        100,
        true,
        'new_user'
    );
    
    INSERT INTO promotions (
        code,
        description,
        discount_type,
        discount_value,
        min_booking_amount,
        start_date,
        end_date,
        usage_limit,
        is_active,
        user_type
    ) VALUES (
        'SUMMER500',
        'Summer promo - PHP 500 off',
        'fixed_amount',
        500.00,
        2500.00,
        CURRENT_DATE,
        CURRENT_DATE + INTERVAL '90 days',
        50,
        true,
        'all'
    );
END $$;