// index.js - Entry Point
require('dotenv').config();
const { Telegraf } = require('telegraf');
const config = require('./config/bot.config');
const logger = require('./utils/logger');
const db = require('./database/db');
const cache = require('./cache/cache');

// Middlewares
const authMiddleware = require('./middlewares/auth');
const rateLimitMiddleware = require('./middlewares/rateLimit');
const loggerMiddleware = require('./middlewares/logger');
const antiSpamMiddleware = require('./middlewares/antiSpam');

// Handlers
const commandHandler = require('./handlers/commandHandler');
const messageHandler = require('./handlers/messageHandler');
const callbackHandler = require('./handlers/callbackHandler');
const errorHandler = require('./handlers/errorHandler');

// Initialize bot
const bot = new Telegraf(process.env.BOT_TOKEN);

// Apply global middlewares
bot.use(loggerMiddleware);
bot.use(authMiddleware);
bot.use(rateLimitMiddleware);
bot.use(antiSpamMiddleware);

// Register handlers
commandHandler.register(bot);
messageHandler.register(bot);
callbackHandler.register(bot);

// Error handler
bot.catch(errorHandler.handle);

// Graceful shutdown
process.once('SIGINT', () => {
  logger.info('SIGINT received, stopping bot...');
  db.save();
  bot.stop('SIGINT');
});

process.once('SIGTERM', () => {
  logger.info('SIGTERM received, stopping bot...');
  db.save();
  bot.stop('SIGTERM');
});

// Start bot
const startBot = async () => {
  try {
    await db.init();
    await cache.init();
    
    logger.info(`Starting bot in ${config.mode} mode...`);
    
    if (config.mode === 'production') {
      // Webhook mode for production
      await bot.launch({
        webhook: {
          domain: config.webhook.domain,
          port: config.webhook.port
        }
      });
    } else {
      // Polling mode for development
      await bot.launch();
    }
    
    logger.success(`Bot @${bot.botInfo.username} is running!`);
  } catch (error) {
    logger.error('Failed to start bot:', error);
    process.exit(1);
  }
};

startBot();