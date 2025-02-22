import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component={Link} to="/" sx={{ flexGrow: 1, textDecoration: 'none', color: 'white' }}>
                    AI Learning Hub
                </Typography>
                <Box>
                    <Button color="inherit" component={Link} to="/search">Search</Button>
                    <Button color="inherit" component={Link} to="/github">GitHub</Button>
                    <Button color="inherit" component={Link} to="/dashboard">Dashboard</Button>
                    <Button color="inherit" component={Link} to="/chat">Chat</Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
