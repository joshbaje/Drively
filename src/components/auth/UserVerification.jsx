import React, { useState } from 'react';
import supabase from '../../services/supabase/supabaseClient';

/**
 * Component to verify a user's existence and roles in Supabase
 * Place this in src/components/auth/UserVerification.jsx
 */
const UserVerification = () => {
  const [email, setEmail] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const verifyUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResults(null);
    
    try {
      // Step 1: Check if user exists in Auth
      const { data: authUsers, error: authError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();
      
      if (authError) {
        if (authError.code === 'PGRST116') {
          throw new Error(`User with email ${email} not found in users table`);
        }
        throw authError;
      }
      
      // Step 2: Check profile based on user type
      let profileData = null;
      
      if (authUsers.user_type === 'renter' || authUsers.user_type === 'verified_renter') {
        const { data: renterProfile, error: renterError } = await supabase
          .from('renter_profiles')
          .select('*')
          .eq('user_id', authUsers.user_id)
          .single();
          
        if (!renterError) {
          profileData = renterProfile;
        }
      } else if (authUsers.user_type === 'owner' || authUsers.user_type === 'verified_owner') {
        const { data: ownerProfile, error: ownerError } = await supabase
          .from('car_owner_profiles')
          .select('*')
          .eq('user_id', authUsers.user_id)
          .single();
          
        if (!ownerError) {
          profileData = ownerProfile;
        }
      }
      
      // Set the results
      setResults({
        user: authUsers,
        profile: profileData
      });
    } catch (err) {
      console.error('Verification error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '20px auto', padding: '20px', border: '1px solid #eee', borderRadius: '8px' }}>
      <h2>User Verification Tool</h2>
      <p>Enter an email address to check if a user exists and verify their roles.</p>
      
      <form onSubmit={verifyUser} style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="user@example.com"
            style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
            required
          />
          <button 
            type="submit"
            disabled={loading}
            style={{ padding: '8px 16px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            {loading ? 'Checking...' : 'Verify User'}
          </button>
        </div>
      </form>
      
      {error && (
        <div style={{ padding: '15px', backgroundColor: '#f8d7da', borderRadius: '4px', marginBottom: '20px', color: '#721c24' }}>
          <strong>Error:</strong> {error}
        </div>
      )}
      
      {results && (
        <div style={{ marginTop: '20px' }}>
          <h3>Verification Results</h3>
          
          <div style={{ padding: '15px', backgroundColor: '#d4edda', borderRadius: '4px', marginBottom: '15px', color: '#155724' }}>
            <strong>User Found!</strong> User exists in the database.
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <h4>User Information</h4>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  <tr>
                    <td style={{ padding: '8px', borderBottom: '1px solid #ddd', fontWeight: 'bold' }}>User ID:</td>
                    <td style={{ padding: '8px', borderBottom: '1px solid #ddd', fontFamily: 'monospace' }}>{results.user.user_id}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '8px', borderBottom: '1px solid #ddd', fontWeight: 'bold' }}>Email:</td>
                    <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{results.user.email}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '8px', borderBottom: '1px solid #ddd', fontWeight: 'bold' }}>Name:</td>
                    <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{results.user.first_name} {results.user.last_name}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '8px', borderBottom: '1px solid #ddd', fontWeight: 'bold' }}>User Type:</td>
                    <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                      <span style={{ 
                        padding: '4px 8px', 
                        borderRadius: '4px', 
                        backgroundColor: 
                          results.user.user_type.includes('admin') ? '#d1c4e9' : 
                          results.user.user_type.includes('owner') ? '#bbdefb' : 
                          results.user.user_type.includes('renter') ? '#c8e6c9' : 
                          results.user.user_type.includes('support') ? '#ffecb3' : '#e0e0e0'
                      }}>
                        {results.user.user_type}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ padding: '8px', borderBottom: '1px solid #ddd', fontWeight: 'bold' }}>Status:</td>
                    <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                      {results.user.is_active ? 
                        <span style={{ color: 'green' }}>Active</span> : 
                        <span style={{ color: 'red' }}>Inactive</span>
                      }
                      {' | '}
                      {results.user.is_verified ? 
                        <span style={{ color: 'green' }}>Verified</span> : 
                        <span style={{ color: 'orange' }}>Unverified</span>
                      }
                    </td>
                  </tr>
                  <tr>
                    <td style={{ padding: '8px', borderBottom: '1px solid #ddd', fontWeight: 'bold' }}>Created:</td>
                    <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                      {new Date(results.user.created_at).toLocaleString()}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ padding: '8px', borderBottom: '1px solid #ddd', fontWeight: 'bold' }}>Last Login:</td>
                    <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                      {results.user.last_login_at ? 
                        new Date(results.user.last_login_at).toLocaleString() : 
                        'Never'
                      }
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div>
              <h4>Profile Information</h4>
              {results.profile ? (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <tbody>
                    {results.user.user_type.includes('renter') ? (
                      // Renter profile fields
                      <>
                        <tr>
                          <td style={{ padding: '8px', borderBottom: '1px solid #ddd', fontWeight: 'bold' }}>License Number:</td>
                          <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{results.profile.driver_license_number}</td>
                        </tr>
                        <tr>
                          <td style={{ padding: '8px', borderBottom: '1px solid #ddd', fontWeight: 'bold' }}>License State:</td>
                          <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{results.profile.license_state}</td>
                        </tr>
                        <tr>
                          <td style={{ padding: '8px', borderBottom: '1px solid #ddd', fontWeight: 'bold' }}>License Expiry:</td>
                          <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                            {results.profile.license_expiry ? new Date(results.profile.license_expiry).toLocaleDateString() : 'Not set'}
                          </td>
                        </tr>
                        <tr>
                          <td style={{ padding: '8px', borderBottom: '1px solid #ddd', fontWeight: 'bold' }}>Verification:</td>
                          <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                            <span style={{ 
                              padding: '4px 8px', 
                              borderRadius: '4px', 
                              backgroundColor: 
                                results.profile.license_verification_status === 'approved' ? '#c8e6c9' : 
                                results.profile.license_verification_status === 'pending' ? '#ffecb3' : 
                                '#ffcdd2'
                            }}>
                              {results.profile.license_verification_status}
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td style={{ padding: '8px', borderBottom: '1px solid #ddd', fontWeight: 'bold' }}>Driving History:</td>
                          <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                            {results.profile.driving_history_verified ? 
                              <span style={{ color: 'green' }}>Verified</span> : 
                              <span style={{ color: 'orange' }}>Unverified</span>
                            }
                          </td>
                        </tr>
                        <tr>
                          <td style={{ padding: '8px', borderBottom: '1px solid #ddd', fontWeight: 'bold' }}>Rating:</td>
                          <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                            {results.profile.average_rating ? `${results.profile.average_rating} / 5` : 'No ratings yet'}
                          </td>
                        </tr>
                        <tr>
                          <td style={{ padding: '8px', borderBottom: '1px solid #ddd', fontWeight: 'bold' }}>Total Rentals:</td>
                          <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{results.profile.total_rentals || 0}</td>
                        </tr>
                      </>
                    ) : results.user.user_type.includes('owner') ? (
                      // Owner profile fields
                      <>
                        <tr>
                          <td style={{ padding: '8px', borderBottom: '1px solid #ddd', fontWeight: 'bold' }}>Verification:</td>
                          <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                            <span style={{ 
                              padding: '4px 8px', 
                              borderRadius: '4px', 
                              backgroundColor: 
                                results.profile.id_verification_status === 'approved' ? '#c8e6c9' : 
                                results.profile.id_verification_status === 'pending' ? '#ffecb3' : 
                                '#ffcdd2'
                            }}>
                              {results.profile.id_verification_status}
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td style={{ padding: '8px', borderBottom: '1px solid #ddd', fontWeight: 'bold' }}>Verified Date:</td>
                          <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                            {results.profile.verification_date ? 
                              new Date(results.profile.verification_date).toLocaleDateString() : 
                              'Not verified'
                            }
                          </td>
                        </tr>
                        <tr>
                          <td style={{ padding: '8px', borderBottom: '1px solid #ddd', fontWeight: 'bold' }}>Business Type:</td>
                          <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                            {results.profile.is_business ? 'Business' : 'Individual'}
                          </td>
                        </tr>
                        {results.profile.is_business && (
                          <>
                            <tr>
                              <td style={{ padding: '8px', borderBottom: '1px solid #ddd', fontWeight: 'bold' }}>Business Name:</td>
                              <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{results.profile.business_name}</td>
                            </tr>
                            <tr>
                              <td style={{ padding: '8px', borderBottom: '1px solid #ddd', fontWeight: 'bold' }}>Registration #:</td>
                              <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{results.profile.business_registration_number}</td>
                            </tr>
                          </>
                        )}
                        <tr>
                          <td style={{ padding: '8px', borderBottom: '1px solid #ddd', fontWeight: 'bold' }}>Tax ID:</td>
                          <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{results.profile.tax_id || 'Not provided'}</td>
                        </tr>
                        <tr>
                          <td style={{ padding: '8px', borderBottom: '1px solid #ddd', fontWeight: 'bold' }}>Rating:</td>
                          <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                            {results.profile.average_rating ? `${results.profile.average_rating} / 5` : 'No ratings yet'}
                          </td>
                        </tr>
                        <tr>
                          <td style={{ padding: '8px', borderBottom: '1px solid #ddd', fontWeight: 'bold' }}>Total Listings:</td>
                          <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{results.profile.total_listings || 0}</td>
                        </tr>
                      </>
                    ) : (
                      <tr>
                        <td colSpan="2" style={{ padding: '8px', textAlign: 'center' }}>
                          No additional profile information required for this role
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              ) : (
                <div style={{ padding: '15px', backgroundColor: '#fff3cd', borderRadius: '4px', color: '#856404' }}>
                  <strong>Warning:</strong> No profile information found for this user.
                  {(results.user.user_type.includes('renter') || results.user.user_type.includes('owner')) && 
                    ' A profile record should be created for this user type.'}
                </div>
              )}
            </div>
          </div>
          
          {/* Raw Data Section */}
          <div style={{ marginTop: '20px' }}>
            <details>
              <summary style={{ cursor: 'pointer', padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
                <strong>Raw Data</strong> (Click to expand)
              </summary>
              <div style={{ marginTop: '10px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '4px', maxHeight: '300px', overflow: 'auto' }}>
                <h4>User Object</h4>
                <pre style={{ margin: 0, overflow: 'auto' }}>{JSON.stringify(results.user, null, 2)}</pre>
                
                {results.profile && (
                  <>
                    <h4>Profile Object</h4>
                    <pre style={{ margin: 0, overflow: 'auto' }}>{JSON.stringify(results.profile, null, 2)}</pre>
                  </>
                )}
              </div>
            </details>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserVerification;