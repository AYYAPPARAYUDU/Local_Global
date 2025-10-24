import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Spinner from '../../components/Spinner';
import Chat from '../../components/Chat'; // Import the real Chat component
import apiService from '../../services/api';
import { FiDollarSign, FiPackage, FiBox, FiTrendingUp, FiMessageSquare } from 'react-icons/fi';
import './Dashboard.css';

// StatCard sub-component for a clean and reusable UI
const StatCard = ({ icon, title, value }) => (
    <div className="stat-card">
        <div className="stat-card-icon">{icon}</div>
        <div className="stat-card-info">
            <p className="title">{title}</p>
            <p className="value">{value}</p>
        </div>
    </div>
);

const Dashboard = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [currentChatCustomer, setCurrentChatCustomer] = useState(null);
    const [currentChatProduct, setCurrentChatProduct] = useState(null); // Add state for product

    useEffect(() => {
        const getDashboardData = async () => {
            try {
                const res = await apiService.getDashboardStats();
                setDashboardData(res.data);
            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };
        getDashboardData();
    }, []);

    const handleOpenChat = (customer, product) => {
        if (!customer || !product) {
            console.error("Missing customer or product data for chat.");
            return;
        }
        setCurrentChatCustomer(customer);
        setCurrentChatProduct(product); // Set the product for the chat
        setIsChatOpen(true);
    };

    const handleCloseChat = () => {
        setIsChatOpen(false);
        setCurrentChatCustomer(null);
        setCurrentChatProduct(null);
    };

    if (loading) return <Spinner />;
    if (!dashboardData) return <div className="text-center p-5 text-danger">Could not load dashboard data.</div>;

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <>
            <motion.header className="dashboard-header mb-5" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                <h1>Welcome Back, Shopkeeper!</h1>
                <p>Here's a snapshot of your store's performance.</p>
            </motion.header>

            <motion.div className="stats-grid mb-5" variants={containerVariants} initial="hidden" animate="visible">
                <motion.div variants={itemVariants}><StatCard icon={<FiDollarSign/>} title="Total Revenue" value={`₹${dashboardData.totalRevenue.toLocaleString('en-IN')}`} /></motion.div>
                <motion.div variants={itemVariants}><StatCard icon={<FiPackage/>} title="Total Orders" value={dashboardData.totalOrders} /></motion.div>
                <motion.div variants={itemVariants}><StatCard icon={<FiBox/>} title="Total Products" value={dashboardData.totalProducts} /></motion.div>
                <motion.div variants={itemVariants}><StatCard icon={<FiTrendingUp/>} title="Avg. Sale" value={`₹${(dashboardData.totalRevenue / (dashboardData.totalOrders || 1)).toLocaleString('en-IN', {minimumFractionDigits: 2})}`} /></motion.div>
                <motion.div variants={itemVariants}><StatCard icon={<FiMessageSquare/>} title="Unread Messages" value={dashboardData.unreadMessages} /></motion.div>
            </motion.div>

            <div className="main-grid">
                <motion.div className="main-grid-col-span-2 info-panel" variants={itemVariants} initial="hidden" animate="visible" transition={{ delay: 0.2 }}>
                    <h4>Weekly Sales</h4>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={dashboardData.salesChartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis /><Tooltip formatter={(value) => `₹${value.toLocaleString('en-IN')}`}/><Legend /><Bar dataKey="sales" fill="var(--primary-color)" name="Sales (INR)" />
                        </BarChart>
                    </ResponsiveContainer>
                </motion.div>
                
                <motion.div className="info-panel" variants={itemVariants} initial="hidden" animate="visible" transition={{ delay: 0.3 }}>
                    <h4>Low Stock Alerts</h4>
                    <div>
                        {dashboardData.lowStockProducts.map(product => (
                            <div key={product._id} className="low-stock-item">
                                <p className="fw-medium text-secondary">{product.name}</p>
                                <p className={`stock-quantity ${product.stock <= 5 ? 'stock-critical' : 'stock-warning'}`}>{product.stock} left</p>
                            </div>
                        ))}
                    </div>
                </motion.div>

                <motion.div className="main-grid-col-span-2 info-panel" variants={itemVariants} initial="hidden" animate="visible" transition={{ delay: 0.4 }}>
                    <h4>Recent Orders</h4>
                    <div className="overflow-x-auto">
                        <table className="table">
                            <thead><tr><th>Order ID</th><th>Customer</th><th>Status</th></tr></thead>
                            <tbody>
                                {dashboardData.recentOrders.map(order => (
                                    <tr key={order._id}>
                                        <td className="fw-bold">#{order._id.slice(-6).toUpperCase()}</td>
                                        <td>{order.user.name}</td>
                                        <td><span className={`order-status status-${order.orderStatus.toLowerCase()}`}>{order.orderStatus}</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
                
                <motion.div className="info-panel" variants={itemVariants} initial="hidden" animate="visible" transition={{ delay: 0.5 }}>
                    <h4>Recent Customer Messages</h4>
                    <div>
                        {dashboardData.recentMessages.map(msg => (
                            <div 
                                key={msg._id} 
                                className="message-item" 
                                onClick={() => handleOpenChat(msg.customer, msg.product)} 
                                style={{cursor: 'pointer'}}
                            >
                                {!msg.isRead && <div className="message-indicator"></div>}
                                <div>
                                    <p className="fw-semibold text-secondary">{msg.customer.name}</p>
                                    <p className="text-sm text-muted">{msg.text}</p>
                                
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
            
            <AnimatePresence>
                {isChatOpen && currentChatCustomer && currentChatProduct && (
                    <Chat 
                        shopkeeper={currentChatCustomer} 
                        product={currentChatProduct} 
                        onClose={handleCloseChat} 
                    />
                )}
            </AnimatePresence>
        </>
    );
};

export default Dashboard;