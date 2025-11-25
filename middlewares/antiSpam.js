// middlewares/antiSpam.js - Anti-Spam Middleware
const cache = require('../cache/cache');
const config = require('../config/bot.config');
const logger = require('../utils/logger');
const db = require('../database/db');

const antiSpamMiddleware = async (ctx, next) => {
  try {
    if (!config.antiSpam.enabled) return next();
    
    const userId = ctx.from?.id;
    if (!userId) return next();
    
    // Skip for admins and VIPs
    if (ctx.isAdmin || ctx.isVIP) return next();
    
    const key = `antispam:${userId}`;
    const messages = cache.get(key) || [];
    const now = Date.now();
    
    // Filter messages within window
    const recentMessages = messages.filter(
      timestamp => now - timestamp < config.antiSpam.messageWindow
    );
    
    // Check if spamming
    if (recentMessages.length >= config.antiSpam.maxMessages) {
      // Check if already banned temporarily
      const banKey = `antispam:banned:${userId}`;
      if (cache.has(banKey)) {
        return; // Silently ignore
      }
      
      // Temporary ban
      cache.set(banKey, true, config.antiSpam.banDuration);
      
      const minutes = Math.ceil(config.antiSpam.banDuration / 60000);
      await ctx.reply(
        `🚫 Spam detected! You have been temporarily restricted for ${minutes} minutes.`
      );
      
      logger.warn(`Anti-spam triggered for user ${userId}`);
      return;
    }
    
    // Add current message timestamp
    recentMessages.push(now);
    cache.set(key, recentMessages, config.antiSpam.messageWindow);
    
    return next();
  } catch (error) {
    logger.error('Anti-spam middleware error:', error);
    return next();
  }
};

module.exports = antiSpamMiddleware;