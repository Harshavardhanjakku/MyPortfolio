// server.js
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { queryGroq } = require("./groq_chat");

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

app.post("/generate", async (req, res) => {
  const userPrompt = req.body.prompt?.trim();
  if (!userPrompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
    const answer = await queryGroq(userPrompt);
    res.json({ response: answer });
  } catch (error) {
    res.status(500).json({ error: "Failed to generate response" });
  }
});

app.listen(port, () => {
  console.log(`✅ Groq chatbot server is running at http://localhost:${port}`);
});
