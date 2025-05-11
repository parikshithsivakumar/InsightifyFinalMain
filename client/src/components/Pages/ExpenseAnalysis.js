import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ExpenseAnalysis.css';
import Header from '../Header'; // adjust path as necessary

const categoriesList = ['Food', 'Entertainment', 'Transport', 'Utilities', 'Health', 'Education'];

const ExpenseForm = () => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [category, setCategory] = useState('');
  const [file, setFile] = useState(null);
  const [isManual, setIsManual] = useState(true);

  const [expenses, setExpenses] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('');

  // Stat calculations
  const totalExpenses = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);
  const expenseCount = expenses.length;
  const categoriesUsed = [...new Set(expenses.map(exp => exp.category))].length;

  // Filtered expenses based on selected category
  const filteredExpenses = categoryFilter
    ? expenses.filter(exp => exp.category === categoryFilter)
    : expenses;

  // Fetch expenses on mount
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          alert('Authentication token missing.');
          return;
        }
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/expenses`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setExpenses(response.data);
      } catch (err) {
        console.error('Error fetching expenses:', err);
      }
    };
    fetchExpenses();
  }, []);

  // Handle manual expense submission
  const handleSubmitManual = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        alert('Authentication token missing.');
        return;
      }
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/add`,
        { name, amount, date, category },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Expense added successfully!');
      setName('');
      setAmount('');
      setDate('');
      setCategory('');
      // Refresh expenses
      setExpenses(prev => [...prev, response.data]);
    } catch (err) {
      console.error('Error adding expense:', err);
      alert('Error adding expense');
    }
  };

  // Handle file input change
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Handle PDF upload and extraction
  const handleSubmitUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      alert('Please select a PDF file.');
      return;
    }
    const formData = new FormData();
    formData.append('file', file);

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        alert('Authentication token missing.');
        return;
      }
      const response = await axios.post(
       `${process.env.REACT_APP_API_URL}/expenses/upload`,
        formData,
        { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } }
      );
      const { extractedData } = response.data;
      if (extractedData) {
        setName(extractedData.name || '');
        setAmount(extractedData.amount || '');
        setDate(extractedData.date || '');
        setCategory(extractedData.category || '');
        alert('Expense details extracted successfully from the PDF!');
      } else {
        alert('PDF processed');
      }
    } catch (err) {
      console.error('Error processing PDF:', err.response || err);
      alert('Error processing PDF');
    }
  };

  return (
    <div className="expense-analysis-container">
      <Header />
      <div className="info-banner">
        Track, analyze, and manage your expenses easily. Switch between manual entry and PDF extraction!
      </div>
      <div className="expense-stat-cards">
        <div className="expense-stat-card">
          <span>₹{totalExpenses.toLocaleString()}</span>
          Total Spent
        </div>
        <div className="expense-stat-card">
          <span>{expenseCount}</span>
          Expenses
        </div>
        <div className="expense-stat-card">
          <span>{categoriesUsed}</span>
          Categories
        </div>
      </div>
      <div className="expense-main-content">
        <div className="expense-form-container">
          <form className="expense-form">
            <h2>{isManual ? 'Add Expense (Manual Entry)' : 'Add Expense (Upload PDF)'}</h2>
            <div className="option-bar">
              <button
                type="button"
                className={`toggle-btn${isManual ? ' active' : ''}`}
                onClick={() => setIsManual(true)}
              >
                Manual Entry
              </button>
              <button
                type="button"
                className={`toggle-btn${!isManual ? ' active' : ''}`}
                onClick={() => setIsManual(false)}
              >
                Upload PDF
              </button>
            </div>
            {isManual ? (
              <>
                <label htmlFor="name">Expense Name</label>
                <input
                  type="text"
                  id="name"
                  placeholder="e.g. Groceries"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <label htmlFor="amount">Amount</label>
                <input
                  type="number"
                  id="amount"
                  placeholder="Amount "
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
                <label htmlFor="date">Date</label>
                <input
                  type="date"
                  id="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
                <label htmlFor="category">Category</label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">Select a Category</option>
                  {categoriesList.map((cat, index) => (
                    <option key={index} value={cat}>{cat}</option>
                  ))}
                </select>
                <button type="submit" className="submit-btn" onClick={handleSubmitManual}>
                  Add Expense
                </button>
              </>
            ) : (
              <>
                <label htmlFor="file">Upload PDF</label>
                <input
                  type="file"
                  id="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                />
                {file && (
                  <div className="file-details">
                    <p>File: {file.name}</p>
                  </div>
                )}
                <button type="submit" className="submit-btn" onClick={handleSubmitUpload}>
                  Extract and Add Expense
                </button>
              </>
            )}
          </form>
        </div>
        <div className="expense-table-container">
          <div className="table-header-row">
            <h2>Recent Expenses</h2>
            <div className="category-filter">
              <label htmlFor="filter-category">Filter:</label>
              <select
                id="filter-category"
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value)}
              >
                <option value="">All Categories</option>
                {categoriesList.map((cat, i) => (
                  <option key={i} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
          <table className="expense-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Amount </th>
                <th>Date</th>
                <th>Category</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.map((exp, index) => (
                <tr key={index}>
                  <td>{exp.name}</td>
                  <td>{exp.amount}</td>
                  <td>{exp.date}</td>
                  <td>{exp.category}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ExpenseForm;
