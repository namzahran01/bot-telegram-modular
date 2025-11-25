// handlers/callbackHandler.js - Callback Query Handler
const logger = require('../utils/logger');

class CallbackHandler {
  constructor() {
    this.callbacks = new Map();
  }
  
  // Register a callback handler
  add(pattern, handler) {
    this.callbacks.set(pattern, handler);
  }
  
  // Register all callbacks with bot
  register(bot) {
    bot.on('callback_query', async (ctx) => {
      try {
        const data = ctx.callbackQuery.data;
        
        // Try to match callback pattern
        let handled = false;
        
        for (const [pattern, handler] of this.callbacks) {
          if (typeof pattern === 'string') {
            if (data === pattern || data.startsWith(pattern + ':')) {
              await handler(ctx);
              handled = true;
              break;
            }
          } else if (pattern instanceof RegExp) {
            if (pattern.test(data)) {
              await handler(ctx);
              handled = true;
              break;
            }
          }
        }
        
        if (!handled) {
          // Default handler for unhandled callbacks
          await this.defaultHandler(ctx);
        }
        
        // Answer callback query to remove loading state
        await ctx.answerCbQuery();
        
      } catch (error) {
        logger.error('Callback query error:', error);
        await ctx.answerCbQuery('❌ An error occurred');
      }
    });
    
    // Register default callbacks
    this.registerDefaultCallbacks();
    
    logger.info('Callback handlers registered');
  }
  
  // Register common callback patterns
  registerDefaultCallbacks() {
    // Close button
    this.add('close', async (ctx) => {
      await ctx.deleteMessage();
    });
    
    // Back button (example)
    this.add('back', async (ctx) => {
      await ctx.editMessageText('Going back...');
    });
    
    // Pagination
    this.add(/^page:(\d+)$/, async (ctx) => {
      const match = ctx.callbackQuery.data.match(/^page:(\d+)$/);
      const page = parseInt(match[1]);
      
      await ctx.editMessageText(`Showing page ${page}`);
    });
  }
  
  // Default handler for unhandled callbacks
  async defaultHandler(ctx) {
    logger.warn(`Unhandled callback: ${ctx.callbackQuery.data}`);
    await ctx.answerCbQuery('⚠️ This action is not available');
  }
}

module.exports = new CallbackHandler();