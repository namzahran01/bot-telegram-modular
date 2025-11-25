// cache/cache.js - In-Memory Cache Manager
const logger = require('../utils/logger');
const config = require('../config/bot.config');

class CacheManager {
  constructor() {
    this.cache = new Map();
    this.stats = {
      hits: 0,
      misses: 0,
      sets: 0,
      deletes: 0,
    };
    this.cleanupTimer = null;
  }
  
  // Initialize cache
  async init() {
    this.startCleanup();
    logger.success('Cache initialized');
  }
  
  // Set cache with TTL
  set(key, value, ttl = config.cache.defaultTTL) {
    const expiry = Date.now() + ttl;
    this.cache.set(key, {
      value,
      expiry,
    });
    this.stats.sets++;
    return true;
  }
  
  // Get cache value
  get(key) {
    const item = this.cache.get(key);
    
    if (!item) {
      this.stats.misses++;
      return null;
    }
    
    // Check if expired
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      this.stats.misses++;
      return null;
    }
    
    this.stats.hits++;
    return item.value;
  }
  
  // Check if key exists
  has(key) {
    const item = this.cache.get(key);
    if (!item) return false;
    
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return false;
    }
    
    return true;
  }
  
  // Delete cache key
  delete(key) {
    const result = this.cache.delete(key);
    if (result) this.stats.deletes++;
    return result;
  }
  
  // Clear all cache
  clear() {
    this.cache.clear();
    logger.info('Cache cleared');
  }
  
  // Get cache size
  size() {
    return this.cache.size;
  }
  
  // Get cache statistics
  getStats() {
    const hitRate = this.stats.hits + this.stats.misses > 0
      ? (this.stats.hits / (this.stats.hits + this.stats.misses) * 100).toFixed(2)
      : 0;
    
    return {
      ...this.stats,
      hitRate: `${hitRate}%`,
      size: this.cache.size,
    };
  }
  
  // Reset statistics
  resetStats() {
    this.stats = {
      hits: 0,
      misses: 0,
      sets: 0,
      deletes: 0,
    };
  }
  
  // Cleanup expired entries
  cleanup() {
    const now = Date.now();
    let cleaned = 0;
    
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiry) {
        this.cache.delete(key);
        cleaned++;
      }
    }
    
    if (cleaned > 0) {
      logger.info(`Cache cleanup: removed ${cleaned} expired entries`);
    }
  }
  
  // Start automatic cleanup
  startCleanup() {
    this.cleanupTimer = setInterval(() => {
      this.cleanup();
    }, config.cache.cleanupInterval);
  }
  
  // Stop automatic cleanup
  stopCleanup() {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = null;
    }
  }
  
  // User-specific cache helpers
  setUserCache(userId, key, value, ttl) {
    return this.set(`user:${userId}:${key}`, value, ttl);
  }
  
  getUserCache(userId, key) {
    return this.get(`user:${userId}:${key}`);
  }
  
  deleteUserCache(userId, key = null) {
    if (key) {
      return this.delete(`user:${userId}:${key}`);
    }
    
    // Delete all user cache
    let deleted = 0;
    const prefix = `user:${userId}:`;
    for (const key of this.cache.keys()) {
      if (key.startsWith(prefix)) {
        this.cache.delete(key);
        deleted++;
      }
    }
    return deleted;
  }
  
  // Session cache helpers
  setSession(userId, data, ttl = 3600000) {
    return this.set(`session:${userId}`, data, ttl);
  }
  
  getSession(userId) {
    return this.get(`session:${userId}`);
  }
  
  deleteSession(userId) {
    return this.delete(`session:${userId}`);
  }
  
  // Query cache helpers
  setQueryCache(query, result, ttl = 600000) {
    const key = `query:${JSON.stringify(query)}`;
    return this.set(key, result, ttl);
  }
  
  getQueryCache(query) {
    const key = `query:${JSON.stringify(query)}`;
    return this.get(key);
  }
}

module.exports = new CacheManager();