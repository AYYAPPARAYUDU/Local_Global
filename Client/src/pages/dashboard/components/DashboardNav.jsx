import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiGrid, FiPackage, FiBarChart2, FiList, FiSettings, FiLogOut } from 'react-icons/fi';
import { useAuth } from '../../../hooks/useAuth';
import './DashboardNav.css';

const DashboardNav = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/'); // Redirect to home page after logout
    };

    const userInitials = user?.name ? user.name.charAt(0).toUpperCase() : '?';
    
    const navLinks = [
        { name: 'Dashboard', path: '/dashboard', icon: <FiGrid /> },
        { name: 'Products', path: '/dashboard/products', icon: <FiPackage /> },
        { name: 'Orders', path: '/dashboard/orders', icon: <FiList /> },
        { name: 'Analytics', path: '/dashboard/analytics', icon: <FiBarChart2 /> },
        { name: 'Shop Settings', path: '/dashboard/settings', icon: <FiSettings /> }, // <-- Settings link is included
    ];

    return (
        <motion.aside 
            className="dashboard-sidebar"
            initial={{ x: -260 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
            <NavLink to="/" className="logo">Local_Global</NavLink>
            
            <nav className="dashboard-nav">
                {navLinks.map(link => (
                    <NavLink to={link.path} key={link.name} end={link.path === '/dashboard'}>
                        {link.icon} {link.name}
                    </NavLink>
                ))}
            </nav>

            <div className="sidebar-footer">
                <div className="user-profile-widget">
                    <div className="profile-avatar-sm">{userInitials}</div>
                    <div className="profile-info">
                        <h6>{user?.name || "Shopkeeper"}</h6>
                        <p>{user?.role || "Admin"}</p>
                    </div>
                </div>
                
                <button onClick={handleLogout} className="logout-button">
                    <FiLogOut /> Logout
                </button>
            </div>
        </motion.aside>
    );
};

export default DashboardNav;