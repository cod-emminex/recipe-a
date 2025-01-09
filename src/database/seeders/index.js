// src/database/seeders/index.js

import { logger } from '../../utils/logger.js';
import { User } from '../../models/User.js';
import { Recipe } from '../../models/Recipe.js';
import { Category } from '../../models/Category.js';

class DatabaseSeeder {
  async seed() {
    try {
      if (process.env.NODE_ENV === 'production') {
        throw new Error('Seeding is not allowed in production');
      }

      await this.seedCategories();
      await this.seedUsers();
      await this.seedRecipes();

      logger.info('Database seeded successfully');
    } catch (error) {
      logger.error(`Seeding error: ${error.message}`);
      throw error;
    }
  }

  async clear() {
    try {
      await Promise.all([
        Category.deleteMany({}),
        User.deleteMany({}),
        Recipe.deleteMany({})
      ]);
      logger.info('Database cleared successfully');
    } catch (error) {
      logger.error(`Clear error: ${error.message}`);
      throw error;
    }
  }
}

export default new DatabaseSeeder();
