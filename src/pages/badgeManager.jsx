import React, { useState, useEffect } from 'react';

const BadgeManager = () => {
  const [badges, setBadges] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    requirements: ''
  });
  const [editBadgeId, setEditBadgeId] = useState(null);
  const port = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchBadges();
  }, []);

  const fetchBadges = async () => {
    const token = localStorage.getItem('access_token');
    try {
      const response = await fetch(`${port}/badge`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setBadges(data);
    } catch (error) {
      console.error('Error fetching badges:', error);
    }
  };

  const addBadge = async () => {
    const token = localStorage.getItem('access_token');
    try {
      const response = await fetch(`${port}/badge/addbadge`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert('Badge added successfully');
        fetchBadges();
        setFormData({ name: '', description: '', requirements: '' });
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error adding badge:', error);
    }
  };

  const updateBadge = async (badgeId) => {
    const token = localStorage.getItem('access_token');
    try {
      const response = await fetch(`${port}/badge/${badgeId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert('Badge updated successfully');
        fetchBadges();
        setFormData({ name: '', description: '', requirements: '' });
        setEditBadgeId(null);
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error updating badge:', error);
    }
  };

  const deleteBadge = async (badgeId) => {
    const token = localStorage.getItem('access_token');
    try {
      const response = await fetch(`${port}/badge/${badgeId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        alert('Badge deleted successfully');
        fetchBadges();
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error deleting badge:', error);
    }
  };

  return (
    <div>
      <h1>Badge Manager</h1>

      <div>
        <h2>{editBadgeId ? 'Edit Badge' : 'Add Badge'}</h2>
        <input
          type="text"
          placeholder="Badge Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
        <input
          type="text"
          placeholder="Requirements"
          value={formData.requirements}
          onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
        />
        <button onClick={() => (editBadgeId ? updateBadge(editBadgeId) : addBadge())}>
          {editBadgeId ? 'Update Badge' : 'Add Badge'}
        </button>
        {editBadgeId && <button onClick={() => setEditBadgeId(null)}>Cancel Edit</button>}
      </div>

      <h2>Existing Badges</h2>
      <ul>
        {badges.map((badge) => (
          <li key={badge.badge_id}>
            <strong>{badge.name}</strong>: {badge.description} (Requirements: {badge.requirements})
            <button onClick={() => {
              setFormData({
                name: badge.name,
                description: badge.description,
                requirements: badge.requirements
              });
              setEditBadgeId(badge.badge_id);
            }}>
              Edit
            </button>
            <button onClick={() => deleteBadge(badge.badge_id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BadgeManager;
