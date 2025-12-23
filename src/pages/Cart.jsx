import React from 'react';
import { Container, Typography, Box, List, ListItem, ListItemText, ListItemAvatar, Avatar, IconButton, Button, Paper, Divider } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Cart = () => {
    const { cartItems, removeFromCart, clearCart } = useCart();

    // Calculate total price
    const totalPrice = cartItems.reduce((acc, item) => acc + (parseFloat(item.price) || 0), 0);

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
            <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>
                Your Cart ({cartItems.length})
            </Typography>

            <Paper elevation={0} sx={{ bgcolor: 'background.paper', borderRadius: 2, overflow: 'hidden' }}>
                <List sx={{ p: 0 }}>
                    {cartItems.map((item, index) => (
                        <React.Fragment key={`${item.id}-${index}`}>
                            <ListItem
                                secondaryAction={
                                    <IconButton edge="end" aria-label="delete" onClick={() => removeFromCart(item.id)} color="error">
                                        <DeleteIcon />
                                    </IconButton>
                                }
                                sx={{ p: 3 }}
                            >
                                <ListItemAvatar sx={{ mr: 2 }}>
                                    <Avatar
                                        src={item.image}
                                        alt={item.name || item.title}
                                        variant="rounded"
                                        sx={{ width: 80, height: 80 }}
                                    />
                                </ListItemAvatar>
                                <ListItemText
                                    primary={
                                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                            {item.name || item.title}
                                        </Typography>
                                    }
                                    secondary={
                                        <Typography variant="body1" sx={{ color: 'primary.main', mt: 1 }}>
                                            ${item.price}
                                        </Typography>
                                    }
                                />
                            </ListItem>
                            {index < cartItems.length - 1 && <Divider component="li" />}
                        </React.Fragment>
                    ))}
                </List>
            </Paper>

            <Box sx={{ mt: 4, p: 3, bgcolor: 'background.paper', borderRadius: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Button variant="outlined" color="error" onClick={clearCart}>
                    Clear Cart
                </Button>
                <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                        Total: ${totalPrice.toFixed(2)}
                    </Typography>
                    <Button variant="contained" size="large" sx={{ mt: 2, px: 6, fontWeight: 'bold', color: 'black', bgcolor: '#FFD700' }}>
                        Checkout
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default Cart;
