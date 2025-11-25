// handlers/messageHandler.js - Message Handler
const logger = require('../utils/logger');

class MessageHandler {
  register(bot) {
    // Text messages (non-command)
    bot.on('text', async (ctx, next) => {
      // Skip if it's a command
      if (ctx.message.text.startsWith('/')) {
        return next();
      }
      
      // Handle regular text message
      logger.debug(`Text message from ${ctx.from.id}: ${ctx.message.text}`);
      
      // Add your custom text message handling here
      // Example: echo bot
      // await ctx.reply(ctx.message.text);
      
      return next();
    });
    
    // Photo messages
    bot.on('photo', async (ctx, next) => {
      logger.debug(`Photo received from ${ctx.from.id}`);
      
      // Handle photo
      // const photo = ctx.message.photo[ctx.message.photo.length - 1];
      // await ctx.reply('Photo received!');
      
      return next();
    });
    
    // Video messages
    bot.on('video', async (ctx, next) => {
      logger.debug(`Video received from ${ctx.from.id}`);
      
      // Handle video
      // await ctx.reply('Video received!');
      
      return next();
    });
    
    // Document messages
    bot.on('document', async (ctx, next) => {
      logger.debug(`Document received from ${ctx.from.id}`);
      
      // Handle document
      // const doc = ctx.message.document;
      // await ctx.reply(`Document received: ${doc.file_name}`);
      
      return next();
    });
    
    // Audio messages
    bot.on('audio', async (ctx, next) => {
      logger.debug(`Audio received from ${ctx.from.id}`);
      return next();
    });
    
    // Voice messages
    bot.on('voice', async (ctx, next) => {
      logger.debug(`Voice message received from ${ctx.from.id}`);
      return next();
    });
    
    // Sticker messages
    bot.on('sticker', async (ctx, next) => {
      logger.debug(`Sticker received from ${ctx.from.id}`);
      return next();
    });
    
    // Location messages
    bot.on('location', async (ctx, next) => {
      logger.debug(`Location received from ${ctx.from.id}`);
      
      // const { latitude, longitude } = ctx.message.location;
      // await ctx.reply(`Location: ${latitude}, ${longitude}`);
      
      return next();
    });
    
    // Contact messages
    bot.on('contact', async (ctx, next) => {
      logger.debug(`Contact received from ${ctx.from.id}`);
      return next();
    });
    
    // New chat members (welcome message)
    bot.on('new_chat_members', async (ctx) => {
      const newMembers = ctx.message.new_chat_members;
      
      for (const member of newMembers) {
        // Check if bot was added
        if (member.id === ctx.botInfo.id) {
          await ctx.reply(
            '👋 Hello! Thank you for adding me to this group!\n' +
            'Use /help to see available commands.'
          );
        } else {
          // Welcome new member
          await ctx.reply(
            `👋 Welcome ${member.first_name}!`
          );
        }
      }
    });
    
    // Left chat member (goodbye message)
    bot.on('left_chat_member', async (ctx) => {
      const member = ctx.message.left_chat_member;
      
      if (member.id !== ctx.botInfo.id) {
        await ctx.reply(
          `👋 Goodbye ${member.first_name}!`
        );
      }
    });
    
    logger.info('Message handlers registered');
  }
}

module.exports = new MessageHandler();