import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Spinner from '../../components/Spinner';
import apiService from '../../services/api';
import { FiChevronDown, FiX, FiCheckCircle, FiTruck } from 'react-icons/fi';
import './Orders.css';

// --- NEW: Tracking Modal ---
const TrackingModal = ({ onClose, onSave, isSaving }) => {
    const [trackingNumber, setTrackingNumber] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(trackingNumber);
    };

    return (
        <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
            <motion.div className="order-modal" initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>Mark as Shipped</h3>
                    <button className="btn-close" onClick={onClose}><FiX /></button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        <label htmlFor="trackingNumber">Tracking Number</label>
                        <input
                            type="text"
                            id="trackingNumber"
                            value={trackingNumber}
                            onChange={(e) => setTrackingNumber(e.target.value)}
                            placeholder="Enter tracking number (e.g., EK123456789IN)"
                            required
                        />
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isSaving}>Cancel</button>
                        <button type="submit" className="btn btn-primary" disabled={isSaving}>
                            {isSaving ? <Spinner size="sm" /> : 'Save & Mark as Shipped'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
};


const Orders = () => {
    const [allOrders, setAllOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(null); // Tracks which order is being saved
    const [activeFilter, setActiveFilter] = useState('All');
    const [openOrderId, setOpenOrderId] = useState(null);
    
    // --- NEW: State for the tracking modal ---
    const [showTrackingModal, setShowTrackingModal] = useState(false);
    const [currentOrder, setCurrentOrder] = useState(null);

    const getOrders = async () => {
        try {
            const res = await apiService.getShopOrders();
            setAllOrders(res.data);
            setFilteredOrders(res.data);
        } catch (error) {
            console.error("Failed to fetch shop orders:", error);
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        getOrders();
    }, []);

    const handleFilterChange = (status) => {
        setActiveFilter(status);
        if (status === 'All') {
            setFilteredOrders(allOrders);
        } else {
            // Re-fetch from allOrders to ensure filter is always correct
            setFilteredOrders(allOrders.filter(order => order.orderStatus === status));
        }
    };
    
    // --- UPDATED: This function is now the "smart" button handler ---
    const handleNextStep = (e, order) => {
        e.stopPropagation(); // Stop accordion from opening
        
        if (order.orderStatus === 'Processing') {
            // If "Processing", open the modal to get tracking info
            setCurrentOrder(order);
            setShowTrackingModal(true);
        } else if (order.orderStatus === 'Shipped') {
            // If "Shipped", mark as delivered immediately
            if (window.confirm("Are you sure you want to mark this order as delivered?")) {
                handleStatusUpdate(order._id, 'Delivered');
            }
        }
    };

    // --- NEW: This function is called by the modal ---
    const handleSaveTracking = async (trackingNumber) => {
        if (!currentOrder) return;
        
        // We will pass the tracking number in the API call in a real app
        // For now, we just pass the new status
        await handleStatusUpdate(currentOrder._id, 'Shipped');
        
        setShowTrackingModal(false);
        setCurrentOrder(null);
    };

    // --- This function now handles all API calls to update status ---
    const handleStatusUpdate = async (orderId, newStatus) => {
        setIsSaving(orderId);
        
        // Optimistic UI update
        const updatedOrders = allOrders.map(order => 
            order._id === orderId ? { ...order, orderStatus: newStatus } : order
        );
        setAllOrders(updatedOrders);

        // Update the filtered view
        if (activeFilter === 'All') {
            setFilteredOrders(updatedOrders);
        } else {
            setFilteredOrders(updatedOrders.filter(o => o.orderStatus === activeFilter));
        }

        try {
            await apiService.updateOrderStatus(orderId, newStatus);
        } catch (error) {
            console.error("Failed to update order status:", error);
            alert("Error: Could not update status.");
            // Revert on failure (we would need originalOrders state)
        } finally {
            setIsSaving(null);
        }
    };
    
    const toggleOrderDetails = (orderId) => {
        setOpenOrderId(openOrderId === orderId ? null : orderId);
    };

    const getStatusClass = (status) => {
        switch(status) {
            case 'Processing': return 'bg-processing';
            case 'Shipped': return 'bg-shipped';
            case 'Delivered': return 'bg-delivered';
            case 'Cancelled': return 'bg-cancelled';
            default: return 'bg-secondary';
        }
    };
    
    if (loading) return <Spinner />;

    return (
        <>
            <motion.header className="dashboard-header mb-4" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                <h1>Customer Orders</h1>
                <p>View and manage all incoming orders for your store.</p>
            </motion.header>

            <div className="order-filters">
                {['All', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(status => (
                    <button key={status} className={`btn ${activeFilter === status ? 'btn-primary' : 'btn-light'}`} onClick={() => handleFilterChange(status)}>
                        {status}
                    </button>
                ))}
            </div>

            <motion.div className="order-list" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {filteredOrders.map(order => (
                    <motion.div layout key={order._id} className="order-accordion-item">
                        <motion.div layout className="order-summary-header" onClick={() => toggleOrderDetails(order._id)}>
                            <div className="order-info">
                                <span className="label">Order ID</span>
                                <span className="value">#{order._id.slice(-6).toUpperCase()}</span>
                            </div>
                            <div className="order-info">
                                <span className="label">Customer</span>
                                <span className="value">{order.user?.name || 'N/A'}</span>
                            </div>
                            <div className="order-info">
                                <span className="label">Date</span>
                                <span className="value">{new Date(order.createdAt).toLocaleDateString('en-IN')}</span>
                            </div>
                            <div className="order-info">
                                <span className="label">Total</span>
                                <span className="value">₹{order.totalPrice.toFixed(2)}</span>
                            </div>
                            <div className="order-info">
                                <span className="label">Status</span>
                                <span className={`status-badge ${getStatusClass(order.orderStatus)}`}>{order.orderStatus}</span>
                            </div>

                            {/* --- THIS IS THE "ADVANCED" UI UPGRADE --- */}
                            <div className="order-actions">
                                {isSaving === order._id ? (
                                    <Spinner size="sm" />
                                ) : (
                                    <>
                                        {order.orderStatus === 'Processing' && (
                                            <button className="btn btn-sm btn-primary" onClick={(e) => handleNextStep(e, order)}>
                                                <FiTruck /> Mark as Shipped
                                            </button>
                                        )}
                                        {order.orderStatus === 'Shipped' && (
                                            <button className="btn btn-sm btn-success" onClick={(e) => handleNextStep(e, order)}>
                                                <FiCheckCircle /> Mark as Delivered
                                            </button>
                                        )}
                                    </>
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
                                                <p className="fw-bold">₹{(item.price * item.quantity).toFixed(2)}</p>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                ))}
                {filteredOrders.length === 0 && <div className="info-panel text-center"><p className="text-muted mb-0">No orders match the filter "{activeFilter}".</p></div>}
            </motion.div>

            {/* --- NEW: Tracking Modal --- */}
            <AnimatePresence>
                {showTrackingModal && (
                    <TrackingModal 
                        onClose={() => setShowTrackingModal(false)}
                        isSaving={isSaving === currentOrder?._id}
                        onSave={handleSaveTracking}
                    />
                )}
            </AnimatePresence>
        </>
    );
};

export default Orders;