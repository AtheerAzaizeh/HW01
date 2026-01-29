// src/components/common/EmptyState.jsx
import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const EmptyState = ({ 
  icon: Icon, 
  title, 
  message, 
  actionText, 
  actionLink,
  onAction 
}) => {
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        minHeight: '40vh',
        textAlign: 'center',
        gap: 2,
        py: 4
      }}
    >
      {Icon && (
        <Icon sx={{ fontSize: 80, color: 'text.secondary', opacity: 0.5 }} />
      )}
      <Typography variant="h5" color="text.secondary">
        {title}
      </Typography>
      {message && (
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 400 }}>
          {message}
        </Typography>
      )}
      {actionText && (actionLink || onAction) && (
        <Button
          variant="contained"
          color="secondary"
          component={actionLink ? Link : 'button'}
          to={actionLink}
          onClick={onAction}
          sx={{ mt: 2, color: 'black', fontWeight: 'bold' }}
        >
          {actionText}
        </Button>
      )}
    </Box>
  );
};

export default EmptyState;
