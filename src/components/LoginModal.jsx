import React from 'react';

const LoginModal = ({ closeModal }) => {
  // Function to handle closing modal when clicking outside the modal content
  const handleOverlayClick = (e) => {
    // Close the modal only if the click was on the overlay (not inside the modal)
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  return (
    <div style={modalStyles.overlay} onClick={handleOverlayClick}>
      <div style={modalStyles.modal}>
        <h2>Login</h2>
        <form>
          <div style={modalStyles.formGroup}>
            <input 
              type="email" 
              placeholder="Email" 
              style={modalStyles.inputField}
            />
          </div>
          <div style={modalStyles.formGroup}>
            <input 
              type="password" 
              placeholder="Password" 
              style={modalStyles.inputField}
            />
          </div>
          <div style={modalStyles.buttonGroup}>
            <button 
              type="submit" 
              style={modalStyles.button}>
              Login
            </button>
            <button 
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
};

export default LoginModal;
