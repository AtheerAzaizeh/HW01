// src/pages/Products.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import {
  Container, Grid, Typography, Box, FormControl, InputLabel,
  Select, MenuItem, TextField, InputAdornment
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import HoodieCard from '../components/HoodieCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import EmptyState from '../components/common/EmptyState';
import { addItem } from '../store/cartSlice';
import api from '../services/api';
import StorefrontIcon from '@mui/icons-material/Storefront';
import { useNotification } from '../context/NotificationContext';

const Products = () => {
  const dispatch = useDispatch();
  const { notifySuccess } = useNotification();
  const { search: urlSearch } = useLocation();
  const searchParams = new URLSearchParams(urlSearch);
  const initialCategory = searchParams.get('category') || '';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState(initialCategory);
  const [sort, setSort] = useState('');
  const [search, setSearch] = useState('');

  // Update category when URL changes
  useEffect(() => {
    const params = new URLSearchParams(urlSearch);
    const cat = params.get('category');
    if (cat !== null) {
      setCategory(cat);
    }
  }, [urlSearch]);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();
        if (category) params.append('category', category);
        if (sort) params.append('sort', sort);
        if (search) params.append('search', search);

        const response = await api.products.getAll(params.toString());
        setProducts(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    // Debounce search
    const timeoutId = setTimeout(fetchProducts, search ? 500 : 0);
    return () => clearTimeout(timeoutId);
  }, [category, sort, search]);

  const handleAddToCart = (product) => {
    dispatch(addItem({
      id: product._id || product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      description: product.description
    }));

    // Use global notification system
    notifySuccess(`${product.name} added to cart!`, 'Added to Cart');
  };

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box sx={{ mb: 6 }}>
        <Typography 
          variant="h3" 
          sx={{ 
            fontWeight: 800, 
            textTransform: 'uppercase', 
            mb: 2,
            fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3rem' }
          }}
        >
          All Hoodies
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Browse our complete collection of premium hoodies
        </Typography>
      </Box>

      {/* Filters */}
      <Box sx={{ 
        display: 'flex', 
        gap: 2, 
        mb: 4, 
        flexWrap: 'wrap',
        flexDirection: { xs: 'column', sm: 'row' }
      }}>
        <TextField
          placeholder="Search hoodies..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ minWidth: { xs: '100%', sm: 250 }, flex: { xs: 1, sm: 'none' } }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        <FormControl sx={{ minWidth: { xs: '100%', sm: 150 }, flex: { xs: 1, sm: 'none' } }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={category}
            label="Category"
            onChange={(e) => setCategory(e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="pullover">Pullover</MenuItem>
            <MenuItem value="zip-up">Zip-Up</MenuItem>
            <MenuItem value="oversized">Oversized</MenuItem>
            <MenuItem value="premium">Premium</MenuItem>
            <MenuItem value="limited">Limited Edition</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: { xs: '100%', sm: 150 }, flex: { xs: 1, sm: 'none' } }}>
          <InputLabel>Sort By</InputLabel>
          <Select
            value={sort}
            label="Sort By"
            onChange={(e) => setSort(e.target.value)}
          >
            <MenuItem value="">Newest</MenuItem>
            <MenuItem value="price-asc">Price: Low to High</MenuItem>
            <MenuItem value="price-desc">Price: High to Low</MenuItem>
            <MenuItem value="name">Name</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Loading State */}
      {loading && <LoadingSpinner message="Loading products..." />}

      {/* Error State */}
      {error && (
        <ErrorMessage 
          message={error} 
          onRetry={() => window.location.reload()} 
        />
      )}

      {/* Empty State */}
      {!loading && !error && products.length === 0 && (
        <EmptyState
          icon={StorefrontIcon}
          title="No products found"
          message={search ? `No products match "${search}"` : "No products available at the moment."}
        />
      )}

      {/* Products Grid */}
      {!loading && !error && products.length > 0 && (
        <>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Showing {products.length} product{products.length !== 1 ? 's' : ''}
          </Typography>

          <Grid container spacing={4}>
            {products.map((product) => (
              <Grid item key={product._id} xs={12} sm={6} md={4}>
                <HoodieCard
                  hoodie={{
                    id: product._id,
                    name: product.name,
                    price: product.price,
                    description: product.description,
                    image: product.image
                  }}
                  onAddToCart={() => handleAddToCart(product)}
                />
              </Grid>
            ))}
          </Grid>
        </>
      )}

      {/* Notifications are handled globally via NotificationContext */}
    </Container>
  );
};

export default Products;
