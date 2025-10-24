import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import Spinner from '../components/Spinner';
import apiService from '../services/api';
import { FiGrid, FiMapPin, FiPhone, FiLogOut } from 'react-icons/fi';
import './styles/Profile.css';

const Profile = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [profileData, setProfileData] = useState(null);
    const [customerStats, setCustomerStats] = useState(null);
    const [orderHistory, setOrderHistory] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                // Fetch all data in parallel for better performance
                const [profileRes, dashboardRes] = await Promise.all([
                    apiService.getMe(),
                    apiService.getCustomerDashboard()
                ]);

                setProfileData(profileRes.data);
                setCustomerStats(dashboardRes.data);
                setOrderHistory(dashboardRes.data.recentOrderHistory);

            } catch (error) {
                console.error("Failed to fetch profile data:", error);
            } finally {
                setLoading(false);
            }
        };
        
        if (user) {
            fetchProfile();
        } else {
            setLoading(false);
        }
    }, [user]);

    const handleLogout = () => { logout(); navigate('/'); };

    if (loading) return <Spinner />;
    if (!profileData) return <div>Could not load profile.</div>;

    const userInitials = profileData.name ? profileData.name.charAt(0).toUpperCase() : '?';

    return (
        <div className="profile-page">
            <div className="container py-5">
                <motion.div className="profile-card col-lg-10 mx-auto" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="profile-header">
                        <div className="profile-avatar">{userInitials}</div>
                        <h2>{profileData.name}</h2>
                        <p>{profileData.email}</p>
                    </div>
                    <div className="profile-body">
                        {profileData.role === 'shopkeeper' && (
                            <div className="profile-section">
                                <h5>Shopkeeper Details</h5>
                                <div className="info-row"><FiGrid /><span className="label">Shop Name:</span><span>{profileData.shopName}</span></div>
                                <div className="info-row"><FiMapPin /><span className="label">Address:</span><span>{profileData.address || 'N/A'}</span></div>
                                <div className="info-row"><FiPhone /><span className="label">Phone:</span><span>{profileData.phone || 'N/A'}</span></div>
                                <Link to="/dashboard" className="btn btn-primary mt-3">Go to Dashboard</Link>
                            </div>
                        )}

                        {profileData.role === 'customer' && customerStats && (
                            <>
                                <div className="profile-section">
                                    <h5>My Dashboard</h5>
                                    <div className="row g-3">
                                        <div className="col-md-4"><div className="stat-card-mini"><div className="label">Total Spent</div><div className="value">₹{customerStats.totalSpent.toLocaleString('en-IN')}</div></div></div>
                                        <div className="col-md-4"><div className="stat-card-mini"><div className="label">Total Orders</div><div className="value">{customerStats.totalOrders}</div></div></div>
                                        <div className="col-md-4"><div className="stat-card-mini"><div className="label">Loyalty Tier</div><div className="value">{customerStats.loyaltyTier}</div></div></div>
                                    </div>
                                </div>
                                {orderHistory && (
                                <div className="profile-section">
                                    <h5>Recent Orders</h5>
                                    <table className="order-table">
                                        <thead><tr><th>Order ID</th><th>Date</th><th>Total</th><th>Status</th></tr></thead>
                                        <tbody>
                                        {orderHistory.map(order => (
                                            <tr key={order._id}>
                                                <td>{order.id || order._id.slice(-6)}</td>
                                                <td>{new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
                                                <td>₹{order.totalPrice.toLocaleString('en-IN')}</td>
                                                <td><span className={`status-badge status-${order.orderStatus.toLowerCase()}`}>{order.orderStatus}</span></td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                    <Link to="/my-orders" className="btn btn-outline-primary mt-3">View All Orders</Link>
                                </div>
                                )}
                            </>
                        )}
                        
                        <div className="mt-4 d-flex justify-content-end">
                            <button className="btn btn-danger" onClick={handleLogout}><FiLogOut /> Log Out</button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Profile;