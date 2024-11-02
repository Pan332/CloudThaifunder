import React from 'react';
import { Navigate } from 'react-router-dom';

// Function to check if the user is an admin
function isAdmin() {
  const token = localStorage.getItem('access_token');
  
  if (token) {
    // Decode token (assuming JWT) to extract role
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.role === 'admin';
  }
  
  return false;
}

function ProtectedAdmin(props) {
  return isAdmin() ? props.element : React.createElement(Navigate, { to: '/unauthorized', replace: true });
}

export default ProtectedAdmin;