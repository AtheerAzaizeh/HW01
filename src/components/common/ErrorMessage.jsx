// src/components/common/ErrorMessage.jsx
import React from 'react';
import { Alert, Box, Button } from '@mui/material';
import ReplayIcon from '@mui/icons-material/Replay';

const ErrorMessage = ({ message, onRetry = null }) => {
  return (
    <Box sx={{ my: 4, textAlign: 'center' }}>
      <Alert 
        severity="error" 
        variant="filled" 
        sx={{ 
          mb: 2, 
          borderRadius: 1,
          justifyContent: 'center'
        }}
      >
        {message || 'An error occurred. Please try again.'}
      </Alert>
      {onRetry && (
        <Button
          variant="outlined"
          startIcon={<ReplayIcon />}
          onClick={onRetry}
          sx={{ color: 'text.primary', borderColor: 'text.secondary' }}
        >
          Try Again
        </Button>
      )}
    </Box>
  );
};

export default ErrorMessage;
