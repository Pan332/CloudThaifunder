import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from "../components/Navbar.jsx";
import Footer from '../components/Footer.jsx';
import './ViewInfo.css'; // Import custom CSS for styling
import { Link } from 'react-router-dom';

function ViewCampaign() {
  const port = import.meta.env.VITE_API_URL;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const [firstName, setFirstName] = useState('');
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('access_token');

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
          <ul>
            <li><Link to='/ViewInfo'>Info</Link></li>
            <li><Link to='/ViewCampaign'>My Campaign</Link></li>
            <li><Link to='/Transaction'>Transaction</Link></li>
            <li><Link to='/Dashboard'>Dashboard</Link></li>
            <li><Link to='/DeleteAccount'>Delete Account</Link></li>
          </ul>
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
                    <h2>{campaign.title}</h2>
                    <p>Goal Amount: {campaign.goal_amount}฿</p>
                    <p>Status: {campaign.status}</p>
                    <p>Deadline: {new Date(campaign.deadline).toLocaleDateString()}</p>
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