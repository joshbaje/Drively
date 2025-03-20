import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CompareContext } from '../../../context/CompareContext';
import './CompareStyles.css';

const CompareBar = () => {
  const { compareList, removeFromCompare, clearCompareList } = useContext(CompareContext);
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();

  if (compareList.length === 0) {
    return null;
  }

  const handleCompareClick = () => {
    if (compareList.length < 2) {
      alert('Please select at least 2 vehicles to compare.');
      return;
    }
    navigate('/compare', { state: { vehicles: compareList } });
  };

  return (
    <div className={`compare-bar ${isExpanded ? 'expanded' : ''}`}>
      <div className="compare-bar-header" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="compare-bar-title">
          <i className="fas fa-exchange-alt"></i>
          <span>Compare Vehicles ({compareList.length}/3)</span>
        </div>
        <button className="expand-toggle">
          <i className={`fas ${isExpanded ? 'fa-chevron-down' : 'fa-chevron-up'}`}></i>
        </button>
      </div>

      {isExpanded && (
        <div className="compare-bar-content">
          <div className="compare-vehicles">
            {compareList.map(vehicle => (
              <div key={vehicle.vehicle_id} className="compare-vehicle-item">
                <img 
                  src={vehicle.image_url || 'https://via.placeholder.com/80x60'} 
                  alt={`${vehicle.make} ${vehicle.model}`} 
                  className="compare-vehicle-image"
                />
                <div className="compare-vehicle-info">
                  <p className="compare-vehicle-name">{vehicle.make} {vehicle.model}</p>
                  <p className="compare-vehicle-price">${vehicle.daily_rate}/day</p>
                </div>
                <button 
                  className="compare-remove-button" 
                  onClick={() => removeFromCompare(vehicle.vehicle_id)}
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            ))}

            {Array(3 - compareList.length).fill().map((_, index) => (
              <div key={`empty-${index}`} className="compare-vehicle-item empty">
                <div className="compare-empty-placeholder">
                  <i className="fas fa-plus"></i>
                  <p>Add a vehicle</p>
                </div>
              </div>
            ))}
          </div>

          <div className="compare-actions">
            <button 
              className="compare-clear-all" 
              onClick={clearCompareList}
            >
              Clear All
            </button>
            <button 
              className="compare-now-button" 
              onClick={handleCompareClick}
              disabled={compareList.length < 2}
            >
              Compare Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompareBar;