import React, { useEffect, useState } from 'react';
import Navbar from "../components/Navbar.jsx";
import Footer from '../components/Footer.jsx';
import Card from "../components/Card.jsx";
import './CategoriesPage.css';
import Search from "../components/Search.jsx";
import { CampaignProvider } from '../components/CampaignContext';

function CategoriesPage() {
  const port = import.meta.env.VITE_API_URL;
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // Pagination state
  const rowsPerPage = 8;
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
          console.log(data)
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

  const paginatedCampaigns = campaigns.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const totalPages = Math.ceil(campaigns.length / rowsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  return (
    <> 
    <CampaignProvider>
      <Navbar />
      <main className="categories-page">
        <h1>All Campaigns</h1>
          <Search/>
      
        {loading ? (
          <p className="loading-message">Loading campaigns...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : campaigns.length === 0 ? (
          <p className="empty-message">No campaigns available at the moment.</p>
        ) : 
        
        (
          
          <div className="campaigns-container">
         
            {paginatedCampaigns.map((campaign, index) => (
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
      <div className="pagination">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className={`btn ${page === currentPage ? 'btn-active' : ''}`}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </button>
            ))}
          </div>
      <Footer />
      </CampaignProvider>
    </>
  );
}

export default CategoriesPage;
