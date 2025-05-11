import React, { useState } from "react";
import Header from '../Header';
import './Support.css';

const Support = () => {
  const [name, setName] = useState("");
  const [issue, setIssue] = useState("");
  const [feedback, setFeedback] = useState("");
  const [message, setMessage] = useState("");

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !issue || !feedback) {
      setMessage("Please fill in all fields.");
      return;
    }

    const feedbackData = { name, issue, feedback };

    fetch('http://localhost:5000/feedback/submit-feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(feedbackData)
    })
      .then(response => response.json())
      .then(data => {
        if (data.message) {
          setMessage(data.message);
        } else {
          setMessage(data.error || "Error submitting feedback.");
        }
      })
      .catch((err) => {
        setMessage('Error submitting feedback. Please try again later.');
        console.error('Error:', err);
      });

    setName("");
    setIssue("");
    setFeedback("");
  };

  return (
    <div className="support-bg">
      <Header />
      <div className="support-container">
        <div className="support-header">
          <h1>Need Help? We're Here to Assist!</h1>
          <p>If you have any questions or need support, feel free to reach out by filling out the form below.</p>
        </div>
        <div className="support-form-card">
          <h2>Contact Support</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Your Name:</label>
              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Your Issue:</label>
              <textarea
                placeholder="Describe your issue or query"
                rows="4"
                value={issue}
                onChange={(e) => setIssue(e.target.value)}
              ></textarea>
            </div>
            <div className="form-group">
              <label>Your Feedback:</label>
              <textarea
                placeholder="Additional comments or feedback"
                rows="4"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
              ></textarea>
            </div>
            <button type="submit" className="submit-btn">Submit</button>
          </form>
          {message && <p className="feedback-message">{message}</p>}
        </div>
      </div>
    </div>
  );
};

export default Support;
