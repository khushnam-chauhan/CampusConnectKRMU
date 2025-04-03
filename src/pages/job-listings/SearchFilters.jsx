import React, { useState, useEffect, useCallback } from 'react';

const SearchFilters = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    searchTerm: '',
    location: '',
    offerType: '',
    skills: ''
  });

  const [isFilterVisible, setIsFilterVisible] = useState(true);
  const [typingTimeout, setTypingTimeout] = useState(null);

  const offerTypes = [
    "All Types",
    "Full time Employment",
    "Internship + PPO",
    "Apprenticeship",
    "Summer Internship"
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });

    if (typingTimeout) clearTimeout(typingTimeout);

    const timeout = setTimeout(() => {
      onFilterChange({
        ...filters,
        [name]: value,
        skills: filters.skills.split(',').map(skill => skill.trim()).filter(Boolean)
      });
    }, 400);

    setTypingTimeout(timeout);
  };

  const clearFilters = () => {
    const resetFilters = {
      searchTerm: '',
      location: '',
      offerType: '',
      skills: ''
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  return (
    <div className="search-filters">
      <div className="filters-header">
        <h3>Search Jobs</h3>
        <div className='filters-btns'>
          <button
            className="toggle-filters-btn"
            onClick={() => setIsFilterVisible(!isFilterVisible)}
          >
            {isFilterVisible ? 'Hide Filters ▲' : 'Show Filters ▼'}
          </button>
          <button className="clear-filters" onClick={clearFilters}>
            Clear all filters
          </button>
        </div>
      </div>

      {isFilterVisible && (
        <div className="filter-form">
          <div className="filters-container">
            <div className="filter-group">
              <label htmlFor="searchTerm">Search by keyword</label>
              <input
                type="text"
                id="searchTerm"
                name="searchTerm"
                value={filters.searchTerm}
                onChange={handleInputChange}
                placeholder="Job profile or company"
              />
            </div>

            <div className="filter-group">
              <label htmlFor="location">Location</label>
              <input
                type="text"
                id="location"
                name="location"
                value={filters.location}
                onChange={handleInputChange}
                placeholder="City, state, or remote"
              />
            </div>

            <div className="filter-group">
              <label htmlFor="offerType">Offer Type</label>
              <select
                id="offerType"
                name="offerType"
                value={filters.offerType}
                onChange={handleInputChange}
              >
                {offerTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="skills">Skills (comma-separated)</label>
              <input
                type="text"
                id="skills"
                name="skills"
                value={filters.skills}
                onChange={handleInputChange}
                placeholder="e.g. ReactJS, NodeJS, MongoDB"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchFilters;
