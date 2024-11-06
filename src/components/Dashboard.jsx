import './Dashboard.css'; // Optional: for custom styling
import Search from "../components/Search.jsx";
import React, { useEffect, useState } from 'react';
import { CampaignProvider } from '../components/CampaignContext';

function Dashboard() {
    const port = import.meta.env.VITE_API_URL;
    const [campaignCount, setCampaignCount] = useState(0);
    const [userCount, setUserCount] = useState(0); // State for user count
    const [amount, setAmount] = useState(0); // State for user count

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
        // Fetch campaign count
        fetch(`${port}/view/CountCampaigns`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch campaign count');
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    setCampaignCount(data.data.totalCampaigns); // Assuming the API returns 'totalCampaigns'
                } else {
                    setError(data.message || 'Failed to load campaign count');
                }
                setLoading(false);
            })
            .catch(error => {
                setError(error.message);
                setLoading(false);
            });

        // Fetch user count
        fetch(`${port}/view/CountUser`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch user count');
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    setUserCount(data.data.totalUsers); // Assuming the API returns 'totalUsers'
                } else {
                    setError(data.message || 'Failed to load user count');
                }
                setLoading(false);
            })
            .catch(error => {
                setError(error.message);
                setLoading(false);
            });
                    // Fetch sum donations

            fetch(`${port}/view/CountAmount`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch user count');
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    setAmount(data.data.totalAmount); // Assuming the API returns 'totalUsers'
                } else {
                    setError(data.message || 'Failed to load user count');
                }
                setLoading(false);
            })
            .catch(error => {
                setError(error.message);
                setLoading(false);
            });
    }, [port]);

    return (
        <div className="dashboard">
            <div className='headers'>
                <div className='pic'>
                    <h1 className='overlay-text'>Fundraiser</h1>
                    <p className='overlay-text2'>For charities No fee.</p>
                    <div className='pic'>
                        <h1 className='overlay-text'>Fundraiser</h1>
                        <p className='overlay-text2'>For charities No fee.</p>
                        <div className='custom-search-container'>
                            <CampaignProvider>
                                <Search />
                            </CampaignProvider>
                        </div>
                    </div>
                </div>
            </div>
            <div className='visualization'>
                <div className='totalcampaign'>
                    <h2>Total Campaigns</h2>
                    <h2>{loading ? 'Loading...' : campaignCount}</h2>
                </div>
                <div className='totalfund'>
                    <h2>Total Funds</h2>
                    <h2>{loading ? 'Loading...' : amount}฿</h2>
                </div>
                <div className='paticipant'>
                    <h2>Participants</h2>
                    <h2>{loading ? 'Loading...' : userCount}</h2>
                </div>
            </div>
            {error && <p className="error">{error}</p>}
        </div>
    );
}

export default Dashboard;
