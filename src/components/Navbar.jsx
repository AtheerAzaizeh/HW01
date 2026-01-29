// src/components/Navbar.jsx
import React, { useState } from 'react';
import { 
  AppBar, Toolbar, Typography, Button, Container, Box, Badge, 
  IconButton, Tooltip, Menu, MenuItem, Avatar, Divider 
} from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { useSelector } from 'react-redux';
import { selectCartCount } from '../store/cartSlice';
import { useAuth } from '../context/AuthContext';
import { NotificationBell } from '../context/NotificationContext';

const Navbar = ({ themeMode, toggleTheme }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  
  const cartCount = useSelector(selectCartCount);
  const [anchorEl, setAnchorEl] = useState(null);

  const isActive = (path) => location.pathname === path ? 'secondary.main' : 'text.secondary';

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate('/');
  };

  return (
    <AppBar 
      position="sticky" 
      color="transparent" 
      elevation={0} 
      sx={{ 
        backdropFilter: 'blur(10px)', 
        borderBottom: '1px solid rgba(255,255,255,0.1)' 
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
          {/* Brand Logo */}
          <Typography
            variant="h5"
            component={Link}
            to="/"
            sx={{
              fontWeight: 900,
              letterSpacing: '.1rem',
              color: 'primary.main',
              textDecoration: 'none',
              textTransform: 'uppercase'
            }}
          >
            BLAKV<span style={{ color: '#FFD700' }}>.</span>
          </Typography>

          {/* Navigation Links */}
          <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
            {[
              { text: 'Home', path: '/' },
              { text: 'Shop', path: '/products' },
              { text: 'API', path: '/api' },
              { text: 'Support', path: '/support' },
              { text: 'Contact', path: '/contact' }
            ].map(({ text, path }) => (
              <Button
                key={text}
                component={Link}
                to={path}
                sx={{
                  color: isActive(path),
                  fontSize: '0.9rem',
                  '&:hover': { color: 'secondary.main' }
                }}
              >
                {text}
              </Button>
            ))}

            {/* Theme Toggle */}
            <Tooltip title={themeMode === 'dark' ? 'Light Mode' : 'Dark Mode'}>
              <IconButton onClick={toggleTheme} sx={{ color: 'inherit' }}>
                {themeMode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>
            </Tooltip>

            {/* Notifications */}
            {isAuthenticated && <NotificationBell />}

            {/* Cart */}
            <IconButton
              component={Link}
              to="/cart"
              sx={{ color: isActive('/cart') === 'secondary.main' ? 'secondary.main' : 'inherit' }}
            >
              <Badge badgeContent={cartCount} color="error">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>


            {/* Auth */}
            {isAuthenticated ? (
              <>
                <IconButton 
                  onClick={handleMenuOpen}
                  sx={{ 
                    ml: 1,
                    border: '2px solid',
                    borderColor: anchorEl ? '#FFD700' : 'transparent'
                  }}
                >
                  <Avatar 
                    sx={{ 
                      width: 32, 
                      height: 32, 
                      bgcolor: '#FFD700', 
                      color: 'black',
                      fontSize: '0.9rem',
                      fontWeight: 'bold'
                    }}
                  >
                    {user?.name?.charAt(0).toUpperCase()}
                  </Avatar>
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                  PaperProps={{
                    sx: { 
                      minWidth: 180,
                      mt: 1,
                      bgcolor: 'background.paper'
                    }
                  }}
                >
                  <Box sx={{ px: 2, py: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                      {user?.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {user?.email}
                    </Typography>
                  </Box>
                  <Divider />
                  <MenuItem 
                    onClick={() => { handleMenuClose(); navigate('/profile'); }}
                  >
                    <PersonIcon sx={{ mr: 1, fontSize: 20 }} />
                    Profile
                  </MenuItem>
                  {isAdmin && (
                    <MenuItem 
                      onClick={() => { handleMenuClose(); navigate('/admin'); }}
                    >
                      <AdminPanelSettingsIcon sx={{ mr: 1, fontSize: 20 }} />
                      Admin Panel
                    </MenuItem>
                  )}
                  <Divider />
                  <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                    <LogoutIcon sx={{ mr: 1, fontSize: 20 }} />
                    Logout
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Button
                component={Link}
                to="/login"
                variant="outlined"
                sx={{ 
                  ml: 1,
                  borderColor: '#FFD700',
                  color: '#FFD700',
                  '&:hover': { 
                    bgcolor: 'rgba(255, 215, 0, 0.1)',
                    borderColor: '#FFD700'
                  }
                }}
              >
                Login
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;