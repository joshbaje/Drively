-- Seed data for payment methods
DO $$
DECLARE
    renter_id UUID;
    test_user_id UUID;
    pm_id UUID; -- Renamed to avoid ambiguity
    test_pm_id UUID; -- For test user's payment method
BEGIN
    -- Get user IDs
    SELECT user_id INTO renter_id FROM users WHERE email = 'renter@example.com';
    SELECT user_id INTO test_user_id FROM users WHERE email = 'bajejosh@gmail.com';
    
    -- Only add payment method if it doesn't exist for this user
    IF NOT EXISTS (SELECT 1 FROM payment_methods WHERE user_id = renter_id) THEN
        -- Add payment method for renter
        INSERT INTO payment_methods (
            user_id,
            type,
            is_default,
            provider,
            last_four,
            expiry_month,
            expiry_year,
            is_verified,
            created_at,
            updated_at
        ) VALUES (
            renter_id,
            'credit_card',
            true,
            'visa',
            '4321',
            12,
            2026,
            true,
            CURRENT_TIMESTAMP,
            CURRENT_TIMESTAMP
        )
        RETURNING payment_method_id INTO pm_id; -- Use our renamed variable
        
        -- Update renter profile with payment method
        UPDATE renter_profiles
        SET preferred_payment_method_id = pm_id
        WHERE user_id = renter_id;
    END IF;
    
    -- Add payment method for test user
    IF NOT EXISTS (SELECT 1 FROM payment_methods WHERE user_id = test_user_id) THEN
        INSERT INTO payment_methods (
            user_id,
            type,
            is_default,
            provider,
            last_four,
            expiry_month,
            expiry_year,
            is_verified,
            created_at,
            updated_at
        ) VALUES (
            test_user_id,
            'credit_card',
            true,
            'mastercard',
            '9876',
            10,
            2027,
            true,
            CURRENT_TIMESTAMP,
            CURRENT_TIMESTAMP
        )
        RETURNING payment_method_id INTO test_pm_id;
        
        -- Update renter profile with payment method
        UPDATE renter_profiles
        SET preferred_payment_method_id = test_pm_id
        WHERE user_id = test_user_id;
    END IF;
END $$;
