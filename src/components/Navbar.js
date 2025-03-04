import React, { useState, useEffect } from 'react';
import { 
    AppBar, 
    Toolbar, 
    Typography, 
    Button, 
    Box, 
    IconButton, 
    Menu, 
    MenuItem,
    useTheme,
    useMediaQuery,
    Avatar,
    Divider
} from '@mui/material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import GitHubIcon from '@mui/icons-material/GitHub';
import ChatIcon from '@mui/icons-material/Chat';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import LogoutIcon from '@mui/icons-material/Logout';
import { logoutUser } from '../services/api';

const Navbar = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [mobileMenuAnchorEl, setMobileMenuAnchorEl] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            setIsAuthenticated(true);
            setIsAdmin(user.username === 'admin');
        }
    }, []);

    const handleLogout = async () => {
        try {
            await logoutUser();
            localStorage.removeItem('user');
            setIsAuthenticated(false);
            setIsAdmin(false);
            handleMenuClose();
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleMobileMenuOpen = (event) => {
        setMobileMenuAnchorEl(event.currentTarget);
    };

    const handleMobileMenuClose = () => {
        setMobileMenuAnchorEl(null);
    };

    const isCurrentPath = (path) => {
        return location.pathname === path;
    };

    const NavButton = ({ to, icon, label }) => (
        <Button
            component={Link}
            to={to}
            color="inherit"
            startIcon={icon}
            sx={{
                mx: 1,
                borderRadius: '8px',
                padding: '6px 16px',
                backgroundColor: isCurrentPath(to) ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                },
            }}
        >
            {label}
        </Button>
    );

    const renderDesktopNav = () => (
        <>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <NavButton to="/search" icon={<SearchIcon />} label="Search" />
                <NavButton to="/knowledgebase" icon={<LibraryBooksIcon />} label="Knowledge Base" />
                <NavButton to="/github" icon={<GitHubIcon />} label="GitHub" />
                <NavButton to="/chat" icon={<ChatIcon />} label="Chat" />
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto' }}>
                {isAuthenticated && (
                    <>
                        {isAdmin && (
                            <NavButton to="/admin-panel" icon={<AdminPanelSettingsIcon />} label="Admin" />
                        )}
                        <NavButton to="/submit-resource" icon={<AddCircleOutlineIcon />} label="Submit" />
                        <NavButton to="/dashboard" icon={<DashboardIcon />} label="Dashboard" />
                        <IconButton
                            onClick={handleMenuOpen}
                            color="inherit"
                            sx={{ ml: 1 }}
                        >
                            <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.dark' }}>
                                {localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).username[0].toUpperCase() : 'U'}
                            </Avatar>
                        </IconButton>
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleMenuClose}
                            sx={{ mt: 1 }}
                        >
                            <MenuItem onClick={handleLogout}>
                                <LogoutIcon sx={{ mr: 1 }} /> Logout
                            </MenuItem>
                        </Menu>
                    </>
                )}
                {!isAuthenticated && (
                    <>
                        <Button
                            component={Link}
                            to="/login"
                            variant="outlined"
                            color="inherit"
                            sx={{ mr: 1 }}
                        >
                            Login
                        </Button>
                        <Button
                            component={Link}
                            to="/signup"
                            variant="contained"
                            color="secondary"
                        >
                            Sign Up
                        </Button>
                    </>
                )}
            </Box>
        </>
    );

    const renderMobileNav = () => (
        <>
            <IconButton
                color="inherit"
                onClick={handleMobileMenuOpen}
                sx={{ ml: 'auto' }}
            >
                <MenuIcon />
            </IconButton>
            <Menu
                anchorEl={mobileMenuAnchorEl}
                open={Boolean(mobileMenuAnchorEl)}
                onClose={handleMobileMenuClose}
                sx={{ mt: 1 }}
            >
                <MenuItem component={Link} to="/search" onClick={handleMobileMenuClose}>
                    <SearchIcon sx={{ mr: 1 }} /> Search
                </MenuItem>
                <MenuItem component={Link} to="/knowledgebase" onClick={handleMobileMenuClose}>
                    <LibraryBooksIcon sx={{ mr: 1 }} /> Knowledge Base
                </MenuItem>
                <MenuItem component={Link} to="/github" onClick={handleMobileMenuClose}>
                    <GitHubIcon sx={{ mr: 1 }} /> GitHub
                </MenuItem>
                <MenuItem component={Link} to="/chat" onClick={handleMobileMenuClose}>
                    <ChatIcon sx={{ mr: 1 }} /> Chat
                </MenuItem>
                
                {isAuthenticated && (
                    <>
                        <Divider />
                        {isAdmin && (
                            <MenuItem component={Link} to="/admin-panel" onClick={handleMobileMenuClose}>
                                <AdminPanelSettingsIcon sx={{ mr: 1 }} /> Admin Panel
                            </MenuItem>
                        )}
                        <MenuItem component={Link} to="/submit-resource" onClick={handleMobileMenuClose}>
                            <AddCircleOutlineIcon sx={{ mr: 1 }} /> Submit Resource
                        </MenuItem>
                        <MenuItem component={Link} to="/dashboard" onClick={handleMobileMenuClose}>
                            <DashboardIcon sx={{ mr: 1 }} /> Dashboard
                        </MenuItem>
                        <MenuItem onClick={handleLogout}>
                            <LogoutIcon sx={{ mr: 1 }} /> Logout
                        </MenuItem>
                    </>
                )}
                {!isAuthenticated && (
                    <>
                        <Divider />
                        <MenuItem component={Link} to="/login" onClick={handleMobileMenuClose}>
                            Login
                        </MenuItem>
                        <MenuItem component={Link} to="/signup" onClick={handleMobileMenuClose}>
                            Sign Up
                        </MenuItem>
                    </>
                )}
            </Menu>
        </>
    );

    return (
        <AppBar 
            position="static" 
            sx={{
                background: 'linear-gradient(90deg, #1976d2 0%, #1565c0 100%)',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            }}
        >
            <Toolbar sx={{ minHeight: '64px' }}>
                <Typography
                    variant="h6"
                    component={Link}
                    to="/"
                    sx={{
                        textDecoration: 'none',
                        color: 'white',
                        fontWeight: 700,
                        letterSpacing: '0.5px',
                        '&:hover': {
                            opacity: 0.9,
                        },
                    }}
                >
                    AI Learning Hub
                </Typography>

                {isMobile ? renderMobileNav() : renderDesktopNav()}
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
