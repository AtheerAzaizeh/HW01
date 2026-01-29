// src/pages/Checkout.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Container, Box, Typography, TextField, Button, Paper, Grid,
  Alert, CircularProgress, Divider, List, ListItem, ListItemText,
  ListItemAvatar, Avatar, Chip, Tab, Tabs
} from '@mui/material';
import { LocalShipping, CheckCircle, Person, PersonOff, Discount } from '@mui/icons-material';
import { selectCartItems, clearCart } from '../store/cartSlice';
import { useAuth } from '../context/AuthContext';
import useForm from '../hooks/useForm';
import { shippingValidator, validators } from '../utils/validators';
import api from '../services/api';
import EmptyState from '../components/common/EmptyState';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';

// Member discount percentage
const MEMBER_DISCOUNT = 0.05; // 5%

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useAuth();
  const cartItems = useSelector(selectCartItems);
  const [serverError, setServerError] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [checkoutMode, setCheckoutMode] = useState(isAuthenticated ? 'member' : 'guest');

  // Calculate totals
  const subtotal = cartItems.reduce(
    (sum, item) => sum + parseFloat(item.price) * (item.quantity || 1),
    0
  );
  
  const discount = isAuthenticated && checkoutMode === 'member' ? subtotal * MEMBER_DISCOUNT : 0;
  const totalPrice = subtotal - discount;

  const handlePlaceOrder = async (values) => {
    setServerError('');

    try {
      const orderData = {
        items: cartItems.map(item => ({
          productId: item.id,
          name: item.name || item.title,
          price: item.price,
          quantity: item.quantity || 1,
          image: item.image
        })),
        shippingAddress: values,
        totalPrice: totalPrice,
        isGuest: checkoutMode === 'guest',
        guestEmail: values.email
      };

      // Guest orders go to a different endpoint or don't require auth
      if (checkoutMode === 'guest') {
        // For guest, we'll still create order but without user reference
        await api.orders.createGuest(orderData);
      } else {
        await api.orders.create(orderData);
      }
      
      setOrderSuccess(true);
      dispatch(clearCart());
      
      // Redirect after 3 seconds
      setTimeout(() => {
        navigate(isAuthenticated ? '/profile' : '/');
      }, 3000);
    } catch (err) {
      setServerError(err.message);
    }
  };

  // Extended validation for guest checkout
  const checkoutValidator = (values) => {
    const errors = {};
    if (!values.fullName?.trim()) errors.fullName = 'Full name is required';
    if (!values.address?.trim()) errors.address = 'Address is required';
    if (!values.city?.trim()) errors.city = 'City is required';
    if (!values.postalCode?.trim()) errors.postalCode = 'Postal code is required';
    if (!values.country?.trim()) errors.country = 'Country is required';
    if (checkoutMode === 'guest') {
      if (!values.email?.trim()) errors.email = 'Email is required';
      else if (validators.email(values.email)) errors.email = validators.email(values.email);
      if (!values.phone?.trim()) errors.phone = 'Phone is required';
    }
    return errors;
  };

  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit
  } = useForm(
    { fullName: '', email: '', phone: '', address: '', city: '', postalCode: '', country: '' },
    checkoutValidator,
    handlePlaceOrder
  );

  // Empty cart
  if (cartItems.length === 0 && !orderSuccess) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <EmptyState
          icon={ShoppingBagIcon}
          title="Your cart is empty"
          message="Add some items to your cart before checking out."
          actionText="Continue Shopping"
          actionLink="/"
        />
      </Container>
    );
  }

  // Order success
  if (orderSuccess) {
    return (
      <Container maxWidth="sm" sx={{ py: 8, textAlign: 'center' }}>
        <CheckCircle sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
          Order Placed Successfully!
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Thank you for your order. {isAuthenticated ? "You'll be redirected to your profile shortly." : "A confirmation email will be sent to you."}
        </Typography>
        <Button 
          variant="contained" 
          onClick={() => navigate(isAuthenticated ? '/profile' : '/')}
          sx={{ bgcolor: '#FFD700', color: 'black' }}
        >
          {isAuthenticated ? 'View Orders' : 'Continue Shopping'}
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 4 }}>
        Checkout
      </Typography>

      {/* Checkout Mode Tabs (only show if not logged in) */}
      {!isAuthenticated && (
        <Paper sx={{ mb: 4 }}>
          <Tabs 
            value={checkoutMode} 
            onChange={(e, v) => setCheckoutMode(v)}
            variant="fullWidth"
          >
            <Tab 
              value="guest" 
              label="Guest Checkout" 
              icon={<PersonOff />} 
              iconPosition="start"
            />
            <Tab 
              value="login" 
              label="Login for 5% OFF" 
              icon={<Discount />} 
              iconPosition="start"
              onClick={() => navigate('/login', { state: { from: { pathname: '/checkout' } } })}
            />
          </Tabs>
        </Paper>
      )}

      {/* Member Discount Banner */}
      {isAuthenticated && (
        <Alert 
          severity="success" 
          icon={<Discount />}
          sx={{ mb: 4, bgcolor: 'rgba(255, 215, 0, 0.1)', border: '1px solid #FFD700' }}
        >
          <Typography variant="body2">
            <strong>Member Discount Applied!</strong> You're saving {(MEMBER_DISCOUNT * 100).toFixed(0)}% on this order.
          </Typography>
        </Alert>
      )}

      <Grid container spacing={4}>
        {/* Shipping Form */}
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 4, bgcolor: 'background.paper' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
              <LocalShipping /> Shipping Address
            </Typography>

            {serverError && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {serverError}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                name="fullName"
                label="Full Name"
                value={values.fullName}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.fullName && !!errors.fullName}
                helperText={touched.fullName && errors.fullName}
                disabled={isSubmitting}
                sx={{ mb: 3 }}
              />

              {/* Guest-only fields */}
              {checkoutMode === 'guest' && (
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      name="email"
                      label="Email"
                      type="email"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.email && !!errors.email}
                      helperText={touched.email && errors.email}
                      disabled={isSubmitting}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      name="phone"
                      label="Phone"
                      value={values.phone}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.phone && !!errors.phone}
                      helperText={touched.phone && errors.phone}
                      disabled={isSubmitting}
                    />
                  </Grid>
                </Grid>
              )}

              <TextField
                fullWidth
                name="address"
                label="Street Address"
                value={values.address}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.address && !!errors.address}
                helperText={touched.address && errors.address}
                disabled={isSubmitting}
                sx={{ mb: 3 }}
              />

              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    name="city"
                    label="City"
                    value={values.city}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.city && !!errors.city}
                    helperText={touched.city && errors.city}
                    disabled={isSubmitting}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    name="postalCode"
                    label="Postal Code"
                    value={values.postalCode}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.postalCode && !!errors.postalCode}
                    helperText={touched.postalCode && errors.postalCode}
                    disabled={isSubmitting}
                  />
                </Grid>
              </Grid>

              <TextField
                fullWidth
                name="country"
                label="Country"
                value={values.country}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.country && !!errors.country}
                helperText={touched.country && errors.country}
                disabled={isSubmitting}
                sx={{ mb: 3 }}
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={isSubmitting}
                sx={{ 
                  py: 1.5,
                  bgcolor: '#FFD700', 
                  color: 'black',
                  fontWeight: 'bold',
                  '&:hover': { bgcolor: '#e6c200' }
                }}
              >
                {isSubmitting ? (
                  <CircularProgress size={24} sx={{ color: 'black' }} />
                ) : (
                  `Place Order • $${totalPrice.toFixed(2)}`
                )}
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Order Summary */}
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 4, bgcolor: 'background.paper' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
              Order Summary ({cartItems.length} items)
            </Typography>

            <List disablePadding>
              {cartItems.map((item) => (
                <ListItem key={item.id} sx={{ px: 0 }}>
                  <ListItemAvatar>
                    <Avatar 
                      src={item.image} 
                      variant="rounded"
                      sx={{ width: 60, height: 60, bgcolor: 'white' }}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={item.name || item.title}
                    secondary={`Qty: ${item.quantity || 1}`}
                    sx={{ ml: 2 }}
                  />
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    ${(parseFloat(item.price) * (item.quantity || 1)).toFixed(2)}
                  </Typography>
                </ListItem>
              ))}
            </List>

            <Divider sx={{ my: 3 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography>Subtotal</Typography>
              <Typography>${subtotal.toFixed(2)}</Typography>
            </Box>
            
            {discount > 0 && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography sx={{ color: 'success.main', display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Discount fontSize="small" /> Member Discount (5%)
                </Typography>
                <Typography sx={{ color: 'success.main' }}>-${discount.toFixed(2)}</Typography>
              </Box>
            )}
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography>Shipping</Typography>
              <Typography color="success.main">FREE</Typography>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Total</Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#FFD700' }}>
                ${totalPrice.toFixed(2)}
              </Typography>
            </Box>

            {!isAuthenticated && (
              <Alert severity="info" sx={{ mt: 3 }}>
                <Typography variant="body2">
                  <strong>Create an account</strong> to get 5% off all orders and access live chat support!
                </Typography>
              </Alert>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Checkout;
