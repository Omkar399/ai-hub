import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { addBookmark } from '../services/api';
import { API_BASE_URL } from '../config';

const KnowledgeBase = () => {
  const [results, setResults] = useState([]);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState(''); // Category for local filtering
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 5;

  // Hardcoded source as 'local'
  const source = 'local';

  // Function to fetch resources based on query and category
  const fetchResources = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/search`, {
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

  // Trigger fetchResources whenever query or category changes
  useEffect(() => {
    // Fetch resources on component mount or when query/category changes
    fetchResources();
  }, [query, category]);

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

  return (
    <div style={{ padding: '20px' }}>
      <h1>Knowledge Base</h1>
      
      {/* Search Input */}
      <input 
        type="text" 
        placeholder="Search knowledge base..." 
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

      {/* Error Message */}
      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}

      {/* Results List */}
      <ul style={{ listStyleType: 'none', padding: '0', marginTop: '20px' }}>
        {currentResults.map((result, index) => (
          <li key={index} style={{ marginBottom: '20px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
            {/* Title as a Hyperlink */}
            {result.url ? (
              <h3 style={{ marginBottom: '5px' }}>
                <a href={result.url} target="_blank" rel="noopener noreferrer" style={{ color: '#007BFF', textDecoration: 'none' }}>
                  {result.title}
                </a>
              </h3>
            ) : (
              <h3 style={{ marginBottom: '5px' }}>{result.title}</h3>
            )}

            {/* Description */}
            {result.description && (
              <p style={{ marginBottom: '5px', color: '#555' }}>
                {result.description}
              </p>
            )}

            {/* Bookmark Button */}
            <button onClick={() => addBookmark(result)} style={{
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

export default KnowledgeBase;