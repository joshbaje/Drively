import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Admin Dashboard Components
import AdminDashboard from './AdminDashboard';
import UserManagement from './UserManagement';
import VehicleManagement from './VehicleManagement';
import BookingManagement from './BookingManagement';

// Vehicle Management Routes
import VehicleCreate from '../../pages/admin/VehicleCreate';

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<AdminDashboard />} />
      <Route path="/dashboard" element={<AdminDashboard />} />
      <Route path="/users" element={<UserManagement />} />
      <Route path="/vehicles" element={<VehicleManagement />} />
      <Route path="/vehicles/create" element={<VehicleCreate />} />
      <Route path="/bookings" element={<BookingManagement />} />
      <Route path="*" element={
        <div className="not-found-content">
          <h2>404 - Admin Page Not Found</h2>
          <p>The admin page you are looking for does not exist.</p>
        </div>
      } />
    </Routes>
  );
};

export default AdminRoutes;