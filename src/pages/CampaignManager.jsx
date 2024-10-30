import React, { useState, useEffect } from 'react'; 
import './CampaignManager.css';
import { useNavigate } from 'react-router-dom';

const CampaignManager = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [goalAmount, setGoalAmount] = useState('');
  const [editingCampaignId, setEditingCampaignId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const port = import.meta.env.VITE_API_URL;

  useEffect(() => {
    checkAuthAndFetchCampaigns();
  }, []);

  const checkAuthAndFetchCampaigns = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      setError('You are not authenticated. Please log in.');
      setLoading(false);
      navigate('/');
      return;
    }
  
    try {
      const response = await fetch(`${port}/auth/validate-token`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
      });
  
      if (response.status !== 200) {
        throw new Error('Failed to validate token');
      }
  
      const contentType = response.headers.get("content-type");
      let data;
      
      // Check if response has JSON content
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
        setCampaigns(data.campaigns);
      } else {
        // Handle non-JSON responses (e.g., plain text)
        const text = await response.text();
        console.warn("Received non-JSON response:", text);
      }
  
    } catch (error) {
      console.error('Error validating token:', error);
      setError('An error occurred while fetching campaigns.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('access_token');

    if (!token) {
      setError('You are not authenticated. Please log in.');
      return;
    }

    try {
      const method = editingCampaignId ? 'PUT' : 'POST';
      const url = editingCampaignId ? `${port}/campaign/updatecampaign` : `${port}/campaign/createcampaign`;

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          goal_amount: goalAmount,
          campaign_id: editingCampaignId
        }),
      });

      if (!response.ok) throw new Error('Failed to submit campaign');

      resetForm();
      setSuccess(editingCampaignId ? 'Campaign updated successfully!' : 'Campaign created successfully!');
      checkAuthAndFetchCampaigns();
    } catch (error) {
      console.error('Error submitting campaign:', error);
      setError('An error occurred while submitting the campaign.');
    }
  };

  const handleDelete = async (campaign_id) => {
    const token = localStorage.getItem('access_token');

    if (!token) {
      setError('You are not authenticated. Please log in.');
      return;
    }

    try {
      const response = await fetch(`${port}/campaign/deletecampaign`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ campaign_id })
      });

      if (!response.ok) throw new Error('Failed to delete campaign');

      setSuccess('Campaign deleted successfully!');
      checkAuthAndFetchCampaigns();
    } catch (error) {
      console.error('Error deleting campaign:', error);
      setError('An error occurred while deleting the campaign.');
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setGoalAmount('');
    setEditingCampaignId(null);
    setError('');
    setSuccess('');
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="campaign-manager">
      <h2>Manage Campaigns</h2>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
      <form onSubmit={handleSubmit} className="campaign-form">
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" required />
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" required />
        <input type="number" value={goalAmount} onChange={(e) => setGoalAmount(e.target.value)} placeholder="Goal Amount" required />
        <button type="submit">{editingCampaignId ? 'Update' : 'Create'} Campaign</button>
      </form>

      <ul className="campaign-list">
        {campaigns.map((campaign) => (
          <li key={campaign.campaign_id} className="campaign-item">
            <h3>{campaign.title}</h3>
            <p>{campaign.description}</p>
            <p>Goal: {campaign.goal_amount}</p>
            <button onClick={() => handleEdit(campaign)}>Edit</button>
            <button onClick={() => handleDelete(campaign.campaign_id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CampaignManager;