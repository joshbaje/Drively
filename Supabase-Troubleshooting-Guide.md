# Drively Supabase Troubleshooting Guide

## Common Issues and Solutions

### 1. Supabase Package Resolution Errors

**Error:**
```
Module not found: Error: Can't resolve '@supabase/supabase-js' in '...'
```

**Solution:**
```bash
# Install the Supabase JavaScript client
npm install @supabase/supabase-js
```

**Explanation:**
This error occurs when the Supabase JavaScript client package is missing from your node_modules directory. Even if it's listed in your package.json, the package may not be installed if:
- You recently cloned the repository
- The dependency was recently added to package.json
- Your node_modules is corrupted

**Additional Troubleshooting:**
1. Verify the package is listed in package.json:
   ```bash
   grep -r "supabase" package.json
   ```

2. Check if the package is actually installed:
   ```bash
   npm list @supabase/supabase-js
   ```

3. If problems persist, try clearing the npm cache:
   ```bash
   npm cache clean --force
   npm install
   ```

### 2. Environment Variable Configuration Issues

**Error:**
```
TypeError: Cannot read properties of null (reading 'from')
```

**Solution:**
Ensure your environment variables are properly configured in your `.env` file:
```
REACT_APP_API_PROVIDER=supabase
REACT_APP_SUPABASE_URL=https://your-project-url.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key
```

**Explanation:**
This error typically occurs when the Supabase client is initialized but can't connect to your Supabase instance due to missing or incorrect environment variables.

**Additional Troubleshooting:**
1. Verify you have a properly configured `.env` file
2. Check for typos in your environment variable names
3. Ensure your Supabase URL and anon key are correct
4. Restart your development server after making changes to environment variables

### 3. CORS Issues with Supabase

**Error:**
```
Access to fetch at 'https://your-project-url.supabase.co/...' from origin 'http://localhost:3000' has been blocked by CORS policy
```

**Solution:**
Configure your Supabase project to allow requests from your development URL:
1. Go to the Supabase dashboard > Project Settings > API
2. Add `http://localhost:3000` to the allowed origins

**Explanation:**
Supabase enforces CORS policies by default, which may block requests from unauthorized origins.

### 4. Authentication Issues

**Error:**
```
PostgreSQL Error: permission denied for table vehicles
```

**Solution:**
Verify that your Row Level Security (RLS) policies are correctly configured in Supabase:
1. Go to the Supabase dashboard > Table Editor
2. Select the relevant table
3. Go to the "Policies" tab
4. Ensure appropriate policies are in place for the operations you're attempting

**Explanation:**
By default, Supabase enforces Row Level Security, which requires explicit policies to allow data access.

### 5. Data Type Mismatches

**Error:**
```
PostgreSQL Error: column "created_at" is of type timestamp with time zone but expression is of type character varying
```

**Solution:**
Ensure the data types you're using in your application match those defined in your Supabase schema:
1. For dates, use JavaScript Date objects or ISO strings
2. For JSON data, make sure it's properly serialized/deserialized

**Explanation:**
Supabase uses PostgreSQL, which has stricter type checking than many NoSQL databases.

## Diagnostic Tools

### 1. Supabase Connection Test Page

Navigate to `/supabase-test` in the application to check:
- Whether the connection to Supabase is successful
- If environment variables are properly configured
- Direct connection test results
- Any error messages

### 2. Browser Console Debugging

Add the following code to your component to see detailed Supabase API interactions:

```javascript
useEffect(() => {
  const client = db.getClient();
  
  // Subscribe to all Supabase events
  const subscription = client
    .channel('*')
    .on('postgres_changes', { event: '*', schema: 'public' }, (payload) => {
      console.log('Supabase change:', payload);
    })
    .subscribe();
    
  return () => {
    subscription.unsubscribe();
  };
}, []);
```

### 3. Supabase Dashboard Monitoring

Use the Supabase Dashboard to:
1. Check API request logs under the "Logs" section
2. Monitor database health in the "Database" section
3. Verify storage contents in the "Storage" section
4. Check authentication logs in the "Authentication" section

## Database Schema Verification

When troubleshooting, it's important to verify that your Supabase database schema matches what your application expects:

1. Verify tables exist and have the correct structure:
   ```sql
   SELECT table_name, column_name, data_type 
   FROM information_schema.columns 
   WHERE table_schema = 'public';
   ```

2. Check if RLS policies are properly configured:
   ```sql
   SELECT table_name, policy_name, definition 
   FROM pg_policies 
   WHERE schemaname = 'public';
   ```

3. Verify if your tables have data:
   ```sql
   SELECT count(*) FROM vehicles;
   ```

## Switching Between Backends

To switch between Xano and Supabase backends:

1. Update the `.env` file to change the API provider:
   ```
   # For Xano
   REACT_APP_API_PROVIDER=xano
   
   # For Supabase
   REACT_APP_API_PROVIDER=supabase
   ```

2. Restart your development server:
   ```bash
   npm start
   ```

## Additional Resources

- [Supabase Documentation](https://supabase.io/docs)
- [Supabase JavaScript Client Reference](https://supabase.io/docs/reference/javascript/start)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [React Environment Variables Guide](https://create-react-app.dev/docs/adding-custom-environment-variables/)
