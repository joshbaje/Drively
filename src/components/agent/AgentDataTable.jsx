import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const AgentDataTable = ({ 
  columns, 
  data, 
  isLoading = false,
  pagination = true,
  pageSize = 10,
  onRowClick = null,
  actions = []
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'asc'
  });
  const [paginatedData, setPaginatedData] = useState([]);
  
  // Effect to handle pagination
  useEffect(() => {
    if (pagination) {
      const start = (currentPage - 1) * pageSize;
      const end = start + pageSize;
      setPaginatedData(data.slice(start, end));
    } else {
      setPaginatedData(data);
    }
  }, [data, currentPage, pageSize, pagination]);
  
  // Calculate total pages
  const totalPages = Math.ceil(data.length / pageSize);
  
  // Handle sort
  const handleSort = (key) => {
    let direction = 'asc';
    
    if (sortConfig.key === key) {
      direction = sortConfig.direction === 'asc' ? 'desc' : 'asc';
    }
    
    setSortConfig({ key, direction });
    
    const sortedData = [...data].sort((a, b) => {
      // Get values using accessor function if provided
      const aValue = typeof key === 'function' ? key(a) : a[key];
      const bValue = typeof key === 'function' ? key(b) : b[key];
      
      // Handle different types
      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;
      
      if (typeof aValue === 'string') {
        return direction === 'asc' 
          ? aValue.localeCompare(bValue) 
          : bValue.localeCompare(aValue);
      }
      
      // Default comparison for numbers, dates, etc.
      return direction === 'asc' 
        ? aValue - bValue 
        : bValue - aValue;
    });
    
    // Update paginated data with sorted data
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    setPaginatedData(pagination ? sortedData.slice(start, end) : sortedData);
  };
  
  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  
  // Handle row click
  const handleRowClick = (row) => {
    if (onRowClick) {
      onRowClick(row);
    }
  };
  
  return (
    <div className="agent-data-table-container">
      {isLoading ? (
        <div className="table-loading">
          <div className="spinner"></div>
          <p>Loading data...</p>
        </div>
      ) : (
        <>
          <div className="table-responsive">
            <table className="agent-data-table">
              <thead>
                <tr>
                  {columns.map((column) => (
                    <th 
                      key={column.key || column.accessor}
                      onClick={() => column.sortable && handleSort(column.accessor)}
                      className={column.sortable ? 'sortable' : ''}
                    >
                      {column.header}
                      {column.sortable && (
                        <span className="sort-indicator">
                          {sortConfig.key === column.accessor ? (
                            sortConfig.direction === 'asc' ? ' ↑' : ' ↓'
                          ) : ''}
                        </span>
                      )}
                    </th>
                  ))}
                  {actions.length > 0 && <th className="actions-column">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {paginatedData.length > 0 ? (
                  paginatedData.map((row, rowIndex) => (
                    <tr 
                      key={row.id || rowIndex} 
                      onClick={() => handleRowClick(row)}
                      className={onRowClick ? 'clickable' : ''}
                    >
                      {columns.map((column) => {
                        const cellKey = column.key || column.accessor;
                        const cellValue = typeof column.accessor === 'function' 
                          ? column.accessor(row) 
                          : row[column.accessor];
                          
                        return (
                          <td key={cellKey}>
                            {column.render ? column.render(cellValue, row) : cellValue}
                          </td>
                        );
                      })}
                      
                      {actions.length > 0 && (
                        <td className="actions-cell">
                          <div className="actions-buttons">
                            {actions.map((action, actionIndex) => (
                              <button
                                key={actionIndex}
                                className={`action-btn ${action.className || ''}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  action.onClick(row);
                                }}
                                title={action.label}
                              >
                                {action.icon && <i className={`fas fa-${action.icon}`}></i>}
                                {action.showLabel && <span>{action.label}</span>}
                              </button>
                            ))}
                          </div>
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={columns.length + (actions.length > 0 ? 1 : 0)} className="no-data">
                      <div className="no-data-message">
                        <i className="fas fa-inbox"></i>
                        <p>No data available</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {pagination && totalPages > 1 && (
            <div className="pagination-controls">
              <button
                className="pagination-btn"
                disabled={currentPage === 1}
                onClick={() => handlePageChange(1)}
              >
                <i className="fas fa-angle-double-left"></i>
              </button>
              <button
                className="pagination-btn"
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                <i className="fas fa-angle-left"></i>
              </button>
              
              <div className="page-indicator">
                <span>Page {currentPage} of {totalPages}</span>
              </div>
              
              <button
                className="pagination-btn"
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                <i className="fas fa-angle-right"></i>
              </button>
              <button
                className="pagination-btn"
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(totalPages)}
              >
                <i className="fas fa-angle-double-right"></i>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

AgentDataTable.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      header: PropTypes.string.isRequired,
      accessor: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired,
      key: PropTypes.string,
      sortable: PropTypes.bool,
      render: PropTypes.func
    })
  ).isRequired,
  data: PropTypes.array.isRequired,
  isLoading: PropTypes.bool,
  pagination: PropTypes.bool,
  pageSize: PropTypes.number,
  onRowClick: PropTypes.func,
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.string,
      label: PropTypes.string.isRequired,
      onClick: PropTypes.func.isRequired,
      className: PropTypes.string,
      showLabel: PropTypes.bool
    })
  )
};

export default AgentDataTable;