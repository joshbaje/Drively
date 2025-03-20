import React, { createContext, useState, useEffect } from 'react';

export const CompareContext = createContext();

export const CompareProvider = ({ children }) => {
  const [compareList, setCompareList] = useState([]);
  const [isBarVisible, setIsBarVisible] = useState(false);

  // Load compare list from localStorage on mount
  useEffect(() => {
    const storedVehicles = localStorage.getItem('compareVehicles');
    if (storedVehicles) {
      try {
        const parsedVehicles = JSON.parse(storedVehicles);
        setCompareList(parsedVehicles);
        if (parsedVehicles.length > 0) {
          setIsBarVisible(true);
        }
      } catch (error) {
        console.error('Error parsing stored compare vehicles:', error);
        localStorage.removeItem('compareVehicles');
      }
    }
  }, []);

  // Save compare list to localStorage whenever it changes
  useEffect(() => {
    if (compareList.length > 0) {
      localStorage.setItem('compareVehicles', JSON.stringify(compareList));
      setIsBarVisible(true);
    } else {
      localStorage.removeItem('compareVehicles');
      setIsBarVisible(false);
    }
  }, [compareList]);

  // Add a vehicle to the compare list
  const addToCompare = (vehicle) => {
    if (compareList.length >= 3) {
      alert('You can compare up to 3 vehicles at a time. Please remove one to add another.');
      return;
    }

    if (!compareList.some(item => item.vehicle_id === vehicle.vehicle_id)) {
      setCompareList([...compareList, vehicle]);
    }
  };

  // Remove a vehicle from the compare list
  const removeFromCompare = (vehicleId) => {
    setCompareList(compareList.filter(vehicle => vehicle.vehicle_id !== vehicleId));
  };

  // Clear the entire compare list
  const clearCompareList = () => {
    setCompareList([]);
  };

  // Toggle the compare bar visibility
  const toggleCompareBar = () => {
    setIsBarVisible(!isBarVisible);
  };

  return (
    <CompareContext.Provider
      value={{
        compareList,
        isBarVisible,
        addToCompare,
        removeFromCompare,
        clearCompareList,
        toggleCompareBar
      }}
    >
      {children}
    </CompareContext.Provider>
  );
};

export default CompareProvider;