// handlers/errorHandler.js - Error Handler
const logger = require('../utils/logger');

class ErrorHandler {
  async handle(error, ctx) {
    logger.error('Bot error occurred:', error);
    
    try {
      // Check error type and respond accordingly
      if (error.code === 403) {
        // Bot was blocked by user
        logger.warn(`Bot blocked by user ${ctx.from?.id}`);
        return;
      }
      
      if (error.code === 429) {
        // Too many requests
        logger.warn('Rate limit from Telegram API');
        if (ctx.reply) {
          await ctx.reply('⚠️ Too many requests. Please try again later.');
        }
        return;
      }
      
      if (error.code === 400) {
        // Bad request
        logger.error('Bad request:', error.description);
        if (ctx.reply) {
          await ctx.reply('❌ Invalid request. Please try again.');
        }
        return;
      }
      
      // Generic error response
      if (ctx && ctx.reply) {
        await ctx.reply(
          '❌ An error occurred while processing your request. ' +
          'Please try again later or contact support.'
        );
      }
      
    } catch (replyError) {
      logger.error('Error sending error message:', replyError);
    }
  }
}

module.exports = new ErrorHandler();