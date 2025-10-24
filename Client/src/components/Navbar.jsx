import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiUser, FiShoppingCart, FiMenu, FiX, FiLogOut, FiGrid, FiList } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../context/CartContext';
import apiService from '../services/api';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const { isAuthenticated, user, logout } = useAuth();
    const { cartItems } = useCart();
    
    const [query, setQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [isSearchActive, setIsSearchActive] = useState(false);
    const searchContainerRef = useRef(null);
    const profileContainerRef = useRef(null);
    const navigate = useNavigate();

    const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

    const navLinks = [
        { name: "Home", path: "/" },
        { name: "Products", path: "/products" },
        { name: "About", path: "/about" },
        { name: "Contact", path: "/contact" },
    ];
    
    // Live search with debounce
    useEffect(() => {
        if (!isSearchActive) return;
        const fetchSearchResults = async () => {
            try {
                const res = await apiService.getAllProducts({ keyword: query.trim() });
                setSearchResults(res.data.slice(0, 5));
            } catch (error) { console.error("Search failed:", error); }
        };
        const debounceTimer = setTimeout(() => {
            if (query.trim() !== '') fetchSearchResults();
            else setSearchResults([]);
        }, 300);
        return () => clearTimeout(debounceTimer);
    }, [query, isSearchActive]);

    // Click outside handler for search and profile dropdowns
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
                setIsSearchActive(false);
            }
            if (profileContainerRef.current && !profileContainerRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (!query.trim()) return;
        setIsSearchActive(false);
        setQuery('');
        navigate(`/products?search=${query}`);
    };

    const menuVariants = {
        hidden: { x: "100%" },
        visible: { x: 0, transition: { type: 'spring', stiffness: 120, damping: 20 } },
        exit: { x: "100%", transition: { duration: 0.3 } }
    };
    
    const dropdownVariants = {
        hidden: { opacity: 0, y: -10, scale: 0.95 },
        visible: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: -10, scale: 0.95 }
    };

    return (
        <>
            <motion.nav className="custom-navbar w-100" initial={{ y: -80 }} animate={{ y: 0 }}>
                <div className="nav-content px-4">
                    <NavLink to="/" className="logo d-flex align-items-center gap-2 text-decoration-none">
                        <motion.div whileHover={{ rotate: [0, 10, -10, 0] }}><span className="logo-icon">🛒</span></motion.div>
                        <div className="logo-text d-none d-md-block">Local_Global</div>
                    </NavLink>

                    <div className="desktop-nav-links d-none d-lg-flex">
                        {navLinks.map((link) => (
                            <NavLink key={link.name} to={link.path} className={({ isActive }) => `nav-item ${isActive ? "active-link" : ""}`}>
                                {({ isActive }) => (
                                    <>
                                        {link.name}
                                        {isActive && <motion.div className="underline" layoutId="desktop-underline" />}
                                    </>
                                )}
                            </NavLink>
                        ))}
                    </div>

                    <div className="nav-right-side">
                        <div className="search-container d-none d-lg-block" ref={searchContainerRef}>
                            <form onSubmit={handleSearchSubmit}>
                                <div className="search-bar">
                                    <input type="text" placeholder="Search products..." value={query} onChange={(e) => setQuery(e.target.value)} onFocus={() => setIsSearchActive(true)} />
                                    <FiSearch className="search-icon" />
                                </div>
                            </form>
                            <AnimatePresence>
                                {isSearchActive && (
                                    <motion.div className="search-results-dropdown" variants={dropdownVariants} initial="hidden" animate="visible" exit="exit">
                                        <h6>{query.trim() ? 'Search Results' : 'Trending Products'}</h6>
                                        {searchResults.map(product => (
                                            <Link to={`/products/${product._id}`} key={product._id} className="result-item" onClick={() => setIsSearchActive(false)}>
                                                <img src={product.image} alt={product.name} className="result-item-image"/>
                                                <div className="result-item-info"><h5>{product.name}</h5><p>${product.price.toFixed(2)}</p></div>
                                            </Link>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                        
                        <NavLink to="/cart" className="nav-item cart-icon-wrapper">
                            <FiShoppingCart className="cart-icon" />
                            <AnimatePresence>{cartCount > 0 && (<motion.span className="cart-badge" key={cartCount}>{cartCount}</motion.span>)}</AnimatePresence>
                        </NavLink>

                        <div className="d-none d-lg-flex align-items-center gap-2">
                            {isAuthenticated ? (
                                <div className="profile-section" ref={profileContainerRef}>
                                    <motion.div whileTap={{ scale: 0.9 }} className="profile-icon nav-item" onClick={() => setIsProfileOpen(!isProfileOpen)}><FiUser /></motion.div>
                                    <AnimatePresence>
                                        {isProfileOpen && (
                                            <motion.div className="profile-dropdown" variants={dropdownVariants} initial="hidden" animate="visible" exit="exit">
                                                <div className="p-2 text-center border-bottom"><span className="fw-bold">{user.name}</span></div>
                                                
                                                {user.role === 'shopkeeper' ? (
                                                    <Link to="/dashboard" className="profile-dropdown-item" onClick={() => setIsProfileOpen(false)}><FiGrid className="me-2"/>Dashboard</Link>
                                                ) : (
                                                    <>
                                                        <Link to="/profile" className="profile-dropdown-item" onClick={() => setIsProfileOpen(false)}>My Profile</Link>
                                                        <Link to="/my-orders" className="profile-dropdown-item" onClick={() => setIsProfileOpen(false)}><FiList className="me-2"/>My Orders</Link>
                                                    </>
                                                )}

                                                <button className="profile-dropdown-item" onClick={() => { logout(); setIsProfileOpen(false); }}><FiLogOut className="me-2"/>Logout</button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ) : (
                                <div className="auth-buttons d-flex gap-2">
                                    <Link to="/login" className="btn btn-primary btn-sm">Login</Link>
                                    <Link to="/signup" className="btn btn-outline-secondary btn-sm">Sign Up</Link>
                                </div>
                            )}
                        </div>
                        
                        <button className="menu-toggle d-lg-none" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                            {isMenuOpen ? <FiX /> : <FiMenu />}
                        </button>
                    </div>
                </div>
            </motion.nav>

            <AnimatePresence>
                {isMenuOpen && (
                    <>
                        <motion.div className="nav-backdrop" onClick={() => setIsMenuOpen(false)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
                        <motion.div className="mobile-nav-container" variants={menuVariants} initial="hidden" animate="visible" exit="exit">
                            {navLinks.map((link, i) => (
                                <motion.div key={i} initial={{ opacity: 0, y:20 }} animate={{ opacity: 1, y:0 }} transition={{ delay: 0.1 * i }}>
                                    <NavLink to={link.path} className="nav-item fs-3" onClick={() => setIsMenuOpen(false)}>{link.name}</NavLink>
                                </motion.div>
                            ))}
                            <hr className="w-75"/>
                            <motion.div className="w-75" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                               {isAuthenticated ? (
                                    <>
                                      {user.role === 'shopkeeper' ? (
                                        <Link to="/dashboard" className="btn btn-primary w-100 mb-3" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
                                      ) : (
                                        <Link to="/profile" className="btn btn-primary w-100 mb-3" onClick={() => setIsMenuOpen(false)}>My Profile</Link>
                                      )}
                                      <button className="btn btn-secondary w-100" onClick={() => { logout(); setIsMenuOpen(false); }}>Logout</button>
                                    </>
                               ) : (
                                    <>
                                       <Link to="/login" className="btn btn-primary w-100 mb-3" onClick={() => setIsMenuOpen(false)}>Login</Link>
                                       <Link to="/signup" className="btn btn-outline-secondary w-100" onClick={() => setIsMenuOpen(false)}>Sign Up</Link>
                                    </>
                               )}
                            </motion.div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;