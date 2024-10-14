import React, { useState } from "react";
import LoginModal from './LoginModal'; // Import the login modal component
import './Navbar.css'; // Optional: for custom styling
import {Link} from 'react-router-dom'
const Navbar = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoginModalOpen, setLoginModalOpen] = useState(false); // State for modal visibility
  const [isCategoriesDropdownOpen, setCategoriesDropdownOpen] = useState(false); // State for dropdown visibility

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  const openLoginModal = () => {
    setLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    setLoginModalOpen(false);
  };

  const toggleCategoriesDropdown = () => {
    setCategoriesDropdownOpen(!isCategoriesDropdownOpen);
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-logo">
          <Link to='/'>Thaifunder</Link>
        </div>

        <div className="navbar-center">
          <ul className={isMobileMenuOpen ? "navbar-links mobile-open" : "navbar-links"}>
            <li className="navbar-item">
            <Link to='/Charities'>Charity funding</Link>
            </li>
            <li 
              className="navbar-item" 
              onMouseEnter={toggleCategoriesDropdown} 
              onMouseLeave={toggleCategoriesDropdown}
            >
  <a href="#">
    Categories <span className="dropdown-arrow">▼</span>
  </a>              {isCategoriesDropdownOpen && (
                <ul className="dropdown">
                  <li><a href="/categories/education">Education</a></li>
                  <li><a href="/categories/game">Game</a></li>
                  <li><a href="/categories/music">Music</a></li>
                  <li><a href="/categories/book">Book</a></li>

                  <li><a href="/categories/technology">Technology</a></li>
                  <li><a href="/categories/View all">View all</a></li>
                </ul>
              )}
            </li>
            <li className="navbar-item">
            <Link to='/AboutPage'>About</Link>
            </li>
            <li className="navbar-item">
            <Link to='/ServicePage'>Services</Link>
            </li>
            <li className="navbar-item">
            <Link to='/ContactPage'>Contact</Link>
            </li>
          </ul>
        </div>

        <div className="campaign-section">
          <a href="/" className="createBtn">Create Campaign</a>
          <a className="login" onClick={openLoginModal}>Login</a> {/* Open modal on click */}
        </div>

        <div className="menu-toggle" onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? (
            <span>&#10005;</span> // X icon for closing
          ) : (
            <span>&#9776;</span> // Hamburger icon for opening
          )}
        </div>
      </nav>

      {isLoginModalOpen && <LoginModal closeModal={closeLoginModal} />} {/* Render the modal */}
    </>
  );
};

export default Navbar;
