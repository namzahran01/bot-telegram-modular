// config/bot.config.js
module.exports = {
  // Bot settings
  mode: process.env.NODE_ENV || 'development',
  
  // Webhook configuration (for production)
  webhook: {
    domain: process.env.WEBHOOK_DOMAIN || 'https://yourdomain.com',
    port: parseInt(process.env.PORT) || 3000,
  },
  
  // Rate limiting
  rateLimit: {
    global: {
      window: 60000, // 1 minute
      max: 30, // 30 requests per minute
    },
    perCommand: {
      window: 60000,
      max: 10, // 10 times per command per minute
    },
  },
  
  // Anti-spam settings
  antiSpam: {
    enabled: true,
    messageWindow: 5000, // 5 seconds
    maxMessages: 5, // max 5 messages in window
    banDuration: 300000, // 5 minutes ban
  },
  
  // Cache settings
  cache: {
    defaultTTL: 3600000, // 1 hour
    cleanupInterval: 300000, // 5 minutes
  },
  
  // Database settings
  database: {
    autoSave: true,
    autoSaveInterval: 60000, // 1 minute
    backupEnabled: true,
    backupInterval: 3600000, // 1 hour
    maxBackups: 5,
  },
  
  // User roles
  roles: {
    ADMIN: 'admin',
    USER: 'user',
    VIP: 'vip',
    BANNED: 'banned',
  },
  
  // Admin user IDs (add your Telegram user ID here)
  admins: process.env.ADMIN_IDS 
    ? process.env.ADMIN_IDS.split(',').map(id => parseInt(id))
    : [],
  
  // Bot features
  features: {
    groupMode: true,
    privateMode: true,
    welcomeMessage: true,
    statistics: true,
  },
  
  // Pagination
  pagination: {
    itemsPerPage: 10,
  },
};