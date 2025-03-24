-- Seed data for vehicle features and feature links
DO $$
DECLARE
    toyota_id UUID;
    honda_id UUID;
    feature_bluetooth UUID;
    feature_camera UUID;
    feature_nav UUID;
    feature_sunroof UUID;
    feature_cruise UUID;
BEGIN
    -- Get vehicle IDs
    SELECT vehicle_id INTO toyota_id FROM vehicles WHERE make = 'Toyota' AND model = 'Vios' LIMIT 1;
    SELECT vehicle_id INTO honda_id FROM vehicles WHERE make = 'Honda' AND model = 'CR-V' LIMIT 1;
    
    -- Add vehicle features
    INSERT INTO vehicle_features (
        name,
        description,
        icon,
        category,
        is_active
    ) VALUES (
        'Bluetooth',
        'Bluetooth connectivity for phone and media',
        'bluetooth',
        'comfort',
        true
    )
    RETURNING feature_id INTO feature_bluetooth;
    
    INSERT INTO vehicle_features (
        name,
        description,
        icon,
        category,
        is_active
    ) VALUES (
        'Backup Camera',
        'Rear view camera for parking assistance',
        'camera',
        'safety',
        true
    )
    RETURNING feature_id INTO feature_camera;
    
    INSERT INTO vehicle_features (
        name,
        description,
        icon,
        category,
        is_active
    ) VALUES (
        'GPS Navigation',
        'Built-in GPS navigation system',
        'map',
        'convenience',
        true
    )
    RETURNING feature_id INTO feature_nav;
    
    INSERT INTO vehicle_features (
        name,
        description,
        icon,
        category,
        is_active
    ) VALUES (
        'Sunroof',
        'Panoramic sunroof',
        'sun',
        'comfort',
        true
    )
    RETURNING feature_id INTO feature_sunroof;
    
    INSERT INTO vehicle_features (
        name,
        description,
        icon,
        category,
        is_active
    ) VALUES (
        'Cruise Control',
        'Adaptive cruise control',
        'dashboard',
        'performance',
        true
    )
    RETURNING feature_id INTO feature_cruise;
    
    -- Link features to Toyota Vios
    INSERT INTO vehicle_feature_links (vehicle_id, feature_id)
    VALUES (toyota_id, feature_bluetooth);
    
    INSERT INTO vehicle_feature_links (vehicle_id, feature_id)
    VALUES (toyota_id, feature_camera);
    
    INSERT INTO vehicle_feature_links (vehicle_id, feature_id)
    VALUES (toyota_id, feature_nav);
    
    -- Link features to Honda CR-V
    INSERT INTO vehicle_feature_links (vehicle_id, feature_id)
    VALUES (honda_id, feature_bluetooth);
    
    INSERT INTO vehicle_feature_links (vehicle_id, feature_id)
    VALUES (honda_id, feature_camera);
    
    INSERT INTO vehicle_feature_links (vehicle_id, feature_id)
    VALUES (honda_id, feature_nav);
    
    INSERT INTO vehicle_feature_links (vehicle_id, feature_id)
    VALUES (honda_id, feature_sunroof);
    
    INSERT INTO vehicle_feature_links (vehicle_id, feature_id)
    VALUES (honda_id, feature_cruise);
END $$;
