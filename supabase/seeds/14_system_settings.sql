-- Seed data for system settings
INSERT INTO system_settings (
    key,
    value,
    description,
    is_public
) VALUES (
    'platform_fee_percentage',
    '10',
    'Percentage of booking amount taken as platform fee',
    false
);

INSERT INTO system_settings (
    key,
    value,
    description,
    is_public
) VALUES (
    'tax_rate_percentage',
    '12',
    'Default tax rate (VAT) for bookings',
    true
);

INSERT INTO system_settings (
    key,
    value,
    description,
    is_public
) VALUES (
    'default_cancellation_policy',
    'Standard Cancellation',
    'Default cancellation policy name for new vehicles',
    true
);

INSERT INTO system_settings (
    key,
    value,
    description,
    is_public
) VALUES (
    'min_booking_duration',
    '1',
    'Minimum booking duration in days',
    true
);

INSERT INTO system_settings (
    key,
    value,
    description,
    is_public
) VALUES (
    'max_booking_duration',
    '30',
    'Maximum booking duration in days',
    true
);

INSERT INTO system_settings (
    key,
    value,
    description,
    is_public
) VALUES (
    'support_email',
    'support@drivelyph.com',
    'Customer support email address',
    true
);

INSERT INTO system_settings (
    key,
    value,
    description,
    is_public
) VALUES (
    'support_phone',
    '+639123456789',
    'Customer support phone number',
    true
);
