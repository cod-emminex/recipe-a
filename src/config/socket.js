// src/config/socket.js

import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

export const setupWebSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  // Authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        throw new Error("Authentication error");
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);

      if (!user) {
        throw new Error("User not found");
      }

      socket.user = user;
      next();
    } catch (error) {
      next(new Error("Authentication error"));
    }
  });

  // Namespace handlers
  const recipeNamespace = io.of("/recipes");
  const commentsNamespace = io.of("/comments");
  const collaborationNamespace = io.of("/collaboration");

  // Recipe namespace
  recipeNamespace.on("connection", (socket) => {
    console.log(`User connected to recipes: ${socket.user.username}`);

    socket.on("join-recipe", (recipeId) => {
      socket.join(`recipe:${recipeId}`);
    });

    socket.on("recipe-updated", (data) => {
      socket.to(`recipe:${data.recipeId}`).emit("recipe-update", data);
    });
  });

  // Comments namespace
  commentsNamespace.on("connection", (socket) => {
    console.log(`User connected to comments: ${socket.user.username}`);

    socket.on("join-discussion", (recipeId) => {
      socket.join(`comments:${recipeId}`);
    });

    socket.on("new-comment", (data) => {
      socket.to(`comments:${data.recipeId}`).emit("comment-added", data);
    });
  });

  // Collaboration namespace
  collaborationNamespace.on("connection", (socket) => {
    console.log(`User connected to collaboration: ${socket.user.username}`);

    socket.on("join-session", (recipeId) => {
      socket.join(`collab:${recipeId}`);
    });

    socket.on("cursor-move", (data) => {
      socket.to(`collab:${data.recipeId}`).emit("cursor-update", {
        userId: socket.user._id,
        username: socket.user.username,
        ...data,
      });
    });

    socket.on("content-change", (data) => {
      socket.to(`collab:${data.recipeId}`).emit("content-update", data);
    });
  });

  return io;
};
