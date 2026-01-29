// src/pages/Admin/components/UsersTab.jsx
import React, { useState } from 'react';
import {
  Box, Typography, Chip, Paper, Stack, IconButton, Avatar, Button,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TextField, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions,
  Divider, Fab
} from '@mui/material';
import { Delete, Add } from '@mui/icons-material';
import api from '../../../services/api';
import useForm from '../../../hooks/useForm';

const UsersTab = ({ users, isMobile, onRefresh, showToast }) => {
  const [adminDialog, setAdminDialog] = useState(false);

  // Admin form
  const adminForm = useForm(
    { name: '', email: '', password: '' },
    null,
    async (values) => {
      try {
        await api.users.createAdmin(values);
        showToast('Admin created successfully');
        setAdminDialog(false);
        adminForm.resetForm();
        onRefresh();
      } catch (err) {
        showToast(err.message, 'error');
      }
    }
  );

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await api.users.delete(id);
      showToast('User deleted');
      onRefresh();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.users.updateRole(userId, newRole);
      showToast('User role updated');
      onRefresh();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'superadmin': return 'error';
      case 'admin': return 'warning';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      {isMobile ? (
        <Fab 
          color="primary" 
          aria-label="add admin" 
          onClick={() => setAdminDialog(true)}
          sx={{ position: 'fixed', bottom: 24, right: 24, bgcolor: '#FFD700', color: 'black', zIndex: 1000 }}
        >
          <Add />
        </Fab>
      ) : (
        <Button 
          variant="contained" 
          startIcon={<Add />}
          onClick={() => setAdminDialog(true)}
          sx={{ mb: 3, bgcolor: '#FFD700', color: 'black' }}
        >
          Create Admin
        </Button>
      )}

      {/* Mobile Card Layout */}
      {isMobile ? (
        <Stack spacing={2}>
          {users.map((u) => (
            <Paper key={u._id} sx={{ borderRadius: 2, overflow: 'hidden' }}>
              <Box sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Avatar sx={{ bgcolor: '#FFD700', color: 'black' }}>
                    {u.name?.charAt(0).toUpperCase()}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle1" fontWeight="bold">{u.name}</Typography>
                    <Typography variant="body2" color="text.secondary">{u.email}</Typography>
                  </Box>
                  <Chip label={u.role} color={getRoleColor(u.role)} size="small" />
                </Box>
                
                <TextField
                  select
                  size="small"
                  value={u.role}
                  onChange={(e) => handleRoleChange(u._id, e.target.value)}
                  fullWidth
                  label="Change Role"
                  disabled={u.role === 'superadmin'}
                >
                  <MenuItem value="user">User</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                </TextField>
              </Box>
              <Divider />
              <Button 
                fullWidth 
                startIcon={<Delete />} 
                color="error" 
                onClick={() => handleDeleteUser(u._id)}
                sx={{ py: 1.5, borderRadius: 0 }}
                disabled={u.role === 'superadmin'}
              >
                Delete User
              </Button>
            </Paper>
          ))}
        </Stack>
      ) : (
        /* Desktop Table Layout */
        <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid', borderColor: 'divider' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Change Role</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u._id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ bgcolor: '#FFD700', color: 'black' }}>
                        {u.name?.charAt(0).toUpperCase()}
                      </Avatar>
                      {u.name}
                    </Box>
                  </TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>
                    <Chip label={u.role} color={getRoleColor(u.role)} size="small" />
                  </TableCell>
                  <TableCell>
                    <TextField
                      select
                      size="small"
                      value={u.role}
                      onChange={(e) => handleRoleChange(u._id, e.target.value)}
                      sx={{ minWidth: 100 }}
                      disabled={u.role === 'superadmin'}
                    >
                      <MenuItem value="user">User</MenuItem>
                      <MenuItem value="admin">Admin</MenuItem>
                    </TextField>
                  </TableCell>
                  <TableCell>
                    <IconButton 
                      color="error" 
                      onClick={() => handleDeleteUser(u._id)}
                      disabled={u.role === 'superadmin'}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Create Admin Dialog */}
      <Dialog open={adminDialog} onClose={() => setAdminDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create Admin Account</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <TextField label="Name" name="name" value={adminForm.values.name} onChange={adminForm.handleChange} fullWidth required />
            <TextField label="Email" name="email" type="email" value={adminForm.values.email} onChange={adminForm.handleChange} fullWidth required />
            <TextField label="Password" name="password" type="password" value={adminForm.values.password} onChange={adminForm.handleChange} fullWidth required />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAdminDialog(false)}>Cancel</Button>
          <Button onClick={adminForm.handleSubmit} variant="contained" sx={{ bgcolor: '#FFD700', color: 'black' }}>
            Create Admin
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UsersTab;
