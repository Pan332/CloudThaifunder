import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Navbar from "../components/Navbar.jsx";
import Dashboard from '../components/Dashboard.jsx';
import Card from "../components/Card.jsx";
import Categories from "../components/Category.jsx";
import Footer from '../components/Footer.jsx';
import HowItWorks from "../components/HowItWorks.jsx";
import Why from "../components/Why.jsx";
import Search from "../components/Search.jsx";
import { useCampaigns } from '../components/CampaignContext.jsx';

import './Homepage.css'; 




function Homepage()  {
  const port = import.meta.env.VITE_API_URL;

  const { campaigns } = useCampaigns();
  console.log(campaigns)
  const calculateTimeRemaining = (deadline) => {
    const deadlineDate = new Date(deadline);
    const now = new Date();
    const timeDifference = deadlineDate - now;
    return timeDifference > 0
      ? `${Math.floor(timeDifference / (1000 * 60 * 60 * 24))} day left`
      : "Campaign ended";
  };
  const getImageUrl = (image) => {
    // If the image is a base64 string
    if (image.startsWith("data:image")) {
      return image;
    }
    // If the image is a file path
    return `${port}/${image}`;
  };
  return (
    <>
      <div className="header">
        <Navbar />
        <Dashboard />
      </div>

      <div className="trend-campaign">
        <h1 className="trend-text">Charities</h1>
        <div className="card-container">
        {campaigns.filter((campaign) => campaign.campaign_tag === 'charities').slice(0, 4).map((campaign, index) => (
              <Card
                key={index}
                id={campaign.campaign_id}
                title={campaign.title}
                name={campaign.first_name} // Assuming first_name is the creator's name
                image={getImageUrl(campaign.image)} 
                description={campaign.short_description}
                goal={campaign.goal_amount}
                raised={campaign.raised_amount}
                timeRemaining={calculateTimeRemaining(campaign.deadline)}
              />
            ))}
         
        </div>
   
      </div>

      <div className="taking-off">
        <h1 className="taking-off-text">Taking Off</h1>
        
        <div className="card-container">
        {campaigns
      .filter((campaign) => campaign.goal_amount === campaign.raised_amount).slice(0, 4)
      .map((campaign, index) => (
        <Card
          key={index}
          id={campaign.campaign_id}
          title={campaign.title}
          name={campaign.first_name}
          image={getImageUrl(campaign.image)} 
          description={campaign.short_description}
          goal={campaign.goal_amount}
          raised={campaign.raised_amount}
          timeRemaining={calculateTimeRemaining(campaign.deadline)}
        />
      ))}
        </div>
      </div>

      <div className="feature-campaign">
        <h1 className="feature-campaign-text">Featured Project</h1>
        <div className="card-container">
        {campaigns
      .filter(
        (campaign) =>
          campaign.campaign_tag === 'technology' || campaign.campaign_tag === 'education'
      )
      .sort(() => Math.random() - 0.5) // Shuffle campaigns randomly
      .slice(0, 4) // Pick the first 4 campaigns from the shuffled list
      .map((campaign, index) => (
        <Card
          key={index}
          id={campaign.campaign_id}
          title={campaign.title}
          name={campaign.first_name}
          image={getImageUrl(campaign.image)}
          description={campaign.short_description}
          goal={campaign.goal_amount}
          raised={campaign.raised_amount}
          timeRemaining={calculateTimeRemaining(campaign.deadline)}
        />
      ))}
        </div>
      </div>
      <div className="feature-campaign">
        <h1 className="feature-campaign-text">Why Thaifunder?</h1>
        <Why/>
      </div>
      <div className="feature-campaign">
        <h1 className="feature-campaign-text">How it Works?</h1>
        <HowItWorks/>
      </div>
   

      <div className="categories">
        <h1 className="category-text">Fundraising Categories</h1>
        <Categories />
      </div>

      <Footer />
    </>
  );
};

export default Homepage;
