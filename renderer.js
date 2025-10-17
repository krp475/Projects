const root = document.getElementById("root");

let username = "";
let users = [];
let messages = [];

function render() {
  root.innerHTML = `
    <div class="win95-window">
      <div class="win95-titlebar">
        <div class="win95-title">CHAT - #GENERAL</div>
        <div class="win95-window-controls">
          <button class="win95-btn win95-btn-min"></button>
          <button class="win95-btn win95-btn-max"></button>
          <button class="win95-btn win95-btn-close"></button>
        </div>
      </div>
      <div class="win95-menubar">
        <span>File</span>
        <span>Edit</span>
        <span>View</span>
        <span>Help</span>
      </div>
      <div class="win95-main">
        <div class="win95-sidebar">
          <div class="win95-users-title">Users (${users.length})</div>
          <div class="win95-users-list">
            ${users.map(u => `<div class="win95-user"><span class="win95-user-dot"></span> ${u}</div>`).join("")}
          </div>
        </div>
        <div class="win95-chat-area">
          <div class="win95-messages" id="messages">
            ${messages.map(msg => {
              if (msg.type === "join") {
                return `<div class="win95-system-message">${msg.username} has joined the chat</div>`;
              } else if (msg.type === "leave") {
                return `<div class="win95-system-message">${msg.username} has left the chat</div>`;
              } else {
                return `<div class="win95-chat-message"><b>${msg.username}</b>: ${msg.text}</div>`;
              }
            }).join("")}
          </div>
          <div class="win95-chat-inputbar">
            <input class="win95-chat-input" id="chatinput" placeholder="Type a message..." />
            <button class="win95-chat-send" id="sendbtn">Send</button>
          </div>
          <div class="win95-statusbar">
            <span>Connected</span>
            <span class="win95-statusbar-right">${users.length} online</span>
            <span class="win95-statusbar-time">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
          </div>
        </div>
      </div>
    </div>
  `;

  document.getElementById("chatinput").addEventListener("keydown", e => {
    if (e.key === "Enter") sendMsg();
  });
  document.getElementById("sendbtn").onclick = sendMsg;
}

function sendMsg() {
  const input = document.getElementById("chatinput");
  if (input.value.trim()) {
    ws.send(input.value.trim());
    input.value = "";
  }
}

const ws = new WebSocket("ws://localhost:8080");

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  if (data.type === "join" || data.type === "leave") {
    users = data.users;
    messages.push(data);
    if (!username && data.type === "join") {
      username = data.username;
    }
  } else if (data.type === "message") {
    messages.push(data);
  }
  render();
};

ws.onopen = () => {
  render();
};

ws.onclose = () => {
  alert("Connection closed!");
};