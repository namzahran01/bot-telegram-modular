// commands/stats.js - Stats Command (Admin Only)
const db = require('../database/db');
const cache = require('../cache/cache');
const { formatDuration, formatNumber } = require('../utils/helpers');

module.exports = async (ctx) => {
  const stats = db.getStats();
  const cacheStats = cache.getStats();
  
  const uptime = Date.now() - stats.startTime;
  const users = db.getAllUsers();
  
  // Calculate active users (active in last 24 hours)
  const oneDayAgo = Date.now() - 86400000;
  const activeUsers = users.filter(u => u.lastActive > oneDayAgo).length;
  
  // Calculate banned users
  const bannedUsers = users.filter(u => u.role === 'banned').length;
  
  let message = '📊 <b>Bot Statistics</b>\n\n';
  
  message += '<b>👥 Users:</b>\n';
  message += `• Total: ${formatNumber(stats.totalUsers)}\n`;
  message += `• Active (24h): ${formatNumber(activeUsers)}\n`;
  message += `• Banned: ${formatNumber(bannedUsers)}\n\n`;
  
  message += '<b>👥 Groups:</b>\n';
  message += `• Total: ${formatNumber(stats.totalGroups)}\n\n`;
  
  message += '<b>💬 Messages:</b>\n';
  message += `• Total Processed: ${formatNumber(stats.totalMessages)}\n\n`;
  
  message += '<b>💾 Cache:</b>\n';
  message += `• Size: ${formatNumber(cacheStats.size)} entries\n`;
  message += `• Hit Rate: ${cacheStats.hitRate}\n`;
  message += `• Hits: ${formatNumber(cacheStats.hits)}\n`;
  message += `• Misses: ${formatNumber(cacheStats.misses)}\n\n`;
  
  message += '<b>⏱ System:</b>\n';
  message += `• Uptime: ${formatDuration(uptime)}\n`;
  message += `• Memory: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB\n`;
  
  await ctx.replyWithHTML(message);
};