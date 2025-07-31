const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI("AIzaSyAg1yMFnY4B8QmLoyM8OMsTnTZK0VOx0xk"); 

async function test() {
  const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-flash" });

  for (let attempt = 1; attempt <= 5; attempt++) {
    try {
      const result = await model.generateContent("Hello Gemini! How are you?");
      console.log("✅ Gemini response:", result.response.text());
      return; // stop if successful
    } catch (err) {
      if (err.status === 503 && attempt < 5) {
        console.log(`⚠️ Gemini overloaded. Retrying in ${attempt * 5} seconds...`);
        await new Promise(r => setTimeout(r, attempt * 5000)); // wait & retry
      } else {
        console.error("❌ Final Error:", err);
        return;
      }
    }
  }
}

test();
