import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
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
  const [step, setStep] = useState(1); // Multi-step form
  
  const { register } = useAuth();
  const navigate = useNavigate();
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const validateStep1 = () => {
    if (!formData.first_name || !formData.last_name || !formData.email) {
      setError('Please fill in all required fields');
      return false;
    }
    
    if (!formData.email.match(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/)) {
      setError('Please enter a valid email address');
      return false;
    }
    
    return true;
  };
  
  const validateStep2 = () => {
    if (!formData.password || !formData.confirm_password || !formData.phone_number) {
      setError('Please fill in all required fields');
      return false;
    }
    
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }
    
    if (formData.password !== formData.confirm_password) {
      setError('Passwords do not match');
      return false;
    }
    
    if (!formData.phone_number.match(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/)) {
      setError('Please enter a valid phone number');
      return false;
    }
    
    return true;
  };
  
  const nextStep = () => {
    if (step === 1 && validateStep1()) {
      setError('');
      setStep(2);
    }
  };
  
  const prevStep = () => {
    setError('');
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
      
      // Remove confirm_password and terms_accepted from data sent to API
      const { confirm_password, terms_accepted, ...userData } = formData;
      
      // Call register from AuthContext
      await register(userData);
      
      // Registration successful, redirect to login or dashboard
      navigate('/login', { 
        state: { 
          message: 'Registration successful! Please log in with your new account.' 
        } 
      });
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
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
        
        <form onSubmit={handleSubmit} className="auth-form">
          {step === 1 ? (
            <>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="first_name">First Name</label>
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
                  <label htmlFor="last_name">Last Name</label>
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
                <label htmlFor="email">Email</label>
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
                <label htmlFor="date_of_birth">Date of Birth</label>
                <input
                  type="date"
                  id="date_of_birth"
                  name="date_of_birth"
                  value={formData.date_of_birth}
                  onChange={handleChange}
                  required
                />
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
                <label htmlFor="phone_number">Phone Number</label>
                <input
                  type="tel"
                  id="phone_number"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="confirm_password">Confirm Password</label>
                <input
                  type="password"
                  id="confirm_password"
                  name="confirm_password"
                  value={formData.confirm_password}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Account Type</label>
                <div className="radio-group">
                  <div className="radio-option">
                    <input
                      type="radio"
                      id="renter"
                      name="user_type"
                      value="renter"
                      checked={formData.user_type === 'renter'}
                      onChange={handleChange}
                    />
                    <label htmlFor="renter">I want to rent a car</label>
                  </div>
                  
                  <div className="radio-option">
                    <input
                      type="radio"
                      id="owner"
                      name="user_type"
                      value="owner"
                      checked={formData.user_type === 'owner'}
                      onChange={handleChange}
                    />
                    <label htmlFor="owner">I want to list my car</label>
                  </div>
                </div>
              </div>
              
              <div className="form-group checkbox">
                <input
                  type="checkbox"
                  id="terms_accepted"
                  name="terms_accepted"
                  checked={formData.terms_accepted}
                  onChange={handleChange}
                />
                <label htmlFor="terms_accepted">
                  I agree to the <a href="/terms">Terms and Conditions</a> and <a href="/privacy">Privacy Policy</a>
                </label>
              </div>
              
              <div className="form-buttons">
                <button 
                  type="button" 
                  className="secondary-button"
                  onClick={prevStep}
                >
                  Back
                </button>
                
                <button 
                  type="submit" 
                  className="auth-button"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Creating Account...' : 'Create Account'}
                </button>
              </div>
            </>
          )}
        </form>
        
        <div className="social-login">
          <p>Or sign up with</p>
          <div className="social-buttons">
            <button className="social-button facebook">
              <i className="fab fa-facebook-f"></i>
              Facebook
            </button>
            <button className="social-button google">
              <i className="fab fa-google"></i>
              Google
            </button>
          </div>
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