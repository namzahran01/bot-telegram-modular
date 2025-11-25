// middlewares/auth.js - Authentication & Authorization Middleware
const db = require('../database/db');
const config = require('../config/bot.config');
const logger = require('../utils/logger');

// Auto-register user/group on first interaction
const authMiddleware = async (ctx, next) => {
  try {
    const from = ctx.from;
    const chat = ctx.chat;
    
    if (!from) return next();
    
    // Handle user
    let user = db.getUser(from.id);
    
    if (!user) {
      user = db.createUser(from.id, {
        username: from.username,
        firstName: from.first_name,
        lastName: from.last_name,
        languageCode: from.language_code,
      });
      
      logger.info(`New user registered: ${from.id} (@${from.username})`);
    } else {
      // Update last active
      db.updateUser(from.id, {
        lastActive: Date.now(),
        username: from.username,
        firstName: from.first_name,
      });
    }
    
    // Check if user is banned
    if (user.role === config.roles.BANNED) {
      await ctx.reply('⛔️ You are banned from using this bot.');
      return;
    }
    
    // Handle group
    if (chat.type === 'group' || chat.type === 'supergroup') {
      let group = db.getGroup(chat.id);
      
      if (!group) {
        group = db.createGroup(chat.id, {
          title: chat.title,
          type: chat.type,
        });
        
        logger.info(`New group registered: ${chat.id} (${chat.title})`);
      } else {
        db.updateGroup(chat.id, {
          title: chat.title,
        });
      }
      
      ctx.group = group;
    }
    
    // Attach user to context
    ctx.user = user;
    ctx.isAdmin = config.admins.includes(from.id) || user.role === config.roles.ADMIN;
    ctx.isVIP = user.role === config.roles.VIP;
    
    return next();
  } catch (error) {
    logger.error('Auth middleware error:', error);
    return next();
  }
};

// Check if user is admin (for command-specific authorization)
const requireAdmin = async (ctx, next) => {
  if (!ctx.isAdmin) {
    await ctx.reply('⛔️ This command is only available for administrators.');
    return;
  }
  return next();
};

// Check if command is allowed in current chat type
const requireChatType = (allowedTypes) => {
  return async (ctx, next) => {
    const chatType = ctx.chat.type;
    
    if (!allowedTypes.includes(chatType)) {
      if (chatType === 'private') {
        await ctx.reply('⛔️ This command is not available in private chat.');
      } else {
        await ctx.reply('⛔️ This command is not available in groups.');
      }
      return;
    }
    
    return next();
  };
};

module.exports = authMiddleware;
module.exports.requireAdmin = requireAdmin;
module.exports.requireChatType = requireChatType;