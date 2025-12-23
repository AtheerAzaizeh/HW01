// src/components/Footer.jsx
import React from 'react';
import { Box, Typography, Container, Grid, TextField, Button, IconButton, Divider } from '@mui/material';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import YouTubeIcon from '@mui/icons-material/YouTube';

const Footer = () => {
  return (
    <Box component="footer" sx={{ bgcolor: '#000', color: 'white', py: 8, mt: 'auto', borderTop: '1px solid #222' }}>
      <Container maxWidth="lg">
        <Grid container spacing={8}>
          
          {/* Brand Column */}
          <Grid item xs={12} md={4}>
            <Typography variant="h5" sx={{ fontWeight: 900, letterSpacing: '.1rem', mb: 2 }}>
              BLAKV<span style={{ color: '#FFD700' }}>.</span>
            </Typography>
            <Typography variant="body2" sx={{ color: '#888', mb: 3, lineHeight: 1.8 }}>
              Redefining streetwear with premium cuts and heavy fabrics. 
              Designed in Daburiyya, worn globally.
            </Typography>
            <Box>
              <IconButton sx={{ color: '#fff' }}><InstagramIcon /></IconButton>
              <IconButton sx={{ color: '#fff' }}><TwitterIcon /></IconButton>
              <IconButton sx={{ color: '#fff' }}><YouTubeIcon /></IconButton>
            </Box>
          </Grid>

          {/* Shop Links */}
          <Grid item xs={6} md={2}>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', textTransform: 'uppercase', mb: 3, color: '#FFD700' }}>
              Shop
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {['New Arrivals', 'Best Sellers', 'Hoodies', 'Accessories', 'Gift Cards'].map((link) => (
                <Typography key={link} variant="body2" sx={{ color: '#aaa', cursor: 'pointer', '&:hover': { color: '#fff' } }}>
                  {link}
                </Typography>
              ))}
            </Box>
          </Grid>

          {/* Support Links */}
          <Grid item xs={6} md={2}>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', textTransform: 'uppercase', mb: 3, color: '#FFD700' }}>
              Support
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {['Help Center', 'Shipping Info', 'Returns', 'Size Guide', 'Contact Us'].map((link) => (
                <Typography key={link} variant="body2" sx={{ color: '#aaa', cursor: 'pointer', '&:hover': { color: '#fff' } }}>
                  {link}
                </Typography>
              ))}
            </Box>
          </Grid>

          {/* Newsletter */}
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', textTransform: 'uppercase', mb: 3, color: '#FFD700' }}>
              Stay in the loop
            </Typography>
            <Typography variant="body2" sx={{ color: '#888', mb: 2 }}>
              Subscribe for exclusive drops and early access.
            </Typography>
            <Box component="form" sx={{ display: 'flex', gap: 1 }}>
              <TextField 
                variant="outlined" 
                placeholder="Enter your email" 
                size="small" 
                fullWidth
                sx={{ 
                  bgcolor: '#1a1a1a', 
                  input: { color: 'white' },
                  '& fieldset': { borderColor: '#333' }
                }} 
              />
              <Button variant="contained" color="secondary" sx={{ minWidth: '100px' }}>
                Join
              </Button>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ borderColor: '#222', my: 6 }} />

        {/* Bottom Bar */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
          <Typography variant="caption" sx={{ color: '#666' }}>
            © 2025 BLAKV Hoodies. All rights reserved.
          </Typography>
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Typography variant="caption" sx={{ color: '#666', cursor: 'pointer' }}>Privacy Policy</Typography>
            <Typography variant="caption" sx={{ color: '#666', cursor: 'pointer' }}>Terms of Service</Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;