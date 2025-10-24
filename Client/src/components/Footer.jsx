import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="footer-container">
            <div className="container">
                <div className="footer-grid">
                    <div className="footer-column">
                        <Link to="/" className="logo text-decoration-none">
                            <span className="logo-icon">🛒</span>
                            <span>Local_Global</span>
                        </Link>
                        <p>Your premier marketplace for authentic local crafts and the world's finest products.</p>
                    </div>
                    <div className="footer-column">
                        <h5>Shop</h5>
                        <ul className="footer-links">
                            <li><Link to="/products">All Products</Link></li>
                            <li><Link to="/products?category=electronics">Electronics</Link></li>
                            <li><Link to="/products?category=jewelery">Jewellery</Link></li>
                            <li><Link to="/products?category=mens-clothing">Men's Clothing</Link></li>
                        </ul>
                    </div>
                    <div className="footer-column">
                        <h5>Help</h5>
                        <ul className="footer-links">
                            <li><Link to="/contact">Contact Us</Link></li>
                            <li><Link to="/about">About Us</Link></li>
                            <li><Link to="/privacy">Privacy Policy</Link></li>
                        </ul>
                    </div>
                    <div className="footer-column">
                        <h5>Stay Connected</h5>
                        <p>Join our newsletter for weekly updates and special deals.</p>
                        <form className="newsletter-form">
                            <input type="email" placeholder="Enter your email" />
                            <button type="submit">Subscribe</button>
                        </form>
                        <div className="social-icons">
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebookF /></a>
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
                            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"><FaLinkedinIn /></a>
                        </div>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} Local_Global. All rights reserved.</p>
                    <div className="footer-bottom-links">
                        <Link to="/privacy">Privacy Policy</Link>
                        <Link to="/terms">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;