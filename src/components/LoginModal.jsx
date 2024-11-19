import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';


const LoginModal = ({ closeModal }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showWelcome, setShowWelcome] = useState(false); // State for welcome message
  const navigate = useNavigate();

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Please fill in both fields.');
      return;
    }

    try {
      const port = import.meta.env.VITE_API_URL;
      const response = await fetch(`${port}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      console.log(data)
      if (response.ok) {
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('refresh_token', data.refresh_token);
        localStorage.setItem('role', data.role);
        navigate('/');
        
        setShowWelcome(true); // Show welcome message
        setTimeout(() => {
          setShowWelcome(false);
          closeModal(); // Close modal after welcome message
        }, 700); // Hide after 3 seconds
      } else {
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
        {showWelcome && <p style={modalStyles.welcome}>Welcome to Thaifunder!</p>}
        <form onSubmit={handleLogin}>
          <div style={modalStyles.formGroup}>
            <input 
              id="username"
              type="text" 
              placeholder="Username" 
              style={modalStyles.inputField}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div style={modalStyles.formGroup}>
            <input 
              id="password"
              type="password" 
              placeholder="Password" 
              style={modalStyles.inputField}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div style={modalStyles.buttonGroup}>
            <button type="submit" style={modalStyles.button}>
              Login
            </button>
            <button 
              type="button" 
              onClick={closeModal} 
              style={modalStyles.closeButton}>
              Close
            </button>
          </div>
          <div style={modalStyles.registerLink}>
            <a href="/RegisterPage" style={modalStyles.link}>Register</a>
          </div>
        </form>
      </div>
    </div>
  );
};

// Styles for modal, overlay, and welcome message
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
    backgroundColor: '#FF4136',
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
  welcome: {
    color: 'green',
    fontSize: '18px',
    marginBottom: '10px',
    animation: 'fadeIn 1s ease-in-out', // Add fade-in animation
  },
  '@keyframes fadeIn': {
    from: { opacity: 0 },
    to: { opacity: 1 },
  },
};

export default LoginModal;
