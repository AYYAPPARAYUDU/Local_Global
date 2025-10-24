import React from 'react';
import { FaStar } from 'react-icons/fa';
// Note: This component uses styles from the main App.css file

const StoreCard = ({ store }) => {
    return (
        <div className="store-card">
            <img src={store.image} alt={store.title} className="store-card-image" />
            <div className="store-card-body">
                <h5 className="store-card-title">{store.title}</h5>
                <div className="store-card-rating">
                    <FaStar /> {store.rating.rate}
                </div>
            </div>
        </div>
    );
};

export default StoreCard;