# Drively Supabase Seed Data

This directory contains SQL seed files to populate the Drively database with test data. The seed files are designed to be idempotent, meaning they can be run multiple times without creating duplicate data or errors.

## Updated Seed Files (March 23, 2025)

The seed files have been updated with robust error handling and conflict management:

1. **Conditional Inserts**: Many files use IF NOT EXISTS checks before attempting inserts
2. **ON CONFLICT Clauses**: Tables with unique constraints use ON CONFLICT DO NOTHING 
3. **PostgreSQL-Generated IDs**: Let the database handle ID generation where possible
4. **Explicit References**: Use lookups to ensure correct foreign key references

## Robust Database Seeding

Our seed files are designed to be resilient to:

1. **Pre-existing Data**: Will not fail if records already exist
2. **Changing IDs**: Uses lookups to find IDs rather than hardcoding them
3. **Multiple Runs**: Can be run multiple times without producing duplicates
4. **Schema Changes**: Minimal dependency on specific schema details

## Structure

The seed files are organized to respect foreign key dependencies:

1. `01_roles.sql` - System roles
2. `02_users.sql` - User accounts
3. `03_addresses.sql` - User addresses
4. `04_user_roles.sql` - Role assignments
5. `05_profiles.sql` - Owner and renter profiles
6. `06_locations.sql` - Vehicle pickup/dropoff locations
7. `07_vehicles.sql` - Vehicle listings
8. `08_vehicle_images.sql` - Vehicle photos
9. `09_vehicle_features.sql` - Vehicle features and feature links
10. `10_payment_methods.sql` - Payment methods
11. `11_insurance_policies.sql` - Insurance policies
12. `12_cancellation_policies.sql` - Cancellation policies
13. `13_promotions.sql` - Promotional codes
14. `14_system_settings.sql` - System settings

## Running Seeds

To run all seeds in sequence:

```bash
psql -d drivelyph -f 00_run_all_seeds.sql
```

To run a specific seed:

```bash
psql -d drivelyph -f [seed_file].sql
```

## Test Accounts

The seed data includes the following test accounts:

| Email | Password | Role | Description |
|-------|----------|------|-------------|
| admin@drivelyph.com | system-generated-hash-to-be-changed | Admin | System administrator |
| owner@example.com | password-hash-1 | Owner | Vehicle owner |
| renter@example.com | password-hash-2 | Renter | Vehicle renter |
| agent@example.com | password-hash-3 | Agent | Support agent |
| bajejosh@gmail.com | 1 | Admin/Owner/Renter | Test user with multiple roles |

## Fixed Issues and Design Patterns

Several approaches are used in the seed files to ensure data integrity:

### 1. Handle Duplicate Records

Each seed file uses one of these approaches:

```sql
-- Approach 1: ON CONFLICT clause for simple tables
INSERT INTO roles (name, description)
VALUES ('owner', 'Vehicle owner')
ON CONFLICT (name) DO NOTHING;

-- Approach 2: IF NOT EXISTS for complex cases
IF NOT EXISTS (SELECT 1 FROM addresses WHERE user_id = owner_id AND address_type = 'home') THEN
    INSERT INTO addresses (...) VALUES (...);
END IF;
```

### 2. Get Database-Generated IDs

Look up IDs rather than hardcoding them:

```sql
SELECT user_id INTO owner_id FROM users WHERE email = 'owner@example.com';
```

### 3. Debugging Support

Output actual IDs for debugging purposes:

```sql
RAISE NOTICE 'User ID for owner@example.com: %', owner_id;
```

### 4. Transaction Management

All PL/pgSQL blocks use transactions automatically, rolling back if errors occur.

## Best Practices for Extending Seeds

When adding new seed data:

1. Follow the existing patterns for conflict handling
2. Use lookups for foreign key references
3. Add new seed files in the appropriate order in `00_run_all_seeds.sql`
4. Test your seed files by running them multiple times
