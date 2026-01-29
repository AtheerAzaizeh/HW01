// src/components/HoodieCard.jsx
import React from 'react';
import { Card, CardContent, CardMedia, Typography, Box, Button } from '@mui/material';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';

const HoodieCard = ({ hoodie, onAddToCart }) => {
  return (
    <Card 
      sx={{ 
        height: '100%',
        minHeight: { xs: 420, sm: 460, md: 480 }, // Fixed minimum height for consistency
        display: 'flex', 
        flexDirection: 'column',
        bgcolor: '#0a0a0a',
        border: '1px solid #222',
        borderRadius: 2,
        overflow: 'hidden',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'translateY(-8px)',
          borderColor: '#FFD700',
          boxShadow: '0 20px 40px rgba(0,0,0,0.4), 0 0 20px rgba(255,215,0,0.1)'
        }
      }}
    >
      {/* Image Container - Fixed Height */}
      <Box sx={{ position: 'relative', overflow: 'hidden', flexShrink: 0 }}>
        <CardMedia
          component="img"
          sx={{ 
            height: { xs: 220, sm: 260, md: 280 },
            objectFit: 'cover',
            transition: 'transform 0.4s ease',
            '&:hover': {
              transform: 'scale(1.05)'
            }
          }}
          image={hoodie.image}
          alt={hoodie.name}
        />
        {/* Badge */}
        <Box 
          sx={{ 
            position: 'absolute', 
            top: 12, 
            right: 12, 
            bgcolor: '#FFD700', 
            color: 'black', 
            px: 1.5,
            py: 0.5,
            borderRadius: 1,
            fontWeight: 700, 
            fontSize: '0.7rem',
            letterSpacing: '0.5px',
            textTransform: 'uppercase'
          }}
        >
          NEW
        </Box>
      </Box>

      {/* Content Container - Flexbox for consistent alignment */}
      <CardContent 
        sx={{ 
          flexGrow: 1, 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'space-between', 
          p: 2.5,
          '&:last-child': { pb: 2.5 }
        }}
      >
        {/* Text Area - Fixed Height */}
        <Box sx={{ flexGrow: 1, mb: 2 }}>
          <Typography 
            variant="subtitle1" 
            component="h3" 
            sx={{ 
              fontWeight: 700,
              fontSize: { xs: '0.95rem', md: '1rem' },
              lineHeight: 1.3,
              mb: 1,
              display: '-webkit-box',
              overflow: 'hidden',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 1,
              minHeight: '1.3em'
            }}
          >
            {hoodie.name}
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              color: 'text.secondary',
              fontSize: '0.8rem',
              lineHeight: 1.5,
              display: '-webkit-box',
              overflow: 'hidden',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 2,
              minHeight: '2.4em'
            }}
          >
            {hoodie.description}
          </Typography>
        </Box>

        {/* Price and Button - Always at bottom */}
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            pt: 2,
            borderTop: '1px solid #1a1a1a'
          }}
        >
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 600, 
              color: '#FFD700',
              fontSize: { xs: '1.1rem', md: '1.25rem' }
            }}
          >
            ${hoodie.price}
          </Typography>
          
          <Button 
            variant="contained" 
            size="small"
            startIcon={<ShoppingBagIcon sx={{ fontSize: '1rem !important' }} />}
            onClick={() => onAddToCart(hoodie)}
            sx={{ 
              fontWeight: 600,
              fontSize: '0.75rem',
              px: 2,
              py: 1,
              bgcolor: '#FFD700',
              color: 'black',
              borderRadius: 1.5,
              textTransform: 'none',
              '&:hover': { 
                bgcolor: '#fff',
                transform: 'scale(1.02)'
              }
            }}
          >
            Add to Cart
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default HoodieCard;