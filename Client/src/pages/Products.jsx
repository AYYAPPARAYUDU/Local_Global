import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Card from '../components/Card';
import Chat from '../components/Chat';
import Spinner from '../components/Spinner';
import apiService from '../services/api';
import { useLocation } from '../context/LocationContext'; // 1. Import the new Location hook

const Products = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [allProducts, setAllProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [category, setCategory] = useState('all');
    
    // --- CHAT STATE (NOW COMPLETE) ---
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [currentChatShop, setCurrentChatShop] = useState(null);
    const [currentChatProduct, setCurrentChatProduct] = useState(null); // 2. Add product state for chat

    // --- LOCATION STATE ---
    const { location, loading: locationLoading, error: locationError } = useLocation(); // 3. Get customer's location

    const searchTerm = searchParams.get('search') || '';

    useEffect(() => {
        // 4. Wait for the location to be loaded
        if (locationLoading) return;

        const getProducts = async () => {
            try {
                setLoading(true);
                setError(null);

                const params = {
                    keyword: searchTerm,
                    category: category === 'all' ? '' : category,
                };
                
                // 5. Send customer's location to the backend (if we have it)
                if (location) {
                    params.lat = location.lat;
                    params.lng = location.lng;
                }
                
                const res = await apiService.getAllProducts(params);
                
                if (!Array.isArray(res.data)) {
                    throw new Error('Invalid product data received');
                }

                // 6. NO MORE FAKE DISTANCE! We use the real data from the backend.
                setAllProducts(res.data);
            } catch (err) {
                console.error('Failed to fetch products:', err);
                setError('Could not load products. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        getProducts();
    }, [searchTerm, category, location, locationLoading]); // Re-fetch if location changes

    // 7. Smarter filtering based on real distance data
    const localProducts = useMemo(() => 
        allProducts
            .filter(p => p.distance != null) // Products that have a distance
            .sort((a, b) => a.distance - b.distance), // Sort from nearest to farthest
        [allProducts]
    );

    const globalProducts = useMemo(() =>
        allProducts.filter(p => p.distance == null), // Products with no location data
        [allProducts]
    );

    // 8. CHAT FIX: Pass the full product to the chat state
    const handleOpenChat = (product) => {
        if (!product || !product.user) {
            console.warn('Invalid product user data for chat');
            return;
        }
        setCurrentChatShop(product.user);
        setCurrentChatProduct(product);
        setIsChatOpen(true);
    };

    const handleCloseChat = () => {
        setIsChatOpen(false);
        setCurrentChatShop(null);
        setCurrentChatProduct(null);
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
    };
    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 },
    };

    if (loading || locationLoading) return <Spinner />;

    return (
        <div className="products-page-container">
            <header className="page-header">
                 <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                     <h1>{searchTerm ? `Results for "${searchTerm}"` : "Explore Our Collection"}</h1>
                     <p>Find the best deals from local and global stores, curated just for you.</p>
                 </motion.div>
            </header>

            <div className="container py-5">
                <div className="filter-bar d-flex flex-column flex-lg-row justify-content-between align-items-center gap-4 mb-5">
                    
                    {/* 9. The distance slider is removed, as we now use real location */}

                    <div className="search-and-filter d-flex gap-3 w-100">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Refine search..."
                            value={searchTerm}
                            onChange={(e) => setSearchParams(e.target.value ? { search: e.target.value } : {})}
                        />
                        <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)}>
                            <option value="all">All Categories</option>
                            <option value="electronics">Electronics</option>
                            <option value="men's clothing">Men's Clothing</option>
                            <option value="women's clothing">Women's Clothing</option>
                            <option value="jewelery">Jewellery</option>
                        </select>
                    </div>
                </div>

                {error && <div className="alert alert-danger text-center">{error}</div>}
                {locationError && <div className="alert alert-warning text-center">{locationError}</div>}

                <>
                    <section className="mb-5">
                        <h2 className="section-title mb-4">Local Shops (Nearest to You)</h2>
                        {localProducts.length > 0 ? (
                            <motion.div className="product-grid" variants={containerVariants} initial="hidden" animate="visible">
                                {localProducts.map((product) => (
                                    <motion.div key={product._id} variants={itemVariants}>
                                        <Link to={`/products/${product._id}`} className="product-link">
                                            {/* This now passes the REAL distance prop to the card */}
                                            <Card product={product} onChatClick={handleOpenChat} />
                                        </Link>
                                    </motion.div>
                                ))}
                            </motion.div>
                        ) : (
                            <div className="text-center p-4 bg-white rounded-3 border">
                                <p className="text-muted mb-0">No local products found. Enable location to see shops near you.</p>
                            </div>
                        )}
                    </section>

                    <section>
                        <h2 className="section-title mb-4">Global Shops</h2>
                        {globalProducts.length > 0 ? (
                            <motion.div className="product-grid" variants={containerVariants} initial="hidden" animate="visible">
                                {globalProducts.map((product) => (
                                    <motion.div key={product._id} variants={itemVariants}>
                                        <Link to={`/products/${product._id}`} className="product-link">
                                            <Card product={product} onChatClick={handleOpenChat} />
                                        </Link>
                                    </motion.div>
                                ))}
                            </motion.div>
                        ) : (
                            <div className="text-center p-4 bg-white rounded-3 border">
                                <p className="text-muted mb-0">No other products found matching your filters.</p>
                            </div>
                        )}
                    </section>
                </>
            </div>

            {/* 10. CHAT FIX: Pass the 'product' prop */}
            <AnimatePresence>
                {isChatOpen && currentChatShop && currentChatProduct && (
                    <Chat 
                        shopkeeper={currentChatShop} 
                        product={currentChatProduct} 
                        onClose={handleCloseChat} 
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default Products;