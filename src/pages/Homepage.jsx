import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

import Navbar from "../components/Navbar.jsx";
import Dashboard from '../components/Dashboard.jsx'
import Card from "../components/Card.jsx";
import Categories from "../components/Category.jsx";
import Footer from '../components/Footer.jsx';

import './Homepage.css'; 
const Homepage = () => {
  return (
    <>
    <div className="header">
      <Navbar/>
      <Dashboard/>
     
    </div>
    <div className="trend-campaign">
      <h1 className="trend-text">Trending Campaigns</h1>
      <div className="card-grip">
      <Card/>
      <Card/>
      <Card/>
      </div>
    

    </div>
    <hr />
    <div className="taking-off">
      <h1 className="taking-off-text">Taking Off</h1>
      <div className="card-grip">
      <Card/>
      <Card/>
      <Card/>
      </div>

    </div>
    <hr />
    <div className="feature-campaign">
      <h1 className="feature-campaign-text">Featured Project</h1>
      <div className="card-grip">
      <Card/>
      <Card/>
      <Card/>
      </div>

    </div>
    <hr />
    <div className="feature-campaign">
      <h1 className="feature-campaign-text">How it work?</h1>
      <Card/>

    </div>
    <hr />
    <div className="categories">
      <h1 className="category-text">Categories</h1>
      <Categories/>
    </div>
    <Footer/>



    </> )
}
export default Homepage;