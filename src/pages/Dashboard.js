import React, { useState, useEffect } from 'react';
import { Container, Grid, Typography, Card, CardContent, Tabs, Tab, Box, Button } from '@mui/material';
import { getUserBookmarks, deleteBookmark } from '../services/api'; // Import delete API

const Dashboard = () => {
    const [bookmarks, setBookmarks] = useState([]);
    const [activeTab, setActiveTab] = useState('bookmarks');

    useEffect(() => {
        fetchUserData();
    }, []);

    // Fetch bookmarks data
    const fetchUserData = async () => {
        try {
            const bookmarksData = await getUserBookmarks();
            setBookmarks(bookmarksData);
        } catch (error) {
            console.error('Failed to fetch user data:', error);
        }
    };

    // Handle bookmark deletion
    const handleDeleteBookmark = async (bookmarkId) => {
        try {
            // Call API to delete bookmark
            await deleteBookmark(bookmarkId);

            // Update state by filtering out the deleted bookmark
            setBookmarks((prevBookmarks) =>
                prevBookmarks.filter((bookmark) => bookmark.id !== bookmarkId)
            );

            console.log(`Bookmark with ID ${bookmarkId} deleted successfully.`);
        } catch (error) {
            console.error('Failed to delete bookmark:', error);
        }
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Learning Dashboard
            </Typography>

            <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} sx={{ mb: 3 }}>
                <Tab label="Bookmarks" value="bookmarks" />
            </Tabs>

            {/* Bookmark Cards */}
            <Grid container spacing={3}>
                {bookmarks.map((bookmark) => (
                    <Grid item xs={12} md={6} key={bookmark.id}>
                        <Card sx={{ height: '100%' }}>
                            <CardContent>
                                <Typography 
                                    variant="h6" 
                                    component="a" 
                                    href={bookmark.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    sx={{
                                        textDecoration: 'none',
                                        color: 'primary.main',
                                        '&:hover': {
                                            textDecoration: 'underline'
                                        }
                                    }}
                                >
                                    {bookmark.title}
                                </Typography>
                                <Typography 
                                    variant="subtitle2" 
                                    color="textSecondary" 
                                    sx={{ mt: 1 }}
                                >
                                    Added on: {new Date(bookmark.createdAt).toLocaleDateString()}
                                </Typography>
                                <Typography 
                                    color="textSecondary" 
                                    sx={{ mt: 2, mb: 2 }}
                                >
                                    {bookmark.description}
                                </Typography>
                                <Box sx={{ mt: 2 }}>
                                    {bookmark.tags && bookmark.tags.map((tag, index) => (
                                        <Typography
                                            key={index}
                                            component="span"
                                            sx={{
                                                backgroundColor: 'primary.light',
                                                color: 'primary.contrastText',
                                                padding: '4px 8px',
                                                borderRadius: '16px',
                                                marginRight: 1,
                                                marginBottom: 1,
                                                display: 'inline-block',
                                                fontSize: '0.875rem'
                                            }}
                                        >
                                            {tag}
                                        </Typography>
                                    ))}
                                </Box>
                                <Box sx={{ 
                                    display: 'flex', 
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    mt: 2 
                                }}>
                                    <Button
                                        variant="outlined"
                                        href={bookmark.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Visit Resource
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="error"
                                        onClick={() => handleDeleteBookmark(bookmark.id)}
                                    >
                                        Delete
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default Dashboard;