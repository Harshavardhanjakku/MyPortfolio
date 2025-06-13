let chatOpen = false;
const history = [];

function toggleChat() {
  const chatWindow = document.getElementById("chat-window");
  chatOpen = !chatOpen;
  chatWindow.style.display = chatOpen ? "flex" : "none";
}

function addMessage(role, text) {
  const chatBox = document.getElementById("chat-box");
  const msgDiv = document.createElement("div");
  msgDiv.className = role;
  msgDiv.textContent = text;
  chatBox.appendChild(msgDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage() {
  const input = document.getElementById("user-input");
  const message = input.value.trim();
  if (!message) return;

  addMessage("user", message);
  history.push({ role: "user", content: message });
  input.value = "";

  // Call your backend API here
  const response = await fetch("http://localhost:3001/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, history }),
  });

  const data = await response.json();
  const reply = data.reply.trim();
  addMessage("bot", reply);
  history.push({ role: "assistant", content: reply });
}
