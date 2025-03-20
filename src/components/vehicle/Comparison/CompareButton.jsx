import React, { useContext } from 'react';
import { CompareContext } from '../../../context/CompareContext';
import './CompareStyles.css';

const CompareButton = ({ vehicle }) => {
  const { compareList, addToCompare, removeFromCompare } = useContext(CompareContext);
  
  const isInCompare = compareList.some(item => item.vehicle_id === vehicle.vehicle_id);
  const isCompareListFull = compareList.length >= 3;

  const handleToggleCompare = () => {
    if (isInCompare) {
      removeFromCompare(vehicle.vehicle_id);
    } else if (!isCompareListFull) {
      addToCompare(vehicle);
    }
  };

  return (
    <button 
      className={`compare-button ${isInCompare ? 'compared' : ''} ${isCompareListFull && !isInCompare ? 'disabled' : ''}`}
      onClick={handleToggleCompare}
      disabled={isCompareListFull && !isInCompare}
      title={isCompareListFull && !isInCompare ? 'You can compare up to 3 vehicles at a time' : ''}
    >
      <i className={`fas ${isInCompare ? 'fa-check' : 'fa-exchange-alt'}`}></i>
      {isInCompare ? 'Added to Compare' : 'Compare'}
    </button>
  );
};

export default CompareButton;