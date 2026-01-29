// src/pages/Admin/hooks/useAdminData.js
import { useState, useEffect, useCallback } from 'react';
import api from '../../../services/api';

/**
 * Custom hook to manage admin panel data fetching and state
 */
const useAdminData = (isSuperAdmin) => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async () => {
    try {
      const res = await api.products.getAll();
      setProducts(res.data || []);
    } catch (err) {
      console.error('Error fetching products:', err);
      throw err;
    }
  }, []);

  const fetchOrders = useCallback(async () => {
    try {
      const res = await api.orders.getAll();
      setOrders(res.data || []);
    } catch (err) {
      console.error('Error fetching orders:', err);
      throw err;
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    if (!isSuperAdmin) return;
    try {
      const res = await api.users.getAll();
      setUsers(res.data || []);
    } catch (err) {
      console.error('Error fetching users:', err);
      throw err;
    }
  }, [isSuperAdmin]);

  const fetchChats = useCallback(async (userId = null) => {
    try {
      const res = await api.chat.getAll();
      let chatData = res.data || [];
      
      // Filter chats for regular admin (only assigned to them)
      if (!isSuperAdmin && userId) {
        chatData = chatData.filter(c => 
          !c.assignedAdmin || c.assignedAdmin._id === userId || c.assignedAdmin === userId
        );
      }
      
      setChats(chatData);
    } catch (err) {
      console.error('Error fetching chats:', err);
    }
  }, [isSuperAdmin]);

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await Promise.all([
        fetchProducts(),
        fetchOrders(),
        fetchUsers()
      ]);
      await fetchChats();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [fetchProducts, fetchOrders, fetchUsers, fetchChats]);

  // Initial fetch
  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Poll for new chats every 5 seconds
  useEffect(() => {
    const interval = setInterval(fetchChats, 5000);
    return () => clearInterval(interval);
  }, [fetchChats]);

  return {
    products,
    orders,
    users,
    chats,
    loading,
    error,
    refetch: fetchAllData,
    refetchChats: fetchChats
  };
};

export default useAdminData;
