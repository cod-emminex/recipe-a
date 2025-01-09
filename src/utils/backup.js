// src/utils/backup.js

import { exec } from "child_process";
import { promisify } from "util";
import path from "path";
import { logger } from "./logger.js";

const execAsync = promisify(exec);

class DatabaseBackup {
  constructor() {
    this.backupDir = path.join(process.cwd(), "backups");
  }

  async backup() {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const filename = `backup-${timestamp}.gz`;
      const filePath = path.join(this.backupDir, filename);

      await execAsync(
        `mongodump --uri="${process.env.MONGODB_URI}" --archive="${filePath}" --gzip`
      );

      logger.info(`Backup created successfully: ${filename}`);
      return filePath;
    } catch (error) {
      logger.error(`Backup error: ${error.message}`);
      throw error;
    }
  }

  async restore(filePath) {
    try {
      await execAsync(
        `mongorestore --uri="${process.env.MONGODB_URI}" --archive="${filePath}" --gzip`
      );
      logger.info("Database restored successfully");
    } catch (error) {
      logger.error(`Restore error: ${error.message}`);
      throw error;
    }
  }
}

export default new DatabaseBackup();
