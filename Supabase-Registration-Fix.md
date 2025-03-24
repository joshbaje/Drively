# Supabase Registration Fix

## Issue: Foreign Key Constraint Violation During Registration

When registering new users with Supabase integration, the following error was occurring:

```
code: "23503"
details: "Key (user_id)=(user-uuid) is not present in table \"users\"."
message: "insert or update on table \"renter_profiles\" violates foreign key constraint \"renter_profiles_user_id_fkey\""
```

## Root Cause

The issue was a race condition in the Supabase authentication flow:

1. When a user registers, `supabase.auth.signUp()` creates a user in the Supabase Auth service
2. Supabase Auth automatically triggers a database function to create a record in the `users` table
3. Our application code was immediately trying to create a profile (renter/owner) using the user ID before the database trigger had completed
4. This resulted in a foreign key constraint violation because the user record wasn't yet available in the `users` table

## Solution Implemented

We implemented the following fixes:

1. **Manual User Record Creation**: Added code to manually insert a user record immediately after auth signup
   - This ensures the user record exists in the database before creating profiles
   - Includes error handling for duplicate record cases (if the trigger already created it)

2. **Retry Logic with Database Utilities**: Created a database utilities module with retry functionality
   - `waitForRecord()` - Waits for a specific record to exist before proceeding
   - `createWithRetry()` - Attempts to create a record with retries if it fails due to foreign key constraints

3. **Enhanced Error Handling**: Added better error logging and handling throughout the authentication flow
   - Added debug logs to trace authentication events
   - Implemented validation functions to check table/record existence

## Files Modified

1. `src/services/supabase/auth/authService.js`
   - Updated user registration flow with manual user record creation
   - Modified profile creation methods to use retry logic

2. `src/services/supabase/supabaseClient.js`
   - Added auth state change listener for debugging
   - Added utility function to validate table existence

3. `src/services/supabase/utils/databaseUtils.js` (new file)
   - Added utility functions for interacting with the database
   - Implemented retry logic for operations that may be affected by race conditions

## Testing

The solution has been tested with various registration scenarios:

1. Registration as renter
2. Registration as owner
3. Registration with invalid data (to ensure validation still works)
4. Multiple rapid registrations (to ensure stability)

## Lessons Learned

1. **Database Triggers and Timing**: When working with Supabase Auth, remember that database triggers happen asynchronously, and there can be a slight delay before records are created in the database.

2. **Foreign Key Constraints**: PostgreSQL strictly enforces foreign key constraints, which requires careful handling of record creation order.

3. **Retry Logic Importance**: For operations dependent on asynchronous processes, implementing retry logic is essential for robustness.

4. **Manual Record Management**: Sometimes it's necessary to manually manage records alongside automated processes to ensure consistency.

## Future Improvements

1. **Migration Scripts**: Create a migration script to ensure all users have corresponding profiles.

2. **Webhook Integration**: Consider using Supabase webhooks for more deterministic handling of user creation events.

3. **Transaction Support**: Investigate using database transactions where appropriate for related operations.

4. **User Provisioning Queue**: Consider implementing a queue system for user provisioning to handle high load scenarios.

---

**Date:** March 24, 2025  
**Fixed by:** Claude  
**Issue ID:** DRIV-AUTH-23503
