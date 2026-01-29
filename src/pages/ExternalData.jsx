// src/pages/ExternalData.jsx
// External API Integration - Fetches hoodie products from external sources
// Uses JSONPlaceholder-style external JSON hosting

import React, { useState, useEffect } from 'react';
import {
  Container, Grid, Typography, CircularProgress, Alert,
  Card, CardMedia, CardContent, Box, Button, Chip
} from '@mui/material';
import ReplayIcon from '@mui/icons-material/Replay';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useDispatch, useSelector } from 'react-redux';
import { addItem, selectCartItems } from '../store/cartSlice';

// External Hoodie Data - This comes from a GitHub Gist (real external URL)
// This simulates fetching from an external hoodie store API
const EXTERNAL_HOODIES_URL = 'https://gist.githubusercontent.com/AtheerAl/hoodie-api/main/hoodies.json';

// Fallback hoodie data (in case external fails - still demonstrates the fetch pattern)
const HOODIE_DATA = [
  {
    id: 'hoodie-001',
    title: 'Classic Black Pullover Hoodie',
    description: 'Premium cotton blend hoodie in classic black. This comfortable hoodie features a kangaroo pocket and adjustable drawstring hood.',
    price: 59.99,
    images: ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400'],
    category: { name: 'Hoodies' }
  },
  {
    id: 'hoodie-002',
    title: 'Grey Athletic Hoodie',
    description: 'Soft grey hoodie perfect for workouts or casual wear. This hoodie offers warmth and style with modern design.',
    price: 49.99,
    images: ['https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?w=400'],
    category: { name: 'Hoodies' }
  },
  {
    id: 'hoodie-003',
    title: 'Navy Blue Zip-Up Hoodie',
    description: 'Full zip hoodie in navy blue. This versatile hoodie features side pockets and premium finish.',
    price: 69.99,
    images: ['https://images.unsplash.com/photo-1578681994506-b8f463449011?w=400'],
    category: { name: 'Hoodies' }
  },
  {
    id: 'hoodie-004',
    title: 'Oversized Streetwear Hoodie',
    description: 'Trendy oversized hoodie for streetwear fashion. This hoodie combines comfort with urban style.',
    price: 79.99,
    images: ['https://images.unsplash.com/photo-1509942774463-acf339cf87d5?w=400'],
    category: { name: 'Hoodies' }
  },
  {
    id: 'hoodie-005',
    title: 'White Minimalist Hoodie',
    description: 'Clean white hoodie with minimal design aesthetic. A must-have hoodie for any wardrobe.',
    price: 54.99,
    images: ['https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400'],
    category: { name: 'Hoodies' }
  },
  {
    id: 'hoodie-006',
    title: 'Vintage Washed Hoodie',
    description: 'Vintage-style washed hoodie with distressed look. This unique hoodie has retro appeal.',
    price: 64.99,
    images: ['https://images.unsplash.com/photo-1542406775-ade58c52d2e4?w=400'],
    category: { name: 'Hoodies' }
  },
  {
    id: 'hoodie-007',
    title: 'Performance Sport Hoodie',
    description: 'Lightweight performance hoodie for sports and training. Moisture-wicking hoodie fabric.',
    price: 74.99,
    images: ['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400'],
    category: { name: 'Hoodies' }
  },
  {
    id: 'hoodie-008',
    title: 'Cropped Fashion Hoodie',
    description: 'Stylish cropped hoodie with modern fit. Perfect hoodie for layering.',
    price: 44.99,
    images: ['https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400'],
    category: { name: 'Hoodies' }
  }
];

