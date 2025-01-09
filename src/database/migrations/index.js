// src/database/migrations/index.js

import { Umzug, SequelizeStorage } from "umzug";
import mongoose from "mongoose";
import { logger } from "../../utils/logger.js";

class DatabaseMigration {
  constructor() {
    this.umzug = new Umzug({
      migrations: {
        glob: "src/database/migrations/*.js",
      },
      context: mongoose.connection,
      storage: new SequelizeStorage({
        model: mongoose.model("Migration", {
          name: String,
          executedAt: Date,
        }),
      }),
      logger: console,
    });
  }

  async migrate() {
    try {
      await this.umzug.up();
      logger.info("Migrations completed successfully");
    } catch (error) {
      logger.error(`Migration error: ${error.message}`);
      throw error;
    }
  }

  async rollback() {
    try {
      await this.umzug.down();
      logger.info("Rollback completed successfully");
    } catch (error) {
      logger.error(`Rollback error: ${error.message}`);
      throw error;
    }
  }
}

export default new DatabaseMigration();
