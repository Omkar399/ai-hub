import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { logoutUser } from '../services/api';

const Navbar = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false); // Track user authentication status
    const navigate = useNavigate();

    // Check if the user is logged in (e.g., by checking localStorage or a backend session)
    useEffect(() => {
        const user = localStorage.getItem('user'); // Check if user data is stored in localStorage
        setIsAuthenticated(!!user); // If user exists, set isAuthenticated to true
    }, []);

    const handleLogout = async () => {
        try {
            const response = await logoutUser(); // Call the API to log out
            
            if (response.message === "Successfully logged out") {
                localStorage.removeItem('user'); // Remove user data from localStorage
                setIsAuthenticated(false); // Update authentication state
                navigate('/login'); // Redirect to login page
            }
        } catch (error) {
            console.error('Logout failed:', error.response?.data || error.message);
        }
    };

    return (
        <AppBar position="static">
            <Toolbar>
                {/* Logo or Brand Name */}
                <Typography 
                    variant="h6" 
                    component={Link} 
                    to="/" 
                    sx={{ flexGrow: 1, textDecoration: 'none', color: 'white' }}
                >
                    AI Learning Hub
                </Typography>

                {/* Navigation Links */}
                <Box>
                    <Button color="inherit" component={Link} to="/search">Search</Button>
                    <Button color="inherit" component={Link} to="/github">GitHub</Button>
                    <Button color="inherit" component={Link} to="/dashboard">Dashboard</Button>
                    <Button color="inherit" component={Link} to="/chat">Chat</Button>

                    {/* Authentication Buttons */}
                    {!isAuthenticated ? (
                        <>
                            <Button color="inherit" component={Link} to="/login">Login</Button>
                            <Button color="inherit" component={Link} to="/signup">Signup</Button>
                        </>
                    ) : (
                        <Button color="inherit" onClick={handleLogout}>Logout</Button>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
