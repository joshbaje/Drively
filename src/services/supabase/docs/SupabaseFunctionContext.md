# Drivelyph Supabase Function Context

## Overview

This document serves as a comprehensive guide for working with PostgreSQL functions in the Drivelyph Supabase implementation. It outlines standards, patterns, and best practices to ensure consistency and quality when creating or modifying database functions.

Drivelyph uses Supabase's PostgreSQL functions to implement complex business logic at the database level. These functions are essential components of our application architecture, handling critical operations like user authentication, profile management, vehicle search, bookings, and payments.

## Design Principles

When creating or modifying Supabase functions, adhere to these principles:

1. **Security First**: Always consider the security implications of your function. Use the appropriate security context (INVOKER vs DEFINER) and implement proper row-level security policies.

2. **Idempotency**: Functions should be idempotent where possible, meaning they can be run multiple times with the same result.

3. **Atomic Operations**: Functions should perform atomic operations to maintain database integrity, using transactions where appropriate.

4. **Comprehensive Error Handling**: Implement thorough error handling to provide meaningful feedback and prevent data corruption.

5. **Clear Documentation**: Each function should have clear documentation including purpose, parameters, return values, and examples.

6. **Performance Optimization**: Write functions with performance in mind, minimizing unnecessary queries and optimizing database operations.

7. **Standardized Structure**: Follow the established structure for consistency across the codebase.

## Function Structure

Each Supabase function should follow this standard structure:

```sql
CREATE OR REPLACE FUNCTION function_name(param1 TYPE, param2 TYPE)
RETURNS return_type
LANGUAGE plpgsql
SECURITY [INVOKER|DEFINER]
SET search_path = public
AS $$
DECLARE
  -- Variable declarations
BEGIN
  -- Function body
  
  -- Error handling
  
  -- Return value
END;
$$;

COMMENT ON FUNCTION function_name IS 'Description of what the function does';
GRANT EXECUTE ON FUNCTION function_name TO [appropriate_roles];
```

## Security Considerations

### SECURITY DEFINER vs INVOKER

- **SECURITY DEFINER**: Functions run with the privileges of the function creator.
  - Use when: The function needs to access tables that the calling user doesn't have direct access to.
  - Example: Functions that insert/update records in multiple related tables.
  
- **SECURITY INVOKER**: Functions run with the privileges of the calling user.
  - Use when: The function should respect the permissions of the calling user.
  - Example: Read-only functions that retrieve data the user already has access to.

### Row Level Security (RLS)

Always implement appropriate RLS policies to restrict data access based on user roles and ownership:

```sql
CREATE POLICY "Users can only see their own data" 
ON table_name
FOR SELECT
USING (auth.uid() = user_id);
```

## Function Categories

### 1. User Functions

Functions related to user management, authentication, profiles, and related operations.

Key patterns:
- Use SECURITY DEFINER for profile creation operations
- Implement proper validation for user input
- Always verify ownership when updating user data

### 2. Vehicle Functions

Functions for vehicle listings, searches, availability, and related operations.

Key patterns:
- Include comprehensive search parameters
- Implement efficient filtering mechanisms
- Handle vehicle availability checks and conflicts

### 3. Booking Functions

Functions for managing rental bookings, reservations, and related workflows.

Key patterns:
- Implement transaction blocks for booking operations
- Include conflict checking with existing bookings
- Handle payment integration where appropriate

### 4. Payment Functions

Functions for payment processing, refunds, and financial operations.

Key patterns:
- Use strict security for all payment functions
- Implement comprehensive logging and auditing
- Handle currency and decimal precision properly

### 5. Rating Functions

Functions for user ratings, reviews, and feedback systems.

Key patterns:
- Verify booking completion before allowing ratings
- Implement constraints to prevent duplicate ratings
- Calculate and update average ratings efficiently

### 6. Search Functions

Functions for complex search operations, filtering, and discovery features.

Key patterns:
- Optimize for performance with large datasets
- Implement pagination for large result sets
- Use text search capabilities where appropriate

### 7. Document Functions

Functions for document management, verification, and processing.

Key patterns:
- Handle document metadata properly
- Implement verification workflows
- Maintain document history and versioning

## Implementation Process

The current process for implementing Supabase functions is:

1. Browse the function documentation on the `/supabase-functions` page
2. Copy the SQL code for the desired function
3. Paste the code into the Supabase SQL Editor
4. Execute the SQL to create or replace the function
5. Test the function to ensure it works as expected

### Function Implementation Checklist

When creating or updating a function:

- [ ] Follow the standard function structure
- [ ] Use appropriate security context (INVOKER/DEFINER)
- [ ] Include comprehensive error handling
- [ ] Add comments explaining complex logic
- [ ] Grant appropriate permissions
- [ ] Test with different user roles and input data
- [ ] Update documentation if changes affect behavior

## Updating Documentation

When creating or modifying functions, ensure documentation stays in sync:

1. If modifying an existing function, update the function definition in:
   - `src/pages/SupabaseFunctions/functionData/[category]Functions.js`

2. If creating a new function:
   - Add the function definition to the appropriate category file
   - Ensure it follows the existing format with id, name, description, security, parameters, returns, and sql properties

3. If the function represents new functionality:
   - Consider updating `docs/supabase-functions/` with additional documentation

## Testing Guidelines

Always test functions thoroughly before deploying to production:

1. **Basic Functionality**: Test that the function performs its primary task correctly.

2. **Edge Cases**: Test with empty inputs, maximum values, and unexpected data.

3. **Error Handling**: Verify that errors are caught and handled appropriately.

4. **Security**: Test with different user roles to ensure proper access controls.

5. **Performance**: Test with realistic data volumes to ensure acceptable performance.

### Testing Methods

- Direct SQL execution in Supabase SQL Editor
- Client-side testing using Supabase RPC calls
- Automated tests where possible

## Migration Notes (Xano to Supabase)

When migrating functions from Xano to Supabase:

1. Understand the existing Xano implementation thoroughly
2. Map Xano endpoints to equivalent Supabase functions
3. Ensure data types and structures are compatible
4. Implement proper error handling and security
5. Test to ensure equivalent functionality

## Future Recommendations

The current manual process works but has limitations. Consider implementing:

1. **Version-Controlled SQL Files**: Store function definitions in .sql files in the repository.

2. **Automated Deployment**: Use Supabase CLI or migration tools to deploy functions:
   ```bash
   supabase functions deploy --project-ref your-project-ref
   ```

3. **CI/CD Integration**: Implement automated testing and deployment in your CI/CD pipeline.

4. **Migration Framework**: Use a framework like [pg-migrate](https://github.com/salsita/node-pg-migrate) or [sqitch](https://sqitch.org/) for better migration management.

5. **Development Environment**: Set up a development Supabase instance for testing before production deployment.

## Conclusion

Following these guidelines will ensure the Drivelyph Supabase functions remain secure, maintainable, and performant. When creating or modifying functions, always consider the broader system impact and ensure changes align with the established patterns and security requirements.
