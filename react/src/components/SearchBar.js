import React from 'react';
import { Paper, InputBase, IconButton, Box, Select, MenuItem } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const SearchBar = ({ onSearch, category, setCategory }) => {
    const [query, setQuery] = React.useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        onSearch(query, category);
    };

    return (
        <Box component="form" onSubmit={handleSearch} sx={{ p: 2, maxWidth: 800, margin: '0 auto' }}>
            <Paper sx={{ p: '2px 4px', display: 'flex', alignItems: 'center' }}>
                <InputBase
                    sx={{ ml: 1, flex: 1 }}
                    placeholder="Search AI resources..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <Select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    sx={{ mx: 1, minWidth: 120 }}
                >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="tutorials">Tutorials</MenuItem>
                    <MenuItem value="courses">Courses</MenuItem>
                    <MenuItem value="papers">Papers</MenuItem>
                    <MenuItem value="github">GitHub</MenuItem>
                </Select>
                <IconButton type="submit" sx={{ p: '10px' }}>
                    <SearchIcon />
                </IconButton>
            </Paper>
        </Box>
    );
};

export default SearchBar;
