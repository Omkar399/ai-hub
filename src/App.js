import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Search from './pages/Search';
import Dashboard from './pages/Dashboard';
import GithubExplorer from './pages/GithubExplorer';
import Chat from './pages/Chat';
import Login from './pages/Login'; // Import Login page
import Signup from './pages/Signup'; 
import ProtectedRoute from './components/ProtectedRoute';

const theme = createTheme({
    palette: {
        primary: {
            main: '#1976d2',
        },
        secondary: {
            main: '#dc004e',
        },
    },
});

function App() {
    return (
        <ThemeProvider theme={theme}>
            <Router>
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/search" element={<Search />} />
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        }
                    />                   
                    <Route path="/github" element={<GithubExplorer />} />
                    <Route path="/chat" element={<Chat />} />
                    <Route path="/login" element={<Login />} /> {/* Login route */}
                    <Route path="/signup" element={<Signup />} /> {/* Signup route */}
                </Routes>
                </Router>
        </ThemeProvider>
    );
}

export default App;
