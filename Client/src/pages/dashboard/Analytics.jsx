import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Spinner from '../../components/Spinner';
import apiService from '../../services/api';
import { FiTrendingUp, FiDollarSign, FiShoppingCart, FiUsers } from 'react-icons/fi';
import './Analytics.css';

// Reusable Stat Card Component
const StatCard = ({ icon, title, value, growth }) => (
    <div className="stat-card">
        <div className="stat-card-icon">{icon}</div>
        <div className="stat-card-info">
            <p className="title">{title}</p>
            <p className="value">{value}</p>
        </div>
        {growth && <span className="stat-card-growth">+{growth}%</span>}
    </div>
);

const COLORS = ['#0d6efd', '#0dcaf0', '#ffc107', '#fd7e14'];

const Analytics = () => {
    const [analyticsData, setAnalyticsData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getData = async () => {
            try {
                const res = await apiService.getAnalytics();
                setAnalyticsData(res.data);
            } catch (error) {
                console.error("Failed to fetch analytics:", error);
            } finally {
                setLoading(false);
            }
        };
        getData();
    }, []);

    const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
    const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

    if (loading) return <Spinner />;
    if (!analyticsData) return <div className="text-center p-5 text-danger">Could not load analytics data.</div>;

    return (
        <>
            <motion.header className="dashboard-header mb-5" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                <h1>Sales Analytics</h1>
                <p>An in-depth look at your store's performance metrics.</p>
            </motion.header>

            <motion.div className="stats-grid mb-5" variants={containerVariants} initial="hidden" animate="visible">
                <motion.div variants={itemVariants}><StatCard icon={<FiDollarSign/>} title="Total Revenue" value={`₹${analyticsData.totalRevenue.toLocaleString('en-IN')}`} growth={analyticsData.salesGrowth} /></motion.div>
                <motion.div variants={itemVariants}><StatCard icon={<FiShoppingCart/>} title="Total Orders" value={analyticsData.totalOrders} /></motion.div>
                <motion.div variants={itemVariants}><StatCard icon={<FiUsers/>} title="New Customers" value={analyticsData.newCustomers} /></motion.div>
                <motion.div variants={itemVariants}><StatCard icon={<FiTrendingUp/>} title="Avg. Sale" value={`₹${(analyticsData.totalRevenue / (analyticsData.totalOrders || 1)).toLocaleString('en-IN')}`} /></motion.div>
            </motion.div>

            <div className="row g-5 mb-5">
                <motion.div className="col-lg-8" variants={itemVariants} initial="hidden" animate="visible" transition={{ delay: 0.2 }}>
                    <div className="chart-container">
                        <h4>Monthly Sales Revenue (INR)</h4>
                        <ResponsiveContainer width="100%" height={350}>
                            <LineChart data={analyticsData.monthlySales} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip formatter={(value) => `₹${value.toLocaleString('en-IN')}`}/>
                                <Legend />
                                <Line type="monotone" dataKey="sales" stroke="var(--primary-color)" strokeWidth={3} activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
                <motion.div className="col-lg-4" variants={itemVariants} initial="hidden" animate="visible" transition={{ delay: 0.3 }}>
                    <div className="chart-container">
                        <h4>Sales by Category</h4>
                         <ResponsiveContainer width="100%" height={350}>
                            <PieChart>
                                <Pie data={analyticsData.categorySales} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={120} label>
                                    {analyticsData.categorySales.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value) => `₹${value.toLocaleString('en-IN')}`}/>
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>
            
            <motion.div variants={itemVariants} initial="hidden" animate="visible" transition={{ delay: 0.4 }}>
                  <h2 className="section-title text-start mb-4">Top Selling Products</h2>
                  <div className="product-table-container">
                       <table className="top-products-table">
                           <thead><tr><th>Product</th><th>Price</th><th>Stock</th><th>Total Sales</th></tr></thead>
                           <tbody>
                               {analyticsData.topProducts.map(product => (
                                   <tr key={product._id}>
                                       <td>
                                           <div className="product-cell">
                                               <img src={product.image} alt={product.name}/>
                                               <span>{product.name}</span>
                                           </div>
                                       </td>
                                       <td>₹{product.price.toFixed(2)}</td>
                                       <td>{product.stock}</td>
                                       <td>{product.sold} units</td>
                                   </tr>
                               ))}
                           </tbody>
                       </table>
                  </div>
            </motion.div>
        </>
    );
};

export default Analytics;