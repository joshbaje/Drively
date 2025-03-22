# Drively Vehicle Calendar Management

## Overview

The Vehicle Calendar Management feature is a visual tool for Drively agents to manage and track vehicle availability, bookings, and maintenance periods. This feature helps agents prevent booking conflicts, schedule maintenance, and view booking details for specific dates.

## Features

- **Multiple View Options**: Monthly and weekly calendar views
- **Visual Monthly Calendar**: See vehicle availability at a glance
- **Detailed Weekly View**: See daily bookings and events with time information
- **Vehicle Statistics Dashboard**: View utilization rate, revenue, and other key metrics
- **Booking Visibility**: View all bookings for a specific vehicle 
- **Availability Management**: Add, edit, and delete unavailability periods (maintenance, personal use, etc.)
- **Detailed Event View**: Click on any date to see detailed information about bookings or unavailability periods
- **Responsive Design**: Works on desktop and mobile devices

## How to Access

1. Login to the Drively Agent Portal
2. Navigate to the Car Management section
3. Access the calendar in one of two ways:
   - Click the calendar icon on any vehicle card in the list view
   - View a vehicle's details and click the "View Availability" button

## Using the Calendar

### Navigating the Calendar

- Toggle between 'Month' and 'Week' views using the buttons at the top right
- Use the arrow buttons to navigate between months or weeks
- The current period (month or week) is displayed in the header
- Days are color-coded based on their status:
  - Available (White): The vehicle is available for booking
  - Booked (Yellow): The vehicle is already booked
  - Unavailable (Coral): The vehicle is unavailable (maintenance, etc.)

### Understanding the Statistics Dashboard

The statistics dashboard displays key metrics for the vehicle:

- **Utilization Rate**: Percentage of available days that have been booked in the last 30 days
- **Total Bookings**: Number of all-time bookings for this vehicle
- **Total Revenue**: Total earnings from this vehicle
- **Upcoming Bookings**: Number of future bookings
- **Average Rental Duration**: Average length of rentals in days
- **Unavailable Days**: Total number of days the vehicle has been marked as unavailable

### Adding Unavailability Periods

1. Click the "Add Unavailable Dates" button at the top of the calendar
2. Set the start and end dates for the unavailability period
3. Select a reason (Maintenance, Personal Use, Other)
4. Add optional notes about the unavailability
5. Click "Save Exception" to create the unavailability period

### Viewing Day Details

1. Click on any day in the calendar to select it
2. The bottom panel will display details of any events on that day
3. For bookings, you'll see:
   - Booking ID
   - Renter name
   - Dates
   - Booking status
   - Total amount
4. For unavailability periods, you'll see:
   - Reason for unavailability
   - Date range
   - Any notes added

### Managing Unavailability Periods

- To delete an unavailability period, select the day and click the "X" button in the event card
- Only unavailability periods can be deleted (bookings must be managed through the booking system)

## Technical Implementation

The calendar feature is implemented using the following components:

- `VehicleCalendar.jsx`: The main calendar component
- `VehicleCalendarPage.jsx`: The page component that wraps the calendar
- `VehicleStatistics.jsx`: Displays usage statistics for the vehicle
- `WeeklyCalendarView.jsx`: Provides a week-by-week view of the vehicle's schedule
- Associated CSS files for styling

Data flow:
1. The calendar fetches vehicle details and availability data on mount
2. It renders bookings and unavailability periods on the appropriate dates
3. Changes to availability are reflected in real-time in the calendar

## Future Enhancements

Planned improvements to the calendar feature include:

1. **Drag-and-Drop Functionality**: Allow agents to create or modify unavailability periods by dragging on the calendar
2. **Calendar Export**: Enable exporting the calendar to PDF or CSV formats
3. **Booking Creation**: Add the ability to create new bookings directly from the calendar
4. **Recurring Unavailability**: Support for recurring maintenance or unavailability patterns
5. **Multiple Vehicle View**: Calendar view showing multiple vehicles side by side for fleet management

## Known Limitations

- Currently using mock data; will be connected to real API endpoints in the future
- Limited to viewing one vehicle at a time
- Unavailability periods can only be added with specific start/end dates, not by clicking on the calendar

## Development Status

This feature is currently implemented with mock data. Integration with the backend API is pending.
