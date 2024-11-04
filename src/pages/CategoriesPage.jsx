import React, { useEffect, useState } from 'react';
import Navbar from "../components/Navbar.jsx";
import Footer from '../components/Footer.jsx';
import Card from "../components/Card.jsx";
import './CategoriesPage.css';

function CategoriesPage() {
  const port = import.meta.env.VITE_API_URL;
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
          setCampaigns(data.data.campaigns);
        } else {
          setError(data.message || 'Failed to load campaigns');
        }
        setLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setLoading(false);
      });
  }, [port]);

  const calculateTimeRemaining = (deadline) => {
    const deadlineDate = new Date(deadline);
    const now = new Date();
    const timeDifference = deadlineDate - now;
    return timeDifference > 0
      ? `${Math.floor(timeDifference / (1000 * 60 * 60 * 24))}`
      : "Campaign ended";
  };

  const getImageUrl = (base64Image) => `data:image/jpeg;base64,${base64Image}`;

  return (
    <>
      <Navbar />
      <main className="categories-page">
        <h1>All Campaigns</h1>

        {loading ? (
          <p className="loading-message">Loading campaigns...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : campaigns.length === 0 ? (
          <p className="empty-message">No campaigns available at the moment.</p>
        ) : (
          <div className="campaigns-container">
            {campaigns.map((campaign, index) => (
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
        )}
      </main>
      <Footer />
    </>
  );
}

export default CategoriesPage;
