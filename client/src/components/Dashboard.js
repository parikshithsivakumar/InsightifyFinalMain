import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer , Cell } from 'recharts';
import axios from 'axios';
import  { useRef } from 'react';


const Dashboard = () => {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [expenseData, setExpenseData] = useState([]);
  const navigate = useNavigate();
  const profileRef = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/');
  };

 useEffect(() => {
  const fetchExpenses = async () => {
    try {
      const response = await axios.get('http://localhost:5000/expenses');
      const rawData = response.data;

      // Aggregate expenses by category
      const categoryMap = {};

      rawData.forEach(expense => {
        const category = expense.category;
        const amount = parseFloat(expense.amount); // Ensure it's a number

        if (categoryMap[category]) {
          categoryMap[category] += amount;
        } else {
          categoryMap[category] = amount;
        }
      });

      // Convert aggregated data into desired format
      const formattedData = Object.entries(categoryMap).map(([category, total]) => ({
        category,
        expense: total
      }));

      setExpenseData(formattedData);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  };

  fetchExpenses();
}, []);

 const [isModalOpen, setIsModalOpen] = useState(false);
const [visibleSummaryIndex, setVisibleSummaryIndex] = useState(null);
 const [documents, setDocuments] = useState([]);
  
 useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/document/all');
        setDocuments(response.data.documents || []);
      } catch (err) {
        console.error('Error fetching documents:', err);
      }
    };

    fetchDocuments();
  }, []);

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
const COLORS = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042',
  '#A28EFF', '#FF6EC7', '#50C878', '#D2691E',
  '#FF6347', '#40E0D0', '#FFA07A', '#DA70D6'
];
  return (
    <div className="app-container">
      {/* Header Section */}
     <header className="main-header">
        <div className="header-content">
          <div className="search-container">
            <input type="text" placeholder="Search documents, reports..." className="search-input" />
            <svg className="search-icon" viewBox="0 0 24 24">
              <path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 0 0 1.48-5.34c-.47-2.78-2.79-5-5.59-5.34a6.505 6.505 0 0 0-7.27 7.27c.34 2.8 2.56 5.12 5.34 5.59a6.5 6.5 0 0 0 5.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0 .41-.41.41-1.08 0-1.49L15.5 14zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
          </div>
          
          <div className="header-controls">
            <button className="notification-btn">
              <svg className="bell-icon" viewBox="0 0 24 24">
                <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
              </svg>
              <span className="notification-badge">2</span>
            </button>
            
            <div 
              className="profile-container"
              ref={profileRef}
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            >
              <div className="profile-circle">PS</div>
              {showProfileDropdown && (
                <div className="profile-dropdown">
                  <div className="dropdown-item">
                    <svg className="dropdown-icon" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/></svg>
                    Account
                  </div>
                  <div className="dropdown-item">
                    <svg className="dropdown-icon" viewBox="0 0 24 24"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/></svg>
                    Settings
                  </div>
                  <div className="dropdown-item" onClick={handleLogout}>  
                    <svg className="dropdown-icon" viewBox="0 0 24 24"><path d="M13 3h-2v10h2V3zm4.83 2.17l-1.42 1.42C17.99 7.86 19 9.81 19 12c0 3.87-3.13 7-7 7s-7-3.13-7-7c0-2.19 1.01-4.14 2.58-5.42L6.17 5.17C4.23 6.82 3 9.26 3 12c0 4.97 4.03 9 9 9s9-4.03 9-9c0-2.74-1.23-5.18-3.17-6.83z"/></svg>
                    Logout
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Dashboard Content */}
      <div className="dashboard-container">
        {/* Left Panel */}
       
       <div className="left-panel">
  {/* Profile Section */}
  <div className="profile-section">
    <div className="profile-content">
      <div className="user-avatar">PS</div>
      <div className="user-info">
        <h4>Parikshith Sivakumar</h4>
        <span></span>
      </div>
    </div>
  </div>

  <nav className="navigation">
    {/* Finance Module */}
    <div className="module-section">
      <h3>Finance Module</h3>
      <ul>
        <li>
          <Link to="/expense-analysis" className="nav-link">
            <svg className="nav-icon" viewBox="0 0 24 24">
              <path d="M12 1.999c5.524 0 10.002 4.478 10.002 10.002 0 5.523-4.478 10.001-10.002 10.001-5.524 0-10.002-4.478-10.002-10.001C1.998 6.477 6.476 1.999 12 1.999zm0 1.5a8.502 8.502 0 100 17.003A8.502 8.502 0 0012 3.5zm-.004 7a.75.75 0 01.744.648l.006.102v4.5a.75.75 0 01-1.493.102l-.007-.102v-4.5a.75.75 0 01.75-.75zm.005-3.5a.933.933 0 110 1.866.933.933 0 010-1.866z" />
            </svg>
            Expense Analysis
          </Link>
        </li>
      </ul>
    </div>

    {/* Legal Module */}
    <div className="module-section">
      <h3>Legal Module</h3>
      <ul>
        <li>
          <Link to="/legal" className="nav-link">
            <svg className="nav-icon" viewBox="0 0 24 24">
              <path d="M14 3v4a1 1 0 001 1h4v11a1 1 0 01-1 1H6a1 1 0 01-1-1V4a1 1 0 011-1h7zm-2 2h-5v14h12V9h-3V6a1 1 0 00-1-1h-3zm6 5v2h-7v-2h7zm0 4v2h-7v-2h7zm-6-8v3h3v-3h-3z" />
            </svg>
            Contract Analysis
          </Link>
        </li>
        <li>
          <Link to="/risk" className="nav-link">
            <svg className="nav-icon" viewBox="0 0 24 24">
              <path d="M12 1l9.5 5.5v11L12 23l-9.5-5.5v-11L12 1zm0 2.311L4.5 7.653v8.694l7.5 4.342 7.5-4.342V7.653L12 3.311zM12 16a4 4 0 110-8 4 4 0 010 8zm0-2a2 2 0 100-4 2 2 0 000 4z" />
            </svg>
            Risk Analysis
          </Link>
        </li>
      </ul>
    </div>
    
    <div className="section-divider"></div>
    
    <div className="module-section">
      <ul>
        <li>
          <Link to="/help-support" className="nav-link help-support-link">
            <svg className="nav-icon" viewBox="0 0 24 24">
              <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 100-16 8 8 0 000 16zm-1-5h2v2h-2v-2zm2-1.645V14h-2v-1.5a1 1 0 011-1 1.5 1.5 0 10-1.5-1.5H11c0-1.5 1.333-2.5 2.75-2.5 1.467 0 2.75 1 2.75 2.5 0 1.03-.392 1.712-1.058 2.231-.546.428-.942.812-.942 1.269z" />
            </svg>
            Support Center
          </Link>
        </li>
      </ul>
    </div>
  </nav>
</div>


        {/* Right Panel */}
        <main className="right-panel">
  {/* Key Metrics */}
   <div className="metrics-grid">
    <div className="metric-card">
      <h3>Total Expenses</h3>
      <p>
        ₹{expenseData.reduce((sum, d) => sum + d.expense, 0).toLocaleString()}
      </p>
      <span className="growth-indicator">+5% this month</span>
    </div>
    <div className="metric-card success">
      <h3>Categories</h3>
      <p>{expenseData.length}</p>
    </div>
    <div className="metric-card warning">
      <h3>Pending Reports</h3>
      <p>2</p>
      <span className="status-indicator">Review needed</span>
    </div>
  </div>

  {/* Activity Chart */}
  <section className="chart-section">
    <h3>Activity Overview</h3>
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={expenseData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="category" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="expense">
          {expenseData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  </section>

  {/* Documents Table */}
  <section>
    <h3>Uploaded Documents</h3>
   <table className="table">
  <thead>
    <tr>
      <th>Filename</th>
      <th>Upload Date</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    {documents.map((doc, index) => (
      <tr key={index}>
        <td>{doc.filename}</td>
        <td>{new Date(doc.upload_date).toLocaleString()}</td>
        <td>
          <button
            className="upload-button"
            style={{ padding: '6px 12px', fontSize: '0.95rem', marginRight: '8px' }}
            onClick={() => setVisibleSummaryIndex(index)}
          >
            View Summary
          </button>
          <button
            className="upload-button"
            style={{ background: 'var(--success)', padding: '6px 12px', fontSize: '0.95rem', marginLeft: '8px' }}
            onClick={() => downloadSummary(doc.summary)}
          >
            Download Summary
          </button>
        </td>
      </tr>
    ))}
  </tbody>
</table>

{/* Modal for Summary */}
{typeof visibleSummaryIndex === 'number' && documents[visibleSummaryIndex] && (
  <div className="modal-overlay" onClick={() => setVisibleSummaryIndex(null)}>
    <div
      className="modal-content"
      onClick={e => e.stopPropagation()} // Prevent closing when clicking inside modal
    >
      <button className="modal-close" onClick={() => setVisibleSummaryIndex(null)}>
        &times;
      </button>
      <h3>Summary</h3>
      <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordWrap: 'break-word', fontStyle: 'italic' }}>
        {documents[visibleSummaryIndex].summary}
      </pre>
    </div>
  </div>
)}

  </section>
</main>

      </div>
    </div>
  );
};

export default Dashboard;