// middlewares/rateLimit.js - Rate Limiting Middleware
const cache = require('../cache/cache');
const config = require('../config/bot.config');
const logger = require('../utils/logger');

class RateLimiter {
  constructor() {
    this.limits = config.rateLimit;
  }
  
  // Check if user is rate limited
  isRateLimited(userId, type = 'global') {
    const key = `ratelimit:${userId}:${type}`;
    const data = cache.get(key);
    
    if (!data) return false;
    
    const limit = type === 'global' 
      ? this.limits.global 
      : this.limits.perCommand;
    
    return data.count >= limit.max;
  }
  
  // Increment rate limit counter
  increment(userId, type = 'global') {
    const key = `ratelimit:${userId}:${type}`;
    const limit = type === 'global' 
      ? this.limits.global 
      : this.limits.perCommand;
    
    let data = cache.get(key);
    
    if (!data) {
      data = {
        count: 1,
        resetAt: Date.now() + limit.window,
      };
    } else {
      data.count++;
    }
    
    cache.set(key, data, limit.window);
    return data;
  }
  
  // Get remaining requests
  getRemaining(userId, type = 'global') {
    const key = `ratelimit:${userId}:${type}`;
    const data = cache.get(key);
    
    if (!data) {
      const limit = type === 'global' 
        ? this.limits.global 
        : this.limits.perCommand;
      return limit.max;
    }
    
    const limit = type === 'global' 
      ? this.limits.global 
      : this.limits.perCommand;
    
    return Math.max(0, limit.max - data.count);
  }
  
  // Get reset time
  getResetTime(userId, type = 'global') {
    const key = `ratelimit:${userId}:${type}`;
    const data = cache.get(key);
    
    if (!data) return null;
    return data.resetAt;
  }
  
  // Reset rate limit for user
  reset(userId, type = null) {
    if (type) {
      cache.delete(`ratelimit:${userId}:${type}`);
    } else {
      // Reset all types
      cache.delete(`ratelimit:${userId}:global`);
      cache.delete(`ratelimit:${userId}:command`);
    }
  }
}

const rateLimiter = new RateLimiter();

// Middleware
const rateLimitMiddleware = async (ctx, next) => {
  try {
    const userId = ctx.from?.id;
    if (!userId) return next();
    
    // Skip rate limit for admins and VIPs
    if (ctx.isAdmin || ctx.isVIP) {
      return next();
    }
    
    // Check global rate limit
    if (rateLimiter.isRateLimited(userId, 'global')) {
      const resetTime = rateLimiter.getResetTime(userId, 'global');
      const seconds = Math.ceil((resetTime - Date.now()) / 1000);
      
      await ctx.reply(
        `⏰ Rate limit exceeded. Please wait ${seconds} seconds before trying again.`
      );
      
      logger.warn(`Rate limit exceeded for user ${userId}`);
      return;
    }
    
    // Check command-specific rate limit
    if (ctx.updateType === 'message' && ctx.message?.text?.startsWith('/')) {
      const command = ctx.message.text.split(' ')[0].substring(1);
      
      if (rateLimiter.isRateLimited(userId, `command:${command}`)) {
        const resetTime = rateLimiter.getResetTime(userId, `command:${command}`);
        const seconds = Math.ceil((resetTime - Date.now()) / 1000);
        
        await ctx.reply(
          `⏰ You're using this command too frequently. Please wait ${seconds} seconds.`
        );
        
        return;
      }
      
      rateLimiter.increment(userId, `command:${command}`);
    }
    
    // Increment global counter
    rateLimiter.increment(userId, 'global');
    
    return next();
  } catch (error) {
    logger.error('Rate limit middleware error:', error);
    return next();
  }
};

module.exports = rateLimitMiddleware;
module.exports.rateLimiter = rateLimiter;