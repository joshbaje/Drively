-- Seed data for vehicle images
DO $$
DECLARE
    toyota_id UUID;
    honda_id UUID;
BEGIN
    -- Get vehicle IDs
    SELECT vehicle_id INTO toyota_id FROM vehicles WHERE make = 'Toyota' AND model = 'Vios' LIMIT 1;
    SELECT vehicle_id INTO honda_id FROM vehicles WHERE make = 'Honda' AND model = 'CR-V' LIMIT 1;
    
    -- Add vehicle images
    INSERT INTO vehicle_images (
        vehicle_id,
        image_url,
        image_type,
        is_primary,
        caption,
        order_index
    ) VALUES (
        toyota_id,
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
        toyota_id,
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
        honda_id,
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
        honda_id,
        'https://example.com/images/honda-crv-interior.jpg',
        'interior',
        false,
        'Honda CR-V 2023 - Interior',
        2
    );
END $$;
