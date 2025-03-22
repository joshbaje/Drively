import React, { useState } from 'react';
import PropTypes from 'prop-types';

const AgentSearchBar = ({ 
  onSearch, 
  placeholder = 'Search...', 
  filters = [],
  advancedSearch = false
}) => {
  const [searchText, setSearchText] = useState('');
  const [activeFilters, setActiveFilters] = useState({});
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  // Handle text search
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchText(value);
    
    // If not using advanced search, trigger search immediately
    if (!advancedSearch) {
      onSearch({ searchText: value, filters: activeFilters });
    }
  };
  
  // Handle filter change
  const handleFilterChange = (filter, value) => {
    const updatedFilters = {
      ...activeFilters,
      [filter.key]: value
    };
    
    // Remove filter if value is empty or 'all'
    if (value === '' || value === 'all') {
      delete updatedFilters[filter.key];
    }
    
    setActiveFilters(updatedFilters);
    
    // If not using advanced search, trigger search immediately
    if (!advancedSearch) {
      onSearch({ searchText, filters: updatedFilters });
    }
  };
  
  // Handle search submission
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({ searchText, filters: activeFilters });
  };
  
  // Toggle advanced search
  const toggleAdvancedSearch = () => {
    setShowAdvanced(!showAdvanced);
  };
  
  // Clear all filters
  const clearFilters = () => {
    setSearchText('');
    setActiveFilters({});
    onSearch({ searchText: '', filters: {} });
  };
  
  return (
    <div className="agent-search-bar">
      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-input-wrapper">
          <i className="fas fa-search search-icon"></i>
          <input
            type="text"
            className="search-input"
            placeholder={placeholder}
            value={searchText}
            onChange={handleSearchChange}
          />
          {searchText && (
            <button 
              type="button" 
              className="clear-search" 
              onClick={() => {
                setSearchText('');
                onSearch({ searchText: '', filters: activeFilters });
              }}
            >
              <i className="fas fa-times"></i>
            </button>
          )}
        </div>
        
        {advancedSearch && (
          <button 
            type="button" 
            className="advanced-search-toggle"
            onClick={toggleAdvancedSearch}
          >
            <i className={`fas fa-${showAdvanced ? 'chevron-up' : 'sliders-h'}`}></i>
            {showAdvanced ? 'Hide Filters' : 'Filters'}
          </button>
        )}
        
        {!advancedSearch && (
          <button type="submit" className="search-btn">
            <i className="fas fa-search"></i>
            Search
          </button>
        )}
      </form>
      
      {/* Quick filters row */}
      {filters.length > 0 && !showAdvanced && (
        <div className="quick-filters">
          {filters.map((filter) => (
            <div key={filter.key} className="filter-group">
              <label>{filter.label}:</label>
              <select
                value={activeFilters[filter.key] || ''}
                onChange={(e) => handleFilterChange(filter, e.target.value)}
              >
                <option value="">All</option>
                {filter.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          ))}
          
          {Object.keys(activeFilters).length > 0 && (
            <button 
              className="clear-filters-btn"
              onClick={clearFilters}
            >
              <i className="fas fa-times"></i> Clear filters
            </button>
          )}
        </div>
      )}
      
      {/* Advanced search panel */}
      {showAdvanced && (
        <div className="advanced-search-panel">
          <div className="filter-groups">
            {filters.map((filter) => {
              // Render different filter types based on filter configuration
              switch (filter.type) {
                case 'select':
                  return (
                    <div key={filter.key} className="filter-group">
                      <label>{filter.label}:</label>
                      <select
                        value={activeFilters[filter.key] || ''}
                        onChange={(e) => handleFilterChange(filter, e.target.value)}
                      >
                        <option value="">All</option>
                        {filter.options.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  );
                  
                case 'date':
                  return (
                    <div key={filter.key} className="filter-group">
                      <label>{filter.label}:</label>
                      <input
                        type="date"
                        value={activeFilters[filter.key] || ''}
                        onChange={(e) => handleFilterChange(filter, e.target.value)}
                      />
                    </div>
                  );
                  
                case 'range':
                  return (
                    <div key={filter.key} className="filter-group range-filter">
                      <label>{filter.label}:</label>
                      <div className="range-inputs">
                        <input
                          type="number"
                          placeholder={`Min ${filter.label}`}
                          value={activeFilters[`${filter.key}_min`] || ''}
                          onChange={(e) => handleFilterChange(`${filter.key}_min`, e.target.value)}
                        />
                        <span className="range-separator">to</span>
                        <input
                          type="number"
                          placeholder={`Max ${filter.label}`}
                          value={activeFilters[`${filter.key}_max`] || ''}
                          onChange={(e) => handleFilterChange(`${filter.key}_max`, e.target.value)}
                        />
                      </div>
                    </div>
                  );
                  
                case 'checkbox':
                  return (
                    <div key={filter.key} className="filter-group checkbox-filter">
                      <label>{filter.label}:</label>
                      <div className="checkbox-options">
                        {filter.options.map((option) => (
                          <div key={option.value} className="checkbox-option">
                            <input
                              type="checkbox"
                              id={`filter-${filter.key}-${option.value}`}
                              checked={activeFilters[filter.key]?.includes(option.value) || false}
                              onChange={(e) => {
                                const currentValues = activeFilters[filter.key] || [];
                                const updatedValues = e.target.checked
                                  ? [...currentValues, option.value]
                                  : currentValues.filter(v => v !== option.value);
                                handleFilterChange(filter, updatedValues.length ? updatedValues : '');
                              }}
                            />
                            <label htmlFor={`filter-${filter.key}-${option.value}`}>{option.label}</label>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                  
                // Default to text input
                default:
                  return (
                    <div key={filter.key} className="filter-group">
                      <label>{filter.label}:</label>
                      <input
                        type="text"
                        placeholder={`Enter ${filter.label.toLowerCase()}`}
                        value={activeFilters[filter.key] || ''}
                        onChange={(e) => handleFilterChange(filter, e.target.value)}
                      />
                    </div>
                  );
              }
            })}
          </div>
          
          <div className="advanced-search-actions">
            <button 
              type="button" 
              className="clear-search-btn"
              onClick={clearFilters}
            >
              Clear All
            </button>
            <button 
              type="button" 
              className="apply-search-btn"
              onClick={() => onSearch({ searchText, filters: activeFilters })}
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

AgentSearchBar.propTypes = {
  onSearch: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  filters: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      type: PropTypes.oneOf(['select', 'date', 'range', 'checkbox', 'text']),
      options: PropTypes.arrayOf(
        PropTypes.shape({
          label: PropTypes.string.isRequired,
          value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
        })
      )
    })
  ),
  advancedSearch: PropTypes.bool
};

export default AgentSearchBar;