// src/components/HoodieCard.jsx
import React from 'react';
import { Card, CardContent, CardMedia, Typography, Box, Button } from '@mui/material';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';

const HoodieCard = ({ hoodie, onAddToCart }) => {
  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        bgcolor: 'transparent',
        border: '1px solid #333', // Subtle border for definition
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-8px)',
          borderColor: '#FFD700', // Gold border on hover
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)' 
        }
      }}
    >
      <Box sx={{ position: 'relative', overflow: 'hidden' }}>
        <CardMedia
          component="img"
          height="350"
          image={hoodie.image}
          alt={hoodie.name}
          sx={{ objectFit: 'cover', filter: 'brightness(0.9)' }}
        />
        {/* Optional: Overlay tag */}
        <Box sx={{ position: 'absolute', top: 10, right: 10, bgcolor: '#FFD700', color: 'black', px: 1, fontWeight: 'bold', fontSize: '0.8rem' }}>
          NEW
        </Box>
      </Box>

      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', p: 3 }}>
        <Box>
          <Typography gutterBottom variant="h6" component="div" sx={{ mb: 0, fontWeight: 'bold' }}>
            {hoodie.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {hoodie.description}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: '300', color: 'white' }}>
            ${hoodie.price}
          </Typography>
          
          {/* THE BUY BUTTON */}
          <Button 
            variant="contained" 
            color="secondary" 
            size="small"
            startIcon={<ShoppingBagIcon />}
            onClick={() => onAddToCart(hoodie)} // Trigger parent function
            sx={{ 
              fontWeight: 'bold', 
              color: 'black',
              '&:hover': { bgcolor: 'white' }
            }}
          >
            Add
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default HoodieCard;