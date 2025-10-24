import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiTrash2, FiShoppingCart } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import './styles/Cart.css'; // Make sure this CSS file exists

const Cart = () => {
    const navigate = useNavigate();
    const { cartItems, updateQuantity, removeFromCart } = useCart();

    const subtotal = cartItems.reduce((acc, item) => acc + (item.price || 0) * item.quantity, 0);
    const shippingCost = subtotal > 500 ? 0.00 : 50.00; // Example: Free shipping over ₹500
    const taxes = subtotal * 0.18; // Example: 18% GST
    const total = subtotal + shippingCost + taxes;

    return (
        <div className="cart-page">
            <header className="page-header">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                    <h1>Your Shopping Cart</h1>
                </motion.div>
            </header>

            <div className="container py-5">
                <div className="row g-5">
                    <div className="col-lg-8">
                        <AnimatePresence>
                            {cartItems.length > 0 ? (
                                cartItems.map((item, index) => (
                                    <motion.div
                                        key={item._id}
                                        className="cart-item"
                                        layout
                                        initial={{ opacity: 0, x: -50 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 50, transition: { duration: 0.3 } }}
                                        transition={{ duration: 0.5, delay: index * 0.05 }}
                                    >
                                        <div className="cart-item-image"><img src={item.image || (item.images && item.images[0])} alt={item.name} /></div>
                                        <div className="cart-item-details">
                                            <h5>{item.name}</h5>
                                            <p>₹{(item.price || 0).toFixed(2)}</p>
                                        </div>
                                        <div className="cart-item-quantity">
                                            <div className="quantity-selector">
                                                <button onClick={() => updateQuantity(item._id, item.quantity - 1)}>-</button>
                                                <input type="text" value={item.quantity} readOnly className="form-control text-center" />
                                                <button onClick={() => updateQuantity(item._id, item.quantity + 1)}>+</button>
                                            </div>
                                        </div>
                                        <div className="cart-item-price">₹{((item.price || 0) * item.quantity).toFixed(2)}</div>
                                        <button className="remove-item-btn" onClick={() => removeFromCart(item._id)}><FiTrash2 /></button>
                                    </motion.div>
                                ))
                            ) : (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="cart-empty-state">
                                    <div className="icon"><FiShoppingCart /></div>
                                    <h3>Your cart is empty.</h3>
                                    <p className="text-muted">Looks like you haven't added anything yet.</p>
                                    <Link to="/products" className="btn btn-primary mt-3">Continue Shopping</Link>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="col-lg-4">
                        <motion.div className="order-summary" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }}>
                            <h3>Order Summary</h3>
                            <div className="summary-item"><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
                            <div className="summary-item"><span>Shipping</span><span>₹{shippingCost.toFixed(2)}</span></div>
                            <div className="summary-item"><span>Taxes (18%)</span><span>₹{taxes.toFixed(2)}</span></div>
                            <div className="summary-item summary-total"><span>Total</span><span>₹{total.toFixed(2)}</span></div>
                            <button
                                className="btn btn-primary w-100 btn-lg mt-4"
                                disabled={cartItems.length === 0}
                                onClick={() => navigate('/checkout')}
                            >
                                Proceed to Checkout
                            </button>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;