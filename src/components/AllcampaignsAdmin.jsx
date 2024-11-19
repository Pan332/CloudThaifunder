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
  const [currentPage, setCurrentPage] = useState(1); // Pagination state
  const rowsPerPage = 6;
  
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
    try {
      const response = await fetch(`${port}/admin/deleteCampaign/${campaignId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: JSON.stringify({ status: 'deleted' }), // Set the new status to 'deleted'
      });
  
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
  
      const data = await response.json();
      if (data.success) {
        // Update the campaign status to 'deleted' in the UI
        setCampaigns((prevCampaigns) =>
          prevCampaigns.map((campaign) =>
            campaign.campaign_id === campaignId ? { ...campaign, status: 'deleted' } : campaign
          )
        );
      } else {
        setError('Failed to delete the campaign.');
      }
    } catch (err) {
      console.error('Error deleting campaign:', err.message);
      setError('An error occurred. Please try again.');
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
      
      if (data.message === 'This campaign is already deleted') {
        setError('This campaign has already been deleted.');
      } else if (data.success) {
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

  const paginatedCampaigns = sortedCampaigns.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const totalPages = Math.ceil(campaigns.length / rowsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };


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
      padding: 6px;
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

 .btn {
            margin: 0 1px;
            border: none;
            color: #fff;
            cursor: pointer;
            border-radius: 4px;
          }

          .btn-more {
            background-color: #da4308;   
              text-decoration: none;
          }

          .btn-edits {
            background-color: #2196F3;
          }

          .btn-delete {
            background-color: #f44336;
          }
.action-buttons {
  display: flex; /* Align buttons horizontally */
  gap: 2px; /* Space between buttons */
  justify-content: center; /* Center the buttons */
}

.action-buttons .btn {
  padding: 6px 8px; /* Consistent padding */
  width: 60px; /* Fixed button width */
  text-align: center; /* Center text */
  display: inline-block; /* Ensure uniformity between <button> and <a> */
  line-height: normal; /* Reset line height for links */
  font-size: 14px; /* Ensure consistent font size */
}

          
    .pagination {
  margin: 20px 0;
  text-align: center;
}

.pagination .btn {
  margin: 0 5px;
  padding: 5px 10px;
  background-color: #2196F3;
  border: 1px solid #ccc;
  cursor: pointer;
  border-radius: 4px;
}

.pagination .btn:hover {
  background-color: #ddd;
}

.pagination .btn-active {
  background-color: #2196F3;
  color: white;
  border-color: #2196F3;
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
                  {paginatedCampaigns.map((campaign) => (
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
                      <div className="action-buttons">
    <Link
      to={`/CampaignsDetailsPage/${campaign.campaign_id}/${campaign.title}/${campaign.first_name}`}
      className="btn btn-more"
    >
      View
    </Link>
    <button
      className="btn btn-edits"
      onClick={() => handleToggleCampaignStatus(campaign.campaign_id, campaign.status)}
    >
      {campaign.status === 'hidden' ? 'Unhide' : 'Hide'}
    </button>
    <button
      className="btn btn-delete"
      onClick={() => handleDeleteCampaign(campaign.campaign_id)}
    >
      Delete
    </button>
  </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No campaigns found.</p>
            )}
          </div>
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
        </main>
      </div>
      <Footer />
    </>
  );
}

export default AllcampaignsAdmin;
