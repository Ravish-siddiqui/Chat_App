const express = require("express");
const app = express();
const { Server } = require("socket.io");
const cors = require("cors");
const http = require("http");

app.use(
  cors({
    origin: "*", // Allow all origins for now, update later with your frontend URL
    methods: ["GET", "POST"],
  })
);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("send-message", (message) => {
    console.log(message);
    socket.broadcast.emit("receive-message", message);
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// Use Render's assigned PORT or default to 5000
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Root route to check if the server is working
app.get("/", (req, res) => {
  res.send("Server is running!");
});
