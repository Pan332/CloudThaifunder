import React from 'react';

const RegisterPage = () => {
  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h2>Register</h2>
        <form>
          <div style={styles.formGroup}>
            <input 
              type="email" 
              placeholder="Email" 
              style={styles.inputField} 
              required
            />
          </div>
          <div style={styles.formGroup}>
            <input 
              type="password" 
              placeholder="Password" 
              style={styles.inputField} 
              required
            />
          </div>
          <div style={styles.formGroup}>
            <input 
              type="password" 
              placeholder="Confirm Password" 
              style={styles.inputField} 
              required
            />
          </div>
          <div style={styles.formGroup}>
            <input 
              type="text" 
              placeholder="First Name" 
              style={styles.inputField} 
              required
            />
          </div>
          <div style={styles.formGroup}>
            <input 
              type="text" 
              placeholder="Last Name" 
              style={styles.inputField} 
              required
            />
          </div>
          <div style={styles.formGroup}>
            <input 
              type="number" 
              placeholder="Age" 
              style={styles.inputField} 
              min="1"
              required
            />
          </div>
   
          <div style={styles.formGroup}>
            <select style={styles.inputField} required>
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div style={styles.formGroup}>
            <input 
              type="text" 
              placeholder="Address" 
              style={styles.inputField} 
              required
            />
          </div>
          <div style={styles.formGroup}>
            <input 
              type="text" 
              placeholder="Phone" 
              style={styles.inputField} 
              required
            />
          </div>
            
        
          <div style={styles.buttonGroup}>
            <button type="submit" style={styles.button}>
              Register
            </button>
          </div>
          <div style={styles.loginLink}>
            <a href="/" style={styles.link}>Go back to Homepage?</a>
          </div>
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
    backgroundImage: 'url("https://images.unsplash.com/photo-1583364481915-dacea3e06d18?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")', // Add your background image URL here
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'fixed', // Optional: makes the background stay fixed while scrolling
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // Add slight transparency to the form background
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
