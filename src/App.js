import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';

// Pages
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import VehicleDetailsPage from './components/vehicle/VehicleDetailsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

function App() {
  // Mock auth state (would be managed by a proper auth system in a real app)
  const [user, setUser] = useState(null);

  return (
    <Router>
      <div className="app">
        <Navbar isLoggedIn={!!user} userType={user?.userType} />
        
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/vehicles/:id" element={<VehicleDetailsPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            {/* Add more routes as you build them */}
            {/* 
            <Route path="/booking/:id" element={<BookingPage />} />
            <Route path="/payment/:id" element={<PaymentPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/owner-dashboard" element={<OwnerDashboardPage />} />
            <Route path="/renter-dashboard" element={<RenterDashboardPage />} />
            <Route path="/list-your-car" element={<ListVehiclePage />} />
            */}
          </Routes>
        </main>
        
        <Footer />
      </div>
    </Router>
  );
}

export default App;