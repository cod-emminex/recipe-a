// src/websocket/handlers/recipeHandler.js

export const recipeHandler = (io) => {
  const recipeNamespace = io.of("/recipes");

  recipeNamespace.on("connection", (socket) => {
    const { user } = socket;

    socket.on("join-recipe", async (recipeId) => {
      socket.join(`recipe:${recipeId}`);

      // Notify others about user joining
      socket.to(`recipe:${recipeId}`).emit("user-joined", {
        userId: user._id,
        username: user.username,
      });
    });

    socket.on("recipe-update", async (data) => {
      const { recipeId, updates } = data;

      // Broadcast changes to all users in the recipe room
      socket.to(`recipe:${recipeId}`).emit("recipe-updated", {
        ...updates,
        updatedBy: user.username,
      });
    });

    socket.on("start-cooking", async (recipeId) => {
      socket.join(`cooking:${recipeId}`);
      socket.to(`recipe:${recipeId}`).emit("cooking-started", {
        userId: user._id,
        username: user.username,
      });
    });
  });
};
