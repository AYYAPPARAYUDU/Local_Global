import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown, FiShoppingBag, FiXCircle } from 'react-icons/fi';
import Spinner from '../components/Spinner';
import Chat from '../components/Chat';
import apiService from '../services/api';
import './styles/MyOrders.css';

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openOrderId, setOpenOrderId] = useState(null);
    
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [currentChatShop, setCurrentChatShop] = useState(null);
    const [currentChatProduct, setCurrentChatProduct] = useState(null);
    const [isCancelling, setIsCancelling] = useState(null); // Track cancelling state

    const fetchOrders = async () => {
        try {
            const res = await apiService.getMyOrders();
            setOrders(res.data);
        } catch (err) {
            console.error("Failed to fetch orders:", err);
            setError("Could not load your orders. Please try again later.");
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        fetchOrders();
    }, []);

    const toggleOrder = (orderId) => {
        setOpenOrderId(openOrderId === orderId ? null : orderId);
    };

    const handleOpenChat = (shopkeeper, product) => {
        if (!shopkeeper || !product) {
            alert("Seller information is not available for this item.");
            return;
        }
        setCurrentChatShop(shopkeeper);
        setCurrentChatProduct(product);
        setIsChatOpen(true);
    };
    
    // --- NEW: Handle Order Cancellation ---
    const handleCancelOrder = async (e, orderId) => {
        e.stopPropagation(); // Prevent the accordion from opening
        if (!window.confirm("Are you sure you want to cancel this order? This action cannot be undone.")) {
            return;
        }

        setIsCancelling(orderId);
        try {
            await apiService.cancelOrder(orderId);
            // Refresh the order list to show the "Cancelled" status
            fetchOrders(); 
        } catch (err) {
            alert(err.response?.data?.msg || "Failed to cancel the order. It may have already been shipped.");
        } finally {
            setIsCancelling(null);
        }
    };
    
    if (loading) return <Spinner />;

    return (
        <>
            <div className="orders-page">
                <header className="page-header">
                    <h1>My Orders</h1>
                    <p>View your order history, track shipments, and manage your purchases.</p>
                </header>

                <main className="container py-5">
                    <div className="order-list">
                        {error && <div className="alert alert-danger">{error}</div>}
                        {orders.length > 0 ? (
                            orders.map((order) => (
                                <motion.div layout key={order._id} className="order-accordion-item">
                                    <motion.div layout className="order-summary-header" onClick={() => toggleOrder(order._id)}>
                                        <div className="order-info">
                                            <span className="label">Order ID</span>
                                            <span className="value">#{order._id.slice(-6).toUpperCase()}</span>
                                        </div>
                                        <div className="order-info">
                                            <span className="label">Date</span>
                                            <span className="value">{new Date(order.createdAt).toLocaleDateString('en-IN')}</span>
                                        </div>
                                        <div className="order-info">
                                            <span className="label">Total</span>
                                            <span className="value">₹{order.totalPrice.toLocaleString('en-IN')}</span>
                                        </div>
                                        <div className="order-info">
                                             <span className="label">Status</span>
                                             <span className={`status-badge status-${order.orderStatus.toLowerCase()}`}>{order.orderStatus}</span>
                                        </div>
                                        
                                        <div className="order-actions">
                                            {/* --- THIS IS THE "GREAT" UI UPGRADE --- */}
                                            {order.orderStatus === 'Processing' && (
                                                <button 
                                                    className="btn btn-sm btn-danger-outline" 
                                                    onClick={(e) => handleCancelOrder(e, order._id)}
                                                    disabled={isCancelling === order._id}
                                                >
                                                    {isCancelling === order._id ? <Spinner size="sm" /> : 'Cancel Order'}
                                                </button>
                                            )}
                                            <motion.div animate={{ rotate: openOrderId === order._id ? 180 : 0 }}><FiChevronDown size={24}/></motion.div>
                                        </div>
                                    </motion.div>

                                    <AnimatePresence>
                                        {openOrderId === order._id && (
                                            <motion.div
                                                className="order-details-body"
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                            >
                                                <h5 className="fw-bold mb-3">Items in this order:</h5>
                                                <div className="order-product-list">
                                                    {order.orderItems.map(item => (
                                                        <div key={item._id} className="product-item">
                                                            <img src={item.image} alt={item.name} />
                                                            <div className="info">
                                                                <p className="fw-bold mb-0">{item.name}</p>
                                                                <p className="text-muted">Qty: {item.quantity}</p>
                                                            </div>
                                                            {item.product ? (
                                                                <button 
                                                                    className="btn btn-sm btn-outline-secondary" 
                                                                    onClick={() => handleOpenChat(item.product.user, item.product)}
                                                                >
                                                                    Contact Seller
                                                                </button>
                                                            ) : (
                                                                <span className="text-muted fst-italic">Product no longer available</span>
                                                            )}
                                                            <p className="fw-bold">₹{(item.price * item.quantity).toFixed(2)}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            ))
                        ) : (
                            <div className="empty-orders-state">
                                <FiShoppingBag />
                                <h3>You have no orders yet.</h3>
                                <p className="text-muted">All your purchases will be saved here.</p>
                                <Link to="/products" className="btn btn-primary mt-3">Start Shopping</Link>
                            </div>
                        )}
                    </div>
                </main>
                <AnimatePresence>
                    {isChatOpen && (
                        <Chat 
                            shopkeeper={currentChatShop} 
                            product={currentChatProduct} 
                            onClose={() => setIsChatOpen(false)} 
                        />
                    )}
                </AnimatePresence>
            </div>
        </>
    );
};

export default MyOrders;