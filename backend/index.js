const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const axios = require("axios");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Load context from aboutme.txt at startup
const aboutText = fs.readFileSync("aboutme.txt", "utf8");

// Groq API Key
const GROQ_API_KEY = process.env.GROQ_API_KEY;

// Handle /generate POST request
app.post("/generate", async (req, res) => {
  const prompt = req.body.prompt?.trim();

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  const fullPrompt = `
You are a helpful assistant for Jakku Harshavardhan. You should only answer based on the content below.
If the answer is not found, respond: "Sorry, as of now I don't have much info about him."

-------------------------
${aboutText}
-------------------------

Answer this question: "${prompt}"
`;

  try {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama3-70b-8192",
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: fullPrompt }
        ],
        temperature: 0.2
      },
      {
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const reply = response.data.choices[0].message.content;
    console.log("✅ Groq response:", reply);
    res.json({
      candidates: [
        {
          content: {
            parts: [{ text: reply }]
          }
        }
      ]
    });
  } catch (err) {
    console.error("❌ Error calling Groq:", err.response?.data || err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
