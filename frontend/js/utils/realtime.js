// Real-time state updates
// frontend/js/utils/realtime.js

import { ws } from "./websocket.js";
import { state } from "./state.js";
import { showNotification } from "./helpers.js";

class RealtimeManager {
  constructor() {
    this.setupWebSocketHandlers();
  }

  setupWebSocketHandlers() {
    // Recipe updates
    ws.on("recipe:created", (data) => {
      state.setState("recipes", (current) => [data, ...current]);
      if (this.shouldNotifyUser(data)) {
        showNotification("New recipe added: " + data.title, "info");
      }
    });

    ws.on("recipe:updated", (data) => {
      state.setState("recipes", (current) =>
        current.map((recipe) =>
          recipe._id === data._id ? { ...recipe, ...data } : recipe
        )
      );
      if (state.getState("currentRecipe")?._id === data._id) {
        state.setState("currentRecipe", data);
      }
    });

    ws.on("recipe:deleted", (id) => {
      state.setState("recipes", (current) =>
        current.filter((recipe) => recipe._id !== id)
      );
    });

    // Comments
    ws.on("comment:created", (data) => {
      const currentRecipe = state.getState("currentRecipe");
      if (currentRecipe && currentRecipe._id === data.recipeId) {
        state.setState("currentRecipe", (current) => ({
          ...current,
          comments: [...(current.comments || []), data],
        }));
      }
    });

    // Ratings
    ws.on("rating:updated", (data) => {
      state.setState("recipes", (current) =>
        current.map((recipe) =>
          recipe._id === data.recipeId
            ? { ...recipe, averageRating: data.averageRating }
            : recipe
        )
      );
    });

    // User notifications
    ws.on("notification", (data) => {
      state.setState("notifications", (current) => [data, ...current]);
      showNotification(data.message, data.type);
    });

    // Connection status
    ws.on("connect", () => {
      state.setState("ui", (current) => ({
        ...current,
        online: true,
      }));
    });

    ws.on("disconnect", () => {
      state.setState("ui", (current) => ({
        ...current,
        online: false,
      }));
      showNotification("Connection lost. Trying to reconnect...", "warning");
    });
  }

  shouldNotifyUser(data) {
    const currentUser = state.getState("user");
    // Notify if user is following the recipe author
    return currentUser?.following?.includes(data.author._id);
  }

  // Subscribe to real-time updates for a specific recipe
  subscribeToRecipe(recipeId) {
    ws.emit("subscribe:recipe", { recipeId });
  }

  // Unsubscribe from recipe updates
  unsubscribeFromRecipe(recipeId) {
    ws.emit("unsubscribe:recipe", { recipeId });
  }

  // Send real-time comment
  sendComment(recipeId, content) {
    ws.emit("comment:create", {
      recipeId,
      content,
    });
  }

  // Update recipe rating
  updateRating(recipeId, rating) {
    ws.emit("rating:update", {
      recipeId,
      rating,
    });
  }
}
