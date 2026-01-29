// src/pages/Cart.jsx
import React from 'react';
import { Container, Typography, Box, List, ListItem, ListItemText, ListItemAvatar, Avatar, IconButton, Button, Paper, Divider, Chip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectCartItems, selectLastUpdated, removeItem, clearCart, updateQuantity } from '../store/cartSlice';
import { useNotification } from '../context/NotificationContext';

const Cart = () => {
    const { notifySuccess, notifyWarning } = useNotification();
    
    // Redux: useSelector to get cart items and last updated timestamp
    const cartItems = useSelector(selectCartItems);
    const lastUpdated = useSelector(selectLastUpdated);
    
    // Redux: useDispatch for cart actions
    const dispatch = useDispatch();

    // Calculate total price
    const totalPrice = cartItems.reduce((acc, item) => acc + (parseFloat(item.price) || 0) * (item.quantity || 1), 0);
    const totalItems = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);

    // Handle quantity change
    const handleQuantityChange = (id, delta) => {
        const item = cartItems.find(i => i.id === id);
        if (item) {
            const newQuantity = (item.quantity || 1) + delta;
            if (newQuantity < 1) {
                dispatch(removeItem(id));
                notifySuccess(`${item.name || item.title} removed from cart`, 'Item Removed');
            } else {
                dispatch(updateQuantity({ id, quantity: newQuantity }));
            }
        }
    };

    // Handle remove item
    const handleRemoveItem = (item) => {
        dispatch(removeItem(item.id));
        notifySuccess(`${item.name || item.title} removed from cart`, 'Item Removed');
    };

    // Handle clear cart
    const handleClearCart = () => {
        dispatch(clearCart());
        notifyWarning('All items have been removed', 'Cart Cleared');
    };

    if (cartItems.length === 0) {
        return (
            <Box sx={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                <ShoppingBagIcon sx={{ fontSize: 60, color: 'text.secondary', opacity: 0.5 }} />
                <Typography variant="h5" sx={{ color: 'text.secondary' }}>
                    Your cart is empty
                </Typography>
                <Button variant="contained" component={Link} to="/" sx={{ mt: 2 }}>
                    Start Shopping
                </Button>
            </Box>
        );
    }

    return (
        <Container maxWidth="md" sx={{ py: 8 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    Your Cart ({totalItems} items)
                </Typography>
                {lastUpdated && (
                    <Chip 
                        label={`Last updated: ${new Date(lastUpdated).toLocaleTimeString()}`}
                        size="small"
                        variant="outlined"
                        sx={{ color: 'text.secondary' }}
                    />
                )}
            </Box>

            <Paper elevation={0} sx={{ bgcolor: 'background.paper', borderRadius: 2, overflow: 'hidden' }}>
                <List sx={{ p: 0 }}>
                    {cartItems.map((item, index) => (
                        <React.Fragment key={`${item.id}-${index}`}>
                            <ListItem
                                disableGutters
                                sx={{ 
                                    p: 3,
                                    flexDirection: { xs: 'column', sm: 'row' },
                                    alignItems: { xs: 'flex-start', sm: 'center' },
                                    gap: 2
                                }}
                            >
                                <Box sx={{ display: 'flex', width: '100%', alignItems: 'center' }}>
                                    <ListItemAvatar sx={{ mr: 2 }}>
                                        <Avatar
                                            src={item.image}
                                            alt={item.name || item.title}
                                            variant="rounded"
                                            sx={{ width: 80, height: 80, bgcolor: 'white' }}
                                        />
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={
                                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                                {item.name || item.title}
                                            </Typography>
                                        }
                                        secondary={
                                            <Box>
                                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                                    ${item.price} × {item.quantity || 1}
                                                </Typography>
                                                <Typography variant="body1" sx={{ color: 'secondary.main', mt: 0.5, fontWeight: 'bold' }}>
                                                    ${(parseFloat(item.price) * (item.quantity || 1)).toFixed(2)}
                                                </Typography>
                                            </Box>
                                        }
                                        secondaryTypographyProps={{ component: 'div' }}
                                    />
                                </Box>

                                <Box sx={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    width: { xs: '100%', sm: 'auto' },
                                    justifyContent: { xs: 'space-between', sm: 'flex-end' },
                                    gap: 1,
                                    mt: { xs: 2, sm: 0 },
                                    borderTop: { xs: '1px solid rgba(255,255,255,0.05)', sm: 'none' },
                                    pt: { xs: 2, sm: 0 }
                                }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: 'background.default', borderRadius: 1 }}>
                                        <IconButton 
                                            size="small" 
                                            onClick={() => handleQuantityChange(item.id, -1)}
                                            sx={{ color: 'text.secondary' }}
                                        >
                                            <RemoveIcon fontSize="small" />
                                        </IconButton>
                                        <Typography sx={{ minWidth: 30, textAlign: 'center', fontWeight: 'bold' }}>
                                            {item.quantity || 1}
                                        </Typography>
                                        <IconButton 
                                            size="small" 
                                            onClick={() => handleQuantityChange(item.id, 1)}
                                            sx={{ color: 'text.secondary' }}
                                        >
                                            <AddIcon fontSize="small" />
                                        </IconButton>
                                    </Box>
                                    
                                    <Button 
                                        startIcon={<DeleteIcon />}
                                        onClick={() => handleRemoveItem(item)} 
                                        color="error"
                                        size="small"
                                        sx={{ ml: 2 }}
                                    >
                                        Remove
                                    </Button>
                                </Box>
                            </ListItem>
                            {index < cartItems.length - 1 && <Divider component="li" />}
                        </React.Fragment>
                    ))}
                </List>
            </Paper>

            <Box sx={{ 
                mt: 4, 
                p: 3, 
                bgcolor: 'background.paper', 
                borderRadius: 2, 
                display: 'flex', 
                flexDirection: { xs: 'column', sm: 'row' },
                justifyContent: 'space-between', 
                alignItems: { xs: 'stretch', sm: 'center' },
                gap: 2
            }}>
                <Button 
                    variant="outlined" 
                    color="error" 
                    onClick={() => dispatch(clearCart())}
                    sx={{ width: { xs: '100%', sm: 'auto' } }}
                >
                    Clear Cart
                </Button>
                <Box sx={{ textAlign: { xs: 'center', sm: 'right' } }}>
                    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                        Total: ${totalPrice.toFixed(2)}
                    </Typography>
                    <Button 
                        variant="contained" 
                        size="large" 
                        component={Link}
                        to="/checkout"
                        sx={{ 
                            mt: 2, 
                            px: 6, 
                            fontWeight: 'bold', 
                            color: 'black', 
                            bgcolor: '#FFD700',
                            width: { xs: '100%', sm: 'auto' }
                        }}
                    >
                        Proceed to Checkout
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default Cart;
