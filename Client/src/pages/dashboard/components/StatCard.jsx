import React from 'react';
import { motion } from 'framer-motion';
import './StatCard.css';

const StatCard = ({ icon, title, value }) => {
    return (
        <motion.div 
            className="stat-card"
            whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(0,0,0,0.05)" }}
        >
            <div className="stat-card-icon">{icon}</div>
            <div className="stat-card-info">
                <p className="title">{title}</p>
                <p className="value">{value}</p>
            </div>
        </motion.div>
    );
};

export default StatCard;