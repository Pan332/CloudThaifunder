import React, { useState, useEffect } from 'react'; 
import './CampaignManager.css';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const CampaignManager = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [title, setTitle] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');  // New state for category

  const [goalAmount, setGoalAmount] = useState('');
  const [endDate, setEndDate] = useState('');      // New state for end date
  const [editingCampaignId, setEditingCampaignId] = useState(null);
  const [imageFile, setImageFile] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const port = import.meta.env.VITE_API_URL;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result.split(",")[1]; // Get only the Base64 part after the comma
        setImageFile(base64String); // Assign the Base64 string to imageFile for DB storage
        setImagePreview(reader.result); // Full Base64 string for preview with MIME type
      };
      reader.readAsDataURL(file); // Trigger Base64 conversion

    }
  };

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

      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
        setCampaigns(data.campaigns);
      } else {
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

  const handleCreateCampaign = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('access_token');

    if (!token) {
      setError('You are not authenticated. Please log in.');
      return;
    }

    try {
      const response = await fetch(`${port}/campaign/createcampaign`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          goal_amount: goalAmount,
          shortDescription,
          endDate,
          imageFile
        }),
      });

      if (!response.ok) throw new Error('Failed to create campaign');

      resetForm();
      setSuccess('Campaign created successfully!');
      checkAuthAndFetchCampaigns();
    } catch (error) {
      console.error('Error creating campaign:', error);
      setError('An error occurred while creating the campaign.');
    }
  };

  const resetForm = () => {
    setTitle('');
    setShortDescription('');
    setDescription('');
    setGoalAmount('');
    setEndDate('');
    setImageFile(null);
    setImagePreview(null);
    setEditingCampaignId(null);
    setError('');
    setSuccess('');
  };

  const handleClose = () => {
    navigate('/');
  };



  return (
    <div className="campaign-manager">
      <button className="close-button" onClick={handleClose}>&times;</button>
      <h2>Create Campaigns</h2>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}

      <form onSubmit={handleCreateCampaign} className="campaign-form">
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" required />
        <input type="file" onChange={handleFileChange} accept="image/*" />
        {imagePreview && <img src={imagePreview} alt="Selected campaign preview" className="image-preview" />}

        <input 
          type="text" 
          value={shortDescription} 
          onChange={(e) => setShortDescription(e.target.value)} 
          placeholder="Short Description" 
          maxLength="150"
          required 
        />
        
        {/* Replace Textarea with ReactQuill */}
        <ReactQuill value={description} onChange={setDescription} placeholder="Description" />

        <select value={category} onChange={(e) => setCategory(e.target.value)} required>
          <option value="">Select Category</option>
          <option value="charities">Charity</option>
          <option value="medical & healing">Medical & Healing</option>
          <option value="education">Education</option>
          <option value="business & startup">Business & Startup</option>
          <option value="game">Game</option>
          <option value="fashion">Fashion</option>
          <option value="design">Design</option>
          <option value="film">Film</option>
          <option value="music">Music</option>
          <option value="art">Art</option>
          <option value="technology">Technology</option>
          <option value="book">Book</option>
        </select>

        <input type="number" value={goalAmount} onChange={(e) => setGoalAmount(e.target.value)} placeholder="Goal Amount" required />
        <label htmlFor="">End Date</label>
        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />

        <button type="submit">{editingCampaignId ? 'Update' : 'Create'} Campaign</button>
      </form>
    </div>
  );
};

export default CampaignManager;
