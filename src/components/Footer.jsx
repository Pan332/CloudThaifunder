import React from 'react';
import { FaTwitter, FaInstagram, FaFacebook } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer style={styles.footerContainer}>
      <div style={styles.socialIcons}>
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" style={styles.icon}>
          <FaTwitter size={30} />
        </a>
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={styles.icon}>
          <FaInstagram size={30} />
        </a>
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" style={styles.icon}>
          <FaFacebook size={30} />
        </a>
      </div>
      <p style={styles.text}>© 2024 Thaifunder. All rights reserved.</p>
    </footer>
  );
};

// Inline styles for the footer
const styles = {
  footerContainer: {
    backgroundColor: '#222',
    color: '#fff',
    textAlign: 'center',
    padding: '20px 0',
    left: 0,
    bottom: 0,
    width: '100%',
  },
  socialIcons: {
    marginBottom: '10px',
  },
  icon: {
    margin: '0 15px',
    color: '#fff',
    textDecoration: 'none',
  },
  text: {
    marginTop: '10px',
    fontSize: '14px',
  },
};

export default Footer;
