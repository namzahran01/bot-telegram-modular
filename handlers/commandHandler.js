// handlers/commandHandler.js - Command Handler
const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger');
const commandsConfig = require('../config/commands.config');

class CommandHandler {
  constructor() {
    this.commands = new Map();
  }
  
  // Load all commands from commands directory
  loadCommands() {
    const commandsDir = path.join(__dirname, '../commands');
    
    if (!fs.existsSync(commandsDir)) {
      logger.warn('Commands directory not found');
      return;
    }
    
    const files = fs.readdirSync(commandsDir).filter(f => f.endsWith('.js'));
    
    for (const file of files) {
      try {
        const commandName = file.replace('.js', '');
        const commandModule = require(path.join(commandsDir, file));
        
        // Find command config
        const config = commandsConfig.commands.find(c => c.command === commandName);
        
        if (!config || !config.enabled) {
          logger.info(`Command /${commandName} is disabled, skipping`);
          continue;
        }
        
        this.commands.set(commandName, {
          handler: commandModule,
          config,
        });
        
        logger.info(`Loaded command: /${commandName}`);
      } catch (error) {
        logger.error(`Error loading command ${file}:`, error);
      }
    }
    
    logger.success(`Loaded ${this.commands.size} commands`);
  }
  
  // Register commands with bot
  register(bot) {
    this.loadCommands();
    
    // Register each command
    for (const [name, { handler, config }] of this.commands) {
      const middlewares = [];
      
      // Add scope check middleware
      if (config.scope) {
        middlewares.push(async (ctx, next) => {
          const chatType = ctx.chat.type;
          
          if (config.scope.includes('private') && chatType === 'private') {
            return next();
          }
          if (config.scope.includes('group') && (chatType === 'group' || chatType === 'supergroup')) {
            return next();
          }
          
          await ctx.reply('⛔️ This command cannot be used here.');
        });
      }
      
      // Add admin check middleware
      if (config.adminOnly) {
        middlewares.push(async (ctx, next) => {
          if (!ctx.isAdmin) {
            await ctx.reply('⛔️ This command is only available for administrators.');
            return;
          }
          return next();
        });
      }
      
      // Register command with middlewares
      bot.command(name, ...middlewares, handler);
      
      // Register aliases
      if (commandsConfig.aliases[name]) {
        bot.command(commandsConfig.aliases[name], ...middlewares, handler);
      }
    }
    
    // Handle unknown commands
    bot.on('message', async (ctx, next) => {
      if (ctx.message?.text?.startsWith('/')) {
        const command = ctx.message.text.split(' ')[0].substring(1).split('@')[0];
        
        if (!this.commands.has(command) && !Object.values(commandsConfig.aliases).includes(command)) {
          await ctx.reply(
            '❓ Unknown command. Use /help to see available commands.'
          );
          return;
        }
      }
      return next();
    });
  }
  
  // Get command list
  getCommands() {
    return Array.from(this.commands.entries()).map(([name, { config }]) => ({
      command: name,
      description: config.description,
    }));
  }
  
  // Get command by name
  getCommand(name) {
    return this.commands.get(name);
  }
}

module.exports = new CommandHandler();