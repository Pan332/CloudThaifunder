import React, { useState, useEffect } from "react";
import { BiLogOut } from "react-icons/bi"; // Import BiLogOut icon from react-icons
import { FaRegUserCircle } from "react-icons/fa"; // Import user icon from react-icons

import LoginModal from './LoginModal';
import './Navbar.css';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isCategoriesDropdownOpen, setCategoriesDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const accessToken = localStorage.getItem('access_token');
    setIsLoggedIn(!!accessToken);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  const openLoginModal = () => {
    setLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    setLoginModalOpen(false);
    const accessToken = localStorage.getItem('access_token');
    setIsLoggedIn(!!accessToken);
  };

  const toggleCategoriesDropdown = () => {
    setCategoriesDropdownOpen(!isCategoriesDropdownOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setIsLoggedIn(false);
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
              <Link to='/CharitiesPage'>Charity Campaigns</Link>
            </li>
            <li 
              className="navbar-item" 
              onMouseEnter={toggleCategoriesDropdown} 
              onMouseLeave={toggleCategoriesDropdown}
            >
              <a href="#">
                Categories <span className="dropdown-arrow">▼</span>
              </a>
              {isCategoriesDropdownOpen && (
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
          <a href="./campaign" className="createBtn">Create Campaign</a>
          {isLoggedIn ? (
            <>
              <Link to="/ViewInfo">
                <FaRegUserCircle className="user-icon" />
              </Link>
              <BiLogOut 
                className="logout-icon" 
                onClick={handleLogout} 
              />
            </>
          ) : (
            <a className="login" onClick={openLoginModal}>Login</a>
          )}
        </div>

        <div className="menu-toggle" onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? (
            <span>&#10005;</span> // X icon for closing
          ) : (
            <span>&#9776;</span> // Hamburger icon for opening
          )}
        </div>
      </nav>

      {isLoginModalOpen && <LoginModal closeModal={closeLoginModal} />}
    </>
  );
};

export default Navbar;