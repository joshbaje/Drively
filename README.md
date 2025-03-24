# Drively Car Rental Platform

## Project Overview

Drively is a peer-to-peer car rental platform similar to Airbnb but for vehicles. The platform enables car owners to list their vehicles for rent, and renters to find and book vehicles that suit their needs.

The application includes both a customer-facing website and an admin/agent portal for managing the platform. This repository contains the complete implementation built with React and Supabase.

## Current Status (March 2025)

### Supabase Migration

The platform is completing a full migration from Xano to Supabase as its exclusive backend service:

- **Database Schema**: ✅ Finalized and implemented in Supabase
- **Auth Integration**: 🔄 Being reimplemented to use Supabase Auth exclusively
- **API Services**: 🔄 Removing all Xano dependencies, using Supabase exclusively
- **Storage Migration**: 🔄 Moving all files to Supabase Storage
- **Real-time Features**: 🔄 Will leverage Supabase subscriptions

### Known Issues

- **Authentication**: Error "Cannot read properties of null (reading 'auth')" appears during login
- **Image Loading**: Vehicle images fail to load on details page
- **API Migration**: All Xano API endpoints need to be replaced with Supabase equivalents
- **User Migration**: User accounts need to be recreated in Supabase Auth

## Core Features

### User Management

- **User Types**: 
  - Renters: Users who rent vehicles
  - Owners: Users who list vehicles
  - Admin: Platform administrators
  - Agents: Support agents and content moderators

- **Authentication**: 
  - JWT-based authentication
  - Protected routes by user role
  - User profile management
  - Registration and login flows

### Vehicle Management

- **Listing**: Owners can list vehicles with details, images, and availability
- **Search & Filtering**: Users can search by location, dates, vehicle type, and price
- **Details View**: Comprehensive vehicle details page with gallery, specs, and reviews
- **Calendar**: Availability management for vehicle owners and agents

### Booking Process

- **Date Selection**: Choose rental period with date validation
- **Insurance Options**: Select different insurance coverage levels
- **Payment Flow**: Simulate payment process with pricing breakdown
- **Confirmation**: Booking confirmation with details
- **Cancellation Policies**: Different policies based on timing

### Admin & Agent Portal

- **Dashboard**: Overview of platform metrics
- **User Management**: Manage users, verify identities, handle disputes
- **Vehicle Management**: Review and approve listings
- **Booking Management**: Track and manage all bookings
- **Fleet Calendar**: Bird's-eye view of all vehicle schedules

## Technical Architecture

### Frontend (React)

```
src/
  ├── components/       # Reusable UI components
  │   ├── admin/        # Admin portal components
  │   ├── agent/        # Agent portal components
  │   ├── common/       # Shared UI components
  │   ├── booking/      # Booking-related components
  │   └── vehicle/      # Vehicle-related components
  ├── pages/            # Page components
  │   ├── admin/        # Admin portal pages
  │   ├── agent/        # Agent portal pages
  │   ├── auth/         # Authentication pages
  │   ├── booking/      # Booking pages
  │   └── vehicle/      # Vehicle pages
  ├── context/          # React context providers
  ├── hooks/            # Custom React hooks
  ├── services/         # API services
  │   ├── api/          # Generic API service
  │   ├── supabase/     # Supabase-specific services
  │   └── mcp/          # MCP client
  ├── database/         # Database connection layer
  └── utils/            # Utility functions
```

### Backend (Supabase)

- **Database**: PostgreSQL with proper schema, relationships, and constraints
- **Auth**: Supabase Auth service with JWT tokens
- **Storage**: Supabase Storage for images and documents
- **Realtime**: Supabase Realtime for subscriptions (planned)

### Database Schema

Key entities in the database:

1. **User Management**:
   - users
   - roles
   - user_roles
   - car_owner_profiles
   - renter_profiles
   - addresses

2. **Vehicle Management**:
   - vehicles
   - vehicle_images
   - vehicle_features
   - vehicle_documents
   - locations

3. **Booking System**:
   - bookings
   - payments
   - vehicle_handovers
   - vehicle_condition_reports
   - insurance_policies

4. **Reviews & Communication**:
   - ratings
   - messages
   - notifications

## Deployment

The application is configured for deployment to GitHub Pages:

- **Homepage**: https://joshbaje.github.io/Drively
- **Routing**: Uses HashRouter for GitHub Pages compatibility
- **Deployment Script**: `npm run deploy`

## Getting Started

### Prerequisites

- Node.js (v14+)
- npm or yarn
- Supabase account and project

### Installation

