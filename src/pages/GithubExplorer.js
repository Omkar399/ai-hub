import React, { useEffect, useState } from 'react';
import { fetchTrendingRepos } from '../services/api';

const GithubExplorer = () => {
    const [repos, setRepos] = useState([]);
    const [error, setError] = useState('');

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

    return (
        <div style={{ padding: '20px' }}>
            <h1>Trending AI Projects on GitHub</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <ul>
                {repos.map((repo) => (
                    <li key={repo.id} style={{ marginBottom: '15px' }}>
                        <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
                            {repo.name}
                        </a>
                        <p>{repo.description}</p>
                        <p>⭐ Stars: {repo.stargazers_count}</p>
                        <p>👨‍💻 Owner: {repo.owner.login}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default GithubExplorer;