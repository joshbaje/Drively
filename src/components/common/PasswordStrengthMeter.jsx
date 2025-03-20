import React from 'react';

const PasswordStrengthMeter = ({ password }) => {
  const calculateStrength = (password) => {
    let strength = 0;
    
    // Length check
    if (password.length >= 8) strength += 1;
    
    // Contains lowercase
    if (/[a-z]/.test(password)) strength += 1;
    
    // Contains uppercase
    if (/[A-Z]/.test(password)) strength += 1;
    
    // Contains number
    if (/[0-9]/.test(password)) strength += 1;
    
    // Contains special character
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    return strength;
  };
  
  const getStrengthLabel = (strength) => {
    switch (strength) {
      case 0:
        return '';
      case 1:
        return 'Very Weak';
      case 2:
        return 'Weak';
      case 3:
        return 'Medium';
      case 4:
        return 'Strong';
      case 5:
        return 'Very Strong';
      default:
        return '';
    }
  };
  
  const getStrengthColor = (strength) => {
    switch (strength) {
      case 0:
        return '#ddd';
      case 1:
        return '#e53e3e';
      case 2:
        return '#ed8936';
      case 3:
        return '#ecc94b';
      case 4:
        return '#48bb78';
      case 5:
        return '#38a169';
      default:
        return '#ddd';
    }
  };
  
  const strength = calculateStrength(password);
  const percentage = (strength / 5) * 100;
  const label = getStrengthLabel(strength);
  const color = getStrengthColor(strength);

  if (!password) return null;
  
  return (
    <div className="password-strength-meter">
      <div className="strength-bar-container">
        <div 
          className="strength-bar" 
          style={{ 
            width: `${percentage}%`,
            backgroundColor: color
          }}
        ></div>
      </div>
      {label && (
        <div className="strength-label" style={{ color }}>
          {label}
        </div>
      )}
    </div>
  );
};

export default PasswordStrengthMeter;