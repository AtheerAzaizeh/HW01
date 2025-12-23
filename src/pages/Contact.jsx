// src/pages/Contact.jsx
import React, { useState } from 'react';
import { 
  Container, TextField, Button, Typography, MenuItem, Box, Grid, 
  Snackbar, Alert 
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';

const Contact = () => {
  // 1. Form State
  const [formData, setFormData] = useState({
    name: '',
    quantity: '',
    subject: 'general',
    message: ''
  });

  // 2. Validation Error State
  const [errors, setErrors] = useState({});

  // 3. Success Notification State (Replaces alert)
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear specific error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validate = () => {
    let tempErrors = {};
    let isValid = true;

    // Requirement: Name > 3 chars
    if (formData.name.length < 3) {
      tempErrors.name = "Name must be at least 3 characters long.";
      isValid = false;
    }

    // Requirement: Quantity must be a number > 0
    if (!formData.quantity || isNaN(formData.quantity) || Number(formData.quantity) <= 0) {
      tempErrors.quantity = "Please enter a valid quantity (e.g., 10, 50).";
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validate()) {
      // 1. Log data as requested
      console.log("Form Data Submitted:", formData);
      
      // 2. Show the Professional UI Message (instead of alert)
      setShowSuccess(true);
      
      // 3. Reset Form
      setFormData({ name: '', quantity: '', subject: 'general', message: '' });
    } else {
      console.log("Validation Failed");
    }
  };

  // Handle closing the success message
  const handleCloseSuccess = (event, reason) => {
    if (reason === 'clickaway') return;
    setShowSuccess(false);
  };

  return (
    <Box sx={{ bgcolor: 'background.default', py: { xs: 5, md: 10 } }}>
      <Container maxWidth="lg">
        
        <Grid container sx={{ boxShadow: '0 20px 40px rgba(0,0,0,0.5)', borderRadius: 0, overflow: 'hidden' }}>
          
          {/* LEFT SIDE: Info Panel */}
          <Grid item xs={12} md={5} sx={{ bgcolor: '#111', color: 'white', p: { xs: 4, md: 6 } }}>
            <Typography variant="h3" sx={{ fontWeight: 800, mb: 2, color: '#FFD700' }}>
              Let's Talk.
            </Typography>
            <Typography variant="body1" sx={{ color: '#aaa', mb: 6 }}>
              Interested in a bulk order or custom design? Fill out the form below.
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
               <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <EmailIcon sx={{ color: '#FFD700' }} />
                <Typography variant="body2" sx={{ color: '#aaa' }}>support@blakv.com</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <LocationOnIcon sx={{ color: '#FFD700' }} />
                <Typography variant="body2" sx={{ color: '#aaa' }}>Ramat Gan</Typography>
              </Box>
            </Box>
          </Grid>

          {/* RIGHT SIDE: Form Panel */}
          <Grid item xs={12} md={7} sx={{ bgcolor: '#1a1a1a', p: { xs: 4, md: 6 } }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 4, color: 'white' }}>
              Bulk / Custom Order
            </Typography>
            
            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              
              <TextField 
                label="Full Name" 
                name="name" 
                variant="filled" 
                fullWidth 
                value={formData.name}
                onChange={handleChange}
                error={!!errors.name}
                helperText={errors.name}
                sx={{ bgcolor: '#222', input: { color: 'white' }, label: { color: '#888' } }}
              />

              <TextField 
                label="Quantity (Number)" 
                name="quantity" 
                type="number" 
                variant="filled" 
                fullWidth 
                value={formData.quantity}
                onChange={handleChange}
                error={!!errors.quantity}
                helperText={errors.quantity}
                sx={{ bgcolor: '#222', input: { color: 'white' }, label: { color: '#888' } }}
              />

              <TextField 
                select 
                label="Topic" 
                name="subject" 
                value={formData.subject} 
                onChange={handleChange} 
                variant="filled" 
                fullWidth
                sx={{ bgcolor: '#222', select: { color: 'white' }, label: { color: '#888' } }}
              >
                <MenuItem value="general">General Inquiry</MenuItem>
                <MenuItem value="order">Order Status</MenuItem>
                <MenuItem value="wholesale">Wholesale / Custom Design</MenuItem>
              </TextField>

              <TextField 
                label="Message" 
                name="message" 
                multiline 
                rows={4} 
                variant="filled" 
                fullWidth 
                value={formData.message}
                onChange={handleChange}
                sx={{ bgcolor: '#222', textarea: { color: 'white' }, label: { color: '#888' } }}
              />

              <Button 
                type="submit" 
                variant="contained" 
                size="large" 
                color="secondary"
                sx={{ mt: 2, py: 1.5, fontWeight: 'bold' }}
              >
                Submit Request
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* --- PROFESSIONAL SUCCESS MESSAGE (SNACKBAR) --- */}
      <Snackbar 
        open={showSuccess} 
        autoHideDuration={6000} 
        onClose={handleCloseSuccess}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} // Position: Bottom Right
      >
        <Alert 
          onClose={handleCloseSuccess} 
          severity="success" 
          variant="filled"
          sx={{ width: '100%', bgcolor: '#FFD700', color: 'black', fontWeight: 'bold' }}
        >
          Message Received! We'll be in touch shortly.
        </Alert>
      </Snackbar>

    </Box>
  );
};

export default Contact;