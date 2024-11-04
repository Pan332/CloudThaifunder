import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import './CampaignsDetailsPage.css';

function CampaignsDetailsPage() {
  const { id } = useParams(); // Get the campaign ID from the URL
  const port = import.meta.env.VITE_API_URL;
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${port}/api/CampaignById/${id}`)
      .then(response => {
        if (!response.ok) throw new Error('Failed to fetch campaign details');
        return response.json();
      })
      .then(data => {
        if (data.success) setCampaign(data.data);
        else setError(data.message || 'Failed to load campaign details');
        setLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setLoading(false);
      });
  }, [port, id]);

  const calculateTimeRemaining = (deadline) => {
    const deadlineDate = new Date(deadline);
    const now = new Date();
    const timeDifference = deadlineDate - now;
    return timeDifference > 0
      ? `${Math.floor(timeDifference / (1000 * 60 * 60 * 24))} days left`
      : "Campaign ended";
  };

  return (
    <>
      <Navbar />
      <div className="details-page">
        {loading && <p>Loading campaign details...</p>}
        {error && <p className="error-message">{error}</p>}
        {campaign && !loading && !error && (
          <div className="campaign-details">
            <div className="image-section">
              <h1>{campaign.title}</h1>
              <img
                src={`data:image/jpeg;base64,${campaign.image}`}
                alt={campaign.title}
                className="campaign-images"
              />
            </div>

            <div className="info-section">
              <div className="stats">
                <p><strong>Goal Amount:</strong> ${campaign.goal_amount}</p>
                <p><strong>Raised Amount:</strong> ${campaign.raised_amount}</p>
                <p><strong>Time Remaining:</strong> {calculateTimeRemaining(campaign.deadline)}</p>
              </div>

              <div className="description">
                <h2>Description</h2>
                <p>{campaign.description}</p>
              </div>

              <div className="donation-section">
                <button className="donate-button">Donate Now</button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}

export default CampaignsDetailsPage;
