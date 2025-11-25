// commands/help.js - Help Command
const commandsConfig = require('../config/commands.config');
const keyboard = require('../utils/keyboard');

module.exports = async (ctx) => {
  const isAdmin = ctx.isAdmin;
  const chatType = ctx.chat.type;
  
  let message = '📚 <b>Available Commands</b>\n\n';
  
  // Filter commands based on user role and chat type
  const availableCommands = commandsConfig.commands.filter(cmd => {
    if (!cmd.enabled) return false;
    if (cmd.adminOnly && !isAdmin) return false;
    
    // Check scope
    if (chatType === 'private' && !cmd.scope.includes('private')) return false;
    if ((chatType === 'group' || chatType === 'supergroup') && !cmd.scope.includes('group')) return false;
    
    return true;
  });
  
  // Group commands by category
  const userCommands = availableCommands.filter(cmd => !cmd.adminOnly);
  const adminCommands = availableCommands.filter(cmd => cmd.adminOnly);
  
  // User commands
  if (userCommands.length > 0) {
    message += '<b>👤 User Commands:</b>\n';
    userCommands.forEach(cmd => {
      message += `/${cmd.command} - ${cmd.description}\n`;
    });
    message += '\n';
  }
  
  // Admin commands
  if (adminCommands.length > 0 && isAdmin) {
    message += '<b>👑 Admin Commands:</b>\n';
    adminCommands.forEach(cmd => {
      message += `/${cmd.command} - ${cmd.description}\n`;
    });
    message += '\n';
  }
  
  message += '💡 <i>Tap on any command to use it!</i>';
  
  const buttons = keyboard.inline([
    [
      { text: '🏠 Back to Start', callback_data: 'start' },
      { text: '❌ Close', callback_data: 'close' },
    ],
  ]);
  
  await ctx.replyWithHTML(message, buttons);
};