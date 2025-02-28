import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { addBookmark } from '../services/api';

const SearchPage = () => {
  const [results, setResults] = useState([]);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('GitHub'); // Selected category
  const [source, setSource] = useState('github'); // Selected source
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1); // Current page number
  const resultsPerPage = 5; // Number of results per page
  const [expandedSummaries, setExpandedSummaries] = useState({}); // Track expanded summaries

  // Mapping of categories to their respective sources
  const categorySourcesMap = {
    Tutorials: ['goooglesearch'],
    Research: ['arxiv', 'paperswithcode'],
    GitHub: ['github'],
    Courses: ['coursera'],
    Blogs: ['medium'],
  };

  useEffect(() => {
    if (category) {
      const newSource = categorySourcesMap[category][0];
      setSource(newSource);
      // Optionally call fetchResources after the source update uses a callback
      // This ensures the fetch uses the updated value.
      // For example, if using an async state updater or useEffect cleanup.
    } else {
      setSource('');
    }
  }, [category]);

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
    if (query || source) {
      fetchResources();
    }
  }, [query, source]); // Dependencies: re-run when these change

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

  // Helper function to map result fields based on the source
  const mapResultFields = (result) => {
    if (source === 'arxiv') {
      return {
        title: result.title,
        url: result.url,
        description: result.summary || '', // Full summary
        published: result.published,
        source: 'arxiv',
      };
    }

    if (source === 'paperswithcode') {
      return {
        title: result.title,
        url: result.code_url || result.repository_url, // Prefer code_url; fallback to repository_url
        description: result.abstract || '', // Use abstract for description
        source: 'paperswithcode',
      };
    }

    if (source === 'medium' || source === 'Towards Data Science') {
      return {
        title: result.title,
        url: result.url,
        description: result.summary || '',
        published: result.date,
        author: result.author,
        readTime: result.read_time,
        source: source,
      };
    }

    if (source === 'github') {
      return {
        title: result.full_name || result.name,
        url: result.html_url,
        description: result.description || '',
        published: result.created_at,
        stars: result.stargazers_count,
        forks: result.forks_count,
        language: result.language,
        topics: result.topics || [],
        updated: result.updated_at,
        owner: result.owner?.login,
        avatar: result.owner?.avatar_url,
        source: 'github',
      };
    }


    // Default mapping for other sources
    return {
      title: result.title,
      url: result.url || result.link,
      description: result.description || result.abstract || result.snippet || '',
      source: source,
    };
  };

  // Toggle the expanded state of a summary
  const toggleSummaryExpansion = (index) => {
    setExpandedSummaries((prev) => ({
      ...prev,
      [index]: !prev[index], // Toggle the current state for this index
    }));
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
        <option value="">Select Category</option>
        {Object.keys(categorySourcesMap).map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>

      {/* Source Dropdown */}
      {category && (
        <select value={source} onChange={(e) => setSource(e.target.value)} style={{ marginLeft: '10px', padding: '8px' }}>
          {categorySourcesMap[category].map((src) => (
            <option key={src} value={src}>
              {src}
            </option>
          ))}
        </select>
      )}

      {/* Error Message */}
      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}

      {/* Results List */}
      <ul style={{ listStyleType: 'none', padding: '0', marginTop: '20px' }}>
        {currentResults.map((result, index) => {
          const mappedResult = mapResultFields(result); // Map fields based on the source

          return (
            <li key={index} style={{ marginBottom: '20px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
              {/* Title as a Hyperlink */}
              {mappedResult.url ? (
                <h3 style={{ marginBottom: '5px' }}>
                  <a href={mappedResult.url} target="_blank" rel="noopener noreferrer" style={{ color: '#007BFF', textDecoration: 'none' }}>
                    {mappedResult.title}
                  </a>
                </h3>
              ) : (
                <h3 style={{ marginBottom: '5px' }}>{mappedResult.title}</h3>
              )}

              {/* Collapsed or Expanded Summary */}
              {mappedResult.description && (
                <p style={{ marginBottom: '5px', color: '#555' }}>
                  {expandedSummaries[index]
                    ? mappedResult.description // Full summary if expanded
                    : mappedResult.description.slice(0, 200) + (mappedResult.description.length > 200 ? '...' : '')} {/* Collapsed summary */}
                </p>
              )}

              {/* Read More / Read Less Button */}
              {mappedResult.description && mappedResult.description.length > 200 && (
                <button 
                  onClick={() => toggleSummaryExpansion(index)}
                  style={{
                    backgroundColor: 'transparent',
                    color: '#007BFF',
                    border: 'none',
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    fontSize: '14px',
                  }}
                >
                  {expandedSummaries[index] ? 'Read Less' : 'Read More'}
                </button>
              )}

              {/* Published Date */}
              {mappedResult.published && (
                <p style={{ fontSize: '12px', color: '#888' }}>
                  Published on: {new Date(mappedResult.published).toLocaleDateString()}
                </p>
              )}

              {/* Bookmark Button */}
              <button onClick={() => addBookmark(mappedResult)} style={{
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
