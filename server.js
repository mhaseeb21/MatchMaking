const http = require("http");
const app = require("./app");
const { Server } = require("socket.io");
require("dotenv").config();

console.log("working");

const PORT = process.env.PORT || 3000;

// Create HTTP server
const server = http.createServer(app);

// Setup Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Make io accessible globally
global.io = io;

// Load socket logic
require("./socket")(io);

// Start server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
