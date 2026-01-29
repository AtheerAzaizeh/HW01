// src/pages/Profile.jsx
import React, { useState, useEffect } from 'react';
import {
  Container, Box, Typography, Paper, Grid, Chip, Divider,
  List, ListItem, ListItemText, Avatar, Button
} from '@mui/material';
import { Person, ShoppingBag, LocalShipping, Edit, Delete, CameraAlt } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import EmptyState from '../components/common/EmptyState';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, 
  IconButton, Stack, Tooltip 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, updateProfile, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Edit Profile State
  const [editOpen, setEditOpen] = useState(false);
  const [formData, setFormData] = useState({ 
    name: '', 
    avatar: '' 
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [updating, setUpdating] = useState(false);

  // Delete Account State
  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        avatar: user.avatar || user.profilePicture || ''
      });
      setPreviewImage(user.avatar || user.profilePicture || null);
    }
  }, [user]);

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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setFormData(prev => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProfile = async () => {
    if (!formData.name.trim()) return;
    setUpdating(true);
    try {
      // Send both field names to ensure backend compatibility
      const updateData = {
        name: formData.name,
        avatar: formData.avatar,
        profilePicture: formData.avatar // Fallback field name
      };
      await updateProfile(updateData);
      setEditOpen(false);
    } catch (err) {
      console.error(err);
      // Ideally show notification
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await api.auth.deleteAccount();
      logout();
      navigate('/');
    } catch (err) {
      console.error('Failed to delete account', err);
      alert(err.message || 'Failed to delete account');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Grid container spacing={4}>
        {/* Profile Info */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 4, bgcolor: 'background.paper', textAlign: 'center', position: 'relative' }}>
            <Box sx={{ position: 'relative', display: 'inline-block' }}>
              <Avatar 
                src={user?.avatar || user?.profilePicture}
                sx={{ 
                  width: 120, 
                  height: 120, 
                  mx: 'auto', 
                  mb: 2,
                  bgcolor: '#FFD700',
                  color: 'black',
                  fontSize: '3rem',
                  border: '4px solid #1a1a1a'
                }}
              >
                {user?.name?.charAt(0).toUpperCase()}
              </Avatar>
              <IconButton 
                sx={{ 
                  position: 'absolute', 
                  bottom: 10, 
                  right: 0, 
                  bgcolor: 'background.paper',
                  border: '1px solid #333',
                  '&:hover': { bgcolor: '#f5f5f5' }
                }}
                onClick={() => setEditOpen(true)}
                size="small"
              >
                <Edit fontSize="small" />
              </IconButton>
            </Box>
            
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 0.5 }}>
              {user?.name}
            </Typography>
            
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {user?.email}
            </Typography>
            
            {user?.isAdmin && (
              <Chip label="Admin" color="primary" size="small" sx={{ mb: 2 }} />
            )}

            <Button 
              variant="outlined" 
              fullWidth 
              startIcon={<Edit />}
              onClick={() => setEditOpen(true)}
              sx={{ mb: 1, borderRadius: 2 }}
            >
              Edit Profile
            </Button>
            
            <Button 
              color="error" 
              fullWidth 
              startIcon={<Delete />}
              onClick={() => setDeleteOpen(true)}
              sx={{ borderRadius: 2 }}
            >
              Delete Account
            </Button>

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
                        primaryTypographyProps={{ component: 'div' }}
                        secondaryTypographyProps={{ component: 'div' }}
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

      {/* Edit Profile Dialog */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: 'center', my: 2 }}>
            <Box sx={{ position: 'relative', display: 'inline-block', mb: 3 }}>
              <Avatar 
                src={previewImage} 
                sx={{ width: 100, height: 100, mx: 'auto', border: '1px solid #333' }}
              />
              <IconButton 
                component="label" 
                sx={{ 
                  position: 'absolute', 
                  bottom: -10, 
                  right: -10, 
                  bgcolor: 'primary.main', 
                  color: 'white',
                  '&:hover': { bgcolor: 'primary.dark' } 
                }}
              >
                <CameraAlt />
                <input hidden accept="image/*" type="file" onChange={handleImageChange} />
              </IconButton>
            </Box>
            <TextField
              fullWidth
              label="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              variant="outlined"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button onClick={handleUpdateProfile} variant="contained" disabled={updating}>
            {updating ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Account Dialog */}
      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <DialogTitle sx={{ color: 'error.main' }}>Delete Account?</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete your account? This action cannot be undone and you will lose all your order history.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteAccount} color="error" variant="contained">
            Delete Permanently
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Profile;
