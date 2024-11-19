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
  const [phone_number, setphone_number] = useState('');
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
    if (file && file.type.startsWith('image/')) {
      setImagePreview(URL.createObjectURL(file)); 
      setImageFile(file); 
    } else {
      setError('Please select a valid image file.');
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
    if (!title || !shortDescription || !description || !goalAmount || !endDate || !imageFile) {
      setError('All fields are required');
      return;
    }
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone_number)) {
      setError('Please enter a valid 10-digit phone number.');
      return;
    }
    const formData = new FormData();
    formData.append('title', title);
    formData.append('shortDescription', shortDescription);
    formData.append('description', description);
    formData.append('goal_amount', goalAmount);
    formData.append('endDate', endDate);
    formData.append('category', category);
    formData.append('phone_number', phone_number);

    formData.append('imageFile', imageFile);

    setLoading(true);
    try {
      const response = await fetch(`${port}/campaign/createcampaign`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (response.status === 200) {
        setSuccess(result.message);
        setTitle('');
        setShortDescription('');
        setDescription('');
        setGoalAmount('');
        setEndDate('');
        setImageFile(null);
        setImagePreview('');
        setphone_number(''); // Clear phone number input after success

        setError('');
      } else {
        setError(result.message || 'Something went wrong');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
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
        <input
      type="text"
      value={phone_number}
      onChange={(e) => setphone_number(e.target.value)}
      placeholder="Phone Number (10 digits)"
      required
    />
    
    {/* Prompt to double-check phone number */}
    <div className="phone-number-warning">
      Please check the phone number carefully. It is for your PromptPay ID.
    </div>
        <input type="number" value={goalAmount} onChange={(e) => setGoalAmount(e.target.value)} placeholder="Goal Amount" required />
        <label htmlFor="">End Date</label>
        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />

        <button type="submit">{editingCampaignId ? 'Update' : 'Create'} Campaign</button>
      </form>
    </div>
  );
};

export default CampaignManager;