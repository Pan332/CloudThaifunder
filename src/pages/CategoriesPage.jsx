import React, { useEffect, useState } from 'react';
import Navbar from "../components/Navbar.jsx";
import Footer from '../components/Footer.jsx';
import Card from "../components/Card.jsx";

function CategoriesPage() {
  const port = import.meta.env.VITE_API_URL;
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    fetch(`${port}/view/Allcampaign`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch campaigns');
        }
        return response.json();
      })
      .then(data => {
        if (data.success) {
          console.log('Campaigns data:', data.data); // Log the data to console
          setCampaigns(data.data.campaigns); // Assuming data.data.campaigns contains the array of campaigns
        } else {
          console.error(data.message);
        }
      })
      .catch(error => console.error('Error fetching campaigns:', error));
  }, [port]);

  // Helper function to calculate time remaining from the deadline
  const calculateTimeRemaining = (deadline) => {
    const deadlineDate = new Date(deadline);
    const now = new Date();
    const timeDifference = deadlineDate - now;

    if (timeDifference > 0) {
      const daysRemaining = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
      return `${daysRemaining}`;
    }
    return "Campaign ended";
  };

  // Helper function to convert base64 to image URL
  const getImageUrl = (base64Image) => {
    return `data:image/jpeg;base64,${base64Image}`;
  };

  return (
    <>
      <Navbar />
      <h1>All Categories</h1>
      <div className="campaigns-container">
        {campaigns.map((campaign, index) => (
          <Card
            key={index}
            title={campaign.title}
            name={campaign.first_name} // Assuming first_name is the campaign creator's name
            image={getImageUrl(campaign.image)} // Convert base64 to image URL
            description={campaign.short_description}
            goal={campaign.goal_amount}
            raised={campaign.raised_amount}
            timeRemaining={calculateTimeRemaining(campaign.deadline)}
          />
        ))}
      </div>
      <Footer />
    </>
  );
}

export default CategoriesPage;
