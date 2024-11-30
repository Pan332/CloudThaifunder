import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from "../components/Navbar.jsx";
import Footer from '../components/Footer.jsx';
import './ViewCampaigns.css'; // Import custom CSS for styling
import jwt_decode from "jwt-decode";

function ViewTransaction() {
  const port = import.meta.env.VITE_API_URL;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [donations, setDonation] = useState([]);
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('access_token');
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
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
      const token = localStorage.getItem('access_token');
      if (!token) return;

      try {
        const decoded = jwt_decode(token);
        const userId = decoded.user_id; // Ensure your JWT contains `user_id`
        fetch(`${port}/view/getDonations/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error('Failed to fetch donations');
            }
            return response.json();
          })
          .then((data) => {
            if (data.donations) {
              setDonation(data.donations);
            } else {
              console.error(data.message);
            }
          })
          .catch((error) => console.error('Error fetching donations:', error));
      } catch (error) {
        console.error('Invalid token:', error);
      }
    }
  }, [isLoggedIn, port]);

  const handleCloseModal = () => {
    setIsModalVisible(false);
    navigate('/');
  };

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
              <li><Link to='/ViewTransaction'>Transaction</Link></li>
            </ul>
          ) : userRole === 'validator' ? (
            <ul>
              <li><Link to='/ViewInfo'>Info</Link></li>
              <li><Link to='/CampaignsValidate'>Pending Campaigns</Link></li>
              <li><Link to='/ViewCampaign'>My Campaign</Link></li>
              <li><Link to='/ViewTransaction'>Transaction</Link></li>
              <li><Link to='/DeleteAccount'>Delete Account</Link></li>
            </ul>
          ) : (
            <ul>
              <li><Link to='/ViewInfo'>Info</Link></li>
              <li><Link to='/ViewCampaign'>My Campaign</Link></li>
              <li><Link to='/ViewTransaction'>Transaction</Link></li>
              <li><Link to='/DeleteAccount'>Delete Account</Link></li>
            </ul>
          )}
        </aside>

        <main className="profile-content">
          <div className="profile-card">
            <div className="profile-header">
              <h1>My Transactions</h1>
            </div>

            <div className="campaign-list">
              {donations.length > 0 ? (
                <table className="donations-table">
                  <thead>
                    <tr>
                      <th>Campaign Title</th>
                      <th>Amount (THB)</th>
                      <th>Transaction ID</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {donations.map((donation) => (
                      <tr key={donation.donation_id}>
                        <td>{donation.campaign_title}</td>
                        <td>{donation.amount}</td>
                        <td>{donation.transaction_id}</td>
                        <td>{new Date(donation.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No donations found.</p>
              )}
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}

export default ViewTransaction;
