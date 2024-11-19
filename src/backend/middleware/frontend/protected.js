import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const port = import.meta.env.VITE_API_URL;

const isTokenExpired = (token) => {
  const decoded = JSON.parse(atob(token.split('.')[1]));
  return decoded.exp < Date.now() / 1000;
};

// Function to refresh the token
const refreshAccessToken = async (refreshToken) => {
  try {
    const response = await fetch(`${port}/auth/refresh-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      throw new Error('Failed to refresh token');
    }

    const data = await response.json();
    const { accessToken } = data;

    // Save the new access token and refresh token to localStorage
    localStorage.setItem('access_token', accessToken);
    return accessToken;
  } catch (error) {
    console.error('Error refreshing token', error);
    throw new Error('Failed to refresh token');
  }
};

// Function to validate the token
const validateToken = async (token) => {
  try {
    const response = await fetch(`${port}/auth/validate-token`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.ok;
  } catch (error) {
    console.error('Error validating token', error);
    return false;
  }
};

export const ProtectedRoute = (props) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem('refresh_token'); // assuming the refresh token is stored in localStorage as well

    const handleAuthentication = async () => {
      if (!token) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      if (isTokenExpired(token)) {
        // If the access token is expired, try refreshing it
        if (refreshToken) {
          try {
            const newAccessToken = await refreshAccessToken(refreshToken);
            setIsAuthenticated(!!newAccessToken);
          } catch {
            setIsAuthenticated(false);
          }
        } else {
          setIsAuthenticated(false);
        }
      } else {
        // If the token is not expired, validate it
        const isValid = await validateToken(token);
        setIsAuthenticated(isValid);
      }

      setLoading(false);
    };

    handleAuthentication();
  }, []);

  if (loading) {
    return React.createElement('div', null, 'Loading...');
  }

  return isAuthenticated ? props.element : React.createElement(Navigate, { to: '/' });
};

export default ProtectedRoute;