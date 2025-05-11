import React, { useState } from 'react';
import axios from 'axios';
import './Chatbot.css'; // Make sure you have proper CSS styling

const Chatbot = () => {
  const [userInput, setUserInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  if (userInput.trim() === '') return;

  const newChatHistory = [...chatHistory, { user: true, message: userInput }];
  setChatHistory(newChatHistory);
  setUserInput('');
  setIsLoading(true);

  console.log("Sending user message:", userInput);  // Log the message being sent

  try {
    // Send request to the backend
     const response = await axios.post('http://localhost:5000/api/chat', {
      userMessage: userInput,
    });

    console.log("Received response from backend:", response.data);  // Log the full response

    setChatHistory([
      ...newChatHistory,
      { user: false, message: response.data.reply },
    ]);
  } catch (error) {
    console.error("Error fetching reply from bot:", error);  // Log any errors
    setChatHistory([
      ...newChatHistory,
      { user: false, message: "Error: Could not fetch reply from bot." },
    ]);
  }
  setIsLoading(false);
};

  return (
    <div className="chatbot-container">
      <div className="chat-history">
        {chatHistory.map((chat, index) => (
          <div key={index} className={chat.user ? 'user-message' : 'bot-message'}>
            {chat.message}
          </div>
        ))}
      </div>

      {isLoading && <div className="loading">Chatbot is typing...</div>}

      <form onSubmit={handleSubmit} className="chat-input-form">
        <input
          type="text"
          value={userInput}
          onChange={handleInputChange}
          placeholder="Ask a question..."
          className="chat-input"
        />
        <button type="submit" className="send-btn">Send</button>
      </form>
    </div>
  );
};

export default Chatbot;
