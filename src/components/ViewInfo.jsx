import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from "../components/Navbar.jsx";
import Footer from '../components/Footer.jsx';
import './ViewInfo.css'; // Import custom CSS for styling
import { Link } from 'react-router-dom';

function ViewInfo() {
  const port = import.meta.env.VITE_API_URL;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [userInfo, setUserInfo] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    age:'',
    gender:'',
    address: '',
    city: '',
    postcode: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [updateMessage, setUpdateMessage] = useState('');
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('access_token');

  useEffect(() => {
    if (!isLoggedIn) {
      setIsModalVisible(true);
    } else {
      fetch(`${port}/view/user-info`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch user info');
        }
        return response.json();
      })
      .then(data => {
        if (data.success) {
          setUserInfo(data.data);
        } else {
          console.error(data.message);
        }
      })
      .catch(error => console.error('Error fetching user info:', error));
    }
  }, [isLoggedIn, port]);

  const handleCloseModal = () => {
    setIsModalVisible(false);
    navigate('/');
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  const handleUpdate = () => {
    console.log('Updating user info with:', userInfo); // Ensure userInfo is correctly populated
    fetch(`${port}/view/update-user-info`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      },
      body: JSON.stringify(userInfo)
    })
    .then(response => {
      console.log('Response Status:', response.status); // Log response status
      if (!response.ok) {
        throw new Error('Failed to update user info');
      }
      return response.json();
    })
    .then(data => {
      console.log('Server Response:', data); // Log the response data
      if (data.success) {
        setIsEditing(false);
        setUpdateMessage('User information updated successfully!');
      } else {
        console.error(data.message);
      }
    })
    .catch(error => console.error('Error updating user info:', error));
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
        {userInfo.role === 'admin' ? (
    // Admin sidebar
    <ul>
      <li><Link to='/ViewInfo'>Info</Link></li>
      <li><Link to='/AlluserAdmin'>View all Account</Link></li>
      <li><Link to='/AllcampaignsAdmin'>View all Campaigns</Link></li>
      <li><Link to='/CampaignsValidate'>Pending Campaigns</Link></li>
      <li><Link to='/ViewCampaign'>My Campaign</Link></li>
      <li><Link to='/Transaction'>Transaction</Link></li>
      <li><Link to='/AdminDashboard'>Dashboard</Link></li>
    </ul>
  ) : (
    // Normal user sidebar
    <ul>
      <li><Link to='/ViewInfo'>Info</Link></li>
      <li><Link to='/ViewCampaign'>My Campaign</Link></li>
      <li><Link to='/Transaction'>Transaction</Link></li>
      <li><Link to='/Dashboard'>Dashboard</Link></li>
      <li><Link to='/DeleteAccount'>Delete Account</Link></li>
    </ul>
  )}
        </aside>
        
        <main className="profile-content">
          <div className="profile-card">

            <div className="profile-header">
              <img src="" alt="" />
         
            </div>

            <div className="profile-section">
              <h1>Personal Information</h1>
              <button className="btn-edit" onClick={handleEditToggle}>Edit</button>

              <div className="info-group">
                <label className='lb'>First Name</label>
                <input className='inp'
                  type="text"
                  name="first_name"
                  value={userInfo.first_name}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
                <label className='lb'>Last Name</label>
                <input className='inp'
                  type="text"
                  name="last_name"
                  value={userInfo.last_name}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
                <label className='lb'>Email</label>
                <input className='inp'
                  type="email"
                  name="email"
                  value={userInfo.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
                <label className='lb'>Phone</label>
                <input className='inp'
                  type="text"
                  name="phone"
                  value={userInfo.phone}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
                   <label className='lb'>Age</label>
                <input className='inp'
                  type="text"
                  name="age"
                  value={userInfo.age}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
                   <label className='lb'>Gender</label>
                <input className='inp'
                  type="text"
                  name="gender"
                  value={userInfo.gender}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
             
              </div>
            
            </div>
          </div>

          <div className="profile-card">
            <div className="profile-section">
            <h1>Address</h1>

              <div className="info-group">
                <label className='lb'>Address</label>
                <input className='inp'
                  type="text"
                  name="address"
                  value={userInfo.address}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
                <label className='lb'>City/State</label>
                <input className='inp'
                  type="text"
                  name="city"
                  value={userInfo.city}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
                <label className='lb'>Postcode</label>
                <input className='inp'
                  type="text"
                  name="postcode"
                  value={userInfo.postcode}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
            </div>
            {isEditing && (
              <div className="button-group">
                <button className="btn-primary" onClick={handleUpdate}>Save</button>
                <button className="btn-secondary" onClick={handleEditToggle}>Cancel</button>
              </div>
            )}
            {/* Display the user info to be sent */}
            {updateMessage && (
              <div className="update-message">
                <h4>Data to be sent:</h4>
                <pre>{updateMessage}</pre> {/* Display the formatted JSON */}
              </div>
            )}
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}

export default ViewInfo;
