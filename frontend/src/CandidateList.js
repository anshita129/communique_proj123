import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CandidateList.css';

function CandidateList({ onBack, onLogout }) {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          alert('No token found. Please login again.');
          onLogout();
          return;
        }

        console.log('Fetching candidates with token:', token);
        const res = await axios.get('/api/candidates', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        console.log('Candidates fetched successfully:', res.data);
        setCandidates(res.data);
      } catch (error) {
        console.error('Failed to fetch candidates:', error);
        const errorMessage = error.response?.data?.message || 'Failed to fetch candidates. Are you logged in?';
        alert(errorMessage);
        
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          onLogout();
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchCandidates();
  }, [onLogout]);

  const handleExport = (format) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to export data.');
      return;
    }
    
    // Note: You'll need to create export endpoints in your API
    window.open(`/api/candidates/export/${format}`, '_blank');
  };

  return (
    <div className="candidate-list-container">
      {/* Top bar with export and navigation buttons */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <button
            className="export-btn"
            onClick={() => handleExport('csv')}
          >
            Export as CSV
          </button>
          <button
            className="export-btn"
            onClick={() => handleExport('pdf')}
          >
            Export as PDF
          </button>
        </div>
        <div>
          <button className="back-btn" onClick={onBack}>
            ← Back to Home
          </button>
          <button className="back-btn" onClick={onLogout}>
            Logout
          </button>
        </div>
      </div>

      {/* Candidate table or loading/empty state */}
      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading candidates...</p>
        </div>
      ) : candidates.length === 0 ? (
        <div className="no-candidates">
          <p>No candidates found.</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="candidates-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Roll Number</th>
                <th>Google Drive Link</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {candidates.map(c => (
                <tr key={c.id}>
                  <td>{c.name}</td>
                  <td>{c.roll_number}</td>
                  <td>
                    <a
                      href={c.google_drive_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="drive-link"
                    >
                      View Document
                    </a>
                  </td>
                  <td>{new Date(c.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default CandidateList;
