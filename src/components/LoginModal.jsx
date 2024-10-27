import React, { useState } from 'react';

const LoginModal = ({ closeModal }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Function to handle closing modal when clicking outside the modal content
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent form submission
    setError(''); // Reset error message

    if (!username || !password) {
      setError('Please fill in both fields.');
      return;
    }

    // Perform login request to backend
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Handle successful login (e.g., store tokens, redirect)
        console.log('Login successful:', data);
        closeModal();
      } else {
        // Show error message from backend
        setError(data.message || 'Login failed. Please try again.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div style={modalStyles.overlay} onClick={handleOverlayClick}>
      <div style={modalStyles.modal}>
        <h2>Login</h2>
        {error && <p style={modalStyles.error}>{error}</p>}
        <form onSubmit={handleLogin}>
          <div style={modalStyles.formGroup}>
            <input 
              type="text" 
              placeholder="Username" 
              style={modalStyles.inputField}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div style={modalStyles.formGroup}>
            <input 
              type="password" 
              placeholder="Password" 
              style={modalStyles.inputField}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div style={modalStyles.buttonGroup}>
            <button 
              type="submit" 
              style={modalStyles.button}>
              Login
            </button>
            <button 
              type="button" // Prevent form submission on Close button
              onClick={closeModal} 
              style={modalStyles.closeButton}>
              Close
            </button>
          </div>
          <div style={modalStyles.registerLink}>
            <a href="signup.jsx" style={modalStyles.link}>Register</a>
          </div>
        </form>
      </div>
    </div>
  );
};

// Styles for modal and overlay
const modalStyles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '10px',
    width: '400px',
    textAlign: 'center',
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)',
  },
  formGroup: {
    marginBottom: '15px',
  },
  inputField: {
    width: '100%',
    padding: '10px',
    fontSize: '16px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    marginBottom: '10px',
    boxSizing: 'border-box',
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '15px',
  },
  button: {
    width: '48%',
    padding: '10px',
    backgroundColor: '#007BFF',
    border: 'none',
    color: '#fff',
    cursor: 'pointer',
    borderRadius: '5px',
    fontSize: '16px',
  },
  closeButton: {
    width: '48%',
    padding: '10px',
    backgroundColor: '#FF4136', // Red color for the Close button
    border: 'none',
    color: '#fff',
    cursor: 'pointer',
    borderRadius: '5px',
    fontSize: '16px',
  },
  registerLink: {
    marginTop: '15px',
    textAlign: 'center',
  },
  link: {
    color: '#007BFF',
    textDecoration: 'none',
    fontSize: '14px',
  },
  error: {
    color: 'red',
    marginBottom: '10px',
  },
};

export default LoginModal;
