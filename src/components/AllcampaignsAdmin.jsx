import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from "../components/Navbar.jsx";
import Footer from '../components/Footer.jsx';
import { Link } from 'react-router-dom';
import './ViewInfo.css';

function AllcampaignsAdmin() {
  const port = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const [error, setError] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  useEffect(() => {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      navigate('/');
      return;
    }

    const userRole = localStorage.getItem('role');
    if (userRole === 'admin') {
      setIsAdmin(true);
    } else {
      navigate('/Unauthorized');
    }
  }, [navigate]);

  useEffect(() => {
    if (isAdmin) {
      const fetchCampaigns = async () => {
        try {
          const response = await fetch(`${port}/admin/getAllcampaigns`, {
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
  }, [isAdmin]);

  const handleDeleteCampaign = async (campaignId) => {
    if (window.confirm('Are you sure you want to delete this campaign?')) {
      try {
        const response = await fetch(`${port}/admin/deleteCampaign/${campaignId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        if (data.success) {
          setCampaigns((prevCampaigns) => prevCampaigns.filter((campaign) => campaign.campaign_id !== campaignId));
        } else {
          setError('Failed to delete campaign.');
        }
      } catch (err) {
        console.error('Error deleting campaign:', err.message);
        setError('An error occurred. Please try again.');
      }
    }
  };

  const handleToggleCampaignStatus = async (campaignId, currentStatus) => {
    const newStatus = currentStatus === 'hidden' ? 'verified' : 'hidden';
    try {
      const response = await fetch(`${port}/admin/hideCampaigns/${campaignId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      if (data.success) {
        setCampaigns((prevCampaigns) =>
          prevCampaigns.map((campaign) =>
            campaign.campaign_id === campaignId ? { ...campaign, status: newStatus } : campaign
          )
        );
      } else {
        setError('Failed to update campaign status.');
      }
    } catch (err) {
      console.error('Error updating campaign status:', err.message);
      setError('An error occurred. Please try again.');
    }
  };

  const calculateTimeRemaining = (deadline) => {
    const deadlineDate = new Date(deadline);
    const now = new Date();
    const timeDifference = deadlineDate - now;
    return timeDifference > 0
      ? `${Math.floor(timeDifference / (1000 * 60 * 60 * 24))}`
      : "Campaign ended";
  };

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedCampaigns = React.useMemo(() => {
    const sorted = [...campaigns];
    if (sortConfig.key) {
      sorted.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sorted;
  }, [campaigns, sortConfig]);

  if (!isAdmin) {
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
  margin-right: 8px; /* Increased from 4px to 8px */
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

  `}
</style>
      <div className="profile-container">
        <aside className="sidebar">
          <ul>
            <li><Link to='/ViewInfo'>Info</Link></li>
            <li><Link to='/AlluserAdmin'>View all Account</Link></li>
            <li><Link to='/AllCampaignsAdmin'>View all Campaigns</Link></li>
            <li><Link to='/CampaignsValidate'>Pending Campaigns</Link></li>
            <li><Link to='/ViewCampaign'>My Campaign</Link></li>
            <li><Link to='/Transaction'>Transaction</Link></li>
            <li><Link to='/AdminDashboard'>Dashboard</Link></li>
          </ul>
        </aside>

        <main className="profile-content">
          <h1>Campaigns Management</h1>
          {error && <p className="error-message">{error}</p>}

          <div className="table-container">
            {sortedCampaigns.length > 0 ? (
              <table className="campaign-table">
                <thead>
                  <tr>
                    <th onClick={() => requestSort('title')}>Title</th>
                    <th onClick={() => requestSort('first_name')}>Create by</th>
                    <th>Short Description</th>
                    <th onClick={() => requestSort('campaign_tag')}>Tag</th>
                    <th onClick={() => requestSort('goal_amount')}>Goal Amount</th>
                    <th onClick={() => requestSort('raised_amount')}>Raised Amount</th>
                    <th onClick={() => requestSort('status')}>Status</th>
                    <th onClick={() => requestSort('deadline')}>Deadline</th>
                    <th>Days Left</th>
                    <th>Image</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedCampaigns.map((campaign) => (
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
                        <button className={`action-button hide-button`} onClick={() => handleToggleCampaignStatus(campaign.campaign_id, campaign.status)}>
                          {campaign.status === 'hidden' ? 'Unhide' : 'Hide'}
                        </button>
                        <button className="action-button delete-button" onClick={() => handleDeleteCampaign(campaign.campaign_id)}>Delete</button>
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
      <Footer />
    </>
  );
}

export default AllcampaignsAdmin;
