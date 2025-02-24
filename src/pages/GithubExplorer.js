import React, { useEffect, useState } from 'react';
import { fetchTrendingRepos, addBookmark } from '../services/api'; // Import addBookmark

const GithubExplorer = () => {
    const [repos, setRepos] = useState([]);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(1); // Current page number
    const resultsPerPage = 5; // Number of results per page

    useEffect(() => {
        const getRepos = async () => {
            try {
                const data = await fetchTrendingRepos();
                setRepos(data);
            } catch (err) {
                setError(err.error || 'Failed to load trending repositories.');
            }
        };

        getRepos();
    }, []);

    // Helper function to map repo fields for bookmarking
    const mapRepoFields = (repo) => ({
        title: repo.name, // Use repo name as title
        url: repo.html_url, // Repository URL
        description: repo.description || '', // Repository description
        source: 'github', // Indicate source as GitHub
    });

    // Pagination logic
    const indexOfLastResult = currentPage * resultsPerPage;
    const indexOfFirstResult = indexOfLastResult - resultsPerPage;
    const currentResults = repos.slice(indexOfFirstResult, indexOfLastResult);

    const totalPages = Math.ceil(repos.length / resultsPerPage);

    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const goToPreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>Trending AI Projects on GitHub</h1>
            
            {/* Error Message */}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {/* Repositories List */}
            <ul style={{ listStyleType: 'none', padding: '0', marginTop: '20px' }}>
                {currentResults.map((repo) => {
                    const mappedRepo = mapRepoFields(repo); // Map repo fields for consistency

                    return (
                        <li key={repo.id} style={{ marginBottom: '20px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
                            {/* Title as a Hyperlink */}
                            <h3 style={{ marginBottom: '5px' }}>
                                <a href={mappedRepo.url} target="_blank" rel="noopener noreferrer" style={{ color: '#007BFF', textDecoration: 'none' }}>
                                    {mappedRepo.title}
                                </a>
                            </h3>

                            {/* Description */}
                            {mappedRepo.description && (
                                <p style={{ marginBottom: '5px', color: '#555' }}>
                                    {mappedRepo.description}
                                </p>
                            )}

                            {/* Stars and Owner */}
                            <p style={{ marginBottom: '5px', color: '#555' }}>⭐ Stars: {repo.stargazers_count}</p>
                            <p style={{ marginBottom: '5px', color: '#555' }}>👨‍💻 Owner: {repo.owner.login}</p>

                            {/* Bookmark Button */}
                            <button onClick={() => addBookmark(mappedRepo)} style={{
                                backgroundColor: '#007BFF',
                                color: '#fff',
                                borderRadius: '5px',
                                border: 'none',
                                padding: '8px',
                                cursor: 'pointer'
                            }}>
                                Bookmark
                            </button>
                        </li>
                    );
                })}
            </ul>

            {/* Pagination Controls */}
            {repos.length > resultsPerPage && (
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                    {/* Previous Button */}
                    <button 
                        onClick={goToPreviousPage} 
                        disabled={currentPage === 1}
                        style={{
                            padding: '10px',
                            marginRight: '10px',
                            backgroundColor: currentPage === 1 ? '#ccc' : '#007BFF',
                            color: '#fff',
                            borderRadius: '5px',
                            border: 'none',
                            cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                        }}
                    >
                        Previous
                    </button>

                    {/* Page Info */}
                    <span>Page {currentPage} of {totalPages}</span>

                    {/* Next Button */}
                    <button 
                        onClick={goToNextPage} 
                        disabled={currentPage === totalPages}
                        style={{
                            padding: '10px',
                            marginLeft: '10px',
                            backgroundColor: currentPage === totalPages ? '#ccc' : '#007BFF',
                            color: '#fff',
                            borderRadius: '5px',
                            border: 'none',
                            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                        }}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default GithubExplorer;
