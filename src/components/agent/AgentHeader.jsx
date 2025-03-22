import React from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const AgentHeader = ({ title, buttons = [] }) => {
  const navigate = useNavigate();

  return (
    <div className="agent-section-header">
      <h2 className="section-title">{title}</h2>
      <div className="header-actions">
        {buttons.map((button, index) => (
          <button
            key={index}
            className={`btn ${button.variant || 'btn-primary'}`}
            onClick={() => {
              if (button.onClick) {
                button.onClick();
              } else if (button.to) {
                navigate(button.to);
              }
            }}
          >
            {button.icon && <i className={`fas fa-${button.icon} me-1`}></i>}
            {button.label}
          </button>
        ))}
      </div>
    </div>
  );
};

AgentHeader.propTypes = {
  title: PropTypes.string.isRequired,
  buttons: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      variant: PropTypes.string,
      icon: PropTypes.string,
      onClick: PropTypes.func,
      to: PropTypes.string
    })
  )
};

export default AgentHeader;