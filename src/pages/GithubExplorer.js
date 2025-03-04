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
                {currentResults.map((repo, index) => {
                    const mappedRepo = mapRepoFields(repo);
                    return (
                        <li key={repo.id} style={{
                            marginBottom: '20px',
                            padding: '20px',
                            borderRadius: '8px',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                            backgroundColor: '#fff'
                        }}>
                            {/* Repository Title and Link */}
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                                <h3 style={{ margin: 0, marginRight: '10px' }}>
                                    <a href={mappedRepo.url} 
                                       target="_blank" 
                                       rel="noopener noreferrer" 
                                       style={{ color: '#007BFF', textDecoration: 'none' }}>
                                        {mappedRepo.title}
                                    </a>
                                </h3>
                            </div>

                            {/* Repository Stats */}
                            <div style={{ 
                                display: 'flex', 
                                gap: '15px', 
                                marginBottom: '10px',
                                fontSize: '14px',
                                color: '#666' 
                            }}>
                                <span>⭐ {repo.stargazers_count.toLocaleString()} stars</span>
                                <span>🔄 {repo.forks_count.toLocaleString()} forks</span>
                                {repo.language && (
                                    <span>📝 {repo.language}</span>
                                )}
                            </div>

                            {/* Description */}
                            {mappedRepo.description && (
                                <p style={{ 
                                    marginBottom: '15px',
                                    color: '#444',
                                    lineHeight: '1.5'
                                }}>
                                    {repo.description.slice(0, 200) + 
                                      (repo.description.length > 200 ? '...' : '')}
                                </p>
                            )}

                            {/* Topics/Tags */}
                            {repo.topics && repo.topics.length > 0 && (
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '15px' }}>
                                    {repo.topics.map((topic, i) => (
                                        <span key={i} style={{
                                            backgroundColor: '#f1f8ff',
                                            color: '#0366d6',
                                            padding: '3px 10px',
                                            borderRadius: '12px',
                                            fontSize: '12px'
                                        }}>
                                            {topic}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* Last Updated */}
                            <div style={{ 
                                fontSize: '13px',
                                color: '#666',
                                marginBottom: '15px'
                            }}>
                                Last updated: {new Date(repo.updated_at).toLocaleDateString()}
                            </div>

                            {/* Action Buttons */}
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button onClick={() => addBookmark(mappedRepo)} style={{
                                    backgroundColor: '#007BFF',
                                    color: '#fff',
                                    borderRadius: '5px',
                                    border: 'none',
                                    padding: '8px 16px',
                                    cursor: 'pointer',
                                    fontSize: '14px'
                                }}>
                                    Bookmark
                                </button>
                                <a href={`${mappedRepo.url}/network/members`}
                                   target="_blank"
                                   rel="noopener noreferrer"
                                   style={{
                                       backgroundColor: '#28a745',
                                       color: '#fff',
                                       borderRadius: '5px',
                                       border: 'none',
                                       padding: '8px 16px',
                                       cursor: 'pointer',
                                       fontSize: '14px',
                                       textDecoration: 'none'
                                   }}>
                                    View Contributors
                                </a>
                            </div>
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
