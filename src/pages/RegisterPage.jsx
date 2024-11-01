import React, { useState } from 'react';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [phone, setPhone] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('user'); // Default to 'user'
  const [signupMessage, setSignupMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setSignupMessage('Passwords do not match');
      return;
    }

    const port = import.meta.env.VITE_API_URL; // Fetching API URL from environment variables
    if (!port) {
      setSignupMessage('API URL is not defined');
      return;
    }

    try {
      const response = await fetch(`${port}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password, role, phone, firstname, lastname }),
      });

      const data = await response.json();
      if (data.success) {
        alert('Sign up Successful');
        setSignupMessage('Sign up successful');
      } else {
        setSignupMessage(data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      setSignupMessage('Error during sign up');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <input
              type="text"
              value={username}
              placeholder="Username"
              onChange={(e) => setUsername(e.target.value)}
              style={styles.inputField}
              required
            />
          </div>
          <div style={styles.formGroup}>
            <input
              type="password"
              placeholder="Password"
              style={styles.inputField}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div style={styles.formGroup}>
            <input
              type="password"
              placeholder="Confirm Password"
              style={styles.inputField}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <div style={styles.formGroup}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.inputField}
              required
            />
          </div>
          <div style={styles.formGroup}>
            <input
              type="text"
              placeholder="First Name"
              style={styles.inputField}
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              required
            />
          </div>
          <div style={styles.formGroup}>
            <input
              type="text"
              placeholder="Last Name"
              style={styles.inputField}
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              required
            />
          </div>
          <div style={styles.formGroup}>
            <input
              type="text"
              placeholder="Phone"
              style={styles.inputField}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          <div style={styles.buttonGroup}>
            <button id="signupButton" type="submit" style={styles.button}>
              Register
            </button>
          </div>
          <div style={styles.loginLink}>
            <a href="/" style={styles.link}>Go back to Homepage?</a>
          </div>
          <div id="signupMessage">{signupMessage}</div>
        </form>
      </div>
    </div>
  );
};

// Page styles
const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundImage: 'url("https://images.unsplash.com/photo-1583364481915-dacea3e06d18?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")', // Background image URL
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'fixed',
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: '40px',
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
    marginTop: '15px',
  },
  button: {
    width: '100%',
    padding: '10px',
    backgroundColor: '#28A745',
    border: 'none',
    color: '#fff',
    cursor: 'pointer',
    borderRadius: '5px',
    fontSize: '16px',
  },
  loginLink: {
    marginTop: '15px',
    textAlign: 'center',
  },
  link: {
    color: '#007BFF',
    textDecoration: 'none',
    fontSize: '14px',
  },
};

export default RegisterPage;
