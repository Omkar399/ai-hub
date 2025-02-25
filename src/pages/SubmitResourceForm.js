import React, { useState } from 'react';
import axios from 'axios';

const SubmitResourceForm = ({ userId }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [message, setMessage] = useState('');
  const [isButtonHovered, setIsButtonHovered] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        'http://localhost:5000/api/resources',
        { title, description, url, category_id: categoryId },
        {
          withCredentials: true,
          headers: { 'User-ID': userId }
        }
      );
      setMessage('Resource submitted successfully! Awaiting admin approval.');
      setTitle('');
      setDescription('');
      setUrl('');
      setCategoryId('');
    } catch (error) {
      setMessage('Failed to submit resource.');
    }
  };

  // Inline style objects
  const formStyle = {
    backgroundColor: "#f4f4f4",
    padding: "20px",
    maxWidth: "500px",
    margin: "20px auto",
    borderRadius: "8px",
    boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)"
  };

  const headingStyle = {
    textAlign: "center",
    marginBottom: "20px",
    color: "#333"
  };

  const formGroupStyle = {
    marginBottom: "15px"
  };

  const labelStyle = {
    display: "block",
    marginBottom: "5px",
    fontWeight: "600",
    color: "#555"
  };

  const inputStyle = {
    width: "100%",
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    fontSize: "1rem"
  };

  const textareaStyle = {
    ...inputStyle,
    resize: "vertical",
    height: "100px"
  };

  const buttonStyle = {
    width: "100%",
    padding: "10px",
    backgroundColor: isButtonHovered ? "#00b86b" : "#00CB79",
    border: "none",
    color: "#fff",
    borderRadius: "4px",
    fontSize: "1rem",
    cursor: "pointer",
    transition: "background-color 0.3s ease"
  };

  const messageStyle = {
    textAlign: "center",
    marginTop: "15px",
    fontSize: "1rem",
    color: "#333"
  };

  return (
    <form style={formStyle} onSubmit={handleSubmit}>
      <h2 style={headingStyle}>Submit AI Learning Material</h2>

      <div style={formGroupStyle}>
        <label htmlFor="title" style={labelStyle}>Title</label>
        <input
          id="title"
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={inputStyle}
        />
      </div>

      <div style={formGroupStyle}>
        <label htmlFor="description" style={labelStyle}>Description</label>
        <textarea
          id="description"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={textareaStyle}
        ></textarea>
      </div>

      <div style={formGroupStyle}>
        <label htmlFor="url" style={labelStyle}>URL</label>
        <input
          id="url"
          type="url"
          placeholder="URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
          style={inputStyle}
        />
      </div>

      <div style={formGroupStyle}>
        <label htmlFor="categoryId" style={labelStyle}>Category ID</label>
        <input
          id="categoryId"
          type="text"
          placeholder="Category ID"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          required
          style={inputStyle}
        />
      </div>

      <button
        type="submit"
        style={buttonStyle}
        onMouseEnter={() => setIsButtonHovered(true)}
        onMouseLeave={() => setIsButtonHovered(false)}
      >
        Submit
      </button>
      {message && <p style={messageStyle}>{message}</p>}
    </form>
  );
};

export default SubmitResourceForm;