import React, { useEffect, useState } from 'react';
import axios from 'axios';
const API_BASE_URL = 'http://44.202.60.5:5000'

const AdminPanel = () => {
    const [pendingResources, setPendingResources] = useState([]);

    // Fetch pending resources on component mount
    useEffect(() => {
        const fetchPendingResources = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/resources/pending`, {
                    withCredentials: true,
                });
                setPendingResources(response.data);
            } catch (error) {
                console.error('Failed to fetch pending resources.');
            }
        };

        fetchPendingResources();
    }, []);

    // Handle approval or rejection of a resource
    const handleAction = async (id, approved) => {
        if (approved) {
            // Approve resource
            try {
                await axios.patch(
                    `${API_BASE_URL}/api/resources/${id}`,
                    { approved },
                    { withCredentials: true }
                );
                setPendingResources(pendingResources.filter((resource) => resource.id !== id));
            } catch (error) {
                console.error('Failed to update resource status.');
            }
        } else {
            // Delete resource (reject)
            try {
                await axios.delete(`${API_BASE_URL}/api/resources/${id}`, { withCredentials: true });
                setPendingResources(pendingResources.filter((resource) => resource.id !== id));
            } catch (error) {
                console.error('Failed to delete resource.');
            }
        }
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Admin Panel - Pending Resources</h2>
            
            {pendingResources.length > 0 ? (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th style={headerStyle}>Title</th>
                            <th style={headerStyle}>Description</th>
                            <th style={headerStyle}>URL</th>
                            <th style={headerStyle}>Submitted By</th>
                            <th style={headerStyle}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pendingResources.map((resource) => (
                            <tr key={resource.id} style={rowStyle}>
                                <td style={cellStyle}>{resource.title}</td>
                                <td style={cellStyle}>{resource.description}</td>
                                <td style={cellStyle}>
                                    <a href={resource.url} target="_blank" rel="noopener noreferrer">
                                        View Resource
                                    </a>
                                </td>
                                <td style={cellStyle}>{resource.submitted_by || 'Unknown'}</td>
                                <td style={cellStyle}>
                                    <button
                                        onClick={() => handleAction(resource.id, true)}
                                        style={{ ...buttonStyle, backgroundColor: '#4CAF50' }}
                                    >
                                        Approve
                                    </button>
                                    <button
                                        onClick={() => handleAction(resource.id, false)}
                                        style={{ ...buttonStyle, backgroundColor: '#f44336' }}
                                    >
                                        Reject
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p style={{ textAlign: 'center', fontSize: '18px' }}>No pending resources.</p>
            )}
        </div>
    );
};

// Inline styles for table and buttons
const headerStyle = {
    backgroundColor: '#f2f2f2',
    padding: '10px',
    textAlign: 'left',
    borderBottom: '1px solid #ddd',
};

const rowStyle = {
    borderBottom: '1px solid #ddd',
};

const cellStyle = {
    padding: '10px',
};

const buttonStyle = {
    marginRight: '10px',
    padding: '5px 10px',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
};

export default AdminPanel;