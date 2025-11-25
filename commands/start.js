// commands/start.js - Start Command
const { Markup } = require('telegraf');
const keyboard = require('../utils/keyboard');

module.exports = async (ctx) => {
  const user = ctx.user;
  const isNewUser = Date.now() - user.registered < 5000; // Registered in last 5 seconds
  
  let message = '';
  
  if (isNewUser) {
    message = `👋 Welcome, ${ctx.from.first_name}!\n\n`;
    message += '🤖 I\'m a Telegram bot built with Telegraf.\n\n';
  } else {
    message = `👋 Welcome back, ${ctx.from.first_name}!\n\n`;
  }
  
  message += '📝 Here\'s what I can do:\n';
  message += '• /help - Show all available commands\n';
  message += '• /settings - Manage your preferences\n';
  
  if (ctx.isAdmin) {
    message += '• /stats - View bot statistics (Admin)\n';
  }
  
  message += '\n💡 Use the buttons below for quick actions!';
  
  // Create inline keyboard
  const buttons = keyboard.inline([
    [
      { text: '📚 Help', callback_data: 'help' },
      { text: '⚙️ Settings', callback_data: 'settings' },
    ],
    [
      { text: '📊 My Stats', callback_data: 'my_stats' },
    ],
  ]);
  
  await ctx.reply(message, buttons);
};