// src/components/common/LoadingSpinner.jsx
import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

const LoadingSpinner = ({ message = 'Loading...', size = 60 }) => {
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '40vh',
        gap: 2
      }}
    >
      <CircularProgress size={size} sx={{ color: '#FFD700' }} />
      <Typography variant="body1" color="text.secondary">
        {message}
      </Typography>
    </Box>
  );
};

export default LoadingSpinner;
