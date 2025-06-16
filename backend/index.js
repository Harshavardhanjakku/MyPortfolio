const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Optional GET route for root URL
app.get("/", (req, res) => {
  res.send("🤖 Gemini Chatbot Backend is running!");
});

// POST route to handle chatbot prompt
app.post("/generate", async (req, res) => {
  const { prompt } = req.body;

  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

  try {
    const response = await axios.post(API_URL, {
      contents: [{ parts: [{ text: prompt }] }]
    });

    res.json(response.data);
  } catch (error) {
    console.error("Error from Gemini API:", error.message);
    res.status(500).json({
      error: "Failed to generate response from Gemini API."
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Gemini backend running at http://localhost:${PORT}`);
});

