
require("dotenv").config(); // Must be the first line
const http = require("http");
const { Server } = require("socket.io");
const app = require("./app");
const connectDB = require("./config/database");
const setupSocket = require("./config/socket");
const dbUrl = process.env.MONGO_ATLASURL
const server = http.createServer(app);
const io = new Server(server);

app.set("socketio", io);

connectDB(dbUrl);         // Connect to MongoDB
setupSocket(io);     // Setup Socket.io

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`🔊 Server listening on port ${PORT}`);
});
