# Supabase Setup Guide for Drively

This guide will walk you through setting up your Supabase database for the Drively car rental platform.

## Prerequisites

- A Supabase account ([Sign up here](https://app.supabase.io/))
- Access to your Supabase project dashboard
- Node.js and npm installed on your computer

## Step 1: Create a Supabase Project

1. Log in to your Supabase dashboard
2. Click "New Project"
3. Enter a name for your project (e.g., "drively")
4. Choose a database password (keep this secure!)
5. Select a region closest to your users
6. Click "Create new project"

## Step 2: Get Your Project Credentials

1. Once your project is created, go to the project dashboard
2. In the left sidebar, click on "Settings" and then "API"
3. Note down these values:
   - **Project URL**: `https://your-project-id.supabase.co`
   - **anon/public** key (this is your API key)

## Step 3: Configure Your Drively Application

1. In your Drively project directory, create or update your `.env` file with:

```
REACT_APP_API_PROVIDER=supabase
REACT_APP_SUPABASE_URL=https://your-project-id.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key
```

2. Replace the placeholders with your actual project URL and key

## Step 4: Create the Database Schema

You have two options for creating the schema:

### Option A: Using the SQL Editor

1. In your Supabase dashboard, go to the "SQL Editor" section
2. Create a new query
3. Copy the entire SQL schema from the `supabase-schema-setup.sql` file
4. Run the query (this may take a moment to complete)

### Option B: Using the Supabase CLI

1. Install the Supabase CLI if you haven't already:
   ```bash
   npm install -g supabase
   ```

2. Login to Supabase:
   ```bash
   supabase login
   ```

3. Save the schema file to your local machine
4. Run:
   ```bash
   supabase db execute -f supabase-schema-setup.sql --db-url postgres://postgres:YOUR_DB_PASSWORD@db.YOUR_PROJECT_ID.supabase.co:5432/postgres
   ```

## Step 5: Add Seed Data (Optional)

1. In the SQL Editor, create a new query
2. Copy the seed data script from the `supabase-seed-data.sql` file
3. Run the query

## Step 6: Verify the Setup

1. Create a `scripts` directory in your project if it doesn't exist already
2. Save the connection checker script to `scripts/checkSupabaseConnection.js`
3. Run the script to verify your connection:
   ```bash
   node scripts/checkSupabaseConnection.js
   ```

4. If everything is set up correctly, you should see a success message and a list of your tables

## Step 7: Enable Supabase Auth (Optional)

If you plan to use Supabase Authentication:

1. In your Supabase dashboard, go to "Authentication" → "Settings"
2. Under "URL Configuration", set:
   - Site URL: `http://localhost:3000` (for development)
   - Redirect URLs: Add `http://localhost:3000/auth/callback`
3. Under "Email Templates", customize the templates as needed

## Step 8: Configure Storage Buckets (Optional)

For file storage (vehicle images, documents, etc.):

1. Go to "Storage" in the Supabase dashboard
2. Create the following buckets:
   - `vehicle-images`
   - `user-documents`
   - `vehicle-documents`
3. Configure the appropriate bucket permissions:
   - For public images: Set to public
   - For private documents: Set to private with RLS policies

## Step 9: Test in the Drively Application

1. Start your Drively application:
   ```bash
   npm start
   ```

2. Navigate to the Supabase connection test page:
   ```
   http://localhost:3000/#/supabase-test
   ```

3. Verify that the connection is working properly

## Troubleshooting

If you encounter issues:

1. **Connection Error**: Check your URL and API key in the `.env` file
2. **Missing Tables**: Verify the schema script ran successfully
3. **Auth Issues**: Check the Supabase Auth settings and URL configuration
4. **Permission Errors**: Review the RLS (Row Level Security) policies in Supabase

## Next Steps

Once your database is set up:

1. Customize the RLS policies for your security needs
2. Set up automatic backups
3. Consider adding database triggers for complex operations
4. Implement real-time subscriptions for features like messaging

## Resources

- [Supabase Documentation](https://supabase.io/docs)
- [Row Level Security Guide](https://supabase.io/docs/guides/auth/row-level-security)
- [Supabase JavaScript Client](https://supabase.io/docs/reference/javascript/installing)
