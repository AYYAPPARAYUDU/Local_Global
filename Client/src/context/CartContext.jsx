import React, { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext();

function cartReducer(state, action) {
    switch (action.type) {
        case 'ADD_TO_CART': {
            const existingItem = state.find(item => item._id === action.product._id);
            if (existingItem) {
                // If item exists, increase quantity by the amount added
                return state.map(item =>
                    item._id === action.product._id 
                    ? { ...item, quantity: item.quantity + (action.product.quantity || 1) } 
                    : item
                );
            }
            // Add new item with the specified quantity or default to 1
            // This correctly spreads the ENTIRE product object, including the 'user' field
            return [...state, { ...action.product, quantity: action.product.quantity || 1 }];
        }
        case 'UPDATE_QUANTITY': {
            return state.map(item =>
                item._id === action.productId ? { ...item, quantity: Math.max(0, action.amount) } : item
            ).filter(item => item.quantity > 0); // Remove item if quantity becomes 0
        }
        case 'REMOVE_FROM_CART': {
            return state.filter(item => item._id !== action.productId);
        }
        case 'CLEAR_CART': {
            return [];
        }
        default: {
            throw new Error(`Unhandled action type: ${action.type}`);
        }
    }
}

export const CartProvider = ({ children }) => {
    // Load the initial state from localStorage
    const initialState = JSON.parse(localStorage.getItem('cart')) || [];
    const [cartItems, dispatch] = useReducer(cartReducer, initialState);

    // Save the cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    // Action functions that components will call
    const addToCart = product => dispatch({ type: 'ADD_TO_CART', product });
    const updateQuantity = (productId, amount) => dispatch({ type: 'UPDATE_QUANTITY', productId, amount });
    const removeFromCart = productId => dispatch({ type: 'REMOVE_FROM_CART', productId });
    const clearCart = () => dispatch({ type: 'CLEAR_CART' });

    const value = { cartItems, addToCart, updateQuantity, removeFromCart, clearCart };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};

// Custom hook for easy access to the cart context
export const useCart = () => {
    return useContext(CartContext);
};