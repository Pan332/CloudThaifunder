import { isTokenExpired } from "./auth";
const BACKEND_API_LINK = import.meta.env.VITE_API_URL;

export const refreshAccessToken = async (refreshToken) => {
    try {
      const response = await fetch(`${BACKEND_API_LINK}/refresh-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: JSON.stringify({ refreshToken }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to refresh token');
      }
  
      const data = await response.json();
      const { accessToken } = data;
  
      // Save the new access token to localStorage
      localStorage.setItem('accessToken', accessToken);
      return accessToken;
    } catch (error) {
      console.error('Error refreshing token', error);
      throw new Error('Failed to refresh token');
    }
  };
  
  export const getAccessToken = () => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    
    // If the access token is expired, refresh it
    if (isTokenExpired(accessToken) && refreshToken) {
      return refreshAccessToken(refreshToken);
    }
  
    return Promise.resolve(accessToken);
  };