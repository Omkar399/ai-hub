import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config';

const ProtectedRoute = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null); // null indicates loading state

    useEffect(() => {
        const checkAuth = async () => {
            try {
                // Call the /auth/check endpoint to verify authentication
                const response = await axios.get(`${API_BASE_URL}/auth/check`, { withCredentials: true });
                if (response.data.loggedIn) {
                    setIsAuthenticated(true); // User is authenticated
                } else {
                    setIsAuthenticated(false); // User is not authenticated
                }
            } catch (error) {
                console.error('Error checking authentication:', error);
                setIsAuthenticated(false); // Assume not authenticated on error
            }
        };

        checkAuth();
    }, []);

    if (isAuthenticated === null) {
        // While checking authentication, show a loading spinner or placeholder
        return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
        // Redirect to login page if not authenticated
        return <Navigate to="/login" />;
    }

    // Render the protected children if authenticated
    return children;
};

export default ProtectedRoute;
