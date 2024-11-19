// Modal.js
import React from 'react';

function Modal({ isOpen, onClose, children, onImageUpload }) {
    if (!isOpen) return null;

    return (
        <div style={modalOverlayStyle}>
            <div style={modalContentStyle}>
                <button onClick={onClose} style={closeButtonStyle}>Close</button>
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
};

const modalContentStyle = {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    maxWidth: '500px',
    textAlign: 'center',
    position: 'relative',
};

const closeButtonStyle = {
    position: 'absolute',
    top: '10px',
    right: '10px',
    background: 'none',
    border: 'none',
    fontSize: '1.5rem',
    cursor: 'pointer',
};

const alertStyle = {
    color: 'red',
    fontWeight: 'bold',
    marginBottom: '15px',
};

const imageButtonStyle = {
    margin: '20px 0',
    padding: '10px',
    cursor: 'pointer',
};

export default Modal;