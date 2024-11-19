import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from "../components/Navbar.jsx";
import Footer from '../components/Footer.jsx';
import { Link } from 'react-router-dom';
import './ViewInfo.css';

function AlluserAdmin() {
  const port = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [editData, setEditData] = useState({
    email: '',
    role: '',
    phone: '',
    first_name: '',
    last_name: '',
  });

  // State for sorting
  const [sortConfig, setSortConfig] = useState({ key: 'email', direction: 'ascending' });
  const [currentPage, setCurrentPage] = useState(1); // Pagination state
  const rowsPerPage = 12; // Rows per page
  
  
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
      const fetchUsers = async () => {
        try {
          const response = await fetch(`${port}/admin/getAlluser`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
            },
          });

          if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
          }

          const data = await response.json();

          if (data.success) {
            setUsers(data.data.userResults);
          } else {
            setError('Failed to fetch users.');
          }
        } catch (err) {
          console.error('Error fetching users:', err.message);
          setError('An error occurred. Please try again.');
        }
      };

      fetchUsers();
    }
  }, [isAdmin]);

  const handleEditUser = (user) => {
    setEditingUser(user.user_id);
    setEditData({
      username: user.username || '',
      email: user.email,
      role: user.role,
      phone: user.phone,
      first_name: user.first_name,
      last_name: user.last_name,
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleEditSubmit = async () => {
    try {
      const response = await fetch(`${port}/admin/editInfo/${editingUser}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: JSON.stringify(editData),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      if (data.success) {
        setUsers((prevUsers) =>
          prevUsers.map((user) => (user.user_id === editingUser ? { ...user, ...editData } : user))
        );
        setEditingUser(null);
      } else {
        setError('Failed to edit user.');
      }
    } catch (err) {
      console.error('Error editing user:', err.message);
      setError('An error occurred. Please try again.');
    }
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const response = await fetch(`${port}/admin/deleteUser/${userId}`, {
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
          setUsers((prevUsers) => prevUsers.filter((user) => user.user_id !== userId));
        } else {
          setError('Failed to delete user.');
        }
      } catch (err) {
        console.error('Error deleting user:', err.message);
        setError('An error occurred. Please try again.');
      }
    }
  };

  const handleMoreClick = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  // Sorting function
  const sortedUsers = [...users].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };



  const paginatedUsers = sortedUsers.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const totalPages = Math.ceil(users.length / rowsPerPage);

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
          }

          .sidebar {
            width: 200px;
            padding: 20px;
          }

          .profile-content {
            flex: 1;
            padding: 20px;
          }

          .table-container {
            overflow-x: auto;
          }

          .user-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }

          .user-table th, .user-table td {
            padding: 8px 10px;
            border: 1px solid #ddd;
            text-align: center;
          }

          .user-table th {
            background-color: #f4f4f4;
          }

          .btn {
            padding: 6px 12px;
            margin: 0 2px;
            border: none;
            color: #fff;
            cursor: pointer;
            border-radius: 4px;
          }

          .btn-more {
            background-color: #da4308;   
          }

          .btn-edits {
            background-color: #2196F3;
          }

          .btn-delete {
            background-color: #f44336;
          }

          .error-message {
            color: red;
            font-weight: bold;
          }

          .edit-row {
            background-color: #e8f4fa;
          }

          .edit-row input, .edit-row select {
            width: 150px;
            padding: 5px;
            border: 1px solid #ccc;
            border-radius: 4px;
          }
          .h1{
            text-align:center;
          }
  .modal {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5); /* Dark overlay */
  animation: fadeIn 0.3s ease; /* Smooth fade-in animation */
  z-index: 1000; /* Ensure it overlays all other elements */
}

.modal-content {
  background: white;
  padding: 30px;
  border-radius: 8px;
  width: 800px;
  max-width: 90%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Subtle shadow */
  animation: slideIn 0.3s ease; /* Slide-in effect */
  position: relative;
  text-align: center;
}

.close {
  position: absolute;
  top: 10px;
  right: 15px;
  font-size: 24px;
  font-weight: bold;
  color: #333;
  cursor: pointer;
  transition: color 0.3s;
}

.close:hover {
  color: #da4308; /* Highlight on hover */
}

.modal-content h2 {
  margin-bottom: 20px;
  font-size: 24px;
  color: #333;
}

.modal-content p {
  margin: 10px 0;
  font-size: 16px;
  color: #666;
}

.modal-content p strong {
  color: #333;
}
  

/* Fade-in animation */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Slide-in animation */
@keyframes slideIn {
  from { transform: translateY(-20px); }
  to { transform: translateY(0); }
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
          <h1 className='h1'>User Management</h1>
          {error && <p className="error-message">{error}</p>}
          <div className="table-container">
            <table className="user-table">
              <thead>
                <tr>
                  <th onClick={() => requestSort('email')}>Email</th>
                  <th onClick={() => requestSort('role')}>Role</th>
                  <th onClick={() => requestSort('phone')}>Phone</th>
                  <th onClick={() => requestSort('first_name')}>First Name</th>
                  <th onClick={() => requestSort('last_name')}>Last Name</th>
                  <th onClick={() => requestSort('total_campaigns')}>All Campaigns</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.map((user) => (
                  <tr key={user.user_id} className={editingUser === user.user_id ? 'edit-row' : ''}>
                    {editingUser === user.user_id ? (
                      <>
                        <td><input name="email" value={editData.email} onChange={handleEditChange} /></td>
                        <td>
                          <select name="role" value={editData.role} onChange={handleEditChange}>
                            <option value="admin">Admin</option>
                            <option value="user">User</option>
                            <option value="validator">Validator</option>
                          </select>
                        </td>
                        <td><input name="phone" value={editData.phone} onChange={handleEditChange} /></td>
                        <td><input name="first_name" value={editData.first_name} onChange={handleEditChange} /></td>
                        <td><input name="last_name" value={editData.last_name} onChange={handleEditChange} /></td>
                        <td>{user.total_campaigns}</td>
                        <td>
                          <button onClick={handleEditSubmit} className="btn btn-edits">Save</button>
                          <button onClick={handleCancelEdit} className="btn btn-delete">Cancel</button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td>{user.email}</td>
                        <td>{user.role}</td>
                        <td>{user.phone}</td>
                        <td>{user.first_name}</td>
                        <td>{user.last_name}</td>
                        <td>{user.total_campaigns}</td>
                        <td>
                          <button onClick={() => handleMoreClick(user)} className="btn btn-more">More</button>
                          <button onClick={() => handleEditUser(user)} className="btn btn-edits">Edit</button>
                          <button onClick={() => handleDeleteUser(user.user_id)} className="btn btn-delete">Delete</button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Modal for additional user info */}
          {isModalOpen && (
  <div className="modal">
    <div className="modal-content">
      <span className="close" onClick={() => setIsModalOpen(false)}>&times;</span>
      <h2>User Details</h2>
      <p><strong>Email:</strong> {selectedUser.email}</p>
      <p><strong>Role:</strong> {selectedUser.role}</p>
      <p><strong>Phone:</strong> {selectedUser.phone || 'N/A'}</p>
      <p><strong>First Name:</strong> {selectedUser.first_name || 'N/A'}</p>
      <p><strong>Last Name:</strong> {selectedUser.last_name || 'N/A'}</p>
      <p><strong>Age</strong> {selectedUser.age || 'N/A'}</p>
      <p><strong>Gender:</strong> {selectedUser.gender || 'N/A'}</p>

      <p><strong>Address:</strong> {selectedUser.address|| 'N/A'}</p>
      <p><strong>City/State:</strong> {selectedUser.city|| 'N/A'}</p>
      <p><strong>Postcode:</strong> {selectedUser.postcode|| 'N/A'}</p>

      <p><strong>Total Campaigns:</strong> {selectedUser.total_campaigns || '0'}</p>
      <p><strong>Pendings Campaigns:</strong> {selectedUser.pending_campaigns || '0'}</p>
      <p><strong>verified Campaigns:</strong> {selectedUser.verified_campaigns || '0'}</p>
      <p><strong>Completed Campaigns:</strong> {selectedUser.completed_campaigns || '0'}</p>

      <p><strong>Total Earned:</strong> {selectedUser.total_earnings || '0'}</p>
    </div>
  </div>
)}
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

export default AlluserAdmin;
