// src/context/NotificationContext.jsx
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Snackbar, Alert, Slide, Badge, IconButton, Menu, MenuItem, Box, Typography, Divider } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';

const NotificationContext = createContext(null);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

// Slide transition for snackbar
const SlideTransition = (props) => <Slide {...props} direction="up" />;

import { useNavigate } from 'react-router-dom';

// ...

export const NotificationProvider = ({ children }) => {
  // Toast notification state
  const [toast, setToast] = useState({ open: false, message: '', severity: 'info', title: '', link: null });
  const navigate = useNavigate();

  // Notification history (for bell icon)
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  
  // Menu state (unused in provider but kept for consistency if needed, though mostly in Bell)
  const [anchorEl, setAnchorEl] = useState(null);

  // Show toast notification
  const showNotification = useCallback((message, severity = 'info', title = '', link = null) => {
    setToast({ open: true, message, severity, title, link });
    
    // Add to notification history
    const notification = {
      id: Date.now(),
      message,
      severity,
      title,
      link,
      timestamp: new Date(),
      read: false
    };
    
    setNotifications(prev => [notification, ...prev].slice(0, 50)); // Keep last 50
    setUnreadCount(prev => prev + 1);
    
    // Request browser notification permission and show
    if (Notification.permission === 'granted') {
      const n = new Notification(title || 'BLAKV Store', {
        body: message,
        icon: '/favicon.ico'
      });
      if (link) {
        n.onclick = () => {
          window.focus();
          navigate(link);
        };
      }
    }
  }, [navigate]);

  // Specific notification types
  const notifySuccess = useCallback((message, title, link) => showNotification(message, 'success', title, link), [showNotification]);
  const notifyError = useCallback((message, title, link) => showNotification(message, 'error', title, link), [showNotification]);
  const notifyWarning = useCallback((message, title, link) => showNotification(message, 'warning', title, link), [showNotification]);
  const notifyInfo = useCallback((message, title, link) => showNotification(message, 'info', title, link), [showNotification]);
  
  // ...
  
  // New message notification
  const notifyNewMessage = useCallback((from, preview, chatId) => {
    showNotification(preview || 'You have a new message', 'info', `Message from ${from}`, chatId ? `/support` : '/support');
  }, [showNotification]);

  // ...

  // Close toast
  const handleCloseToast = (event, reason) => {
    if (reason === 'clickaway') return;
    setToast(prev => ({ ...prev, open: false }));
  };
  
  const handleToastClick = () => {
      if (toast.link) {
          navigate(toast.link);
          setToast(prev => ({ ...prev, open: false }));
      }
  };

  // Mark all as read
  const markAllRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
    setAnchorEl(null);
  }, []);

  // Request notification permission on mount
  useEffect(() => {
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const value = {
    showNotification,
    notifySuccess,
    notifyError,
    notifyWarning,
    notifyInfo,
    notifyNewMessage,
    // notifyOrderStatus, // This was missing in the previous block but I see it in full view, let me double check the full file view. 
    // Wait, the previous view showed I removed valid existing code?
    // Looking at Step 636 diff, I replaced the whole `value` block with `// ...` implicitly? 
    // No, I see `const value = { ... };` in line 104 of Step 619 (original view).
    // In Step 685 (current view), line 91 ends with `// ...` and line 94 starts with `return (`.
    // The `value` definition is GONE.
    notifications,
    unreadCount,
    markAllRead
  };
  
  return (
    <NotificationContext.Provider value={value}>
      {children}
      
      {/* Toast Snackbar */}
      <Snackbar
        open={toast.open}
        autoHideDuration={5000}
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        TransitionComponent={SlideTransition}
        onClick={handleToastClick}
        sx={{ cursor: toast.link ? 'pointer' : 'default' }}
      >
        <Alert 
          onClose={handleCloseToast} 
          severity={toast.severity} 
          variant="filled"
          sx={{ 
            minWidth: 300,
            boxShadow: 3,
            '& .MuiAlert-message': { fontWeight: 500 }
          }}
        >
          {toast.title && (
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
              {toast.title}
            </Typography>
          )}
          {toast.message}
        </Alert>
      </Snackbar>
    </NotificationContext.Provider>
  );
};

// Notification Bell Component for Navbar
export const NotificationBell = () => {
  const { notifications, unreadCount, markAllRead } = useNotification();
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  
  const handleItemClick = (notification) => {
      handleClose();
      if (notification.link) {
          navigate(notification.link);
      }
  };

  return (
    <>
      <IconButton onClick={handleClick} sx={{ color: 'inherit' }}>
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{ sx: { width: 320, maxHeight: 400 } }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="subtitle1" fontWeight="bold">Notifications</Typography>
          {unreadCount > 0 && (
            <Typography 
              variant="caption" 
              sx={{ cursor: 'pointer', color: 'primary.main' }}
              onClick={markAllRead}
            >
              Mark all read
            </Typography>
          )}
        </Box>
        <Divider />
        
        {notifications.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography color="text.secondary" variant="body2">No notifications</Typography>
          </Box>
        ) : (
          notifications.slice(0, 10).map((n) => (
            <MenuItem 
              key={n.id} 
              onClick={() => handleItemClick(n)}
              sx={{ 
                whiteSpace: 'normal', 
                bgcolor: n.read ? 'transparent' : 'action.hover',
                borderLeft: n.read ? 'none' : '3px solid',
                borderColor: 'secondary.main',
                cursor: 'pointer'
              }}
            >
              <Box sx={{ py: 0.5 }}>
                {n.title && (
                  <Typography variant="caption" fontWeight="bold" display="block">
                    {n.title}
                  </Typography>
                )}
                <Typography variant="body2">{n.message}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {new Date(n.timestamp).toLocaleTimeString()}
                </Typography>
              </Box>
            </MenuItem>
          ))
        )}
      </Menu>
    </>
  );
};

export default NotificationContext;
