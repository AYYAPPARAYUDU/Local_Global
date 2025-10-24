import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext'; // Import the context itself

/**
 * A custom hook that provides a clean shortcut to access the AuthContext.
 * It simplifies getting user data, authentication status, and login/logout functions.
 * @returns {object} The authentication context value.
 */
export const useAuth = () => {
    const context = useContext(AuthContext);

    // This check is a good practice. It ensures the hook is only used
    // inside a component that is a child of the AuthProvider.
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
};