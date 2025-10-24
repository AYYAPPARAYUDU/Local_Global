import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiLock, FiHome } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';
import apiService from '../services/api';

const SignUp = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [role, setRole] = useState('customer');
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        shopName: '',
        shopLocation: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        const userData = {
            name: formData.name,
            email: formData.email,
            password: formData.password,
            role: role,
        };
        
        if (role === 'shopkeeper') {
            userData.shopName = formData.shopName;
            userData.shopLocation = formData.shopLocation;
        }

        try {
            const response = await apiService.signup(userData);
            const { token } = response.data;
            login(token);

            if (role === 'shopkeeper') {
                navigate('/dashboard');
            } else {
                navigate('/');
            }
        } catch (err) {
            setError(err.response?.data?.msg || "Registration failed. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="auth-page">
            <motion.div className="auth-card" initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }}>
                <div className="auth-header">
                    <div className="logo-icon">🛒</div>
                    <h2 className="auth-title">Create an Account</h2>
                </div>
                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="mb-4">
                        <label className="form-label">I am a:</label>
                        <div className="role-selector">
                            <button type="button" className={`btn btn-role ${role === 'customer' ? 'active' : ''}`} onClick={() => setRole('customer')}>Customer</button>
                            <button type="button" className={`btn btn-role ${role === 'shopkeeper' ? 'active' : ''}`} onClick={() => setRole('shopkeeper')}>Shopkeeper</button>
                        </div>
                    </div>
                    
                    <div className="mb-3">
                        <label className="form-label">Full Name</label>
                        <div className="input-group-wrapper">
                            <FiUser className="input-icon" />
                            <input type="text" name="name" className="form-control" value={formData.name} onChange={handleChange} required />
                        </div>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Email Address</label>
                        <div className="input-group-wrapper">
                            <FiMail className="input-icon" />
                            <input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} required />
                        </div>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Password</label>
                         <div className="input-group-wrapper">
                            <FiLock className="input-icon" />
                            <input type="password" name="password" className="form-control" value={formData.password} onChange={handleChange} required />
                        </div>
                    </div>
                    
                    {role === 'shopkeeper' && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                             <div className="mb-3">
                                <label className="form-label">Shop Name</label>
                                <div className="input-group-wrapper">
                                    <FiHome className="input-icon" />
                                    <input type="text" name="shopName" className="form-control" value={formData.shopName} onChange={handleChange} required={role === 'shopkeeper'} />
                                </div>
                            </div>
                             <div className="mb-3">
                                <label className="form-label">Shop Location</label>
                                <div className="input-group-wrapper">
                                    <FiHome className="input-icon" />
                                    <input type="text" name="shopLocation" className="form-control" value={formData.shopLocation} onChange={handleChange} required={role === 'shopkeeper'} />
                                </div>
                            </div>
                        </motion.div>
                    )}
                    
                    {error && <div className="auth-error-message mt-3">{error}</div>}

                    <button type="submit" className="btn btn-primary w-100 mt-3" disabled={isSubmitting}>
                        {isSubmitting ? <span className="spinner-border spinner-border-sm"></span> : 'Create Account'}
                    </button>
                </form>
                
                <p className="text-center text-muted mt-4">
                    Already have an account? <Link to="/login" className="switch-auth-link">Log In</Link>
                </p>
            </motion.div>
        </div>
    );
};

export default SignUp;