import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // This hook runs once when the app starts to check for a saved session
    useEffect(() => {
        const token = localStorage.getItem('userToken');
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                
                // Check if the token is expired
                if (decodedToken.exp * 1000 < Date.now()) {
                    // Token is expired, so log the user out
                    localStorage.removeItem('userToken');
                    setUser(null);
                } else {
                    // Token is valid, set the user
                    setUser(decodedToken.user);
                }
            } catch (error) {
                // If token is malformed, clear it
                localStorage.removeItem('userToken');
                setUser(null);
            }
        }
        setLoading(false); // Finished checking for a user
    }, []);

    const login = (token) => {
        try {
            localStorage.setItem('userToken', token);
            const decodedToken = jwtDecode(token);
            setUser(decodedToken.user);
        } catch (error) {
            console.error("Failed to decode token on login:", error);
        }
    };

    const logout = () => {
        localStorage.removeItem('userToken');
        setUser(null);
        // We can also redirect to home page on logout for a better UX
        window.location.href = '/login';
    };

    const isAuthenticated = !!user;
    const value = { user, isAuthenticated, loading, login, logout };

    // Don't render the app until we know if the user is logged in or not
    if (loading) {
        // You can replace this with your <Spinner /> component for a better look
        return <div>Loading Application...</div>; 
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};