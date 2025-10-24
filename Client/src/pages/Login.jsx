import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiLock } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';
import apiService from '../services/api';
import { jwtDecode } from 'jwt-decode';
import './Auth.css';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [role, setRole] = useState('customer'); // For the UI toggle
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [credentials, setCredentials] = useState({ email: '', password: '' });

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        try {
            // Send only email and password to the server
            const response = await apiService.login(credentials);
            const { token } = response.data;

            // The context handles saving the token and user state
            login(token);

            // Decode the token to get the TRUE role from the server
            const decodedToken = jwtDecode(token);
            const userRoleFromServer = decodedToken.user.role;

            // Navigate based on the actual role received from the server
            if (userRoleFromServer === 'shopkeeper') {
                navigate('/dashboard');
            } else {
                navigate('/');
            }
        } catch (err) {
            console.error('Login failed:', err.response?.data || err.message);
            setError(err.response?.data?.msg || 'Login failed. Invalid credentials.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="auth-page">
            <motion.div
                className="auth-card"
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <div className="auth-header">
                    <div className="logo-icon">🛒</div>
                    <h2 className="auth-title">Welcome Back!</h2>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="mb-4">
                        <label className="form-label">Log in as:</label>
                        <div className="role-selector">
                            <button
                                type="button"
                                className={`btn btn-role ${role === 'customer' ? 'active' : ''}`}
                                onClick={() => setRole('customer')}
                            >
                                Customer
                            </button>
                            <button
                                type="button"
                                className={`btn btn-role ${role === 'shopkeeper' ? 'active' : ''}`}
                                onClick={() => setRole('shopkeeper')}
                            >
                                Shopkeeper
                            </button>
                        </div>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Email Address</label>
                        <div className="input-group-wrapper">
                            <FiMail className="input-icon" />
                            <input
                                name="email"
                                type="email"
                                className="form-control"
                                value={credentials.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Password</label>
                        <div className="input-group-wrapper">
                            <FiLock className="input-icon" />
                            <input
                                name="password"
                                type="password"
                                className="form-control"
                                value={credentials.password}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    {error && <div className="auth-error-message mt-3">{error}</div>}

                    <button
                        type="submit"
                        className="btn btn-primary w-100 mt-3"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <span className="spinner-border spinner-border-sm"></span>
                        ) : (
                            'Log In'
                        )}
                    </button>
                </form>

                <p className="text-center text-muted mt-4">
                    Don’t have an account?{' '}
                    <Link to="/signup" className="switch-auth-link">
                        Sign Up
                    </Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Login;