import React from 'react'
import Navbar from "../components/Navbar.jsx";
import Footer from '../components/Footer.jsx';
import { useCampaigns } from '../components/CampaignContext.jsx';
import Card from "../components/Card.jsx";
import './CategoriesPage.css';
import Search from "../components/Search.jsx";

function CharitiesPage() {
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
  <Navbar/>
  <main className="categories-page">
  <h1>Charity Campaign</h1>
  <Search/>
          <div className="campaigns-container">
            {campaigns.filter((campaign) => campaign.campaign_tag === 'charities').map((campaign, index) => (
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
          </main>

  <Footer/>
  </>
  )
}

export default CharitiesPage;
