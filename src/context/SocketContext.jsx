// src/context/SocketContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { user } = useAuth();
  
  // Connect to socket when user is logged in
  useEffect(() => {
    // Only connect if we have a user
    if (user) {
      // Connect to the same host/port as the API
      // In development it's typically http://localhost:5000
      const socketUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
      
      const newSocket = io(socketUrl, {
        withCredentials: true,
        transports: ['websocket', 'polling']
      });

      newSocket.on('connect', () => {
        console.log('Connected to socket server:', newSocket.id);
        // Join user-specific room for notifications
        if (user?._id || user?.id) {
            newSocket.emit('join_user', user._id || user.id);
        }
      });

      newSocket.on('connect_error', (err) => {
        console.error('Socket connection error:', err);
      });

      setSocket(newSocket);

      // Cleanup on unmount or user change
      return () => {
        newSocket.disconnect();
      };
    } else {
      // If no user, ensure socket is disconnected
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
    }
  }, [user?.id]); // Re-connect only if user ID changes or user logs in/out

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketContext;
