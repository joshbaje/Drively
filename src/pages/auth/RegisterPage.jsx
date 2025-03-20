import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import PasswordStrengthMeter from '../../components/common/PasswordStrengthMeter';
import './AuthPages.css';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    password: '',
    confirm_password: '',
    date_of_birth: '',
    user_type: 'renter', // Default to renter
    terms_accepted: false
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [step, setStep] = useState(1); // Multi-step form
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();
  
  // Clear success message when changing fields
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear specific errors when user starts correcting them
    if (error && (
      (name === 'email' && error.includes('email')) ||
      (name === 'password' && error.includes('password')) ||
      (name === 'confirm_password' && error.includes('match')) ||
      (name === 'phone_number' && error.includes('phone'))
    )) {
      setError('');
    }
  };
  
  const validateStep1 = () => {
    if (!formData.first_name.trim()) {
      setError('First name is required');
      return false;
    }
    
    if (!formData.last_name.trim()) {
      setError('Last name is required');
      return false;
    }
    
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    
    if (!formData.email.match(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/)) {
      setError('Please enter a valid email address');
      return false;
    }
    
    if (!formData.date_of_birth) {
      setError('Date of birth is required');
      return false;
    }
    
    // Check if user is at least 18 years old
    const birthDate = new Date(formData.date_of_birth);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (age < 18 || (age === 18 && monthDiff < 0) || (age === 18 && monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      setError('You must be at least 18 years old to register');
      return false;
    }
    
    return true;
  };
  
  const validateStep2 = () => {
    if (!formData.phone_number.trim()) {
      setError('Phone number is required');
      return false;
    }
    
    if (!formData.phone_number.match(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/)) {
      setError('Please enter a valid phone number');
      return false;
    }
    
    if (!formData.password) {
      setError('Password is required');
      return false;
    }
    
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }
    
    // Check for strong password (at least one uppercase, one lowercase, one number, one special character)
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      setError('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character');
      return false;
    }
    
    if (!formData.confirm_password) {
      setError('Please confirm your password');
      return false;
    }
    
    if (formData.password !== formData.confirm_password) {
      setError('Passwords do not match');
      return false;
    }
    
    return true;
  };
  
  const nextStep = () => {
    if (step === 1 && validateStep1()) {
      setError('');
      setSuccess('Personal information validated successfully!');
      // Clear success message after 2 seconds
      setTimeout(() => setSuccess(''), 2000);
      setStep(2);
    }
  };
  
  const prevStep = () => {
    setError('');
    setSuccess('');
    setStep(1);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep2()) {
      return;
    }
    
    if (!formData.terms_accepted) {
      setError('You must accept the Terms and Conditions');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError('');
      
      // Format date in ISO format for API
      const formattedDOB = new Date(formData.date_of_birth).toISOString().split('T')[0];
      
      // Remove confirm_password and terms_accepted from data sent to API
      const { confirm_password, terms_accepted, ...userData } = formData;
      
      // Add formatted DOB
      userData.date_of_birth = formattedDOB;
      
      // Call register from AuthContext
      await register(userData);
      
      // Show success message
      setSuccess('Registration successful! Redirecting to login...');
      
      // Registration successful, redirect to login or dashboard after a brief delay
      setTimeout(() => {
        navigate('/login', { 
          state: { 
            message: 'Registration successful! Please log in with your new account.' 
          } 
        });
      }, 2000);
    } catch (err) {
      // Handle specific API errors
      if (err.message && err.message.includes('email')) {
        setError('This email is already registered. Please use a different email address.');
      } else if (err.message && err.message.includes('phone')) {
        setError('This phone number is already registered. Please use a different phone number.');
      } else {
        setError(err.message || 'Registration failed. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h1>Create an Account</h1>
          <p>Join Drivelyph to start renting or listing vehicles</p>
        </div>
        
        {error && <div className="auth-error">{error}</div>}
        {success && <div className="auth-success">{success}</div>}
        
        <form onSubmit={handleSubmit} className="auth-form">
          {step === 1 ? (
            <>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="first_name">First Name <span className="required">*</span></label>
                  <input
                    type="text"
                    id="first_name"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    placeholder="Enter your first name"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="last_name">Last Name <span className="required">*</span></label>
                  <input
                    type="text"
                    id="last_name"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    placeholder="Enter your last name"
                    required
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email Address <span className="required">*</span></label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="date_of_birth">Date of Birth <span className="required">*</span></label>
                <input
                  type="date"
                  id="date_of_birth"
                  name="date_of_birth"
                  value={formData.date_of_birth}
                  onChange={handleChange}
                  max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
                  required
                />
                <small className="form-hint">You must be at least 18 years old</small>
              </div>
              
              <button 
                type="button" 
                className="auth-button"
                onClick={nextStep}
              >
                Next
              </button>
            </>
          ) : (
            <>
              <div className="form-group">
                <label htmlFor="phone_number">Phone Number <span className="required">*</span></label>
                <div className="input-with-icon">
                  <input
                    type="tel"
                    id="phone_number"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleChange}
                    placeholder="Enter your phone number (e.g., 123-456-7890)"
                    required
                  />
                  <i className="fas fa-phone input-icon"></i>
                </div>
                <small className="form-hint">Format: XXX-XXX-XXXX</small>
              </div>
              
              <div className="form-group">
                <label htmlFor="password">Password <span className="required">*</span></label>
                <div className="password-input-container">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a password"
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
                <small className="form-hint">
                  Must be at least 8 characters with uppercase, lowercase, number, and special character
                </small>
                <PasswordStrengthMeter password={formData.password} />
              </div>
              
              <div className="form-group">
                <label htmlFor="confirm_password">Confirm Password <span className="required">*</span></label>
                <div className="password-input-container">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirm_password"
                    name="confirm_password"
                    value={formData.confirm_password}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    required
                  />
                  <i className="fas fa-lock input-icon"></i>
                  <button 
                    type="button" 
                    className="password-toggle" 
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    tabIndex="-1"
                  >
                    <i className={`fas ${showConfirmPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                  </button>
                </div>
              </div>
              
              <div className="radio-group-container">
                <label className="radio-option">
                  <input
                    type="radio"
                    id="renter"
                    name="user_type"
                    value="renter"
                    checked={formData.user_type === 'renter'}
                    onChange={handleChange}
                  />
                  <span className="radio-button"></span>
                  <i className="fas fa-car-side radio-icon"></i>
                  I want to rent a car
                </label>
                
                <label className="radio-option">
                  <input
                    type="radio"
                    id="owner"
                    name="user_type"
                    value="owner"
                    checked={formData.user_type === 'owner'}
                    onChange={handleChange}
                  />
                  <span className="radio-button"></span>
                  <i className="fas fa-key radio-icon"></i>
                  I want to list my car
                </label>
              </div>
              
              <div className="terms-checkbox">
                <input
                  type="checkbox"
                  id="terms_accepted"
                  name="terms_accepted"
                  checked={formData.terms_accepted}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="terms_accepted">
                  I agree to the <a href="/terms" target="_blank" rel="noopener noreferrer">Terms and Conditions</a> and <a href="/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
                </label>
              </div>
              
              <div className="form-buttons">
                <button 
                  type="button" 
                  className="back-button"
                  onClick={prevStep}
                >
                  BACK
                </button>
                
                <button 
                  type="submit" 
                  className="create-account-button"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Creating Account...' : 'CREATE ACCOUNT'}
                </button>
              </div>
            </>
          )}
        </form>
        
        <div className="divider">Or sign up with</div>
        
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
            Already have an account?{' '}
            <Link to="/login" className="auth-link">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;