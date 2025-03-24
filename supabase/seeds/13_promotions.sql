-- Seed data for promotions
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

INSERT INTO promotions (
    code,
    description,
    discount_type,
    discount_value,
    min_booking_amount,
    max_discount,
    start_date,
    end_date,
    usage_limit,
    is_active,
    user_type
) VALUES (
    'WEEKEND30',
    'Weekend special - 30% off, up to PHP 1000',
    'percentage',
    30.00,
    3000.00,
    1000.00,
    CURRENT_DATE - INTERVAL '15 days',
    CURRENT_DATE + INTERVAL '45 days',
    75,
    true,
    'all'
);
