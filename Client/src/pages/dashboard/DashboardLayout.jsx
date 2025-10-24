import React from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import DashboardNav from './components/DashboardNav'; // Assuming DashboardNav is in the same folder
import './DashboardLayout.css'; // We will create this file for styling

const DashboardLayout = () => {
    return (
        <div className="dashboard-page-wrapper">
            <DashboardNav />
            <motion.main 
                className="dashboard-content"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Outlet />
            </motion.main>
        </div>
    );
};

export default DashboardLayout;