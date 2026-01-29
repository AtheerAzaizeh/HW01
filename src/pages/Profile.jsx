// src/pages/Profile.jsx
import React, { useState, useEffect } from 'react';
import {
  Container, Box, Typography, Paper, Grid, Chip, Divider,
  List, ListItem, ListItemText, Avatar, Button
} from '@mui/material';
import { Person, ShoppingBag, LocalShipping } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import EmptyState from '../components/common/EmptyState';

const Profile = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.orders.getMyOrders();
        setOrders(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusColor = (status) => {
    const colors = {
      pending: 'warning',
      processing: 'info',
      shipped: 'primary',
      delivered: 'success',
      cancelled: 'error'
    };
    return colors[status] || 'default';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Grid container spacing={4}>
        {/* Profile Info */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 4, bgcolor: 'background.paper', textAlign: 'center' }}>
            <Avatar 
              sx={{ 
                width: 100, 
                height: 100, 
                mx: 'auto', 
                mb: 2,
                bgcolor: '#FFD700',
                color: 'black',
                fontSize: '2.5rem'
              }}
            >
              {user?.name?.charAt(0).toUpperCase()}
            </Avatar>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
              {user?.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {user?.email}
            </Typography>
            {user?.isAdmin && (
              <Chip label="Admin" color="primary" size="small" />
            )}
            <Divider sx={{ my: 3 }} />
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#FFD700' }}>
                  {orders.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Orders
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Orders */}
        <Grid item xs={12} md={8}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
            <ShoppingBag /> Order History
          </Typography>

          {loading && <LoadingSpinner message="Loading orders..." />}
          
          {error && <ErrorMessage message={error} />}

          {!loading && !error && orders.length === 0 && (
            <EmptyState
              icon={LocalShipping}
              title="No orders yet"
              message="When you place orders, they'll appear here."
              actionText="Start Shopping"
              actionLink="/"
            />
          )}

          {!loading && !error && orders.length > 0 && (
            <Paper sx={{ bgcolor: 'background.paper' }}>
              <List disablePadding>
                {orders.map((order, index) => (
                  <React.Fragment key={order._id}>
                    <ListItem sx={{ py: 3, px: 3 }}>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                              Order #{order._id.slice(-8).toUpperCase()}
                            </Typography>
                            <Chip 
                              label={order.status.charAt(0).toUpperCase() + order.status.slice(1)} 
                              color={getStatusColor(order.status)}
                              size="small"
                            />
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              {formatDate(order.createdAt)} • {order.items.length} item(s)
                            </Typography>
                            <Typography variant="h6" sx={{ color: '#FFD700', mt: 1 }}>
                              ${order.totalPrice.toFixed(2)}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < orders.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </Paper>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default Profile;
