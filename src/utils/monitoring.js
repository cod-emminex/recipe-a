// src/utils/monitoring.js

import mongoose from "mongoose";
import { logger } from "./logger.js";

class DatabaseMonitor {
  async checkHealth() {
    try {
      const status = await mongoose.connection.db.admin().ping();
      return {
        status: status.ok === 1 ? "healthy" : "unhealthy",
        latency: await this.measureLatency(),
        connections: mongoose.connection.pool.size,
        activeConnections: mongoose.connection.pool.available,
      };
    } catch (error) {
      logger.error(`Health check error: ${error.message}`);
      return { status: "unhealthy", error: error.message };
    }
  }

  async measureLatency() {
    const start = Date.now();
    await mongoose.connection.db.admin().ping();
    return Date.now() - start;
  }
}

export default new DatabaseMonitor();
