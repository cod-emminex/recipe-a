// client/src/services/cache.js
class CacheService {
  constructor() {
    this.cache = new Map();
    this.timeouts = new Map();
  }

  set(key, value, ttl = 5 * 60 * 1000) {
    // Default TTL: 5 minutes
    this.cache.set(key, {
      value,
      timestamp: Date.now(),
    });

    // Clear previous timeout if exists
    if (this.timeouts.has(key)) {
      clearTimeout(this.timeouts.get(key));
    }

    // Set new timeout
    const timeout = setTimeout(() => {
      this.delete(key);
    }, ttl);

    this.timeouts.set(key, timeout);
  }

  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;
    return item.value;
  }

  delete(key) {
    this.cache.delete(key);
    if (this.timeouts.has(key)) {
      clearTimeout(this.timeouts.get(key));
      this.timeouts.delete(key);
    }
  }

  clear() {
    this.cache.clear();
    this.timeouts.forEach((timeout) => clearTimeout(timeout));
    this.timeouts.clear();
  }

  has(key) {
    return this.cache.has(key);
  }

  // Get all cached items with their timestamps
  getDebugInfo() {
    const info = {};
    this.cache.forEach((item, key) => {
      info[key] = {
        age: Date.now() - item.timestamp,
        value: item.value,
      };
    });
    return info;
  }
}

export default new CacheService();
