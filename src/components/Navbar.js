import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { logoutUser } from '../services/api';

const Navbar = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false); // Track user authentication status
    const [isAdmin, setIsAdmin] = useState(false); // Track if the user is an admin
    const navigate = useNavigate();

    // Check if the user is logged in and their username
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user')); // Parse user data from localStorage
        if (user) {
            setIsAuthenticated(true);
            setIsAdmin(user.username === 'admin'); // Check if the username is 'admin'
        }
    }, []);

    const handleLogout = async () => {
        try {
            await logoutUser(); // Call the API to log out
            localStorage.removeItem('user'); // Remove user data from localStorage
            setIsAuthenticated(false); // Update authentication state
            setIsAdmin(false); // Reset admin state
            navigate('/login'); // Redirect to login page
        } catch (error) {
            console.error('Logout failed:', error); // Log any errors
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
                    <Button color="inherit" component={Link} to="/knowledgebase">Knowledge Base</Button>
                    <Button color="inherit" component={Link} to="/github">GitHub</Button>
                    <Button color="inherit" component={Link} to="/chat">Chat</Button>

                    {/* Show Submit Resource Button for Authenticated Users */}
                    {isAuthenticated && (
                        <Button color="inherit" component={Link} to="/submit-resource">
                            Submit Resource
                        </Button>
                    )}

                    {/* Show Admin Panel Button for Admin Users */}
                    {isAuthenticated && isAdmin && (
                        <Button color="inherit" component={Link} to="/admin-panel">
                            Admin Panel
                        </Button>
                    )}

                    {/* Authentication Buttons */}
                    {isAuthenticated ? (
                        <>
                            <Button color="inherit" component={Link} to="/dashboard">Dashboard</Button>
                            <Button color="inherit" onClick={handleLogout}>Logout</Button>
                        </>
                    ) : (
                        <>
                            <Button color="inherit" component={Link} to="/login">Login</Button>
                            <Button color="inherit" component={Link} to="/signup">Signup</Button>
                        </>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
