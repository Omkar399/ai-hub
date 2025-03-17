import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../services/api';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      // Attempt to register the user
      await registerUser({ username, email, password });

      // Redirect to the login page upon successful signup
      navigate('/login');
    } catch (err) {
      // Handle registration error
      setError(err.error || 'Failed to register');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', textAlign: 'center' }}>
      <h1>Sign Up</h1>
      <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {/* Username Input */}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={{ padding: '10px', fontSize: '16px' }}
        />

        {/* Email Input */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ padding: '10px', fontSize: '16px' }}
        />

        {/* Password Input */}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ padding: '10px', fontSize: '16px' }}
        />

        {/* Error Message */}
        {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}

        {/* Submit Button */}
        <button type="submit" style={{ padding: '10px', fontSize: '16px', cursor: 'pointer' }}>
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default Signup;
