import React from 'react';
import { AppBar, Toolbar, Typography, Button, Container, Box, Badge, IconButton } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const location = useLocation();
  const { getCartCount } = useCart();

  const isActive = (path) => location.pathname === path ? 'primary.main' : 'text.secondary';

  return (
    <AppBar position="sticky" color="transparent" elevation={0} sx={{ backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
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

          {/* Links */}
          <Box sx={{ display: 'flex', gap: 4, alignItems: 'center' }}>
            {['Home', 'Contact', 'API'].map((text, index) => {
              const path = index === 0 ? '/' : `/${text.toLowerCase()}`;
              return (
                <Button
                  key={text}
                  component={Link}
                  to={path}
                  sx={{
                    color: isActive(path),
                    fontSize: '0.9rem',
                    '&:hover': { color: 'primary.main' }
                  }}
                >
                  {text}
                </Button>
              );
            })}

            {/* Cart Badge */}
            <IconButton
              component={Link}
              to="/cart"
              sx={{ color: isActive('/cart') === 'primary.main' ? 'primary.main' : 'inherit' }}
            >
              <Badge badgeContent={getCartCount()} color="error">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;