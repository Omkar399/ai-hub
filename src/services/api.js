import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

// Axios instance for reusable configuration
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000, // Set a timeout of 10 seconds
});

// Helper function for handling errors
const handleError = (error) => {
    console.error('API call failed:', error);
    throw error.response?.data || { error: 'Something went wrong. Please try again later.' };
};

// Fetch trending GitHub repositories
export const fetchTrendingRepos = async () => {
    try {
        const response = await apiClient.get('/api/github/trending');
        return response.data; // Return the list of repositories
    } catch (error) {
        handleError(error);
    }
};

// Search resources with query and filters
export const searchResources = async (query, filters = {}) => {
    try {
        const response = await apiClient.get('/api/search', { params: { query, ...filters } });
        return response.data;
    } catch (error) {
        handleError(error);
    }
};

// Get AI-related papers from arXiv
export const getArxivPapers = async (query) => {
    try {
        const response = await apiClient.get('/api/papers', { params: { query } });
        return response.data;
    } catch (error) {
        handleError(error);
    }
};

// Get popular AI courses
export const getCourses = async () => {
    try {
        const response = await apiClient.get('/api/courses');
        return response.data;
    } catch (error) {
        handleError(error);
    }
};

// Get user bookmarks
export const getUserBookmarks = async () => {
    try {
        const response = await apiClient.get('/api/bookmarks');
        return response.data;
    } catch (error) {
        handleError(error);
    }
};

// Save a new bookmark
export const saveBookmark = async (bookmarkData) => {
    try {
        const response = await apiClient.post('/api/bookmarks', bookmarkData);
        return response.data;
    } catch (error) {
        handleError(error);
    }
};

// Delete a bookmark by ID
export const deleteBookmark = async (bookmarkId) => {
    try {
        const response = await apiClient.delete(`/api/bookmarks/${bookmarkId}`);
        return response.data;
    } catch (error) {
        handleError(error);
    }
};

// Register a new user
export const registerUser = async (userData) => {
    try {
        const response = await apiClient.post('/auth/register', userData);
        return response.data; // Return success message or user data
    } catch (error) {
        handleError(error);
    }
};

// Log in an existing user
export const loginUser = async (credentials) => {
    try {
        const response = await apiClient.post('/auth/login', credentials);
        return response.data; // Return user data and success message
    } catch (error) {
        handleError(error);
    }
};

// Log out the current user
export const logoutUser = async () => {
    try {
        const response = await apiClient.post('/auth/logout');
        return response.data; // Return success message if needed
    } catch (error) {
        console.error('Error during logout:', error);
        throw error; // Re-throw error for higher-level handling
    }
};
