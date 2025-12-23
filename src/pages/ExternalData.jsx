// src/pages/ExternalData.jsx
import React, { useState, useEffect } from 'react';
import {
  Container, Grid, Typography, CircularProgress, Alert,
  Card, CardMedia, CardContent, Box, Button
} from '@mui/material';
import ReplayIcon from '@mui/icons-material/Replay';

import { useCart } from '../context/CartContext';

const ExternalData = () => {
  // 1. State Management
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true); // Start as true
  const [error, setError] = useState(null);

  const { addToCart } = useCart();

  // 2. Fetch Function
  const fetchProducts = async () => {
    // Reset states before fetching
    setLoading(true);
    setError(null);

    try {
      // Intentionally using a delay (setTimeout) so you can clearly SEE the loading spinner
      // In real life, you don't need setTimeout, but for assignments, it helps show the state.
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Use fetch to call the API
      const response = await fetch("https://fakestoreapi.com/products/category/men's clothing");

      if (!response.ok) {
        throw new Error('Failed to connect to the server.');
      }

      const data = await response.json();
      setProducts(data); // Store data
    } catch (err) {
      setError(err.message); // Store error message
    } finally {
      setLoading(false); // Stop loading regardless of success/fail
    }
  };

  // 3. useEffect to trigger fetch on mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // --- RENDER: LOADING STATE ---
  if (loading) {
    return (
      <Box sx={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
        <CircularProgress size={60} sx={{ color: '#FFD700' }} />
        <Typography variant="h6" sx={{ color: '#888' }}>Loading Collection...</Typography>
      </Box>
    );
  }

  // --- RENDER: ERROR STATE ---
  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 10, textAlign: 'center' }}>
        <Alert severity="error" variant="filled" sx={{ mb: 4, borderRadius: 0 }}>
          Error: {error}
        </Alert>
        <Button
          variant="outlined"
          color="inherit"
          startIcon={<ReplayIcon />}
          onClick={fetchProducts}
          sx={{ color: 'white', borderColor: 'white' }}
        >
          Try Again
        </Button>
      </Container>
    );
  }

  // --- RENDER: SUCCESS STATE (Data Display) ---
  return (
    <Container sx={{ py: 8 }} maxWidth="lg">
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Typography variant="h3" sx={{ fontWeight: 800, textTransform: 'uppercase', mb: 1 }}>
          Global Archive
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Live inventory fetched from External API
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* If you have data, display it using .map() */}
        {products.map((item) => (
          <Grid item key={item.id} xs={12} sm={6} md={3}>
            {/* Proper Key Used Above */}

            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                bgcolor: '#1a1a1a', // Dark card
                borderRadius: 0,
                transition: '0.3s',
                '&:hover': { transform: 'translateY(-5px)' }
              }}
            >
              {/* Image Area */}
              <Box sx={{ bgcolor: 'white', p: 2, height: 250, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CardMedia
                  component="img"
                  image={item.image}
                  alt={item.title}
                  sx={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
                />
              </Box>

              {/* Content Area */}
              <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 'bold', lineHeight: 1.2 }}>
                  {item.title.substring(0, 30)}...
                </Typography>

                <Typography variant="caption" sx={{ color: '#888' }}>
                  Category: {item.category}
                </Typography>

                <Box sx={{ mt: 'auto', pt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6" sx={{ color: '#FFD700' }}>
                    ${item.price}
                  </Typography>
                  <Button
                    size="small"
                    variant="contained"
                    color="secondary"
                    sx={{ color: 'black', fontWeight: 'bold' }}
                    onClick={() => addToCart(item)}
                  >
                    Add +
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ExternalData;