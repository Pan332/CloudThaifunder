import React, { useState } from 'react';
import './signup.css'; // Assuming you still want to include your CSS

const SignupForm = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('user'); // Default to 'user'
  const [signupMessage, setSignupMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setSignupMessage('Passwords do not match');
      return;
    }

    try {
      const response = await fetch('http://localhost:5173/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password, role }),
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
    <div className="container-signup">
      <div className="left">
        {/* Optional left side content */}
      </div>
      <div className="right">
        <div className="container">
          <form className="signupform" onSubmit={handleSubmit}>
            <h1>Create an account.</h1>
            <p>
              Already have an account?{' '}
              <a style={{ color: '#242424', textDecoration: 'none', fontWeight: 600 }} href="/login">Login?</a>{' '}
              <a href="/" style={{ color: '#242424', textDecoration: 'none', fontWeight: 600 }}>Go Back?</a>
            </p>

            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              required
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
              required
            />
            <select value={role} onChange={(e) => setRole(e.target.value)} required>
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="fundraiser">Fundraiser</option>
            </select>
            <br />
            <button id="signupButton" type="submit">Sign Up</button>
            <br />
            <div id="signupMessage">{signupMessage}</div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;
