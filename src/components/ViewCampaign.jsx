import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from "../components/Navbar.jsx";
import Footer from '../components/Footer.jsx';
import './ViewCampaigns.css'; // Import custom CSS for styling

function ViewCampaign() {
  const port = import.meta.env.VITE_API_URL;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const [firstName, setFirstName] = useState('');
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('access_token');
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const accessToken = localStorage.getItem('access_token');
  

    const role = localStorage.getItem('role');
    setUserRole(role);

    if (role !== 'admin' && role !== 'validator' && role !== 'user') {
      navigate('/Unauthorized');
    }
  }, [navigate]);
  useEffect(() => {
    if (!isLoggedIn) {
      setIsModalVisible(true);
    } else {
      fetch(`${port}/view/campaign-info`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to fetch campaign info');
          }
          return response.json();
        })
        .then(data => {
          if (data.success) {
            setCampaigns(data.data.campaigns);
            setFirstName(data.data.first_name);
          } else {
            console.error(data.message);
          }
        })
        .catch(error => console.error('Error fetching campaign info:', error));
    }
  }, [isLoggedIn, port]);

  const handleCloseModal = () => {
    setIsModalVisible(false);
    navigate('/');
  };

  const getImageUrl = (image) => {
    // If the image is a base64 string
    if (image.startsWith("data:image")) {
      return image;
    }
    // If the image is a file path
    return `${port}/${image}`;
  };


  if (!isLoggedIn) {
    return (
      <>
        <Navbar />
        {isModalVisible && (
          <div className="modal">
            <div className="modal-content">
              <h2>Login Required</h2>
              <p>You must log in to view this page.</p>
              <button className="btn-primary" onClick={handleCloseModal}>OK</button>
            </div>
          </div>
        )}
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="profile-container">
      <aside className="sidebar">
  {userRole === 'admin' ? (
    <ul>
      <li><Link to='/ViewInfo'>Info</Link></li>
      <li><Link to='/AlluserAdmin'>View all Account</Link></li>
      <li><Link to='/AllcampaignsAdmin'>View all Campaigns</Link></li>
      <li><Link to='/CampaignsValidate'>Pending Campaigns</Link></li>
      <li><Link to='/ViewCampaign'>My Campaign</Link></li>
      <li><Link to='/Transaction'>Transaction</Link></li>


    </ul>
  ) : userRole === 'validator' ? (
    <ul>
      <li><Link to='/ViewInfo'>Info</Link></li>
      <li><Link to='/CampaignsValidate'>Pending Campaigns</Link></li>
      <li><Link to='/ViewCampaign'>My Campaign</Link></li>
      <li><Link to='/Transaction'>Transaction</Link></li>
      <li><Link to='/DeleteAccount'>Delete Account</Link></li>
    </ul>
  ) : (
    <ul>
      <li><Link to='/ViewInfo'>Info</Link></li>
      <li><Link to='/ViewCampaign'>My Campaign</Link></li>
      <li><Link to='/Transaction'>Transaction</Link></li>
      <li><Link to='/DeleteAccount'>Delete Account</Link></li>
    </ul>
  )}
</aside>
        
        <main className="profile-content">
          <div className="profile-card">
            <div className="profile-header">
              <h1>{firstName}'s Campaigns</h1>
            </div>

            <div className="campaign-list">
              {campaigns.length > 0 ? (
                campaigns.map((campaign, index) => (
                  <div key={index} className="campaign-item">
                    <Link 
                      to={`/CampaignsDetailsPage/${campaign.campaign_id}/${campaign.title}/${campaign.name}`}
                      className="campaign-link"
                    >
                      <img 
                        src={getImageUrl(campaign.image)} 
                        alt={`${campaign.title} Thumbnail`} 
                        className="campaign-image" 
                      />
                      <h2 className="campaign-title">{campaign.title}</h2>
                      <p className="campaign-goal">Goal Amount: {campaign.goal_amount}฿</p>
                      <p className="campaign-status">Status: {campaign.status}</p>
                      <p className="campaign-deadline">Deadline: {new Date(campaign.deadline).toLocaleDateString()}</p>
                    </Link>
                  </div>
                ))
              ) : (
                <p>No campaigns found.</p>
              )}
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}

export default ViewCampaign;
