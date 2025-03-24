/**
 * This is an example hook demonstrating how to use the database connection
 * with provider-agnostic code to fetch vehicle data
 */
import { useState, useCallback, useEffect } from 'react';
import dbConnection from '../database/connection';

/**
 * Hook for managing vehicle data
 */
export const useVehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });

  /**
   * Fetch vehicles with optional filtering
   */
  const fetchVehicles = useCallback(async (filters = {}, options = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      // Determine pagination options
      const paginationOptions = {
        limit: options.limit || pagination.limit,
        offset: options.page ? (options.page - 1) * (options.limit || pagination.limit) : 0
      };
      
      // Sort options
      const sortOptions = {};
      if (options.sortBy) {
        sortOptions.orderBy = `${options.sortBy}:${options.sortDirection || 'asc'}`;
      }
      
      // Use the database connection to fetch data
      const result = await dbConnection.getMany(
        'vehicles', 
        filters, 
        {
          ...paginationOptions,
          ...sortOptions
        }
      );
      
      setVehicles(result.data);
      setPagination(result.pagination || pagination);
    } catch (err) {
      console.error('Error fetching vehicles:', err);
      setError(err.message || 'Failed to fetch vehicles');
    } finally {
      setLoading(false);
    }
  }, [pagination.limit]);

  /**
   * Get a single vehicle by ID
   */
  const getVehicleById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await dbConnection.getById('vehicles', id, {
        relations: ['vehicle_images', 'location']
      });
      
      return result;
    } catch (err) {
      console.error('Error fetching vehicle:', err);
      setError(err.message || 'Failed to fetch vehicle');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Create a new vehicle
   */
  const createVehicle = useCallback(async (vehicleData) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await dbConnection.create('vehicles', vehicleData);
      
      // Refresh the vehicle list after creating a new one
      fetchVehicles();
      
      return result;
    } catch (err) {
      console.error('Error creating vehicle:', err);
      setError(err.message || 'Failed to create vehicle');
      return null;
    } finally {
      setLoading(false);
    }
  }, [fetchVehicles]);

  /**
   * Update an existing vehicle
   */
  const updateVehicle = useCallback(async (id, vehicleData) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await dbConnection.update('vehicles', id, vehicleData);
      
      // Update local state with the updated vehicle
      setVehicles(prevVehicles => 
        prevVehicles.map(vehicle => 
          vehicle.id === id ? { ...vehicle, ...vehicleData } : vehicle
        )
      );
      
      return result;
    } catch (err) {
      console.error('Error updating vehicle:', err);
      setError(err.message || 'Failed to update vehicle');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Delete a vehicle
   */
  const deleteVehicle = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      await dbConnection.delete('vehicles', id);
      
      // Remove the deleted vehicle from local state
      setVehicles(prevVehicles => 
        prevVehicles.filter(vehicle => vehicle.id !== id)
      );
      
      return true;
    } catch (err) {
      console.error('Error deleting vehicle:', err);
      setError(err.message || 'Failed to delete vehicle');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Upload a vehicle image
   */
  const uploadVehicleImage = useCallback(async (vehicleId, imageFile) => {
    setLoading(true);
    setError(null);
    
    try {
      const path = `vehicles/${vehicleId}/${Date.now()}_${imageFile.name}`;
      const result = await dbConnection.uploadFile('vehicle-images', path, imageFile);
      
      // Create an image record in the database
      const imageData = {
        vehicle_id: vehicleId,
        image_url: result.url,
        image_type: 'exterior',
        is_primary: false
      };
      
      await dbConnection.create('vehicle_images', imageData);
      
      return result;
    } catch (err) {
      console.error('Error uploading image:', err);
      setError(err.message || 'Failed to upload image');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    vehicles,
    loading,
    error,
    pagination,
    fetchVehicles,
    getVehicleById,
    createVehicle,
    updateVehicle,
    deleteVehicle,
    uploadVehicleImage
  };
};

export default useVehicles;
