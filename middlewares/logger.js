// middlewares/logger.js - Logging Middleware
const logger = require('../utils/logger');
const db = require('../database/db');

const loggerMiddleware = async (ctx, next) => {
  const start = Date.now();
  const from = ctx.from;
  const chat = ctx.chat;
  
  try {
    // Log incoming update
    if (ctx.message) {
      const messageType = ctx.message.text ? 'text' : Object.keys(ctx.message)[1];
      logger.info(
        `Message from @${from?.username || from?.id} ` +
        `in ${chat.type} (${chat.id}): ${messageType}`
      );
      
      // Increment message counter
      if (from) {
        db.updateUser(from.id, {
          messageCount: (ctx.user?.messageCount || 0) + 1,
        });
      }
      db.incrementStat('totalMessages');
    }
    
    if (ctx.callbackQuery) {
      logger.info(
        `Callback from @${from?.username || from?.id}: ` +
        `${ctx.callbackQuery.data}`
      );
    }
    
    await next();
    
    // Log response time
    const duration = Date.now() - start;
    logger.debug(`Request processed in ${duration}ms`);
    
  } catch (error) {
    const duration = Date.now() - start;
    logger.error(
      `Error processing update (${duration}ms):`,
      error
    );
    throw error;
  }
};

module.exports = loggerMiddleware;