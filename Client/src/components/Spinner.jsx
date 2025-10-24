import React from 'react';
// No CSS import needed as it's in App.css

const Spinner = () => {
    return (
        <div className="spinner-overlay">
            <div className="spinner"></div>
            <p className="spinner-text">Loading...</p>
        </div>
    );
};

export default Spinner;