import React from 'react';
import { Box, Typography, Container, Grid } from '@mui/material';

const Home = () => {
    return (
        <Container maxWidth="lg">
            <Box sx={{ mt: 4 }}>
                <Typography variant="h3" component="h1" gutterBottom>
                    Welcome to AI Learning Hub
                </Typography>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <Typography variant="h5" gutterBottom>
                            Discover AI Resources
                        </Typography>
                        <Typography variant="body1">
                            Find tutorials, courses, research papers, and GitHub repositories all in one place.
                        </Typography>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
};

export default Home;
