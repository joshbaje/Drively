# Drively Car Rental Platform

Drively is a peer-to-peer car rental platform similar to Airbnb but for vehicles. The platform enables car owners to list their vehicles for rent, and renters to find and book vehicles that suit their needs.

## Project Overview

The application includes both a customer-facing website and an admin/agent portal for managing the platform. This repository contains the frontend implementation built with React.

## Recent Updates

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
  │   └── vehicle/    # Vehicle-related components
  ├── pages/
  │   ├── admin/      # Admin portal pages
  │   ├── agent/      # Agent portal pages
  │   └── ...         # Other pages
  ├── context/        # React context providers
  ├── hooks/          # Custom React hooks
  ├── services/       # API services (currently mocked)
  ├── utils/          # Utility functions
  └── assets/         # Static assets
```

## Future Development

### Planned Features

1. **Backend API Integration**
   - Connect all forms to the backend API
   - Implement proper authentication and authorization
   - Enable real data persistence

2. **Enhanced Vehicle Management**
   - Add vehicle availability calendar
   - Implement search and filtering enhancements
   - Support bulk operations for fleet management

3. **Booking Improvements**
   - Multi-step booking process
   - Integration with payment gateways
   - Support for recurring bookings

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
