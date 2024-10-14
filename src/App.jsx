import React from "react";
import Navbar from "./components/Navbar.jsx";
import Dashboard from './components/Dashboard.jsx'
import Card from "./components/Card.jsx";

import './App.css'; 
const App = () => {
  return (
    <>
    <div className="header">
      <Navbar/>
      <Dashboard/>
     
    </div>
    <div className="trend-campaign">
      <h1 className="trend-text">Trending Campaigns</h1>
      <Card/>
      <Card/>
      <Card/>

    </div>
    <hr />
    <div className="taking-off">
      <h1 className="taking-off-text">Taking Off</h1>
      <Card/>
      <Card/>
      <Card/>

    </div>



    </> )
}
export default App