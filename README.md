# Drively Car Rental Platform

Drively is a peer-to-peer car rental platform similar to Airbnb but for vehicles. The platform enables car owners to list their vehicles for rent, and renters to find and book vehicles that suit their needs.

## Project Overview

The application includes both a customer-facing website and an admin/agent portal for managing the platform. This repository contains the frontend implementation built with React.

## Recent Updates

### Booking Process Improvements (March 2025)

- **Fixed Booking Flow**: Resolved issue with the booking process flow from vehicle details to payment page
- **Enhanced Data Passing**: Improved how booking details are passed between components
- **Vehicle Details Integration**: Better integration of vehicle information in the booking process
- **Seamless Navigation**: Created smooth transition between booking form and payment page
- **Agent Booking Modal**: Fixed issue with creating bookings from the Vehicle Calendar page

The booking process now follows a proper flow:
1. User selects dates and insurance on the vehicle details page
2. Form validation ensures all required information is provided
3. User is automatically redirected to the payment page with all booking details
4. After payment, user receives a booking confirmation

See [Booking-Process-README.md](./Booking-Process-README.md) for detailed documentation on the booking system and [Vehicle-Calendar-NewBooking-Fix.md](./Vehicle-Calendar-NewBooking-Fix.md) for information about the agent booking modal fix.



### UI Enhancements and Fixes (March 2025)

- **Agent Portal Header Improvements**:
  - Fixed status indicator styling and position issues
  - Added booking badge notification system
  - Enhanced responsive layout for better mobile display
  - Improved visual separation of user controls
  
- **Vehicle Calendar UI Enhancements**:
  - Fixed layout issues with the vehicle info bar
  - Improved responsive behavior for small screens
  - Better spacing and alignment for calendar components
  - Fixed overlap issues with dynamic content
  
- **General UI Improvements**:
  - Refined component styling for better consistency
  - Fixed z-index issues causing element overlaps
  - Enhanced responsive behavior across all agent portal screens
  - Improved visual hierarchy for better UX

### Fleet Calendar Management

A new Fleet Calendar feature has been added to the Agent Portal, enabling agents to:

- View all vehicle bookings and availability in one comprehensive calendar
- See the number of booked and available vehicles for each day
- Get detailed information about which vehicles are booked or available on any date
- Filter between all vehicles, booked vehicles, or available vehicles
- Quickly access vehicle details or individual calendars

This feature significantly improves fleet management capabilities by providing a bird's-eye view of the entire fleet's scheduling and availability.

**How to Access**:
1. Go to the Agent Portal
2. Click on "Fleet Calendar" in the sidebar menu

### Vehicle Calendar Management

A new vehicle calendar management feature has been added to the Agent Portal, allowing agents to:

- View a vehicle's availability calendar in monthly or weekly views
- See existing bookings and unavailability periods
- Add new unavailability periods (e.g., for maintenance)
- Manage and delete unavailability exceptions
- View detailed booking information for specific dates
- Access vehicle statistics like utilization rate and revenue

This feature provides agents with a visual tool to manage vehicle availability, helping to prevent booking conflicts and manage vehicle maintenance schedules more effectively.

**How to Access**:
1. Go to the Agent Portal
2. Navigate to Car Management
3. Click the calendar icon on any vehicle card, or
4. View a vehicle's details and click "View Availability"

### Add New Car Modal in Agent Portal

The Add New Car modal in the Agent Portal's Car Management page has been significantly enhanced with the following features:

- **Comprehensive Form Fields**:
  - Basic vehicle information (make, model, year, trim)
  - Registration information with VIN validation
  - Vehicle specifications (transmission, fuel type)
  - Pricing and status management
  - Vehicle description field
  - Dynamic feature management

- **Image Upload Functionality**:
  - Support for up to 5 vehicle images
  - Image preview with delete capability
  - First image automatically set as primary display image

- **Form Validation**:
  - Required field validation
  - VIN format validation (ensuring 17-character format without I, O, Q)
  - Informative error messages

- **Status Management**:
  - Multiple status options (Available, Rented, Maintenance, Unlisted, Pending Approval)
  - Helpful tooltips explaining status implications

- **Enhanced User Experience**:
  - Success notifications after form submission
  - Loading state indicators during submission
  - Section organization for better form navigation
  - Contextual help hints for complex fields

## Getting Started

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

## Project Structure

```
src/
  ├── components/
  │   ├── admin/      # Admin portal components
  │   ├── agent/      # Agent portal components
  │   ├── common/     # Shared UI components
  │   ├── booking/    # Booking-related components
  │   │   ├── BookingForm.jsx      # Date selection and booking creation
  │   │   └── BookingForm.css      # Styles for booking form
  │   └── vehicle/    # Vehicle-related components
  │       ├── VehicleDetailsPage.jsx  # Vehicle details with booking form
  │       └── ...     # Other vehicle components
  ├── pages/
  │   ├── admin/      # Admin portal pages
  │   ├── agent/      # Agent portal pages
  │   ├── booking/    # Booking pages
  │   │   ├── BookingsPage.jsx     # List of user bookings
  │   │   └── ConfirmationPage.jsx # Booking confirmation details
  │   ├── payment/    # Payment pages
  │   │   └── PaymentPage.jsx      # Payment processing
  │   └── ...         # Other pages
  ├── context/        # React context providers
  ├── hooks/          # Custom React hooks
  ├── services/       # API services (currently mocked)
  ├── utils/          # Utility functions
  └── assets/         # Static assets
```

## Future Development

### Planned Features

1. **Backend API Integration** ✅
   - Connect all forms to the backend API through a flexible API service architecture
   - Implement proper authentication and authorization with JWT
   - Support both Xano (current) and Supabase (future) backends
   - See [API Integration Guide](./README-API-Integration.md) for details

2. **Enhanced Vehicle Management**
   - Add vehicle availability calendar
   - Implement search and filtering enhancements
   - Support bulk operations for fleet management

3. **Booking Improvements**
   - ✅ Multi-step booking process (Implemented March 2025)
   - Integration with payment gateways (Simulated UI complete, API integration pending)
   - Support for recurring bookings
   - Booking modification and cancellation workflows

4. **User Management**
   - Enhanced customer profiles
   - Document verification workflows
   - Rating and review system

5. **Reporting & Analytics**
   - Financial reporting dashboard
   - Vehicle performance metrics
   - Occupancy and utilization reporting

## Color Palette

- Light Yellow: `#FCFFC1` (rgb(252, 255, 193))
- Yellow: `#FFE893` (rgb(255, 232, 147))
- Coral: `#FBB4A5` (rgb(251, 180, 165))
- Pink: `#FB9EC6` (rgb(251, 158, 198))

## Login Details

To test the application, use the following credentials:

- **Email**: bajejosh@gmail.com
- **Password**: 1 

## Contributors

- Josh Baje - Lead Developer

## License

This project is proprietary and confidential.
