import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from "../components/Navbar.jsx";
import Footer from '../components/Footer.jsx';
import { Link } from 'react-router-dom';
import './ViewInfo.css';

function AdminDashboard() {
  const port = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const [error, setError] = useState('');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false); // New state for success popup

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
  }, [isAdmin]);



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
            <h1 className='h1'>Dashboard</h1>
     
      </div>

 

      <Footer />
    </>
  );
}

export default AdminDashboard;
