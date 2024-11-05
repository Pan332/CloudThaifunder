// CampaignContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const CampaignContext = createContext();

export const CampaignProvider = ({ children }) => {
  const port = import.meta.env.VITE_API_URL;
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${port}/view/Allcampaign`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch campaigns');
        }
        return response.json();
      })
      .then((data) => {
        if (data.success) {
          setCampaigns(data.data.campaigns);
        } else {
          setError(data.message || 'Failed to load campaigns');
        }
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, [port]);

  return (
    <CampaignContext.Provider value={{ campaigns, loading, error }}>
      {children}
    </CampaignContext.Provider>
  );
};

export const useCampaigns = () => useContext(CampaignContext);
