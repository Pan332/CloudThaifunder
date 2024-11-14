// SearchCampaigns.jsx
import React, { useState } from 'react';
import Fuse from 'fuse.js';
import { useCampaigns } from './CampaignContext';
import { Link } from 'react-router-dom';

import './Search.css'; // Assuming you have a CSS file for styling

const Search = () => {
  const { campaigns } = useCampaigns(); // Use the campaigns from the CampaignContext
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  // Configure Fuse.js options
  const options = {
    keys: ['title', 'short_description', 'first_name'], // Customize based on your campaign data fields
    threshold: 0.4, // Adjust sensitivity of search
    minMatchCharLength: 2,
  };

  const fuse = new Fuse(campaigns, options); // Use campaigns from the context in Fuse

  const handleSearch = (event) => {
    const searchQuery = event.target.value;
    setQuery(searchQuery);

    // Perform the search and set results
    if (searchQuery.trim()) {
      const results = fuse.search(searchQuery).map(result => result.item);
      setSearchResults(results);
    } else {
      setSearchResults([]); // Clear results when search is empty
    }
  };

  return (
    <div className="search-campaigns">
      <div className="search-bar">
        <input
          type="text"
          value={query}
          onChange={handleSearch}
          placeholder="Search campaigns"
          className="search-input"
        />
        <span className="search-icon">&#x1F50D;</span>
      </div>

      <ul className="search-results">
        {searchResults.map((campaign, index) => (
      <li key={index} className="search-result-item">
      <Link to={`/CampaignsDetailsPage/${campaign.campaign_id}/${campaign.title}/${campaign.first_name}`} className="search-result-link">
        <p className="result-title">
          {campaign.title}
        </p>
        <p className="result-fname">By {campaign.first_name}</p>
        <p className="result-description">{campaign.short_description}</p>
      </Link>
    </li>
        ))}
      </ul>
    </div>
  );
};

export default Search;
