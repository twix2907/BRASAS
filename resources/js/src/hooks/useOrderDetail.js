import { useCallback } from 'react';
import axios from '../axiosConfig';

export const useOrderDetail = () => {
  const getOrderDetail = useCallback(async (orderId) => {
    try {
      const response = await axios.get(`/api/orders/${orderId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching order detail:', error);
      throw error;
    }
  }, []);

  return { getOrderDetail };
};