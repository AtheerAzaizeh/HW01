// src/pages/Home.jsx
import React, { useState } from 'react';
import HoodieCard from '../components/HoodieCard';
import { useCart } from '../context/CartContext';
import { Container, Grid, Typography, Box, Button, Snackbar, Alert } from '@mui/material';

const Home = () => {
  // 1. Product Data
  const [hoodies] = useState([
    { id: 1, name: 'ESSENTIALS Black', price: 89.99, description: 'Heavyweight Cotton', image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=800&q=80' },
    { id: 2, name: 'Oversized Concrete', price: 95.00, description: 'Street Fit / Grey', image: 'https://images.unsplash.com/photo-1578768079052-aa76e52ff62e?auto=format&fit=crop&w=800&q=80' },
    { id: 3, name: 'Signature Red', price: 110.00, description: 'Limited Edition', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80' },
    { id: 4, name: 'Midnight Blue', price: 85.00, description: 'Fleece Lined', image: 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=800&q=80' },
  ]);

  // 2. Notification State
  const [toast, setToast] = useState({ open: false, message: '' });

  // 3. Handle Buy Action
  const { addToCart } = useCart();

  const handleAddToCart = (product) => {
    // Add to Global Context
    addToCart(product);

    // Show success message
    setToast({
      open: true,
      message: `${product.name} added to cart!`
    });
  };

  const handleCloseToast = (event, reason) => {
    if (reason === 'clickaway') return;
    setToast({ ...toast, open: false });
  };

  return (
    <Box>
      {/* HERO SECTION */}
      <Box
        sx={{
          height: '80vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          backgroundImage: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.7)), url(https://images.unsplash.com/photo-1523396860166-407c3451e9f5?auto=format&fit=crop&w=1600&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          mb: 8
        }}
      >
        <Container>
          <Typography variant="h2" sx={{ color: 'white', mb: 2, textTransform: 'uppercase', letterSpacing: '0.2em', fontWeight: 900 }}>
            Redefine Comfort
          </Typography>
          <Typography variant="h6" sx={{ color: 'grey.300', mb: 4, fontWeight: 300 }}>
            The FW2025 Collection is here.
          </Typography>
          <Button variant="contained" color="secondary" size="large" sx={{ px: 5, py: 1.5, fontWeight: 'bold', color: 'black' }}>
            Shop Collection
          </Button>
        </Container>
      </Box>

      {/* PRODUCT GRID */}
      <Container maxWidth="lg" sx={{ mb: 10 }}>
        <Typography variant="h4" sx={{ mb: 4, fontWeight: 700, textTransform: 'uppercase', borderLeft: '4px solid #FFD700', pl: 2 }}>
          Latest Drops
        </Typography>

        <Grid container spacing={4}>
          {hoodies.map((hoodie) => (
            <Grid item key={hoodie.id} xs={12} sm={6} md={3}>
              {/* Pass the function to the child component */}
              <HoodieCard
                hoodie={hoodie}
                onAddToCart={handleAddToCart}
              />
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* SUCCESS NOTIFICATION */}
      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseToast}
          severity="success"
          variant="filled"
          sx={{ bgcolor: '#FFD700', color: 'black', fontWeight: 'bold', width: '100%' }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Home;