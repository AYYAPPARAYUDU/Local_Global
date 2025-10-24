import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCheckCircle } from 'react-icons/fa';
import Card from '../components/Card';
import Spinner from '../components/Spinner';
import { mockCategories, testimonials } from '../data/mockData'; // Categories & testimonials remain local
import apiService from '../services/api'; // Use the REAL API service

const Home = () => {
    const [popularProducts, setPopularProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // This useEffect now fetches real products from your server
    useEffect(() => {
        const fetchHomeData = async () => {
            try {
                const res = await apiService.getAllProducts();
                // Get the first 4 products to feature on the homepage
                setPopularProducts(res.data.slice(0, 4));
            } catch (err) {
                console.error("Failed to fetch popular products:", err);
                setError("Could not load trending products.");
            } finally {
                setLoading(false);
            }
        };
        fetchHomeData();
    }, []);

    const sectionVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
    };
    
    if (loading) {
        return <Spinner />;
    }

    return (
        <div className="homepage-container">
            {/* --- Hero Section --- */}
            <section className="hero-section py-5">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-6">
                            <motion.div className="hero-content" initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }}>
                                <h1 className="hero-title">Smart Shopping. Local or Global, You Choose!</h1>
                                <p className="hero-description">
                                    Local-Global connects you to nearby stores and trusted global platforms. Compare prices, negotiate, and get instant delivery — all in one place.
                                </p>
                                <div className="hero-buttons d-flex gap-3 flex-wrap">
                                    <Link to="/products" className="btn btn-primary">Start Shopping</Link>
                                    <Link to="/products" className="btn btn-outline-dark">Explore Deals</Link>
                                </div>
                            </motion.div>
                        </div>
                        <div className="col-lg-6 d-none d-lg-block">
                            <motion.div className="hero-image-container" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}>
                                <img src="https://images.pexels.com/photos/5632390/pexels-photo-5632390.jpeg" alt="Smart Shopping" className="hero-main-image" />
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- Categories Section (Static Data) --- */}
            <motion.section className="category-cards-section section-padding text-center" variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <div className="container">
                    <h2 className="section-title">Shop by Category</h2>
                    <div className="row g-4 justify-content-center">
                        {mockCategories.map((category, index) => (
                            <motion.div key={index} className="col-lg col-md-4 col-6" whileHover={{ scale: 1.05 }}>
                                <Link to={`/products?category=${category.name.toLowerCase()}`} className="text-decoration-none">
                                    <div className="category-card"><img src={category.image} alt={category.name} /><div className="card-body"><h5 className="card-title">{category.name}</h5></div></div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.section>
            
            {/* --- Why Choose Us Section (Static Data) --- */}
            <motion.section className="why-choose-us-section section-padding" variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                 <div className="container">
                    <div className="row align-items-center g-5">
                        <div className="col-lg-6">
                            <div className="why-choose-us-content">
                                <h3 className="section-title text-start">Why Local-Global?</h3>
                                <ul>
                                    <li><FaCheckCircle /> Compare Local vs Global Prices</li>
                                    <li><FaCheckCircle /> Smart Negotiation System</li>
                                    <li><FaCheckCircle /> Faster Local Deliveries</li>
                                    <li><FaCheckCircle /> Trusted Global Sellers</li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="why-choose-us-images">
                                <img src="https://images.pexels.com/photos/5632378/pexels-photo-5632378.jpeg" alt="Shopping" />
                                <img src="https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg" alt="Local Shop" />
                            </div>
                        </div>
                    </div>
                </div>
            </motion.section>

            {/* --- UPDATED: Popular Products Section (Live Data) --- */}
            <motion.section className="popular-products-section section-padding text-center" variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <div className="container">
                    <h2 className="section-title">Top Trending Products</h2>
                    {error ? <p className="text-danger">{error}</p> : (
                        <div className="row g-4">
                            {popularProducts.map((product) => (
                                <motion.div key={product._id} className="col-lg-3 col-md-6" whileHover={{ scale: 1.03 }}>
                                    <Link to={`/products/${product._id}`} className="text-decoration-none">
                                        <Card product={product} />
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </motion.section>

            {/* --- Testimonials Section (Static Data) --- */}
            <motion.section className="testimonials-section section-padding" variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <div className="container text-center">
                    <h2 className="section-title">What Our Users Say</h2>
                    <div className="row g-4">
                        {testimonials.map((t, index) => (
                            <motion.div key={index} className="col-lg-4 d-flex align-items-stretch">
                                <div className="testimonial-card">
                                    <img src={t.image} alt={t.name} className="testimonial-image" />
                                    <h5 className="testimonial-name">{t.name}</h5>
                                    <div className="testimonial-rating">{'★'.repeat(t.rating)}{'☆'.repeat(5 - t.rating)}</div>
                                    <p className="testimonial-text">"{t.text}"</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.section>
        </div>
    );
};

export default Home;