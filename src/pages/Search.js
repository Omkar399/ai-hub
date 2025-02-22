import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SearchPage = () => {
  const [resources, setResources] = useState([]);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/resources', {
          params: { query, category },
        });
        setResources(response.data);
      } catch (err) {
        setError('Failed to load resources.');
      }
    };

    fetchResources();
  }, [query, category]);

  return (
    <div>
      <h1>Search AI Resources</h1>
      <input 
        type="text" 
        placeholder="Search..." 
        value={query} 
        onChange={(e) => setQuery(e.target.value)} 
      />
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="">All Categories</option>
        <option value="Courses">Courses</option>
        <option value="Handbooks">Handbooks</option>
        <option value="GitHub">GitHub</option>
        <option value="Research Papers">Research Papers</option>
        <option value="Blogs">Blogs</option>
      </select>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {resources.map((resource) => (
          <li key={resource.id}>
            <a href={resource.url} target="_blank" rel="noopener noreferrer">{resource.title}</a>
            <p>{resource.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchPage;
