const BACKEND_URL = "https://fragmentstothought.onrender.com/ask";

const chatbotToggler = document.querySelector(".chatbot-toggler");
const closeBtn = document.querySelector(".close-btn");
const chatbox = document.querySelector(".chatbox");
const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");

let userMessage = null;
const inputInitHeight = chatInput.scrollHeight;

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

// Generate response from RAG backend
const generateResponse = async (chatElement, question) => {
  const messageElement = chatElement.querySelector("p");

  try {
    const response = await fetch(BACKEND_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.answer || "Server error");
    }

    messageElement.textContent =
      data.answer || "I don’t have enough information to answer that.";

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

  // Bot thinking
  setTimeout(() => {
    const incomingChatLi = createChatLi("Thinking...", "incoming");
    chatbox.appendChild(incomingChatLi);
    chatbox.scrollTo(0, chatbox.scrollHeight);
    generateResponse(incomingChatLi, userMessage);
  }, 500);
};

// Auto-grow input
chatInput.addEventListener("input", () => {
  chatInput.style.height = `${inputInitHeight}px`;
  chatInput.style.height = `${chatInput.scrollHeight}px`;
});

// Send on Enter
chatInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    handleChat();
  }
});

// Send on click
sendChatBtn.addEventListener("click", handleChat);

// Toggle chat visibility
closeBtn.addEventListener("click", () =>
  document.body.classList.remove("show-chatbot")
);

chatbotToggler.addEventListener("click", () =>
  document.body.classList.toggle("show-chatbot")
);
