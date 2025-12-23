import React, { createContext, useState, useContext } from 'react';

// Create confirmation of Context
const CartContext = createContext();

// Custom hook for using the cart context
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    // Add item to cart
    const addToCart = (product) => {
        setCartItems((prevItems) => {
            // Check if item already exists to update quantity (optional logic, keeping it simple for now as array of items)
            return [...prevItems, product];
        });
    };

    // Remove item from cart (by ID or index - let's use ID or object reference)
    // For this homework, just removing by checking filter is fine.
    const removeFromCart = (productId) => {
        setCartItems((prevItems) => prevItems.filter(item => item.id !== productId));
    };

    // Clear cart
    const clearCart = () => {
        setCartItems([]);
    };

    const getCartCount = () => cartItems.length;

    const value = {
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        getCartCount
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};
