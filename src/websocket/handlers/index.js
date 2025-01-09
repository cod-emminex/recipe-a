// src/websocket/handlers/index.js

import { recipeHandler } from "./recipeHandler.js";
import { commentHandler } from "./commentHandler.js";
import { collaborationHandler } from "./collaborationHandler.js";
import { notificationHandler } from "./notificationHandler.js";

export const setupEventHandlers = (io) => {
  recipeHandler(io);
  commentHandler(io);
  collaborationHandler(io);
  notificationHandler(io);
};
