// src/services/api.js
// Centralized API configuration

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Get auth token from localStorage
const getToken = () => localStorage.getItem('token');

// Retry configuration
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000; // 1 second

// Sleep utility for retries
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Check if error is retryable (network errors or 5xx server errors)
const isRetryableError = (error, status) => {
  // Network errors (no status) are retryable
  if (!status) return true;
  // 5xx server errors are retryable
  if (status >= 500 && status < 600) return true;
  // 429 Too Many Requests is retryable
  if (status === 429) return true;
  return false;
};

// Base fetch wrapper with auth header and retry logic
const apiFetch = async (endpoint, options = {}, retries = MAX_RETRIES) => {
  const token = getToken();
  
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  let lastError;
  
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, config);
      const data = await response.json();

      if (!response.ok) {
        const error = new Error(data.message || 'API Error');
        error.status = response.status;
        error.errors = data.errors;
        
        // Don't retry client errors (4xx) except 429
        if (!isRetryableError(error, response.status)) {
          throw error;
        }
        
        lastError = error;
        throw error; // Throw to trigger retry
      }

      return data;
    } catch (error) {
      lastError = error;
      
      // If it's a non-retryable error or last attempt, throw immediately
      if (!isRetryableError(error, error.status) || attempt === retries) {
        throw error;
      }
      
      // Exponential backoff: 1s, 2s, 4s
      const delay = INITIAL_RETRY_DELAY * Math.pow(2, attempt);
      console.warn(`API request failed, retrying in ${delay}ms... (attempt ${attempt + 1}/${retries})`);
      await sleep(delay);
    }
  }
  
  throw lastError;
};

// API service object
const api = {
  // Auth
  auth: {
    register: (userData) => 
      apiFetch('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
    login: (credentials) => 
      apiFetch('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
    getMe: () => 
      apiFetch('/auth/me'),
    updateProfile: (data) => 
      apiFetch('/auth/profile', { method: 'PUT', body: JSON.stringify(data) }),
    deleteAccount: () => 
      apiFetch('/auth/account', { method: 'DELETE' }),
  },

  // Products
  products: {
    getAll: (params = '') => 
      apiFetch(`/products${params ? `?${params}` : ''}`),
    getOne: (id) => 
      apiFetch(`/products/${id}`),
    create: (productData) => 
      apiFetch('/products', { method: 'POST', body: JSON.stringify(productData) }),
    update: (id, productData) => 
      apiFetch(`/products/${id}`, { method: 'PUT', body: JSON.stringify(productData) }),
    delete: (id) => 
      apiFetch(`/products/${id}`, { method: 'DELETE' }),
  },

  // Orders
  orders: {
    create: (orderData) => 
      apiFetch('/orders', { method: 'POST', body: JSON.stringify(orderData) }),
    createGuest: (orderData) => 
      apiFetch('/orders/guest', { method: 'POST', body: JSON.stringify(orderData) }),
    getMyOrders: () => 
      apiFetch('/orders'),
    getOne: (id) => 
      apiFetch(`/orders/${id}`),
    getAll: () => 
      apiFetch('/orders/admin/all'),
    updateStatus: (id, status) => 
      apiFetch(`/orders/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),
  },

  // Chat
  chat: {
    create: (data) => 
      apiFetch('/chat', { method: 'POST', body: JSON.stringify(data) }),
    getMyChats: () => 
      apiFetch('/chat'),
    getAll: () => 
      apiFetch('/chat/admin/all'),
    getOne: (id) => 
      apiFetch(`/chat/${id}`),
    addMessage: (id, message) => 
      apiFetch(`/chat/${id}/message`, { method: 'POST', body: JSON.stringify({ message }) }),
    updateStatus: (id, status) => 
      apiFetch(`/chat/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),
  },

  // Users (SuperAdmin)
  users: {
    getAll: () => 
      apiFetch('/users'),
    createAdmin: (userData) => 
      apiFetch('/users/admin', { method: 'POST', body: JSON.stringify(userData) }),
    updateRole: (id, role) => 
      apiFetch(`/users/${id}/role`, { method: 'PUT', body: JSON.stringify({ role }) }),
    delete: (id) => 
      apiFetch(`/users/${id}`, { method: 'DELETE' }),
  },

  // Health check
  health: () => apiFetch('/health'),
};

export { API_URL, apiFetch };
export default api;
