import React, { useState, useEffect } from 'react';
import supabase from '../../services/supabase/supabaseClient';
import './DatabaseManager.css';

const DatabaseManager = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [tablesInfo, setTablesInfo] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [seedScripts, setSeedScripts] = useState({
    roles: `
-- Recreate standard roles
INSERT INTO roles (name, description, is_active)
VALUES 
  ('admin', 'Full system administration access', true),
  ('support', 'Customer support agent access', true),
  ('content_moderator', 'Content moderation privileges', true),
  ('owner', 'Vehicle owner access', true),
  ('verified_owner', 'Verified vehicle owner with ID and profile checks', true),
  ('renter', 'Basic vehicle renter access', true),
  ('verified_renter', 'Verified renter with ID and license checks', true);`,
    admin_user: `
-- Create system admin user
INSERT INTO users (
  email, 
  phone_number, 
  password_hash, 
  first_name, 
  last_name, 
  user_type, 
  is_active, 
  is_verified
)
VALUES (
  'admin@drivelyph.com',
  '+639123456789',
  'system-generated-hash-to-be-changed',
  'System',
  'Administrator',
  'admin',
  true,
  true
);

-- Assign admin role to the system user
INSERT INTO user_roles (user_id, role_id, is_primary)
SELECT 
    (SELECT user_id FROM users WHERE email = 'admin@drivelyph.com'),
    (SELECT role_id FROM roles WHERE name = 'admin'),
    true;`,
    sample_data: `
-- This would execute the full seed data script from 02_seed_data.sql
-- Here we're just showing a message for safety
SELECT 'To run the full sample data script, use the dedicated button below';`
  });
  
  useEffect(() => {
    fetchTablesInfo();
  }, []);
  
  const fetchTablesInfo = async () => {
    try {
      setLoading(true);
      
      // Query to get all tables and their record counts
      const { data: tablesData, error } = await supabase.rpc('get_tables_info');
      
      if (error) throw error;
      
      setTablesInfo(tablesData || []);
    } catch (error) {
      console.error('Error fetching tables info:', error);
      setMessage({ type: 'error', text: 'Failed to fetch database information: ' + error.message });
    } finally {
      setLoading(false);
    }
  };
  
  const fetchTableData = async (tableName) => {
    try {
      setLoading(true);
      setSelectedTable(tableName);
      
      // Query to get the first 100 records from the selected table
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .limit(100);
      
      if (error) throw error;
      
      setTableData(data || []);
    } catch (error) {
      console.error(`Error fetching data from ${tableName}:`, error);
      setMessage({ type: 'error', text: `Failed to fetch data from ${tableName}: ${error.message}` });
      setTableData([]);
    } finally {
      setLoading(false);
    }
  };
  
  const truncateTable = async (tableName) => {
    if (!window.confirm(`Are you sure you want to delete ALL records from ${tableName}?`)) {
      return;
    }
    
    try {
      setLoading(true);
      
      // Execute a function to truncate the table
      const { data, error } = await supabase.rpc('truncate_table', {
        table_name: tableName
      });
      
      if (error) throw error;
      
      setMessage({ 
        type: 'success', 
        text: `Successfully truncated table: ${tableName}`
      });
      
      // Refresh table info and clear selected table data
      await fetchTablesInfo();
      if (selectedTable === tableName) {
        setTableData([]);
      }
    } catch (error) {
      console.error(`Error truncating ${tableName}:`, error);
      setMessage({ 
        type: 'error', 
        text: `Failed to truncate ${tableName}: ${error.message}`
      });
    } finally {
      setLoading(false);
    }
  };
  
  const truncateAllTables = async () => {
    if (!window.confirm('⚠️ WARNING: This will delete ALL data from ALL tables. Are you absolutely sure?')) {
      return;
    }
    
    if (!window.confirm('⚠️ FINAL WARNING: This action cannot be undone. Proceed?')) {
      return;
    }
    
    try {
      setLoading(true);
      
      // Execute the function to truncate all tables in the public schema
      const { data, error } = await supabase.rpc('truncate_all_tables');
      
      if (error) throw error;
      
      setMessage({ 
        type: 'success', 
        text: 'Successfully truncated all tables in the database'
      });
      
      // Refresh table info and clear selected table data
      await fetchTablesInfo();
      setSelectedTable(null);
      setTableData([]);
    } catch (error) {
      console.error('Error truncating all tables:', error);
      setMessage({ 
        type: 'error', 
        text: `Failed to truncate tables: ${error.message}`
      });
    } finally {
      setLoading(false);
    }
  };
  
  const runSeedScript = async (scriptType) => {
    const scriptName = {
      'roles': 'Standard Roles',
      'admin_user': 'Admin User',
      'sample_data': 'Sample Data'
    }[scriptType];
    
    if (!window.confirm(`Are you sure you want to run the "${scriptName}" seed script?`)) {
      return;
    }
    
    try {
      setLoading(true);
      
      // Execute the SQL script
      const { data, error } = await supabase.rpc('run_sql_script', {
        sql_script: seedScripts[scriptType]
      });
      
      if (error) throw error;
      
      setMessage({ 
        type: 'success', 
        text: `Successfully executed the ${scriptName} seed script`
      });
      
      // If we created roles or admin user, refresh the tables
      if (scriptType === 'roles' || scriptType === 'admin_user') {
        await fetchTablesInfo();
      }
      
      // If the full sample data was added, refresh the whole view
      if (scriptType === 'sample_data') {
        await fetchTablesInfo();
        setSelectedTable(null);
      }
    } catch (error) {
      console.error(`Error running ${scriptType} script:`, error);
      setMessage({ 
        type: 'error', 
        text: `Failed to run ${scriptName} script: ${error.message}`
      });
    } finally {
      setLoading(false);
    }
  };
  
  const runFullSeedScript = async () => {
    if (!window.confirm('This will populate the database with sample data. Continue?')) {
      return;
    }
    
    try {
      setLoading(true);
      
      // Call a stored procedure that will execute the full seed script
      const { data, error } = await supabase.rpc('run_full_seed_script');
      
      if (error) throw error;
      
      setMessage({ 
        type: 'success', 
        text: 'Successfully populated the database with sample data'
      });
      
      // Refresh table info
      await fetchTablesInfo();
    } catch (error) {
      console.error('Error running full seed script:', error);
      setMessage({ 
        type: 'error', 
        text: `Failed to populate database: ${error.message}`
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="database-manager">
      <h2>Database Management</h2>
      
      {message && (
        <div className={`alert alert-${message.type}`}>
          {message.text}
          <button 
            className="close-btn" 
            onClick={() => setMessage(null)}
          >×</button>
        </div>
      )}
      
      <div className="manager-controls">
        <div className="section seed-section">
          <h3>Seed Data</h3>
          <p>Initialize or reset essential database tables:</p>
          
          <div className="button-group">
            <button 
              className="btn btn-primary" 
              onClick={() => runSeedScript('roles')}
              disabled={loading}
            >
              Recreate Roles
            </button>
            
            <button 
              className="btn btn-primary" 
              onClick={() => runSeedScript('admin_user')}
              disabled={loading}
            >
              Create Admin User
            </button>
            
            <button 
              className="btn btn-success" 
              onClick={runFullSeedScript}
              disabled={loading}
            >
              Run Full Sample Data Script
            </button>
          </div>
        </div>
        
        <div className="section danger-section">
          <h3>Danger Zone</h3>
          <p>⚠️ These actions permanently delete data and cannot be undone:</p>
          
          <button 
            className="btn btn-danger" 
            onClick={truncateAllTables}
            disabled={loading}
          >
            Truncate All Tables
          </button>
        </div>
      </div>
      
      <div className="database-explorer">
        <h3>Database Explorer</h3>
        
        {loading && (
          <div className="loader">Loading...</div>
        )}
        
        <div className="tables-section">
          <div className="tables-list">
            <h4>Tables ({tablesInfo.length})</h4>
            <ul>
              {tablesInfo.map((table) => (
                <li key={table.table_name}>
                  <div className="table-item">
                    <button 
                      className={`table-name ${selectedTable === table.table_name ? 'active' : ''}`}
                      onClick={() => fetchTableData(table.table_name)}
                    >
                      {table.table_name}
                      <span className="record-count">{table.record_count}</span>
                    </button>
                    
                    <button 
                      className="truncate-btn"
                      onClick={() => truncateTable(table.table_name)}
                      disabled={loading || table.record_count === 0}
                      title="Delete all records"
                    >
                      🗑️
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="table-data">
            {selectedTable ? (
              <>
                <h4>{selectedTable} Data</h4>
                {tableData.length > 0 ? (
                  <div className="data-table-container">
                    <table className="data-table">
                      <thead>
                        <tr>
                          {Object.keys(tableData[0]).map((column) => (
                            <th key={column}>{column}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {tableData.map((row, rowIndex) => (
                          <tr key={rowIndex}>
                            {Object.entries(row).map(([column, value], colIndex) => (
                              <td key={colIndex}>
                                {value === null ? (
                                  <span className="null-value">NULL</span>
                                ) : typeof value === 'object' ? (
                                  <span className="json-value" title={JSON.stringify(value)}>
                                    {JSON.stringify(value).substring(0, 30)}...
                                  </span>
                                ) : (
                                  String(value).substring(0, 50) + (String(value).length > 50 ? '...' : '')
                                )}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p>No data available in this table.</p>
                )}
              </>
            ) : (
              <div className="select-prompt">
                <p>Select a table to view its data</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatabaseManager;