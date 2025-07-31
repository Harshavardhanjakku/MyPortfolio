// groq_chat.js
const fs = require("fs");
const axios = require("axios");
require("dotenv").config();

const GROQ_API_KEY = process.env.GROQ_API_KEY;

// Load context from aboutme.txt
const aboutText = fs.readFileSync("aboutme.txt", "utf-8");

// Function to query Groq API
async function queryGroq(prompt) {
  const instruction = `
You are a helpful assistant for Jakku Harshavardhan ,you should only answer that answers only based on the content provided below.
If the answer is not found, respond: "I dont have information updated "

-------------------------
${aboutText}
-------------------------

Answer this question: "${prompt}"

If the answer is not found in the content above, reply:
"Sorry, as of now i dont have much info about him "
`;

  try {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama3-70b-8192", // or "mixtral-8x7b-32768"
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: instruction }
        ],
        temperature: 0.2
      },
      {
        headers: {
          "Authorization": `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    return response.data.choices[0].message.content;
  } catch (err) {
    console.error("Error calling Groq:", err.response?.data || err.message);
    throw err;
  }
}

module.exports = { queryGroq };
