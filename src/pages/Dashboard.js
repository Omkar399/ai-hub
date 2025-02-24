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
                <Tab label="Progress" value="progress" />
                <Tab label="Notes" value="notes" />
            </Tabs>

            {/* Bookmark Cards */}
            <Grid container spacing={3}>
                {bookmarks.map((bookmark) => (
                    <Grid item xs={12} md={6} key={bookmark.id}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6">{bookmark.title}</Typography>
                                <Typography color="textSecondary">
                                    {bookmark.description}
                                </Typography>
                                {/* Delete Button */}
                                <Button
                                    variant="contained"
                                    color="error"
                                    onClick={() => handleDeleteBookmark(bookmark.id)}
                                    sx={{ mt: 2 }}
                                >
                                    Delete
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default Dashboard;