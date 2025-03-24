import React, { useState } from 'react';
import './SupabaseFunctions.css';

// Import function definitions
import userFunctions from './functionData/userFunctions';
import vehicleFunctions from './functionData/vehicleFunctions';
import bookingFunctions from './functionData/bookingFunctions';
import paymentFunctions from './functionData/paymentFunctions';
import ratingFunctions from './functionData/ratingFunctions';
import searchFunctions from './functionData/searchFunctions';
import documentFunctions from './functionData/documentFunctions';

const SupabaseFunctions = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedFunction, setCopiedFunction] = useState(null);

  const categories = [
    { name: 'All', color: '#4E5D94' },
    { name: 'User', color: '#3182CE', functions: userFunctions },
    { name: 'Vehicle', color: '#38A169', functions: vehicleFunctions },
    { name: 'Booking', color: '#DD6B20', functions: bookingFunctions },
    { name: 'Payment', color: '#D53F8C', functions: paymentFunctions },
    { name: 'Rating', color: '#805AD5', functions: ratingFunctions },
    { name: 'Search', color: '#2B6CB0', functions: searchFunctions },
    { name: 'Document', color: '#718096', functions: documentFunctions },
  ];

  // Get all functions or filter by category
  const getAllFunctions = () => {
    if (selectedCategory === 'All') {
      return [
        ...userFunctions,
        ...vehicleFunctions,
        ...bookingFunctions,
        ...paymentFunctions,
        ...ratingFunctions,
        ...searchFunctions,
        ...documentFunctions,
      ];
    } else {
      const category = categories.find(cat => cat.name === selectedCategory);
      return category ? category.functions : [];
    }
  };

  // Filter functions by search term
  const getFilteredFunctions = () => {
    const allFunctions = getAllFunctions();
    if (!searchTerm) return allFunctions;
    
    return allFunctions.filter(fn => 
      fn.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fn.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // Handle copy to clipboard
  const copyToClipboard = (functionId, sqlCode) => {
    navigator.clipboard.writeText(sqlCode)
      .then(() => {
        setCopiedFunction(functionId);
        setTimeout(() => setCopiedFunction(null), 2000);
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
      });
  };

  const filteredFunctions = getFilteredFunctions();

  return (
    <div className="supabase-functions-container">
      <div className="functions-header">
        <h1>Drivelyph Supabase Functions</h1>
        <p>Browse, view, and copy PostgreSQL functions for your Supabase project</p>
        <div className="functions-search-bar">
          <input
            type="text"
            placeholder="Search functions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="functions-content">
        <div className="functions-sidebar">
          <h2>Categories</h2>
          <ul>
            {categories.map(category => (
              <li 
                key={category.name}
                className={selectedCategory === category.name ? 'active' : ''}
                onClick={() => setSelectedCategory(category.name)}
                style={{ 
                  borderLeft: `4px solid ${category.color}`,
                  backgroundColor: selectedCategory === category.name ? `${category.color}20` : 'transparent'
                }}
              >
                {category.name}
                {category.functions && (
                  <span className="function-count">{category.functions.length}</span>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className="functions-main">
          <h2>
            {selectedCategory === 'All' 
              ? 'All Functions' 
              : `${selectedCategory} Functions`}
            <span className="function-count">({filteredFunctions.length})</span>
          </h2>

          {filteredFunctions.length === 0 ? (
            <div className="no-functions">
              No functions found. Try another search term or category.
            </div>
          ) : (
            <div className="functions-list">
              {filteredFunctions.map(fn => {
                // Find the category this function belongs to
                const fnCategory = categories.find(cat => 
                  cat.functions && cat.functions.some(f => f.id === fn.id)
                );
                
                return (
                  <div key={fn.id} className="function-card">
                    <div className="function-header" style={{ backgroundColor: fnCategory ? fnCategory.color : '#4A5568' }}>
                      <h3>{fn.name}</h3>
                      <div className="function-category">{fnCategory ? fnCategory.name : ''}</div>
                    </div>
                    <div className="function-content">
                      <p className="function-description">{fn.description}</p>
                      <div className="function-details">
                        <div className="detail"><strong>Security:</strong> {fn.security}</div>
                        <div className="detail"><strong>Parameters:</strong> {fn.parameters.join(', ') || 'None'}</div>
                        <div className="detail"><strong>Returns:</strong> {fn.returns}</div>
                      </div>
                      <div className="function-actions">
                        <button 
                          className="copy-button"
                          onClick={() => copyToClipboard(fn.id, fn.sql)}
                        >
                          {copiedFunction === fn.id ? 'Copied!' : 'Copy Function'}
                        </button>
                        <button 
                          className="view-button"
                          onClick={() => {
                            document.getElementById(`sql-${fn.id}`).classList.toggle('expanded');
                          }}
                        >
                          View SQL
                        </button>
                      </div>
                      <pre id={`sql-${fn.id}`} className="function-sql">
                        <code>{fn.sql}</code>
                      </pre>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SupabaseFunctions;
