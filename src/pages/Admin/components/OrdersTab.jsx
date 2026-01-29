// src/pages/Admin/components/OrdersTab.jsx
import React from 'react';
import {
  Box, Typography, Chip, Paper, Stack,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TextField, MenuItem
} from '@mui/material';
import api from '../../../services/api';

const OrdersTab = ({ orders, isMobile, onRefresh, showToast }) => {
  
  const handleOrderStatus = async (id, status) => {
    try {
      await api.orders.updateStatus(id, status);
      showToast('Order status updated');
      onRefresh();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'success';
      case 'shipped': return 'info';
      case 'processing': return 'primary';
      case 'cancelled': return 'error';
      default: return 'warning';
    }
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      {/* Mobile Card Layout */}
      {isMobile ? (
        <Stack spacing={2}>
          {orders.map((order) => (
            <Paper key={order._id} sx={{ borderRadius: 2, overflow: 'hidden' }}>
              <Box sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', fontFamily: 'monospace' }}>
                      #{order._id.slice(-6).toUpperCase()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </Typography>
                  </Box>
                  <Chip 
                    label={order.status} 
                    color={getStatusColor(order.status)}
                    size="small"
                    sx={{ fontWeight: 'bold' }}
                  />
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, bgcolor: 'background.default', p: 1.5, borderRadius: 1 }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary" display="block">CUSTOMER</Typography>
                    <Typography variant="body2" fontWeight="medium">{order.user?.name || 'Guest'}</Typography>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="caption" color="text.secondary" display="block">TOTAL</Typography>
                    <Typography variant="body1" fontWeight="bold" color="primary.main">
                      ${order.totalPrice?.toFixed(2)}
                    </Typography>
                  </Box>
                </Box>

                <TextField
                  select
                  size="small"
                  value={order.status}
                  onChange={(e) => handleOrderStatus(order._id, e.target.value)}
                  fullWidth
                  label="Update Order Status"
                  variant="outlined"
                >
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="processing">Processing</MenuItem>
                  <MenuItem value="shipped">Shipped</MenuItem>
                  <MenuItem value="delivered">Delivered</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                </TextField>
              </Box>
            </Paper>
          ))}
        </Stack>
      ) : (
        /* Desktop Table Layout */
        <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid', borderColor: 'divider' }}>
          <Table size="medium">
            <TableHead>
              <TableRow>
                <TableCell>Order ID</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Items</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order._id} hover>
                  <TableCell sx={{ fontFamily: 'monospace', fontWeight: 'bold' }}>
                    #{order._id.slice(-6).toUpperCase()}
                  </TableCell>
                  <TableCell>{order.user?.name || order.guestEmail || 'Guest'}</TableCell>
                  <TableCell>{order.items?.length || 0}</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>${order.totalPrice?.toFixed(2)}</TableCell>
                  <TableCell>
                    <Chip label={order.status} color={getStatusColor(order.status)} size="small" />
                  </TableCell>
                  <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <TextField
                      select
                      size="small"
                      value={order.status}
                      onChange={(e) => handleOrderStatus(order._id, e.target.value)}
                      sx={{ minWidth: 130 }}
                    >
                      <MenuItem value="pending">Pending</MenuItem>
                      <MenuItem value="processing">Processing</MenuItem>
                      <MenuItem value="shipped">Shipped</MenuItem>
                      <MenuItem value="delivered">Delivered</MenuItem>
                      <MenuItem value="cancelled">Cancelled</MenuItem>
                    </TextField>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default OrdersTab;