1. Clone the repository
   ```
   git clone https://github.com/your-username/Drively.git
   cd Drively
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Configure environment variables
   - Copy `.env.example` to `.env`
   - Update with your Supabase credentials
   ```
   REACT_APP_SUPABASE_URL=https://your-project-url.supabase.co
   REACT_APP_SUPABASE_ANON_KEY=your-anon-key
   ```

4. Start the development server
   ```
   npm start
   ```

5. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## Login Credentials

⚠️ **Important Note**: The platform is being migrated to Supabase Auth. The previous Xano credentials (bajejosh@gmail.com/password:1) will be deprecated. New test credentials will be created in Supabase during the migration.

## Additional Documentation

- [Supabase Complete Migration Plan](./Supabase-Transition-Plan.md) - Detailed plan for migrating to Supabase
- [Supabase Setup Guide](./Supabase-Setup-Guide.md) - Setup instructions for Supabase environment
- [Booking Process](./Booking-Process-README.md) - Details of the booking workflow
- [Vehicle Calendar](./Vehicle-Calendar-README.md) - Vehicle calendar management feature

## Development Roadmap

### Immediate Priorities

1. **Complete Supabase Authentication Migration**:
   - Remove all Xano authentication code
   - Implement full Supabase Auth with proper session management
   - Create test users in Supabase to replace Xano credentials
   - Add comprehensive error handling

2. **Replace All Xano API Dependencies**:
   - Identify and remove all Xano API calls
   - Replace with Supabase database operations
   - Implement Row Level Security (RLS) policies
   - Test all CRUD operations with Supabase

3. **Migrate Storage to Supabase**:
   - Set up Supabase Storage buckets for different file types
   - Move all images from Xano to Supabase Storage
   - Update image paths throughout the application
   - Configure proper security policies

### Medium-term Goals

1. **Enhance User Experience**:
   - Add real-time notifications using Supabase subscriptions
   - Implement chat messaging between renters and owners
   - Add offline support and data caching

2. **Mobile Responsiveness**:
   - Improve responsive design across all pages
   - Optimize for mobile and tablet experiences
   - Add mobile-specific features (location services, etc.)

3. **Advanced Search Features**:
   - Implement geolocation-based search
   - Add advanced filtering options
   - Optimize search performance

### Future Enhancements

1. **Payment Integration**:
   - Real payment processor integration (Stripe/PayPal)
   - Automated booking workflows
   - Payout system for vehicle owners

2. **Analytics & Reporting**:
   - User metrics and booking statistics
   - Vehicle performance reports
   - Financial reporting for vehicle owners

3. **Mobile App Development**:
   - React Native implementation
   - Native features (push notifications, etc.)
   - Offline capability and synchronization

## Recent Feature Updates

### Fleet Calendar Management

A new Fleet Calendar feature has been added to the Agent Portal, enabling agents to:

- View all vehicle bookings and availability in one comprehensive calendar
- See the number of booked and available vehicles for each day
- Get detailed information about which vehicles are booked or available on any date
- Filter between all vehicles, booked vehicles, or available vehicles
- Quickly access vehicle details or individual calendars

### Vehicle Calendar Management

A new vehicle calendar management feature has been added to the Agent Portal, allowing agents to:

- View a vehicle's availability calendar in monthly or weekly views
- See existing bookings and unavailability periods
- Add new unavailability periods (e.g., for maintenance)
- Manage and delete unavailability exceptions
- View detailed booking information for specific dates
- Access vehicle statistics like utilization rate and revenue

### Booking Process Improvements

- Fixed booking process flow from vehicle details to payment page
- Improved how booking details are passed between components
- Enhanced vehicle information integration in the booking process
- Created smooth transition between booking form and payment page
- Fixed issues with creating bookings from the Vehicle Calendar page

## Testing the Supabase Connection

To verify the Supabase integration:

1. Configure the necessary environment variables in your `.env` file
2. Start the application and navigate to `/#/supabase-test`
3. Check the connection status and any reported errors

If you encounter errors like:
```
Module not found: Error: Can't resolve '@supabase/supabase-js'
```

Follow these troubleshooting steps:

1. Ensure the Supabase package is properly installed:
   ```
   npm install @supabase/supabase-js
   ```

2. Check that your node_modules folder contains the package:
   ```
   npm list @supabase/supabase-js
   ```

3. Verify your package.json has the dependency listed with the correct version

## Color Palette

- Light Yellow: `#FCFFC1` (rgb(252, 255, 193))
- Yellow: `#FFE893` (rgb(255, 232, 147))
- Coral: `#FBB4A5` (rgb(251, 180, 165))
- Pink: `#FB9EC6` (rgb(251, 158, 198))

## Contributors

- Josh Baje - Lead Developer

## License

This project is proprietary and confidential.
