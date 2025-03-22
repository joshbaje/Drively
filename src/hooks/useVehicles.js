/**
 * Vehicle data hook for Drively
 * 
 * This hook provides functions for interacting with vehicle data
 * and manages loading/error state for components.
 */

import { useState, useEffect, useCallback } from 'react';
import ApiService from '../services/api';

const useVehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [featuredVehicles, setFeaturedVehicles] = useState([]);
  const [currentVehicle, setCurrentVehicle] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all vehicles with optional filtering
  const fetchVehicles = useCallback(async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await ApiService.vehicles.getAll(filters);
      setVehicles(response.data || response);
      return response;
    } catch (err) {
      setError(err.message || 'Failed to fetch vehicles');
      console.error('Error fetching vehicles:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch featured vehicles for homepage
  const fetchFeaturedVehicles = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await ApiService.vehicles.getAll({ is_featured: true, limit: 6 });
      setFeaturedVehicles(response.data || response);
      return response;
    } catch (err) {
      setError(err.message || 'Failed to fetch featured vehicles');
      console.error('Error fetching featured vehicles:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch a single vehicle by ID
  const fetchVehicleById = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      const response = await ApiService.vehicles.getById(id);
      setCurrentVehicle(response);
      return response;
    } catch (err) {
      setError(err.message || 'Failed to fetch vehicle details');
      console.error(`Error fetching vehicle ID ${id}:`, err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new vehicle listing
  const createVehicle = useCallback(async (vehicleData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await ApiService.vehicles.create(vehicleData);
      // Update vehicles list with new vehicle if needed
      setVehicles(prev => [response, ...prev]);
      return response;
    } catch (err) {
      setError(err.message || 'Failed to create vehicle listing');
      console.error('Error creating vehicle:', err);
      throw err; // Rethrow to let form handlers catch it
    } finally {
      setLoading(false);
    }
  }, []);

  // Update an existing vehicle
  const updateVehicle = useCallback(async (id, vehicleData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await ApiService.vehicles.update(id, vehicleData);
      
      // Update current vehicle if it's the one being edited
      if (currentVehicle && currentVehicle.vehicle_id === id) {
        setCurrentVehicle(response);
      }
      
      // Update vehicle in the list if it exists there
      setVehicles(prev => 
        prev.map(vehicle => 
          vehicle.vehicle_id === id ? response : vehicle
        )
      );
      
      return response;
    } catch (err) {
      setError(err.message || 'Failed to update vehicle');
      console.error(`Error updating vehicle ID ${id}:`, err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentVehicle]);

  // Delete a vehicle
  const deleteVehicle = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      await ApiService.vehicles.delete(id);
      
      // Remove vehicle from the list
      setVehicles(prev => 
        prev.filter(vehicle => vehicle.vehicle_id !== id)
      );
      
      // Clear current vehicle if it's the one being deleted
      if (currentVehicle && currentVehicle.vehicle_id === id) {
        setCurrentVehicle(null);
      }
      
      return true;
    } catch (err) {
      setError(err.message || 'Failed to delete vehicle');
      console.error(`Error deleting vehicle ID ${id}:`, err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentVehicle]);

  // Upload vehicle image
  const uploadVehicleImage = useCallback(async (vehicleId, imageFile) => {
    try {
      setLoading(true);
      setError(null);
      const response = await ApiService.vehicles.uploadImage(vehicleId, imageFile);
      
      // Update current vehicle with new image if it's the one being updated
      if (currentVehicle && currentVehicle.vehicle_id === vehicleId) {
        const updatedImages = [...(currentVehicle.vehicle_images || []), response];
        setCurrentVehicle({
          ...currentVehicle,
          vehicle_images: updatedImages
        });
      }
      
      return response;
    } catch (err) {
      setError(err.message || 'Failed to upload image');
      console.error(`Error uploading image for vehicle ID ${vehicleId}:`, err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentVehicle]);

  // Delete vehicle image
  const deleteVehicleImage = useCallback(async (vehicleId, imageId) => {
    try {
      setLoading(true);
      setError(null);
      await ApiService.vehicles.deleteImage(vehicleId, imageId);
      
      // Update current vehicle by removing the deleted image
      if (currentVehicle && currentVehicle.vehicle_id === vehicleId) {
        const updatedImages = currentVehicle.vehicle_images.filter(
          img => img.image_id !== imageId
        );
        setCurrentVehicle({
          ...currentVehicle,
          vehicle_images: updatedImages
        });
      }
      
      return true;
    } catch (err) {
      setError(err.message || 'Failed to delete image');
      console.error(`Error deleting image ID ${imageId}:`, err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentVehicle]);

  // Check vehicle availability for specific dates
  const checkVehicleAvailability = useCallback(async (vehicleId, startDate, endDate) => {
    try {
      setLoading(true);
      setError(null);
      const response = await ApiService.vehicles.getAvailability(vehicleId, startDate, endDate);
      return response;
    } catch (err) {
      setError(err.message || 'Failed to check availability');
      console.error(`Error checking availability for vehicle ID ${vehicleId}:`, err);
      return { is_available: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    // State
    vehicles,
    featuredVehicles,
    currentVehicle,
    loading,
    error,
    
    // Actions
    fetchVehicles,
    fetchFeaturedVehicles,
    fetchVehicleById,
    createVehicle,
    updateVehicle,
    deleteVehicle,
    uploadVehicleImage,
    deleteVehicleImage,
    checkVehicleAvailability,
    
    // Helpers
    clearError: () => setError(null),
    clearCurrentVehicle: () => setCurrentVehicle(null)
  };
};

export default useVehicles;