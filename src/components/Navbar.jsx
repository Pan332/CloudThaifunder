import React, { useState } from "react";
import './Navbar.css'; // Optional: for custom styling

const Navbar = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <a href="/">ThaiFunder</a>
      </div>

      <div className="navbar-center">
        <ul className={isMobileMenuOpen ? "navbar-links mobile-open" : "navbar-links"}>
          <li className="navbar-item">
            <a href="/">Home</a>
          </li>
          <li className="navbar-item">
            <a href="/about">About</a>
          </li>
          <li className="navbar-item">
            <a href="/services">Services</a>
          </li>
          <li className="navbar-item">
            <a href="/contact">Contact</a>
          </li>
        </ul>
        
      </div>
      <div className="campaign-section">
      <a href="/" className="createBtn">Create Campaign</a>
      <a href="/" className="login">Login</a>
      </div>
   
      
     

      <div className="menu-toggle" onClick={toggleMobileMenu}>
        {isMobileMenuOpen ? (
          <span>&#10005;</span> // X icon for closing
        ) : (
          <span>&#9776;</span> // Hamburger icon for opening
        )}
      </div>
    </nav>
  );
};

export default Navbar;
