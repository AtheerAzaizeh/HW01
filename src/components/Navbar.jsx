// src/components/Navbar.jsx
import React, { useState } from 'react';
import { 
  AppBar, Toolbar, Typography, Button, Container, Box, Badge, 
  IconButton, Tooltip, Menu, MenuItem, Avatar, Divider,
  Drawer, List, ListItem, ListItemButton, ListItemText, ListItemIcon
} from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import HomeIcon from '@mui/icons-material/Home';
import StorefrontIcon from '@mui/icons-material/Storefront';
import ApiIcon from '@mui/icons-material/Api';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import ContactMailIcon from '@mui/icons-material/ContactMail';
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
  const [mobileOpen, setMobileOpen] = useState(false);

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
    setMobileOpen(false);
    navigate('/');
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navItems = [
    { text: 'Home', path: '/', icon: <HomeIcon /> },
    { text: 'Shop', path: '/products', icon: <StorefrontIcon /> },
    { text: 'API', path: '/api', icon: <ApiIcon /> },
    { text: 'Support', path: '/support', icon: <SupportAgentIcon /> },
    { text: 'Contact', path: '/contact', icon: <ContactMailIcon /> }
  ];

  // Mobile Drawer Content
  const drawer = (
    <Box sx={{ width: 280, bgcolor: 'background.default', height: '100%' }}>
      {/* Drawer Header */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        p: 2,
        borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}>
        <Typography variant="h6" sx={{ fontWeight: 900, color: 'primary.main' }}>
          BLAKV<span style={{ color: '#FFD700' }}>.</span>
        </Typography>
        <IconButton onClick={handleDrawerToggle} sx={{ color: 'text.primary' }}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Navigation Links */}
      <List sx={{ py: 2 }}>
        {navItems.map(({ text, path, icon }) => (
          <ListItem key={text} disablePadding>
            <ListItemButton
              component={Link}
              to={path}
              onClick={handleDrawerToggle}
              selected={location.pathname === path}
              sx={{
                py: 1.5,
                '&.Mui-selected': {
                  bgcolor: 'rgba(255, 215, 0, 0.1)',
                  borderRight: '3px solid #FFD700',
                  '& .MuiListItemIcon-root': { color: '#FFD700' },
                  '& .MuiListItemText-primary': { color: '#FFD700', fontWeight: 'bold' }
                },
                '&:hover': {
                  bgcolor: 'rgba(255, 215, 0, 0.05)'
                }
              }}
            >
              <ListItemIcon sx={{ color: 'text.secondary', minWidth: 40 }}>
                {icon}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />

      {/* Auth Section in Drawer */}
      <Box sx={{ p: 2 }}>
        {isAuthenticated ? (
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Avatar src={user?.avatar} sx={{ bgcolor: '#FFD700', color: 'black', fontWeight: 'bold' }}>
                {user?.name?.charAt(0).toUpperCase()}
              </Avatar>
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                  {user?.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {user?.email}
                </Typography>
              </Box>
            </Box>
            <List dense>
              <ListItem disablePadding>
                <ListItemButton 
                  onClick={() => { handleDrawerToggle(); navigate('/profile'); }}
                  sx={{ borderRadius: 1 }}
                >
                  <ListItemIcon sx={{ minWidth: 36 }}><PersonIcon fontSize="small" /></ListItemIcon>
                  <ListItemText primary="Profile" />
                </ListItemButton>
              </ListItem>
              {isAdmin && (
                <ListItem disablePadding>
                  <ListItemButton 
                    onClick={() => { handleDrawerToggle(); navigate('/admin'); }}
                    sx={{ borderRadius: 1 }}
                  >
                    <ListItemIcon sx={{ minWidth: 36 }}><AdminPanelSettingsIcon fontSize="small" /></ListItemIcon>
                    <ListItemText primary="Admin Panel" />
                  </ListItemButton>
                </ListItem>
              )}
              <ListItem disablePadding>
                <ListItemButton 
                  onClick={handleLogout}
                  sx={{ borderRadius: 1, color: 'error.main' }}
                >
                  <ListItemIcon sx={{ minWidth: 36, color: 'error.main' }}><LogoutIcon fontSize="small" /></ListItemIcon>
                  <ListItemText primary="Logout" />
                </ListItemButton>
              </ListItem>
            </List>
          </Box>
        ) : (
          <Button
            component={Link}
            to="/login"
            variant="contained"
            fullWidth
            onClick={handleDrawerToggle}
            sx={{ 
              bgcolor: '#FFD700',
              color: 'black',
              fontWeight: 'bold',
              '&:hover': { bgcolor: '#e6c200' }
            }}
          >
            Login / Register
          </Button>
        )}
      </Box>
    </Box>
  );

  return (
    <>
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

            {/* Desktop Navigation Links - Hidden on mobile */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 3, alignItems: 'center' }}>
              {navItems.map(({ text, path }) => (
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
                      src={user?.avatar}
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

            {/* Mobile Navigation Icons */}
            <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', gap: 1 }}>
              {/* Theme Toggle - Mobile */}
              <IconButton onClick={toggleTheme} sx={{ color: 'inherit' }} size="small">
                {themeMode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>

              {/* Cart - Mobile */}
              <IconButton
                component={Link}
                to="/cart"
                sx={{ color: 'inherit' }}
                size="small"
              >
                <Badge badgeContent={cartCount} color="error">
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>

              {/* Hamburger Menu */}
              <IconButton
                onClick={handleDrawerToggle}
                sx={{ 
                  color: 'inherit',
                  ml: 0.5
                }}
              >
                <MenuIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: 280,
            bgcolor: 'background.default'
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Navbar;