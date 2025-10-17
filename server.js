const WebSocket = require('ws');
const server = new WebSocket.Server({ port: 8080 });

let users = [];

server.on('connection', (ws) => {
  let username = `User${Math.floor(Math.random() * 1000)}`;
  users.push({ ws, username });

  // Notify all users about the new user
  broadcast({ type: 'join', username, users: users.map(u => u.username) });

  ws.on('message', (msg) => {
    broadcast({ type: 'message', username, text: msg });
  });

  ws.on('close', () => {
    users = users.filter(u => u.ws !== ws);
    broadcast({ type: 'leave', username, users: users.map(u => u.username) });
  });
});

function broadcast(data) {
  users.forEach(u => {
    u.ws.send(JSON.stringify(data));
  });
}

console.log("WebSocket server running on ws://localhost:8080");