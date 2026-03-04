let io;
const userSockets = new Map();

module.exports = {
  init: (httpServer) => {
    io = require("socket.io")(httpServer, {
      cors: {
        origin: "*", // Adjust as needed for production
        methods: ["GET", "POST"]
      }
    });

    io.on("connection", (socket) => {
      console.log("Client connected:", socket.id);

      socket.on("join", (userId) => {
        if (userId) {
          userSockets.set(userId, socket.id);
          socket.join(userId); // Join a room specifically for this user
          console.log(`User ${userId} joined their notification room`);
        }
      });

      socket.on("disconnect", () => {
        // Find and remove the user from userSockets
        for (const [userId, socketId] of userSockets.entries()) {
          if (socketId === socket.id) {
            userSockets.delete(userId);
            break;
          }
        }
        console.log("Client disconnected");
      });
    });

    return io;
  },
  getIO: () => {
    if (!io) {
      throw new Error("Socket.io not initialized!");
    }
    return io;
  },
  sendNotification: (recipientId, notification) => {
    if (io) {
      io.to(recipientId.toString()).emit("newNotification", notification);
    }
  }
};
