import React from 'react';
import { Card, CardContent, CardActions, Typography, Button, Chip } from '@mui/material';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';

const ResourceCard = ({ resource, onBookmark, isBookmarked }) => {
    return (
        <Card sx={{ maxWidth: 345, m: 2 }}>
            <CardContent>
                <Typography gutterBottom variant="h6" component="div">
                    {resource.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {resource.description}
                </Typography>
                <Chip
                    label={resource.category}
                    size="small"
                    sx={{ mt: 1 }}
                />
            </CardContent>
            <CardActions>
                <Button size="small" href={resource.url} target="_blank">
                    Learn More
                </Button>
                <IconButton onClick={() => onBookmark(resource.id)}>
                    {isBookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                </IconButton>
            </CardActions>
        </Card>
    );
};

export default ResourceCard;
