# Testing Supabase Authentication in Drivelyph

This guide provides step-by-step instructions for testing the Supabase authentication functionality in the Drivelyph application.

## Prerequisites

1. A Supabase project with:
   - Authentication enabled
   - Database tables created using the migration scripts
   - Proper policies configured

2. Environment variables set in the `.env` file:
   ```
   REACT_APP_SUPABASE_URL=https://your-project-id.supabase.co
   REACT_APP_SUPABASE_ANON_KEY=your-anon-key
   REACT_APP_API_PROVIDER=supabase
   ```

3. Running Drivelyph application in development mode:
   ```
   npm start
   ```

## Testing Options

There are two ways to test the Supabase authentication:

1. Using the standalone authentication test component
2. Testing through the normal application flow

## Option 1: Standalone Authentication Test Component

This method uses a dedicated component for testing Supabase authentication without affecting the main application flow.

1. Navigate to `/supabase-auth-test` in your browser (e.g., http://localhost:3000/Drively/#/supabase-auth-test)

2. The test component will display:
   - Supabase connection status
   - Login/registration form
   - Error messages and authentication status

3. Test registration:
   - Enter an email address and password
   - Click "Sign Up"
   - Verify that a success message appears or a confirmation email is sent (if configured)

4. Test login:
   - Enter an email address and password
   - Click "Log In"
   - Verify that the authenticated user information appears

5. Test logout:
   - Click "Log Out"
   - Verify that the form reappears

## Option 2: Main Application Flow

This method tests authentication through the normal application user interface.

### Testing Registration

1. Navigate to the registration page at `/#/register`

2. Fill in the registration form:
   - First Name (e.g., "Test")
   - Last Name (e.g., "User")
   - Email Address (e.g., "testuser@example.com")
   - Date of Birth (e.g., "1990-01-01")
   - Phone Number (e.g., "123-456-7890")
   - Password (e.g., "TestPassword123!")
   - Confirm Password (same as password)
   - User type (Renter or Owner)
   - Accept Terms and Conditions

3. Click "CREATE ACCOUNT"

4. Expected behavior:
   - If email verification is required, you should see a message to check your email
   - If not, you should be redirected to the login page or dashboard

### Testing Login

1. Navigate to the login page at `/#/login`

2. Enter the credentials of a registered user:
   - Email Address
   - Password

3. Click "SIGN IN"

4. Expected behavior:
   - If successful, you should be redirected to the dashboard or home page
   - If unsuccessful, an error message should appear

### Testing Authentication State Persistence

1. After logging in, refresh the page

2. Expected behavior:
   - You should remain logged in due to the persisted session

3. Navigate to different pages within the application

4. Expected behavior:
   - The authentication state should persist across pages

### Testing Logout

1. While logged in, click the "Log Out" button (usually in the user menu)

2. Expected behavior:
   - You should be logged out and redirected to the login page or home page
   - Protected pages should no longer be accessible

## Troubleshooting

If you encounter issues during testing, check the following:

### Registration Issues

1. **Error: "User already registered"**
   - The email address is already in use
   - Try a different email address or use the login form

2. **No confirmation email received**
   - Check Supabase Email settings in the dashboard
   - Check the spam/junk folder
   - Verify the email templates are configured correctly

3. **Form submission doesn't do anything**
   - Check browser console for errors
   - Verify that Supabase URL and anon key are correct in `.env`
   - Make sure the API provider is set to "supabase"

### Login Issues

1. **Error: "Invalid login credentials"**
   - Double-check the email and password
   - Ensure the user has completed email verification (if required)

2. **Error: "Network request failed"**
   - Check internet connection
   - Verify that Supabase URL is correct and accessible

3. **Login successful but protected pages not accessible**
   - Check that the JWT token is stored properly
   - Verify that the auth state is maintained in the context
   - Ensure the role-based permissions are correct

## Testing with Browser Developer Tools

Developer tools can help diagnose authentication issues:

1. Open browser developer tools (F12 or Right-click > Inspect)

2. Check the Network tab:
   - Look for requests to `supabase.co`
   - Check status codes (200 is success, 4xx/5xx are errors)

3. Check the Console tab:
   - Look for JavaScript errors
   - Check for Supabase-related error messages

4. Check the Application tab:
   - Local Storage: Look for Supabase session data
   - Cookies: Check for authentication cookies

## Creating a Test User Directly in Supabase

If you encounter issues with registration, you can create a test user directly in Supabase:

1. Go to your Supabase project dashboard
2. Navigate to Authentication > Users
3. Click "Add User"
4. Enter the user's email and password
5. Click "Create User"

This user will bypass email verification and can be used immediately for testing.

## Automated Testing

For automated testing of authentication, consider:

1. Writing Jest tests for AuthContext and authentication services
2. Using Cypress for end-to-end testing of login/registration flows
3. Creating mocks for Supabase services in unit tests

Sample Jest test for the auth service:

```javascript
import authService from '../services/supabase/auth/authService';
import supabase from '../services/supabase/supabaseClient';

// Mock Supabase
jest.mock('../services/supabase/supabaseClient', () => ({
  auth: {
    signUp: jest.fn(),
    signInWithPassword: jest.fn(),
    signOut: jest.fn(),
    getSession: jest.fn()
  },
  from: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  eq: jest.fn().mockReturnThis(),
  single: jest.fn()
}));

describe('Auth Service', () => {
  test('sign up calls Supabase with correct parameters', async () => {
    // Mock successful response
    supabase.auth.signUp.mockResolvedValue({
      data: { user: { id: '123' }, session: { access_token: 'test-token' } },
      error: null
    });
    
    // Call the service
    const result = await authService.signUp(
      'test@example.com',
      'password',
      { first_name: 'Test', last_name: 'User' }
    );
    
    // Verify Supabase was called correctly
    expect(supabase.auth.signUp).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password',
      options: {
        data: expect.objectContaining({
          first_name: 'Test',
          last_name: 'User',
          user_type: 'renter'
        })
      }
    });
    
    // Verify result
    expect(result.data.user.id).toBe('123');
    expect(result.error).toBeNull();
  });
  
  // Additional tests...
});
```
