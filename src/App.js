import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Auth Context Provider
import { AuthProvider } from './context/AuthContext';
import { CompareProvider } from './context/CompareContext';

// Components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';
import CompareBar from './components/vehicle/Comparison/CompareBar';

// Pages
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import VehicleDetailsPage from './components/vehicle/VehicleDetailsPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ListVehiclePage from './pages/owner/ListVehiclePage';
import ProfilePage from './pages/profile/ProfilePage';
import BookingsPage from './pages/booking/BookingsPage';
import ConfirmationPage from './pages/booking/ConfirmationPage';
import PaymentPage from './pages/payment/PaymentPage';
import ComparePage from './pages/vehicle/ComparePage';
import OwnerDashboard from './pages/owner/dashboard/OwnerDashboard';

// Admin Pages
import AdminPage from './pages/admin/AdminPage';

function App() {
  return (
    <AuthProvider>
      <CompareProvider>
        <Router>
          <div className="app">
            {/* Main Routes with Navbar and Footer */}
            <Routes>
              {/* Admin Routes (no Navbar or Footer) */}
              <Route path="/admin/*" element={
                <ProtectedRoute requiredRole="admin">
                  <AdminPage />
                </ProtectedRoute>
              } />
              
              {/* Regular Routes */}
              <Route path="/*" element={
                <>
                  <Navbar />
                  <main className="main-content">
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/search" element={<SearchPage />} />
                      <Route path="/vehicles/:id" element={<VehicleDetailsPage />} />
                      <Route path="/compare" element={<ComparePage />} />
                      <Route path="/login" element={<LoginPage />} />
                      <Route path="/register" element={<RegisterPage />} />
                      
                      {/* Owner Routes */}
                      <Route path="/list-your-car" element={
                        <ProtectedRoute requiredRole="owner">
                          <ListVehiclePage />
                        </ProtectedRoute>
                      } />
                      <Route path="/owner/dashboard" element={
                        <ProtectedRoute requiredRole="owner">
                          <OwnerDashboard />
                        </ProtectedRoute>
                      } />
                      <Route path="/vehicles/edit/:id" element={
                        <ProtectedRoute requiredRole="owner">
                          <ListVehiclePage isEditing={true} />
                        </ProtectedRoute>
                      } />
                      <Route path="/vehicles/calendar/:id" element={
                        <ProtectedRoute requiredRole="owner">
                          {/* Calendar management page component would go here */}
                          <div>Vehicle Calendar Management</div>
                        </ProtectedRoute>
                      } />
                      
                      {/* User Routes */}
                      <Route path="/profile" element={
                        <ProtectedRoute>
                          <ProfilePage />
                        </ProtectedRoute>
                      } />
                      <Route path="/bookings" element={
                        <ProtectedRoute>
                          <BookingsPage />
                        </ProtectedRoute>
                      } />
                      <Route path="/bookings/:id" element={
                        <ProtectedRoute>
                          <BookingsPage showDetails={true} />
                        </ProtectedRoute>
                      } />
                      
                      {/* Booking & Payment Routes */}
                      <Route path="/payment/:bookingId" element={
                        <ProtectedRoute>
                          <PaymentPage />
                        </ProtectedRoute>
                      } />
                      <Route path="/booking/confirmation/:bookingId" element={
                        <ProtectedRoute>
                          <ConfirmationPage />
                        </ProtectedRoute>
                      } />
                      <Route path="/payment/history/:paymentId" element={
                        <ProtectedRoute>
                          {/* Payment Details component would go here */}
                          <div>Payment Details</div>
                        </ProtectedRoute>
                      } />
                      
                      {/* Notifications Page */}
                      <Route path="/notifications" element={
                        <ProtectedRoute>
                          {/* Notifications Page component would go here */}
                          <div>Notifications Page</div>
                        </ProtectedRoute>
                      } />
                      
                      {/* 404 Not Found */}
                      <Route path="*" element={
                        <div className="not-found">
                          <h1>404 - Page Not Found</h1>
                          <p>The page you are looking for does not exist.</p>
                        </div>
                      } />
                    </Routes>
                  </main>
                  <CompareBar />
                  <Footer />
                </>
              } />
            </Routes>
          </div>
        </Router>
      </CompareProvider>
    </AuthProvider>
  );
}

export default App;