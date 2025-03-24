-- Seed data for user profiles
DO $$
DECLARE
    owner_id UUID;
    renter_id UUID;
    test_user_id UUID;
BEGIN
    -- Get user IDs from database
    SELECT user_id INTO owner_id FROM users WHERE email = 'owner@example.com';
    SELECT user_id INTO renter_id FROM users WHERE email = 'renter@example.com';
    SELECT user_id INTO test_user_id FROM users WHERE email = 'bajejosh@gmail.com';
    
    -- Create owner profile if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM car_owner_profiles WHERE user_id = owner_id) THEN
        INSERT INTO car_owner_profiles (
            user_id,
            id_verification_status,
            verification_date,
            bank_account_number,
            tax_id,
            total_listings,
            average_rating,
            is_business,
            created_at,
            updated_at
        ) VALUES (
            owner_id,
            'approved',
            CURRENT_DATE - INTERVAL '30 days',
            '1234567890',
            'TAX-123-456-789',
            0,
            4.8,
            false,
            CURRENT_TIMESTAMP,
            CURRENT_TIMESTAMP
        );
    END IF;
    
    -- Create renter profile if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM renter_profiles WHERE user_id = renter_id) THEN
        INSERT INTO renter_profiles (
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
            renter_id,
            'N04-12-123456',
            'Metro Manila',
            CURRENT_DATE + INTERVAL '2 years',
            'approved',
            CURRENT_DATE - INTERVAL '15 days',
            true,
            4.9,
            0,
            CURRENT_TIMESTAMP,
            CURRENT_TIMESTAMP
        );
    END IF;
    
    -- Create owner profile for test user if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM car_owner_profiles WHERE user_id = test_user_id) THEN
        INSERT INTO car_owner_profiles (
            user_id,
            id_verification_status,
            verification_date,
            bank_account_number,
            tax_id,
            total_listings,
            average_rating,
            is_business,
            created_at,
            updated_at
        ) VALUES (
            test_user_id,
            'approved',
            CURRENT_DATE - INTERVAL '30 days',
            '0987654321',
            'TAX-987-654-321',
            2,
            4.9,
            true,
            CURRENT_TIMESTAMP,
            CURRENT_TIMESTAMP
        );
    END IF;
    
    -- Create renter profile for test user if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM renter_profiles WHERE user_id = test_user_id) THEN
        INSERT INTO renter_profiles (
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
            test_user_id,
            'N04-12-654321',
            'Metro Manila',
            CURRENT_DATE + INTERVAL '3 years',
            'approved',
            CURRENT_DATE - INTERVAL '10 days',
            true,
            5.0,
            3,
            CURRENT_TIMESTAMP,
            CURRENT_TIMESTAMP
        );
    END IF;
END $$;
