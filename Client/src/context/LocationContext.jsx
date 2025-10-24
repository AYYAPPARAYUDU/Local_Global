import React, { useState, useEffect, createContext, useContext } from 'react';

// 1. Create the Context
const LocationContext = createContext();

// 2. Create the Provider component
export const LocationProvider = ({ children }) => {
    const [location, setLocation] = useState(null); // Will be { lat, lng }
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // 3. Ask for the user's location
        if (!navigator.geolocation) {
            setError("Geolocation is not supported by your browser.");
            setLoading(false);
            return;
        }

        // This pops up the "Allow Location" request in the browser
        navigator.geolocation.getCurrentPosition(
            (position) => {
                // 4. On success, save the location
                setLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                });
                setLoading(false);
            },
            () => {
                // 5. On error (e.g., user clicks "Block"), set an error
                setError("Please enable location services to see nearby products.");
                setLoading(false);
            }
        );
    }, []);

    // 6. Provide the location data to the rest of the app
    return (
        <LocationContext.Provider value={{ location, loading, error }}>
            {children}
        </LocationContext.Provider>
    );
};

// 7. Create a custom hook for easy access to the context
export const useLocation = () => {
    return useContext(LocationContext);
};