import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Auth Context Provider
import { AuthProvider } from './context/AuthContext';

// Components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';

// Pages
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import VehicleDetailsPage from './components/vehicle/VehicleDetailsPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ListVehiclePage from './pages/owner/ListVehiclePage';
import ProfilePage from './pages/profile/ProfilePage';
import BookingsPage from './pages/booking/BookingsPage';

// Admin Pages
import AdminPage from './pages/admin/AdminPage';

function App() {
  return (
    <AuthProvider>
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
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/list-your-car" element={
                      <ProtectedRoute requiredRole="owner">
                        <ListVehiclePage />
                      </ProtectedRoute>
                    } />
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
                    {/* Add more routes as you build them */}
                  </Routes>
                </main>
                <Footer />
              </>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;