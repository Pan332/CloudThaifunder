import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from "./Navbar.jsx";
import Footer from './Footer.jsx';
import './ViewCampaigns.css'; // Import custom CSS for styling

function DeleteAccount() {
  const port = import.meta.env.VITE_API_URL;
  const [isModalVisible, setIsModalVisible] = useState(true); // Modal is visible by default
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false); // Success modal

  const [user, setuser] = useState([]);
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
            throw new Error('Failed to fetch campaign info');
          }
          return response.json();
        })
        .then(data => {
          if (data.success) {
            setuser(data.data);
            console.log(user);
          } else {
            console.error(data.message);
          }
        })
        .catch(error => console.error('Error fetching campaign info:', error));
    }
  }, [isLoggedIn, port]);

  const handleDeleteUser = async (userId) => {
    fetch(`${port}/view/deleteUser/${userId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        if (response.ok) {
          setIsModalVisible(false);
          setIsSuccessModalVisible(true); // Show success modal
          setTimeout(() => {
            navigate('/'); // Redirect after 3 seconds
          }, 3000);
        localStorage.removeItem('access_token'); // Clear the token

        } else {
          console.error('Failed to delete account');
        }
      })
      .catch(error => console.error('Error deleting account:', error));
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    navigate('/'); // Redirect to home or another page if the user cancels
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
            <li><Link to='/ViewInfo'>Info</Link></li>
            <li><Link to='/ViewCampaign'>My Campaign</Link></li>
            <li><Link to='/Transaction'>Transaction</Link></li>
            <li><Link to='/DeleteAccount'>Delete Account</Link></li>
          </ul>
        </aside>
        
        <div className="modal">
  <div className="modal-content">
    <h2>Are you sure you want to delete this account?</h2>
    <p>This action is irreversible, and all your data will be lost.</p>
    <div className="modal-actions">
      <button 
        className="btn-danger" 
        onClick={() => handleDeleteUser(user.user_id)}
      >
        Yes, Delete
      </button>
      <button 
        className="btn-secondary" 
        onClick={handleCloseModal}
      >
        Cancel
      </button>
    </div>
  </div>
</div>
{isSuccessModalVisible && (
          <div className="modal">
            <div className="modal-content">
              <h2>Account Deleted</h2>
              <p>Your account has been successfully deleted.</p>
              <p>You will be redirected to the home page shortly.</p>
            </div>
          </div>
        )}


      </div>
      <Footer />
    </>
  );
}

export default DeleteAccount;
