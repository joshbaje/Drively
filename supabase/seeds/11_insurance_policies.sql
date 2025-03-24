-- Seed data for insurance policies
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
