import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from "../components/Navbar.jsx";
import Footer from '../components/Footer.jsx';
import { Link } from 'react-router-dom';
import './ViewInfo.css';

function CampaignsValidate() {
  const port = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const [error, setError] = useState('');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false); // New state for success popup
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      navigate('/');
      return;
    }

    const role = localStorage.getItem('role');
    setUserRole(role);

    if (role !== 'admin' && role !== 'validator') {
      navigate('/Unauthorized');
    }
  }, [navigate]);

  useEffect(() => {
    if (userRole === 'admin' || userRole === 'validator') {
      const fetchCampaigns = async () => {
        try {
          const response = await fetch(`${port}/admin/PendingCampaigns`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
            },
          });

          if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
          }

          const data = await response.json();
          console.log('Fetched data:', data);

          if (data.success) {
            setCampaigns(data.data.campaigns);
          } else {
            setError('Failed to fetch campaigns.');
          }
        } catch (err) {
          console.error('Error fetching campaigns:', err.message);
          setError('An error occurred. Please try again.');
        }
      };

      fetchCampaigns();
    }
  }, [userRole]);

  const handleVerifyCampaign = async (campaignId) => {
    if (window.confirm("Are you sure you want to verify this campaign?")) { // Confirmation popup
      try {
        const response = await fetch(`${port}/admin/ValidateCampaigns/${campaignId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          },
          body: JSON.stringify({ campaign_id: campaignId }),
        });

        const data = await response.json();
        if (response.ok && data.success) {
          // Update the local state to remove the verified campaign from the pending list
          setCampaigns((prevCampaigns) =>
            prevCampaigns.filter((campaign) => campaign.campaign_id !== campaignId)
          );
          setError(''); // Clear any previous errors
          setShowSuccessPopup(true); // Show success popup
        } else {
          setError(data.message || 'Failed to verify campaign');
        }
      } catch (err) {
        console.error('Error verifying campaign:', err.message);
        setError('An error occurred while verifying the campaign. Please try again.');
      }
    }
  };

  const closePopup = () => {
    setShowSuccessPopup(false);
  };

  const calculateTimeRemaining = (deadline) => {
    const deadlineDate = new Date(deadline);
    const now = new Date();
    const timeDifference = deadlineDate - now;
    return timeDifference > 0
      ? `${Math.floor(timeDifference / (1000 * 60 * 60 * 24))}`
      : "Campaign ended";
  };

  if (userRole === '') {
    return null;
  }

  return (
    <>
      <Navbar />
      <style>
  {`
    .profile-container {
      display: flex;
      font-family: Arial, sans-serif;
    }

    .profile-content {
      flex: 1;
      padding: 20px;
    }

    h1 {
      text-align: center;
      color: #333;
    }

    .table-container {
      overflow-x: auto;
      margin-top: 20px;
    }

    .campaign-table {
      width: 100%;
      border-collapse: collapse;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    .campaign-table th, .campaign-table td {
      padding: 12px;
      border: 1px solid #ddd;
      text-align: center;
    }

    .campaign-table th {
      background-color: #007bff;
      color: #fff;
    }

    .campaign-table td {
      background-color: #f9f9f9;
    }

    .campaign-table tr:nth-child(even) td {
      background-color: #f1f1f1;
    }

    .campaign-table img {
      width: 80px;
      height: 80px;
      object-fit: cover;
      border-radius: 4px;
    }

    .error-message {
      color: red;
      font-weight: bold;
      text-align: center;
      margin-top: 20px;
    }

    /* Button styles */
    .action-button {
      padding: 8px 12px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      font-weight: bold;
      transition: background-color 0.3s ease;
      margin-right: 8px;
    }

    .view-button {
      background-color: #6c757d;
      color: white;
      text-decoration: none;
    }
    .view-button:hover {
      background-color: #5a6268;
    }

    .hide-button {
      background-color: #ff9800;
      color: white;
    }
    .hide-button:hover {
      background-color: #fb8c00;
    }

    .delete-button {
      background-color: #f44336;
      color: white;
    }
    .delete-button:hover {
      background-color: #e53935;
    }

    /* Success popup styles */
    .popup-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .popup-content {
      background-color: white;
      padding: 20px;
      border-radius: 8px;
      text-align: center;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    .popup-content p {
      font-size: 18px;
      color: #333;
    }

    .close-button {
      background-color: #007bff;
      color: white;
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      font-size: 16px;
      cursor: pointer;
      margin-top: 10px;
    }
    .close-button:hover {
      background-color: #0056b3;
    }
  `}
</style>

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
          <h1>Validate Campaigns</h1>
          {error && <p className="error-message">{error}</p>}

          <div className="table-container">
            {campaigns.length > 0 ? (
              <table className="campaign-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Create by</th>
                    <th>Short Description</th>
                    <th>Tag</th>
                    <th>Goal Amount</th>
                    <th>Raised Amount</th>
                    <th>Status</th>
                    <th>Deadline</th>
                    <th>Days Left</th>
                    <th>Image</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {campaigns.map((campaign) => (
                    <tr key={campaign.campaign_id}>
                      <td>{campaign.title}</td>
                      <td>{campaign.first_name}</td>
                      <td>{campaign.short_description}</td>
                      <td>{campaign.campaign_tag}</td>
                      <td>{campaign.goal_amount}</td>
                      <td>{campaign.raised_amount}</td>
                      <td>{campaign.status}</td>
                      <td>{new Date(campaign.deadline).toLocaleDateString()}</td>
                      <td>{calculateTimeRemaining(campaign.deadline)}</td>
                      <td>
                        {campaign.image && (
                          <img
                            src={`${port}/${campaign.image.replace('\\', '/')}`}
                            alt={campaign.title}
                          />
                        )}
                      </td>
                      <td>
                        <Link to={`/CampaignsDetailsPage/${campaign.campaign_id}/${campaign.title}/${campaign.first_name}`} className="action-button view-button">View</Link>
                        <button className="action-button hide-button" onClick={() => handleVerifyCampaign(campaign.campaign_id)}>Verify</button>
                        <button className="action-button delete-button" onClick={() => handleDeleteCampaign(campaign.campaign_id)}>Reject</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No campaigns found.</p>
            )}
          </div>
        </main>
      </div>

      {showSuccessPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <p>Campaign verified successfully!</p>
            <button className="close-button" onClick={closePopup}>Close</button>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}

export default CampaignsValidate;
