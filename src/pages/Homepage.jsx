import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Navbar from "../components/Navbar.jsx";
import Dashboard from '../components/Dashboard.jsx';
import Card from "../components/Card.jsx";
import Categories from "../components/Category.jsx";
import Footer from '../components/Footer.jsx';




import './Homepage.css'; 

const campaigns = [
  {
    title: "Save the Rainforest",
    name: "John Doe",
    image: "https://media.istockphoto.com/id/1354066820/photo/gavieiro-or-el-silencio-beach-cudillero-asturias-spain.jpg?s=612x612&w=0&k=20&c=X6Q0YT2ay8brfNjAeaK4nUqzyeR9yALH4TCIndsqtOY=",
    description: "Help us protect the rainforests by supporting our campaign. We are looking to raise funds to ...",
    goal: 10000,
    raised: 7500,
    timeRemaining: 15
  },
  {
    title: "Clean Water for All",
    name: "Jane Smith",
    image: "https://api.hub.jhu.edu/factory/sites/default/files/styles/soft_crop_1300/public/drink-more-water-hub.jpg",
    description: "We aim to provide clean drinking water to underserved communities around the world.",
    goal: 5000,
    raised: 5000,
    timeRemaining: 1
  },
  {
    title: "Data Engineer",
    name: "Jane Smith",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGrPpmFxBkHOKPZxwAb04V_Qd4stXQqNmVDg&s",
    description: "We aim to provide clean drinking water to underserved communities around the world.",
    goal: 5000,
    raised: 2000,
    timeRemaining: 13
  },
  {
    title: "Data Scientist",
    name: "Jane Smith",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSQP_x9y2Q5RV0XbojJp7oowNIqaapAjT40A&s",
    description: "We aim to provide clean drinking water to underserved communities around the world.",
    goal: 5000,
    raised: 1000,
    timeRemaining: 70
  }
  
];

const Homepage = () => {

  return (
    <>
      <div className="header">
        <Navbar />
        <Dashboard />
      </div>

      <div className="trend-campaign">
        <h1 className="trend-text">Trending Campaigns</h1>
        <div className="card-container">
          {campaigns.map((campaign, index) => (
            <Card
              key={index}
              title={campaign.title}
              name={campaign.name}
              image={campaign.image}
              description={campaign.description}
              goal={campaign.goal}
              raised={campaign.raised}
              timeRemaining={campaign.timeRemaining}
            />
          ))}
        </div>
   
      </div>

      <hr />
      <div className="taking-off">
        <h1 className="taking-off-text">Taking Off</h1>
        <div className="card-container">
          {campaigns.map((campaign, index) => (
            <Card
              key={index}
              title={campaign.title}
              name={campaign.name}
              image={campaign.image}
              description={campaign.description}
              goal={campaign.goal}
              raised={campaign.raised}
              timeRemaining={campaign.timeRemaining}
            />
          ))}
        </div>
      </div>

      <hr />
      <div className="feature-campaign">
        <h1 className="feature-campaign-text">Featured Project</h1>
        <div className="card-container">
          {campaigns.map((campaign, index) => (
            <Card
              key={index}
              title={campaign.title}
              name={campaign.name}
              image={campaign.image}
              description={campaign.description}
              goal={campaign.goal}
              raised={campaign.raised}
              timeRemaining={campaign.timeRemaining}
            />
          ))}
        </div>
      </div>

      <hr />
      <div className="feature-campaign">
        <h1 className="feature-campaign-text">How it works?</h1>
      </div>

      <hr />
      <div className="categories">
        <h1 className="category-text">Categories</h1>
        <Categories />
      </div>

      <Footer />
    </>
  );
};

export default Homepage;
