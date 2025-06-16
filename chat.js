const BACKEND_URL = "https://harshavardhan-one.vercel.app/generate";

const chatbotToggler = document.querySelector(".chatbot-toggler");
const closeBtn = document.querySelector(".close-btn");
const chatbox = document.querySelector(".chatbox");
const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");

let userMessage = null;
const inputInitHeight = chatInput.scrollHeight;

const history = [
  {
    role: "user",
    parts: [{ text: "You are a helpful assistant. Answer briefly and clearly." }]
  }
];

// Create message UI
const createChatLi = (message, className) => {
  const chatLi = document.createElement("li");
  chatLi.classList.add("chat", className);
  let chatContent =
    className === "outgoing"
      ? `<p></p>`
      : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
  chatLi.innerHTML = chatContent;
  chatLi.querySelector("p").textContent = message;
  return chatLi;
};

// Generate Gemini response via backend
const generateResponse = async (chatElement) => {
  const messageElement = chatElement.querySelector("p");

  const requestBody = {
    prompt: history.map((entry) => entry.parts[0].text).join("\n")
  };

  try {
    const response = await fetch(BACKEND_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody)
    });

    const data = await response.json();

    if (!response.ok || !data.candidates) throw new Error(data.error?.message || "API error");

    const reply = data.candidates[0].content.parts[0].text;
    messageElement.textContent = reply;

    history.push({
      role: "model",
      parts: [{ text: reply }]
    });
  } catch (error) {
    messageElement.classList.add("error");
    messageElement.textContent = "⚠️ " + error.message;
  } finally {
    chatbox.scrollTo(0, chatbox.scrollHeight);
  }
};

// Chat handling
const handleChat = () => {
  userMessage = chatInput.value.trim();
  if (!userMessage) return;

  // Reset input
  chatInput.value = "";
  chatInput.style.height = `${inputInitHeight}px`;

  // Display user message
  const outgoingLi = createChatLi(userMessage, "outgoing");
  chatbox.appendChild(outgoingLi);
  chatbox.scrollTo(0, chatbox.scrollHeight);

  // Add to history
  history.push({ role: "user", parts: [{ text: userMessage }] });

  // Show bot thinking
  setTimeout(() => {
    const incomingChatLi = createChatLi("Thinking...", "incoming");
    chatbox.appendChild(incomingChatLi);
    chatbox.scrollTo(0, chatbox.scrollHeight);
    generateResponse(incomingChatLi);
  }, 600);
};

// Auto-grow input
chatInput.addEventListener("input", () => {
  chatInput.style.height = `${inputInitHeight}px`;
  chatInput.style.height = `${chatInput.scrollHeight}px`;
});

// Send on Enter (desktop)
chatInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
    e.preventDefault();
    handleChat();
  }
});

// Send on click
sendChatBtn.addEventListener("click", handleChat);

// Toggle chat visibility
closeBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));
chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));
