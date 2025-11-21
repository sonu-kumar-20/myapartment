require("dotenv").config(); // Must be the first line
const http = require("http");
const { Server } = require("socket.io");
const app = require("./app");
const connectDB = require("./config/database");
const setupSocket = require("./config/socket");

const dbUrl = process.env.MONGO_ATLASURL;

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  }
});

// Attach socket to express
app.set("socketio", io);

// Connect to DB
connectDB(dbUrl);

// Setup socket.io
setupSocket(io);

const PORT = process.env.PORT || 3000;

// IMPORTANT for Render → must bind to 0.0.0.0
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});







// require("dotenv").config(); // Must be the first line
// const http = require("http");
// const { Server } = require("socket.io");
// const app = require("./app");
// const connectDB = require("./config/database");
// const setupSocket = require("./config/socket");
// const dbUrl = process.env.MONGO_ATLASURL
// const server = http.createServer(app);
// const io = new Server(server);

// app.set("socketio", io);

// connectDB(dbUrl);         // Connect to MongoDB
// setupSocket(io);     // Setup Socket.io

// const PORT = process.env.PORT || 3000; // 3000 for local testing
// server.listen(PORT, () => {
// });
