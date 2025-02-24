import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SearchPage = () => {
  const [results, setResults] = useState([]);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [source, setSource] = useState('local'); // Default source is local database
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1); // Current page number
  const resultsPerPage = 5; // Number of results per page

  // Function to fetch resources based on query, category, and source
  const fetchResources = async () => {
    try {
      const response = await axios.get('http://localhost:5000/search', {
        params: {
          q: query,
          category,
          source,
        },
      });
      setResults(response.data);
      setError(''); // Clear any previous errors
    } catch (err) {
      console.error(err);
      setError('Failed to load resources.');
      setResults([]);
    }
  };

  // Trigger fetchResources whenever query, category, or source changes
  useEffect(() => {
    if (query || category || source) {
      fetchResources();
    }
  }, [query, category, source]); // Dependencies: re-run when these change

  // Pagination logic
  const indexOfLastResult = currentPage * resultsPerPage;
  const indexOfFirstResult = indexOfLastResult - resultsPerPage;
  const currentResults = results.slice(indexOfFirstResult, indexOfLastResult);

  const totalPages = Math.ceil(results.length / resultsPerPage);

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

  // Function to add a bookmark
  const addBookmark = async (resourceId) => {
    try {
        const response = await axios.post(
          'http://localhost:5000/api/bookmarks',
          { resource_id: resourceId },
          {
              headers: {
                  'Content-Type': 'application/json',
              },
              withCredentials: true,
          }
      );
      console.log(response.data);
      alert('Bookmark added successfully!');
    } catch (err) {
      console.error(error.response?.data || error.message);
      alert(error.response?.data?.error || 'Failed to add bookmark.')
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Search AI Resources</h1>
      
      {/* Search Input */}
      <input 
        type="text" 
        placeholder="Enter your query..." 
        value={query} 
        onChange={(e) => setQuery(e.target.value)} 
        style={{ marginBottom: '10px', padding: '8px', width: '300px' }}
      />

      {/* Category Dropdown */}
      <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ marginLeft: '10px', padding: '8px' }}>
        <option value="">All Categories</option>
        <option value="Courses">Courses</option>
        <option value="Handbooks">Handbooks</option>
        <option value="GitHub">GitHub</option>
        <option value="Research Papers">Research Papers</option>
        <option value="Blogs">Blogs</option>
      </select>

      {/* Source Dropdown */}
      <select value={source} onChange={(e) => setSource(e.target.value)} style={{ marginLeft: '10px', padding: '8px' }}>
        <option value="local">Local Database</option>
        <option value="arxiv">arXiv</option>
        <option value="paperswithcode">PapersWithCode</option>
        <option value="google">Google Search</option>
      </select>

      {/* Error Message */}
      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}

      {/* Results List */}
      <ul style={{ listStyleType: 'none', padding: '0', marginTop: '20px' }}>
        {currentResults.map((result, index) => (
          <li key={index} style={{ marginBottom: '20px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
            {/* Title as a Hyperlink */}
            {result.url || result.link ? (
              <h3 style={{ marginBottom: '5px' }}>
                <a href={result.url || result.link} target="_blank" rel="noopener noreferrer" style={{ color: '#007BFF', textDecoration: 'none' }}>
                  {result.title}
                </a>
              </h3>
            ) : (
              <h3 style={{ marginBottom: '5px' }}>{result.title}</h3>
            )}

            {/* Abstract/Description */}
            {result.abstract || result.description || result.snippet ? (
              <p style={{ marginBottom: '5px', color: '#555' }}>
                {result.abstract || result.description || result.snippet}
              </p>
            ) : null}

            {/* Bookmark Button */}
            <button onClick={() => addBookmark(result.id)} style={{
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
        ))}
      </ul>

      {/* Pagination Controls */}
      {results.length > resultsPerPage && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
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
          <span>Page {currentPage} of {totalPages}</span>
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

export default SearchPage;
