// src/hooks/useApi.js
import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for API calls
 * @param {string} url - The API endpoint URL
 * @param {object} options - Optional fetch options
 * @returns {object} - { data, loading, error, refetch }
 */
const useApi = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch function that can be called manually via refetch
  const fetchData = useCallback(async () => {
    // Reset states before fetching
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url, options);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message || 'An error occurred while fetching data');
    } finally {
      setLoading(false);
    }
  }, [url, JSON.stringify(options)]);

  // Fetch on mount and when URL changes
  useEffect(() => {
    if (url) {
      fetchData();
    }
  }, [url, fetchData]);

  // Manual refetch function
  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch };
};

export default useApi;
