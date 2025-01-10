// src/server.js

import express from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import morgan from "morgan";
import { rateLimit } from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import hpp from "hpp";
import cookieParser from "cookie-parser";
import { config } from "dotenv";
import { createServer } from "http";
import Database from "./config/database.js";
import { setupWebSocket } from "./config/socket.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { notFound } from "./middleware/notFound.js";
import { logger } from "./utils/logger.js";
import routes from "./routes/index.js";

// Load environment variables
config();

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3000;
    this.httpServer = createServer(this.app);
    this.io = null;

    // Initialize middleware
    this.initializeMiddleware();
    // Initialize routes
    this.initializeRoutes();
    // Initialize error handling
    this.initializeErrorHandling();
  }

  initializeMiddleware() {
    // Security middleware
    this.app.use(
      helmet({
        contentSecurityPolicy:
          process.env.NODE_ENV === "production" ? undefined : false,
      })
    );

    this.app.use(
      cors({
        origin: process.env.FRONTEND_URL,
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
        allowedHeaders: ["Content-Type", "Authorization"],
      })
    );

    // Rate limiting
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // Limit each IP to 100 requests per windowMs
      message:
        "Too many requests from this IP, please try again after 15 minutes",
    });
    this.app.use("/api", limiter);

    // Body parser
    this.app.use(express.json({ limit: "10kb" }));
    this.app.use(express.urlencoded({ extended: true, limit: "10kb" }));

    // Cookie parser
    this.app.use(cookieParser());

    // Data sanitization against NoSQL query injection
    this.app.use(mongoSanitize());

    // Data sanitization against XSS
    this.app.use(xss());

    // Prevent parameter pollution
    this.app.use(
      hpp({
        whitelist: [
          "duration",
          "ratingsQuantity",
          "ratingsAverage",
          "difficulty",
          "price",
        ],
      })
    );

    // Compression
    this.app.use(compression());

    // Logging
    if (process.env.NODE_ENV === "development") {
      this.app.use(morgan("dev"));
    } else {
      this.app.use(
        morgan("combined", {
          stream: { write: (message) => logger.info(message.trim()) },
        })
      );
    }

    // Add request time to req object
    this.app.use((req, res, next) => {
      req.requestTime = new Date().toISOString();
      next();
    });
  }

  initializeRoutes() {
    // Health check route
    this.app.get("/health", (req, res) => {
      res.status(200).json({
        status: "success",
        message: "Server is healthy",
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
      });
    });

    // API routes
    this.app.use("/api/v1", routes);

    // Handle undefined routes
    this.app.use(notFound);
  }

  initializeErrorHandling() {
    this.app.use(errorHandler);

    // Handle uncaught exceptions
    process.on("uncaughtException", (error) => {
      logger.error("UNCAUGHT EXCEPTION! 💥 Shutting down...");
      logger.error(error.name, error.message);
      process.exit(1);
    });

    // Handle unhandled rejections
    process.on("unhandledRejection", (error) => {
      logger.error("UNHANDLED REJECTION! 💥 Shutting down...");
      logger.error(error.name, error.message);
      this.httpServer.close(() => {
        process.exit(1);
      });
    });

    // Handle SIGTERM
    process.on("SIGTERM", () => {
      logger.info("👋 SIGTERM RECEIVED. Shutting down gracefully");
      this.httpServer.close(() => {
        logger.info("💥 Process terminated!");
      });
    });
  }

  async startDatabase() {
    try {
      await Database.connect();
    } catch (error) {
      logger.error("Database connection error:", error);
      process.exit(1);
    }
  }

  initializeWebSocket() {
    this.io = setupWebSocket(this.httpServer);
  }

  async start() {
    try {
      // Connect to database
      await this.startDatabase();

      // Initialize WebSocket
      this.initializeWebSocket();

      // Start server
      this.httpServer.listen(this.port, () => {
        logger.info(`
        ################################################
        🛡️  Server listening on port: ${this.port} 🛡️
        ################################################
        Environment: ${process.env.NODE_ENV}
        Database: Connected
        WebSocket: Initialized
        Current Time: ${new Date().toISOString()}
        `);
      });
    } catch (error) {
      logger.error("Server startup error:", error);
      process.exit(1);
    }
  }
}

// Create and start server instance
const server = new Server();
server.start().catch((error) => {
  logger.error("Failed to start server:", error);
  process.exit(1);
});

export default server;
