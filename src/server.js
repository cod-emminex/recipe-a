// src/server.js

import database from "./config/database.js";
import migration from "./database/migrations/index.js";
import seeder from "./database/seeders/index.js";
import backup from "./utils/backup.js";
import monitor from "./utils/monitoring.js";

async function startServer() {
  try {
    // Connect to database
    await database.connect();

    // Run migrations
    await migration.migrate();

    // Seed database in development
    if (process.env.NODE_ENV === "development") {
      await seeder.seed();
    }

    // Schedule daily backup
    setInterval(
      async () => {
        await backup.backup();
      },
      24 * 60 * 60 * 1000
    );

    // Monitor database health
    setInterval(
      async () => {
        const health = await monitor.checkHealth();
        if (health.status === "unhealthy") {
          logger.error("Database health check failed:", health);
        }
      },
      5 * 60 * 1000
    );
  } catch (error) {
    logger.error(`Server startup error: ${error.message}`);
    process.exit(1);
  }
}

startServer();
