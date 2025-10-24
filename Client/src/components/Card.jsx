import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LuMessageSquareText } from "react-icons/lu";
import { IoMdCall } from "react-icons/io";
import { FaLocationDot } from "react-icons/fa6";
import { useCart } from '../context/CartContext';
import { motion } from 'framer-motion';
import '../pages/styles/components/Card.css'; // Make sure this path is correct

const Card = ({ product, onChatClick }) => {
    const navigate = useNavigate();
    const { addToCart } = useCart();

    const {
        image = "https://placehold.co/300x300?text=Image",
        name = "Product Name",
        price = 0,
        originalPrice = 0,
        distance, // This is the key prop for the location feature
        user,
        stock = 0,
    } = product;

    const isOutOfStock = stock === 0;

    const handleInteraction = (e, action) => {
        e.preventDefault();
        e.stopPropagation();
        action();
    };
    
    const handleCallClick = (e) => e.stopPropagation();

    return (
        <motion.div 
            className={`card hover-effect h-100 ${isOutOfStock ? 'out-of-stock' : ''}`}
            whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
        >
            <div className="product-image-container">
                {isOutOfStock && <div className="out-of-stock-badge">Out of Stock</div>}
                <img src={image} alt={name} className='product-image'/>
            </div>
            
            <div className='card-content-wrapper'>
                <p className='product-name'><b>{name}</b></p>
                
                <div className='price-row'>
                    <p className='price'>
                        ₹{price?.toFixed(2)} 
                        {originalPrice > 0 && <span className='original-price'>₹{originalPrice?.toFixed(2)}</span>}
                    </p>
                    <div className='icon-group'>
                        {onChatClick && <LuMessageSquareText className='Message' onClick={(e) => handleInteraction(e, () => onChatClick(product))} />}
                        {user?.phone && (
                            <a href={`tel:${user.phone}`} onClick={handleCallClick}>
                                <IoMdCall className='Phone' />
                            </a>
                        )}
                    </div>
                </div> 

                {distance != null && (
                    <p className='location-info'><FaLocationDot/> {distance.toFixed(1)} km away</p>
                )}

                <div className='button-row'>
                    <button 
                        className='add_cart' 
                        onClick={(e) => handleInteraction(e, () => {
                            addToCart(product);
                            alert(`${name} has been added to your cart!`);
                        })}
                        disabled={isOutOfStock}
                    >
                        Add to Cart
                    </button>
                    <button 
                        className='buy_now' 
                        onClick={(e) => handleInteraction(e, () => {
                            addToCart(product);
                            navigate('/cart');
                        })}
                        disabled={isOutOfStock}
                    >
                        Buy Now
                    </button>
                </div> 
            </div>
        </motion.div>
    );
};

export default Card;