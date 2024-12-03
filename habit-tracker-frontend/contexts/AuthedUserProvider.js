import React, { createContext, useState, useEffect, useContext } from 'react';
import { getUser } from '../services/authService';

// Create the AuthedUserContext
const AuthedUserContext = createContext(null);

// Provider Component
const AuthedUserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check for an authenticated user on mount
    useEffect(() => {
        const checkUser = async () => {
            setLoading(true);
            try {
                const authedUser = await getUser();
                setUser(authedUser);
            } catch (error) {
                console.error('Error checking user:', error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        checkUser();
    }, []);

    return (
        <AuthedUserContext.Provider value={{ user, setUser, loading }}>
            {children}
        </AuthedUserContext.Provider>
    );
};

// Custom Hook for consuming the context
const useAuthedUser = () => {
    const context = useContext(AuthedUserContext);
    if (!context) {
        throw new Error('useAuthedUser must be used within an AuthedUserProvider');
    }
    return context;
};

export { AuthedUserProvider, useAuthedUser };
