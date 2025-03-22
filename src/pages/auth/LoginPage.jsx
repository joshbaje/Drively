import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './AuthPages.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check for message from the registration page
  const registrationMessage = location.state?.message;
  
  // Get the redirect path from location state, or default to homepage
  const from = location.state?.from?.pathname || '/';

  // Show registration success message if present
  React.useEffect(() => {
    if (registrationMessage) {
      setSuccess(registrationMessage);
      // Clear the message after 5 seconds
      const timer = setTimeout(() => setSuccess(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [registrationMessage]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError('');
      
      // Call login from AuthContext
      const loginData = await login(email, password);
      
      // Determine redirect based on user role
      let redirectPath = from;
      
      // If the user has a specific role, redirect to their dashboard
      const userType = loginData?.user?.user_type;
      
      if (userType) {
        if (userType === 'admin' || userType === 'super_admin' || userType === 'system_admin') {
          redirectPath = '/admin';
        } else if (userType === 'support' || userType === 'content_moderator') {
          redirectPath = '/agent/dashboard';
        } else if (userType === 'verified_owner' || userType === 'fleet_manager') {
          redirectPath = '/owner/dashboard';
        } else if (userType === 'verified_renter') {
          redirectPath = '/renter-dashboard';
        }
      }
      
      // Login successful, redirect
      navigate(redirectPath, { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h1>Welcome Back</h1>
          <p>Sign in to continue to Drivelyph</p>
        </div>
        
        {error && <div className="auth-error">{error}</div>}
        {success && <div className="auth-success">{success}</div>}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email <span className="required">*</span></label>
            <div className="input-with-icon">
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
              <i className="fas fa-envelope input-icon"></i>
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password <span className="required">*</span></label>
            <div className="password-input-container">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
              <i className="fas fa-lock input-icon"></i>
              <button 
                type="button" 
                className="password-toggle" 
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                tabIndex="-1"
              >
                <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
              </button>
            </div>
          </div>
          
          <div className="form-options">
            <div className="remember-me">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label htmlFor="rememberMe">Remember me</label>
            </div>
            <Link to="/forgot-password" className="forgot-password">
              Forgot password?
            </Link>
          </div>
          
          <button 
            type="submit" 
            className="create-account-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'SIGNING IN...' : 'SIGN IN'}
          </button>
        </form>
        
        <div className="divider">Or sign in with</div>
        
        <div className="social-buttons">
          <button className="social-button">
            <i className="fab fa-facebook-f"></i>
            <span>Facebook</span>
          </button>
          <button className="social-button">
            <i className="fab fa-google"></i>
            <span>Google</span>
          </button>
        </div>
        
        <div className="auth-footer">
          <p>
            Don't have an account?{' '}
            <Link to="/register" className="auth-link">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;