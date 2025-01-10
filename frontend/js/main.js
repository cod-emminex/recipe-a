// frontend/js/main.js
import { initializeApp } from "./api/config.js";
import { setupEventListeners } from "./utils/helpers.js";
import { initializeWebSocket } from "./utils/websocket.js";
import { setupTheme } from "./utils/theme.js";
import { setupAuth } from "./api/auth.js";

document.addEventListener("DOMContentLoaded", async () => {
  try {
    // Initialize the application
    await initializeApp();

    // Setup event listeners
    setupEventListeners();

    // Initialize WebSocket connection
    initializeWebSocket();

    // Setup theme
    setupTheme();

    // Setup authentication
    setupAuth();
  } catch (error) {
    console.error("Error initializing application:", error);
  }
});
