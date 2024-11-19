import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { isTokenExpired } from '../../../aUtils/auth';
import { refreshAccessToken } from '../../../aUtils/api';

// Function to check if the user is an admin
function isAdmin(token) {
  if (token) {
    // Decode token (assuming JWT) to extract role
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.role === 'admin';
  }
  
  return false;
}

function ProtectedAdmin(props) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem('refresh_token');

    if (!token) {
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }

    // Check if the token is expired
    if (isTokenExpired(token) && refreshToken) {
      // If the access token is expired, try refreshing it
      refreshAccessToken(refreshToken)
        .then((newAccessToken) => {
          if (newAccessToken && isAdmin(newAccessToken)) {
            setIsAuthenticated(true);
          } else {
            setIsAuthenticated(false);
          }
        })
        .catch(() => setIsAuthenticated(false))
        .finally(() => setLoading(false));
    } else {
      if (isAdmin(token)) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
      setLoading(false);
    }
  }, []);

  if (loading) {
    return React.createElement('div', null, 'Loading...');
  }

  return isAuthenticated ? props.element : React.createElement(Navigate, { to: '/unauthorized', replace: true });
}

export default ProtectedAdmin;