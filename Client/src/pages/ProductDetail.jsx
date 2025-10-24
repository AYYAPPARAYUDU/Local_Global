import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useAuth } from '../hooks/useAuth';
import Card from '../components/Card';
import Chat from '../components/Chat';
import Spinner from '../components/Spinner';
import Map from '../components/Map'; // 1. Import the new Map component
import apiService from '../services/api';
import './styles/ProductDetail.css';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { isAuthenticated } = useAuth();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [mainImage, setMainImage] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('description');
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [isChatOpen, setIsChatOpen] = useState(false);

    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [reviewError, setReviewError] = useState('');
    const [isReviewSubmitting, setIsReviewSubmitting] = useState(false);

    const loadProductData = useCallback(async () => {
        window.scrollTo(0, 0);
        try {
            setLoading(true);
            setError(null);
            // This API call already populates the full 'user' object with location, upiId, etc.
            const productResponse = await apiService.getProductById(id);
            const productData = productResponse.data;

            if (productData) {
                setProduct(productData);
                // This logic correctly handles single or multiple images
                const images = productData.images?.length > 0 ? productData.images : [productData.image];
                productData.images = images;
                setMainImage(images[0]);

                const relatedResponse = await apiService.getAllProducts({ category: productData.category });
                const related = relatedResponse.data.filter(p => p._id !== productData._id).slice(0, 4);
                setRelatedProducts(related);
            } else {
                setError("Product not found.");
            }
        } catch (err) {
            setError("Could not load product data.");
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        loadProductData();
    }, [id, loadProductData]);

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0) {
            setReviewError("Please select a star rating.");
            return;
        }
        setIsReviewSubmitting(true);
        setReviewError('');
        try {
            await apiService.createProductReview(id, { rating, comment });
            alert('Review submitted successfully!');
            setRating(0);
            setComment('');
            loadProductData();
        } catch (err) {
            setReviewError(err.response?.data?.msg || "Failed to submit review.");
        } finally {
            setIsReviewSubmitting(false);
        }
    };

    const handleAddToCart = () => addToCart({ ...product, quantity });
    const handleBuyNow = () => { addToCart({ ...product, quantity }); navigate('/checkout'); };
    
    if (loading) return <Spinner />;
    if (error) return <div className="d-flex justify-content-center align-items-center vh-100 text-danger bg-light"><h2>{error}</h2></div>;
    if (!product) return <div className="d-flex justify-content-center align-items-center vh-100 bg-light"><h2>Product Not Found</h2></div>;

    const isOutOfStock = product.stock === 0;
    const StarRating = ({ ratingValue }) => <span>{'★'.repeat(Math.round(ratingValue))}{'☆'.repeat(5 - Math.round(ratingValue))}</span>;

    return (
        <div className="product-detail-page">
            <div className="container">
                <motion.div className="main-product-card p-4 p-md-5 mb-5" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="row g-5">
                        <div className="col-lg-6">
                            <motion.img src={mainImage} alt="Main product" className="main-image mb-4" key={mainImage} initial={{ opacity: 0 }} animate={{ opacity: 1 }} />
                            <div className="thumbnail-gallery">
                                {product.images.map((img, idx) => (
                                    <motion.img key={idx} src={img} alt={`Thumbnail ${idx}`} className={`thumbnail ${mainImage === img ? 'active' : ''}`} onClick={() => setMainImage(img)} whileHover={{ scale: 1.05 }} />
                                ))}
                            </div>
                        </div>
                         <div className="col-lg-6 d-flex flex-column">
                            <h1 className="product-title">{product.name}</h1>
                            <p className="product-price mb-3">₹{product.price.toFixed(2)}</p>
                            <p className="mb-3">
                                <span className={`badge fs-6 ${isOutOfStock ? 'bg-danger' : 'bg-success'}`}>
                                    {isOutOfStock ? 'Out of Stock' : 'In Stock'}
                                </span>
                            </p>
                            <div className="d-flex align-items-center mb-4">
                                <StarRating ratingValue={product.rating} />
                                <span className="ms-3 text-muted fs-5">({product.numReviews} reviews)</span>
                            </div>
                            <p className="fs-5 text-secondary">{product.description.substring(0, 150)}...</p>
                             <div className="d-flex align-items-center my-4 quantity-selector">
                                <button className="btn btn-outline-secondary rounded-circle" onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</button>
                                <span className="mx-4">{quantity}</span>
                                <button className="btn btn-outline-secondary rounded-circle" onClick={() => setQuantity(q => q + 1)}>+</button>
                            </div>
                             <div className="d-grid gap-3 d-sm-flex mt-auto">
                                <button className="btn btn-primary action-btn flex-grow-1" onClick={handleAddToCart} disabled={isOutOfStock}>Add to Cart</button>
                                <button className="btn btn-dark action-btn flex-grow-1" onClick={() => setIsChatOpen(true)} disabled={!product.user}>Chat with Seller</button>
                            </div>
                         </div>
                    </div>
                    
                    <div className="mt-5 pt-4 border-top">
                        <div className="info-tabs">
                            <button className={`tab-button ${activeTab === 'description' ? 'active' : ''}`} onClick={() => setActiveTab('description')}>Description</button>
                            <button className={`tab-button ${activeTab === 'reviews' ? 'active' : ''}`} onClick={() => setActiveTab('reviews')}>Reviews ({product.numReviews})</button>
                            
                            {/* --- 2. ADD NEW TABS --- */}
                            <button className={`tab-button ${activeTab === 'shopInfo' ? 'active' : ''}`} onClick={() => setActiveTab('shopInfo')}>Shop Info</button>
                            {product.user?.location && (
                                <button className={`tab-button ${activeTab === 'location' ? 'active' : ''}`} onClick={() => setActiveTab('location')}>Shop Location</button>
                            )}
                        </div>
                        <AnimatePresence mode="wait">
                            <motion.div key={activeTab} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -10, opacity: 0 }} className="tab-content py-4">
                                
                                {activeTab === 'description' && (
                                    <p className="fs-5 lh-lg text-secondary">{product.description}</p>
                                )}

                                {activeTab === 'reviews' && (
                                    <div className="reviews-section">
                                        {product.reviews.map(review => (
                                            <div className="review-card" key={review._id}>
                                                <p className="fw-bold fs-5 mb-1">{review.name}</p>
                                                <div className="review-stars mb-2"><StarRating ratingValue={review.rating} /></div>
                                                <p className="text-secondary">{review.comment}</p>
                                                <small className="text-muted">{new Date(review.createdAt).toLocaleDateString()}</small>
                                            </div>
                                        ))}
                                        <div className="review-form mt-5">
                                            <h4>Write a Review</h4>
                                            {isAuthenticated ? (
                                                <form onSubmit={handleReviewSubmit}>
                                                    <div className="mb-3"><label className="form-label fs-5">Your Rating</label><div className="star-rating-input">
                                                        {[1, 2, 3, 4, 5].map(star => (<span key={star} className={`star ${rating >= star ? 'active' : ''}`} onClick={() => setRating(star)}>★</span>))}
                                                    </div></div>
                                                    <div className="mb-3"><label className="form-label fs-5">Your Comment</label><textarea className="form-control fs-5" rows="4" value={comment} onChange={(e) => setComment(e.target.value)} required></textarea></div>
                                                    {reviewError && <div className="alert alert-danger">{reviewError}</div>}
                                                    <button type="submit" className="btn btn-primary action-btn" disabled={isReviewSubmitting}>
                                                        {isReviewSubmitting ? 'Submitting...' : 'Submit Review'}
                                                    </button>
                                                </form>
                                            ) : (
                                                <p className="text-muted fs-5">Please <Link to="/login">log in</Link> to write a review.</p>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* --- 3. ADD NEW TAB CONTENT --- */}
                                {activeTab === 'shopInfo' && (
                                    <div className="shop-info-container">
                                        <h5>Shop Name: {product.user?.shopName || 'N/A'}</h5>
                                        <p>Contact: {product.user?.phone || 'N/A'}</p>
                                        <h5 className="mt-4">Return Policy</h5>
                                        <p>{product.user?.returnPolicy || 'No return policy specified.'}</p>
                                    </div>
                                )}
                                {activeTab === 'location' && product.user?.location?.coordinates && (
                                    <div className="shop-location-container">
                                        <Map 
                                            lat={product.user.location.coordinates[1]} 
                                            lng={product.user.location.coordinates[0]} 
                                        />
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </motion.div>

                {relatedProducts.length > 0 && (
                     <motion.section className="mt-5" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                         <h2 className="related-products-title mb-4 text-center">Related Products</h2>
                         <div className="row row-cols-1 row-cols-md-4 g-4">
                             {relatedProducts.map(p => ( <div className="col" key={p._id}><Card product={p} /></div> ))}
                         </div>
                     </motion.section>
                )}
            </div>
            
            <AnimatePresence>
                {isChatOpen && product.user && (
                    <Chat 
                        shopkeeper={product.user} 
                        product={product} 
                        onClose={() => setIsChatOpen(false)} 
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default ProductDetail;