const API_URL = `${import.meta.env.VITE_API_URL}/getenv`;

/**
 * Fetch environment token from backend
 * @returns {Promise<Object>} The token configuration
 */
export const fetchToken = async () => {
  try {
    const response = await fetch(`${API_URL}/Token`);
    if (!response.ok) {
      throw new Error('Failed to fetch Token');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching Token:', error);
    throw error;
  }
};

/**
 * Fetch environment cookie from backend
 * @returns {Promise<Object>} The cookie configuration
 */
export const fetchCookie = async () => {
  try {
    const response = await fetch(`${API_URL}/Cookie`);
    if (!response.ok) {
      throw new Error('Failed to fetch Cookie');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching Cookie:', error);
    throw error;
  }
};

/**
 * Fetch environment link from backend
 * @returns {Promise<Object>} The link configuration
 */
export const fetchLink = async () => {
  try {
    const response = await fetch(`${API_URL}/Link`);
    if (!response.ok) {
      throw new Error('Failed to fetch Link');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching Link:', error);
    throw error;
  }
};

/**
 * Fetch all environment configurations from backend
 * @returns {Promise<Object>} All configurations
 */
export const fetchAllConfig = async () => {
  try {
    const response = await fetch(`${API_URL}/All`);
    if (!response.ok) {
      throw new Error('Failed to fetch all configurations');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching all configurations:', error);
    throw error;
  }
};