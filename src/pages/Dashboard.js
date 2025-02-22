import React, { useState, useEffect } from 'react';
import { Container, Grid, Typography, Card, CardContent, Tabs, Tab, Box } from '@mui/material';
import { getUserBookmarks } from '../services/api';

const Dashboard = () => {
    const [bookmarks, setBookmarks] = useState([]);
    const [activeTab, setActiveTab] = useState('bookmarks');

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            const bookmarksData = await getUserBookmarks();
            setBookmarks(bookmarksData);
        } catch (error) {
            console.error('Failed to fetch user data:', error);
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

            <Grid container spacing={3}>
                {bookmarks.map((bookmark) => (
                    <Grid item xs={12} md={6} key={bookmark.id}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6">{bookmark.title}</Typography>
                                <Typography color="textSecondary">
                                    {bookmark.description}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default Dashboard;
