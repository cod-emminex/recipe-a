// src/config/database.js

import mongoose from 'mongoose';
import { logger } from '../utils/logger.js';

class Database {
  constructor() {
    this.mongoURI = process.env.NODE_ENV === 'test' 
      ? process.env.MONGODB_TEST_URI 
      : process.env.MONGODB_URI;
  }

  async connect() {
    try {
      await mongoose.connect(this.mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        autoIndex: true,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });

      logger.info(`MongoDB Connected: ${mongoose.connection.host}`);
      this.setupEventListeners();
    } catch (error) {
      logger.error(`Database connection error: ${error.message}`);
      process.exit(1);
    }
  }

  setupEventListeners() {
    mongoose.connection.on('error', (error) => {
      logger.error(`MongoDB error: ${error.message}`);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected. Attempting to reconnect...');
    });

    process.on('SIGINT', this.gracefulShutdown.bind(this));
  }

  async gracefulShutdown() {
    try {
      await mongoose.connection.close();
      logger.info('MongoDB connection closed through app termination');
      process.exit(0);
    } catch (error) {
      logger.error(`Error during database shutdown: ${error.message}`);
      process.exit(1);
    }
  }
}

export default new Database();
