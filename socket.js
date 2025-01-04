let io;

function initSocket(server) {
  io = require("socket.io")(server, {
    cors: {
      origin: "*", // Adjust based on your needs
    },
  });

  io.on("connection", (socket) => {
    console.log(`New client connected: ${socket.id}`);

    // Listen to events
    socket.on("exampleEvent", (data) => {
      console.log(`Received data: ${data}`);
    });

    // Handle disconnect
    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });
}

function getSocketInstance() {
  if (!io) {
    throw new Error("Socket.IO not initialized!");
  }
  return io;
}

module.exports = { initSocket, getSocketInstance };
