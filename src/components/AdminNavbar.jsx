// src/components/AdminNavbar.jsx
import React from 'react';
import { 
  AppBar, Toolbar, Typography, Button, Container, Box, 
  Avatar, Menu, MenuItem, Divider, Chip
} from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '../context/AuthContext';

const AdminNavbar = () => {
  const navigate = useNavigate();
  const { user, logout, isSuperAdmin } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar 
      position="sticky" 
      sx={{ 
        bgcolor: '#1a1a1a',
        borderBottom: '2px solid #FFD700'
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
          {/* Brand Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 900,
                letterSpacing: '.1rem',
                color: 'white',
                textTransform: 'uppercase'
              }}
            >
              BLAKV<span style={{ color: '#FFD700' }}>.</span>
            </Typography>
          </Box>

          {/* Admin Info */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                {user?.name}
              </Typography>
              <Typography variant="caption" sx={{ color: '#888' }}>
                {isSuperAdmin ? 'Super Admin' : 'Admin'}
              </Typography>
            </Box>
            
            <Avatar 
              sx={{ 
                bgcolor: '#FFD700', 
                color: 'black',
                fontWeight: 'bold'
              }}
            >
              {user?.name?.charAt(0).toUpperCase()}
            </Avatar>

            <Button
              variant="outlined"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
              sx={{ 
                color: '#ff4444',
                borderColor: '#ff4444',
                '&:hover': { borderColor: '#ff6666', bgcolor: 'rgba(255,68,68,0.1)' }
              }}
            >
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default AdminNavbar;
