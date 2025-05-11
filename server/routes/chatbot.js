require("dotenv").config();
const express = require("express");
const { OpenAI } = require("openai");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const app = express();
app.use(express.json());

app.post("/api/chat", async (req, res) => {
  const { userMessage } = req.body;

  console.log("Received message:", userMessage);  // Log the received message

  try {
    // Call OpenAI API
    const response = await openai.chat.completions.create({
      messages: [{ role: "user", content: userMessage }],
      model: "gpt-4", // Or use "gpt-3.5-turbo"
    });

    console.log("OpenAI Response:", response); // Log the full response from OpenAI

    const reply = response.choices[0].message.content;
    res.json({ reply });
  } catch (error) {
    console.error("OpenAI API error:", error.message); // Log any error from the API
    res.status(500).json({ error: "Something went wrong." });
  }
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
