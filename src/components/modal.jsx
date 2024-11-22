import React from 'react';

function Modal({ isOpen, onClose, children, onImageUpload }) {
    if (!isOpen) return null;

    return (
        <div style={modalOverlayStyle}>
            <div style={modalContentStyle}>
                <button onClick={onClose} style={closeButtonStyle}>×</button>
                <h2 style={alertStyle}>Please Upload Your Transaction Slip for Verification</h2>
                {children}
            </div>
        </div>
    );
}

const modalOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Slightly darker overlay
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999, // Ensure modal appears on top of other content
};

const modalContentStyle = {
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '8px',
    maxWidth: '600px', // Increased the max width for larger screens
    width: '90%', // Make it responsive on smaller screens
    textAlign: 'center',
    position: 'relative',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)', // Added subtle shadow for better contrast
};

const closeButtonStyle = {
    position: 'absolute',
    top: '10px',
    right: '10px',
    background: 'none',
    border: 'none',
    fontSize: '1.8rem',
    color: '#333',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'color 0.3s ease',
};

const closeButtonHoverStyle = {
    color: '#ff0000', // Red on hover
};

const alertStyle = {
    color: '#ff5733', // Lighter color for better contrast
    fontWeight: 'bold',
    marginBottom: '20px', // Added more spacing from content
    fontSize: '20px', // Slightly larger for emphasis
};

const imageButtonStyle = {
    margin: '20px 0',
    padding: '12px 24px',
    backgroundColor: '#007bff', // Blue button
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
};

const imageButtonHoverStyle = {
    backgroundColor: '#0056b3', // Darker blue on hover
};

export default Modal;
