const express = require("express");
const app = express();

const { Server } = require("socket.io");
// Server Setup: By importing { Server } from socket.io

const cors = require("cors");

app.use(cors());
//For example:
// Your frontend (React) might be running on http://localhost:3000.
// Your backend (Node.js + Express) might be running on http://localhost:5000.
// Since these are different origins, the browser would block API calls
// from the frontend to the backend unless CORS is configured

const http = require("http");
// require("http"): Imports Node.js's
//  built-in HTTP module, which is used to create the server.

const server = http.createServer(app);

// http.createServer(app): Wraps your Express app (app) in an HTTP server,
// allowing it to handle low-level HTTP requests and upgrades (e.g., WebSocket connections).

const io = new Server(server, {
  // This initializes a Socket.IO server on top of the HTTP server (server).
  // It allows your backend to listen for and emit real-time events to connected clients.
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
  //   origin: Specifies that only requests from http://localhost:5173 (your frontend's URL) are allowed.
  // methods: Limits allowed HTTP methods (like GET and POST).
});

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("send-message", (message) => {
    console.log(message);
    // Broadcast the message to other users
    socket.broadcast.emit("receive-message", message);
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
