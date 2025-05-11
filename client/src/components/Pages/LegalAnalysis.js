import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './LegalUpload.css';
import Header from '../Header';

const LegalUpload = () => {
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState('');
  const [compliance, setCompliance] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [documents, setDocuments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSummary, setCurrentSummary] = useState('');
  const [visibleSummaryIndex, setVisibleSummaryIndex] = useState(null);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/document/all`);
        setDocuments(response.data.documents || []);
      } catch (err) {
        console.error('Error fetching documents:', err);
      }
    };

    fetchDocuments();
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setSummary('');
    setCompliance('');
    setError('');
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      setLoading(true);
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/document/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setSummary(response.data.summary || ' Summary Processing Done');
      setCompliance(response.data.compliance_status || 'Unknown');
      setError('');

      const response2 = await axios.get(`${process.env.REACT_APP_API_URL}/api/document/all`);
      setDocuments(response2.data.documents || []);
    } catch (err) {
      console.error(err);
      setError('Error uploading the file.');
    } finally {
      setLoading(false);
    }
  };

  const toggleSummary = (index) => {
    setVisibleSummaryIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const downloadSummary = (summary) => {
    const blob = new Blob([summary], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'summary.txt';
    link.click();
  };

  const styles = {
    th: {
      borderBottom: '1px solid #ccc',
      padding: '10px',
      textAlign: 'left',
    },
    td: {
      padding: '10px',
      borderBottom: '1px solid #eee',
    },
    summaryRow: {
      backgroundColor: '#f9f9f9',
      padding: '10px',
      fontStyle: 'italic',
    },
    pre: {
      margin: 0,
      whiteSpace: 'pre-wrap',
      wordWrap: 'break-word',
    },
  };

  return (
    <div className="legal-upload">
      <Header />
      <div className="legal-upload-container">
        <div className="main-content">
          <div className="upload-column">
            <h2>Upload Legal Document</h2>
            <input type="file" accept=".pdf,.txt" onChange={handleFileChange} />
            <button onClick={handleUpload} disabled={loading} style={{ marginTop: 10 }}>
              {loading ? 'Processing...' : 'Upload & Analyze'}
            </button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {summary && (
              <>
                <h3>Summary</h3>
                <p>{summary}</p>
              </>
            )}
          </div>

          <div className="document-column">
            <h3>Documents Uploaded: {documents.length}</h3>
            {documents.length > 0 ? (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={styles.th}>Filename</th>
                    <th style={styles.th}>Upload Date</th>
                    <th style={styles.th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {documents.map((doc, index) => (
                    <React.Fragment key={index}>
                      <tr>
                        <td style={styles.td}>{doc.filename}</td>
                        <td style={styles.td}>{new Date(doc.upload_date).toLocaleString()}</td>
                        <td style={styles.td}>
                          <button onClick={() => toggleSummary(index)} style={{ marginRight: '8px' }}>
                            {visibleSummaryIndex === index ? 'Hide Summary' : 'View Summary'}
                          </button>
                          <button onClick={() => downloadSummary(doc.summary)} style={{ marginLeft: '8px' }}>
                            Download Summary
                          </button>
                        </td>
                      </tr>
                      {visibleSummaryIndex === index && (
                        <tr>
                          <td colSpan="3" style={styles.summaryRow}>
                            <pre style={styles.pre}>{doc.summary}</pre>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No documents uploaded yet.</p>
            )}
          </div>
        </div>

        {isModalOpen && (
          <div className="modal">
            <div className="modal-content">
              <h3>Document Summary</h3>
              <p>{currentSummary}</p>
              <button onClick={handleCloseModal}>Close</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LegalUpload;
