// src/pages/Home.jsx
import React, { useState, useMemo } from 'react';
import HoodieCard from '../components/HoodieCard';
import { useDispatch } from 'react-redux';
import { addItem } from '../store/cartSlice';
import useLocalStorage from '../hooks/useLocalStorage';
import useApi from '../hooks/useApi';
import { Container, Grid, Typography, Box, Button, Snackbar, Alert, CircularProgress, Chip } from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';

const Home = () => {
  // Redux: useDispatch for adding to cart
  const dispatch = useDispatch();

  // useLocalStorage: Track recently viewed products
  const [recentlyViewed, setRecentlyViewed] = useLocalStorage('recentlyViewed', []);

  // ===== useApi HOOK (HW3 Requirement) =====
  // Using custom useApi hook instead of manual fetch/useState/useEffect
  const { 
    data: apiResponse, 
    loading, 
    error 
  } = useApi(`${import.meta.env.VITE_API_URL}/products`);

  // Process products from useApi response
  const allProducts = useMemo(() => {
    return apiResponse?.data || [];
  }, [apiResponse]);

  const featuredProducts = useMemo(() => {
    return allProducts.filter(p => p.featured).slice(0, 4);
  }, [allProducts]);

  const products = useMemo(() => {
    return allProducts.filter(p => !p.featured).slice(0, 4);
  }, [allProducts]);

  // Notification State
  const [toast, setToast] = useState({ open: false, message: '' });

  // Handle Buy Action - uses Redux dispatch
  const handleAddToCart = (product) => {
    // Normalize product structure
    const normalizedProduct = {
      id: product._id || product.id,
      name: product.name || product.title,
      title: product.name || product.title,
      price: product.price,
      image: product.image || product.thumbnail,
      description: product.description || product.category
    };

    // Add to Redux store
    dispatch(addItem(normalizedProduct));

    // Track in recently viewed using useLocalStorage
    setRecentlyViewed(prev => {
      const exists = prev.find(p => p.id === normalizedProduct.id);
      if (exists) return prev;
      // Keep only last 5 items
      return [normalizedProduct, ...prev].slice(0, 5);
    });

    // Show success message
    setToast({
      open: true,
      message: `${normalizedProduct.name} added to cart!`
    });
  };

  const handleCloseToast = (event, reason) => {
    if (reason === 'clickaway') return;
    setToast({ ...toast, open: false });
  };

  const clearRecentlyViewed = () => {
    setRecentlyViewed([]);
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
          backgroundImage: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.7)), url(https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=1600&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          mb: 8
        }}
      >
        <Container>
          <Typography variant="h2" sx={{ color: 'white', mb: 2, textTransform: 'uppercase', letterSpacing: '0.2em', fontWeight: 900 }}>
            Premium Hoodies
          </Typography>
          <Typography variant="h6" sx={{ color: 'grey.300', mb: 4, fontWeight: 300 }}>
            The FW2025 Collection is here. Comfort redefined.
          </Typography>
          <Button 
            variant="contained" 
            color="secondary" 
            size="large" 
            href="/products"
            sx={{ px: 5, py: 1.5, fontWeight: 'bold', color: 'black' }}
          >
            Shop Collection
          </Button>
        </Container>
      </Box>

      {/* RECENTLY VIEWED SECTION - uses useLocalStorage */}
      {recentlyViewed.length > 0 && (
        <Container maxWidth="lg" sx={{ mb: 6 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <HistoryIcon sx={{ color: 'secondary.main' }} />
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                Recently Viewed
              </Typography>
            </Box>
            <Button size="small" onClick={clearRecentlyViewed} sx={{ color: 'text.secondary' }}>
              Clear History
            </Button>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 2 }}>
            {recentlyViewed.map((item) => (
              <Chip
                key={item.id}
                label={item.name || item.title}
                variant="outlined"
                sx={{ 
                  color: 'text.primary', 
                  borderColor: 'secondary.main',
                  '&:hover': { bgcolor: 'rgba(255, 215, 0, 0.1)' }
                }}
              />
            ))}
          </Box>
        </Container>
      )}

      {/* Loading State */}
      {loading && (
        <Container maxWidth="lg" sx={{ mb: 10, textAlign: 'center', py: 8 }}>
          <CircularProgress sx={{ color: '#FFD700' }} />
          <Typography sx={{ mt: 2 }} color="text.secondary">Loading products...</Typography>
        </Container>
      )}

      {/* Error State */}
      {error && (
        <Container maxWidth="lg" sx={{ mb: 10 }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
          <Button variant="outlined" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </Container>
      )}

      {/* FEATURED PRODUCTS */}
      {!loading && !error && featuredProducts.length > 0 && (
        <Container maxWidth="lg" sx={{ mb: 10 }}>
          <Typography variant="h4" sx={{ mb: 4, fontWeight: 700, textTransform: 'uppercase', borderLeft: '4px solid #FFD700', pl: 2 }}>
            Featured Products
          </Typography>

          <Grid container spacing={4}>
            {featuredProducts.map((product) => (
              <Grid item key={product._id} xs={12} sm={6} md={3}>
                <HoodieCard
                  hoodie={{
                    id: product._id,
                    name: product.name,
                    price: product.price,
                    description: product.description,
                    image: product.image
                  }}
                  onAddToCart={handleAddToCart}
                />
              </Grid>
            ))}
          </Grid>
        </Container>
      )}

      {/* LATEST DROPS */}
      {!loading && !error && products.length > 0 && (
        <Container maxWidth="lg" sx={{ mb: 10 }}>
          <Typography variant="h4" sx={{ mb: 4, fontWeight: 700, textTransform: 'uppercase', borderLeft: '4px solid #FFD700', pl: 2 }}>
            Latest Drops
          </Typography>

          <Grid container spacing={4}>
            {products.map((product) => (
              <Grid item key={product._id} xs={12} sm={6} md={3}>
                <HoodieCard
                  hoodie={{
                    id: product._id,
                    name: product.name,
                    price: product.price,
                    description: product.description,
                    image: product.image
                  }}
                  onAddToCart={handleAddToCart}
                />
              </Grid>
            ))}
          </Grid>
        </Container>
      )}

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