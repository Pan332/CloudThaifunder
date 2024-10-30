import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from "../components/Navbar.jsx";
import Footer from '../components/Footer.jsx';
import './ViewInfo.css'; // Import custom CSS for styling

function ViewInfo() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('access_token');

  useEffect(() => {
    if (!isLoggedIn) {
      setIsModalVisible(true);
    } else {
      fetch('/api/user-info', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      })
      .then(response => response.json())
      .then(data => setUserInfo(data))
      .catch(error => console.error('Error fetching user info:', error));
    }
  }, [isLoggedIn]);

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
    fetch('/api/update-user-info', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      },
      body: JSON.stringify(userInfo)
    })
    .then(response => response.json())
    .then(data => {
      console.log('User info updated:', data);
      setIsEditing(false);
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
          <ul>
            <li>Profile</li>
            <li>My Campaign</li>
            <li>Transaction</li>
            <li>Notification</li>
            <li>Billing</li>
            <li>Dashboard</li>
            <li>Delete Account</li>
          </ul>
        </aside>
        
        <main className="profile-content">
          <div className="profile-card">
            <div className="profile-header">
              <img src="" alt="" />
              <h1>{userInfo.name || "User Name"}</h1>
              <button className="btn-edit" onClick={handleEditToggle}>Edit</button>
            </div>

            <div className="profile-section">
              <h3>Personal Information</h3>
              <div className="info-group">
                <label>First Name</label>
                <input className='inp'
                  type="text"
                  name="fname"
                  value={userInfo.fname}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
                  <label>Last Name</label>
                <input className='inp'
                  type="text"
                  name="lname"
                  value={userInfo.lname}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
                <label>Email </label>
                <input className='inp'
                  type="email"
                  name="email"
                  value={userInfo.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
                  <label>Phone</label>
                <input className='inp'
                  type="text"
                  name="phone"
                  value={userInfo.phone}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
            </div>

         

          </div>
       
          <div className="profile-card">
          <h1>Address</h1>

          <div className="profile-section">
            
              <div className="info-group">
                <label>Country</label>
                <input className='inp'
                  type="text"
                  name="address"
                  value={userInfo.address}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
                <label>City/State</label>
                <input className='inp'
                  type="text"
                  name="city"
                  value={userInfo.city}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
                  <label>Postcode</label>
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
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}

export default ViewInfo;
