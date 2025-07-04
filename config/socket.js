const socketHandler = (io) => {
  const onlineUsers = new Map();

  io.on("connection", (socket) => {
   

    socket.on("joinRoom", ({ roomId, userId }) => {
      socket.join(roomId);
      socket.userId = userId;
      socket.roomsJoined = socket.roomsJoined || new Set();
      socket.roomsJoined.add(roomId);

      if (!onlineUsers.has(userId)) onlineUsers.set(userId, new Set());
      onlineUsers.get(userId).add(socket.id);

      io.to(roomId).emit("userOnline", userId);
    });

    socket.on("chatMessage", (data) => {
      io.to(data.roomId).emit("message", data);
    });

    socket.on("typing", ({ roomId, userId }) => {
      socket.to(roomId).emit("typing", userId);
    });

    socket.on("stopTyping", ({ roomId, userId }) => {
      socket.to(roomId).emit("stopTyping", userId);
    });

    socket.on("checkOnlineStatus", (userId) => {
      socket.emit(onlineUsers.has(userId) ? "userOnline" : "userOffline", userId);
    });

    socket.on("disconnect", () => {
      const userId = socket.userId;
      if (userId && onlineUsers.has(userId)) {
        onlineUsers.get(userId).delete(socket.id);
        if (onlineUsers.get(userId).size === 0) {
          onlineUsers.delete(userId);
          if (socket.roomsJoined) {
            socket.roomsJoined.forEach(roomId => {
              io.to(roomId).emit("userOffline", userId);
            });
          }
        }
      }
    });
  });
};

module.exports = socketHandler;