const ExternalData = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [apiSource, setApiSource] = useState('');

  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);

  // Fetch hoodies from external source
  const fetchHoodies = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Call our backend scraping endpoint
      const response = await fetch(`${import.meta.env.VITE_API_URL}/external/scrape`);
      const data = await response.json();
      
      if (data.success && Array.isArray(data.data)) {
          setProducts(data.data);
          setApiSource('Live eBay Data (Scraped)');
      } else {
          throw new Error(data.message || 'Failed to load data');
      }
    } catch (err) {
      console.error('Scraping failed:', err);
      // Fallback: Use static hoodie data
      setProducts(HOODIE_DATA);
      setApiSource('Fallback Data (Scraping Failed - Check Server/Python)');
      setError('Could not scrape live data. Showing fallback.');
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchHoodies();
  }, []);

  const isInCart = (productId) => {
    return cartItems.some(item => item.id === productId);
  };

  const handleAddToCart = (item) => {
    dispatch(addItem({
      id: item.id,
      name: item.title,
      title: item.title,
      price: item.price,
      image: item.images?.[0],
      category: item.category?.name || 'Hoodies'
    }));
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
        <CircularProgress size={60} sx={{ color: '#FFD700' }} />
        <Typography variant="h6" sx={{ color: 'text.secondary' }}>Fetching Hoodies from External API...</Typography>
      </Box>
    );
  }

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
          onClick={fetchHoodies}
          sx={{ color: 'text.primary', borderColor: 'text.primary' }}
        >
          Try Again
        </Button>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 8 }} maxWidth="lg">
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Typography variant="h3" sx={{ fontWeight: 800, textTransform: 'uppercase', mb: 1 }}>
          External Hoodies Store
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
          Products fetched from <strong>{apiSource}</strong>
        </Typography>
        <Typography variant="caption" color="text.disabled" display="block">
          Filtered: Only products with "hoodie" in description
        </Typography>

        <Box sx={{ mt: 2 }}>
          <Button
            variant="outlined"
            startIcon={<ReplayIcon />}
            onClick={fetchHoodies}
            sx={{ color: 'text.secondary', borderColor: 'text.secondary' }}
          >
            Refresh Data
          </Button>
        </Box>

        <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
          Found {products.length} hoodies from external store
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {products.map((item) => (
          <Grid item key={item.id} xs={12} sm={6} md={3}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                bgcolor: 'background.paper',
                borderRadius: 0,
                transition: '0.3s',
                '&:hover': { transform: 'translateY(-5px)' }
              }}
            >
              <Box sx={{ bgcolor: 'white', p: 2, height: 250, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CardMedia
                  component="img"
                  image={item.images?.[0]}
                  alt={item.title}
                  onError={(e) => { e.target.style.display = 'none'; }}
                  sx={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'cover', borderRadius: 1 }}
                />
              </Box>

              <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="subtitle1" sx={{ color: 'text.primary', fontWeight: 'bold', lineHeight: 1.2 }}>
                  {item.title}
                </Typography>

                <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                  <Chip 
                    label="Hoodie" 
                    size="small" 
                    color="primary"
                    variant="outlined"
                  />
                  {item.source && (
                    <Chip 
                      label={item.source} 
                      size="small" 
                      color="secondary"
                      sx={{ fontWeight: 'bold' }}
                    />
                  )}
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem', mb: 1 }}>
                  {item.description}
                </Typography>
                
                {item.link && item.link !== '#' && (
                    <Button 
                        href={item.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        size="small"
                        sx={{ textTransform: 'none', justifyContent: 'flex-start', p: 0, minWidth: 0 }}
                    >
                        View on Site ↗
                    </Button>
                )}

                <Box sx={{ mt: 'auto', pt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6" sx={{ color: 'secondary.main' }}>
                    ${item.price}
                  </Typography>
                  
                  {isInCart(item.id) ? (
                    <Chip
                      icon={<CheckCircleIcon />}
                      label="In Cart"
                      color="success"
                      size="small"
                      variant="outlined"
                    />
                  ) : (
                    <Button
                      size="small"
                      variant="contained"
                      color="secondary"
                      sx={{ color: 'black', fontWeight: 'bold' }}
                      onClick={() => handleAddToCart(item)}
                    >
                      Add +
                    </Button>
                  )}
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
