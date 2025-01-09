// src/websocket/handlers/collaborationHandler.js

export const collaborationHandler = (io) => {
  const collaborationNamespace = io.of("/collaboration");

  collaborationNamespace.on("connection", (socket) => {
    const { user } = socket;

    socket.on("join-session", (recipeId) => {
      socket.join(`collab:${recipeId}`);

      // Track active users in the collaboration session
      collaborationNamespace.to(`collab:${recipeId}`).emit("user-joined", {
        userId: user._id,
        username: user.username,
        timestamp: new Date(),
      });
    });

    socket.on("cursor-move", (data) => {
      socket.to(`collab:${data.recipeId}`).emit("cursor-update", {
        userId: user._id,
        username: user.username,
        position: data.position,
      });
    });

    socket.on("content-change", (data) => {
      socket.to(`collab:${data.recipeId}`).emit("content-update", {
        userId: user._id,
        username: user.username,
        changes: data.changes,
        timestamp: new Date(),
      });
    });

    socket.on("disconnect", () => {
      // Notify others about user leaving
      socket.rooms.forEach((room) => {
        if (room.startsWith("collab:")) {
          const recipeId = room.split(":")[1];
          socket.to(room).emit("user-left", {
            userId: user._id,
            username: user.username,
          });
        }
      });
    });
  });
};
