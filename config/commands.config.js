// config/commands.config.js
module.exports = {
  // Command list with metadata
  commands: [
    {
      command: 'start',
      description: 'Start bot and show welcome message',
      scope: ['private', 'group'],
      adminOnly: false,
      enabled: true,
    },
    {
      command: 'help',
      description: 'Show help message',
      scope: ['private', 'group'],
      adminOnly: false,
      enabled: true,
    },
    {
      command: 'stats',
      description: 'Show bot statistics',
      scope: ['private'],
      adminOnly: true,
      enabled: true,
    },
    {
      command: 'ping',
      description: 'Check bot response time',
      scope: ['private', 'group'],
      adminOnly: false,
      enabled: true,
    },
    {
      command: 'settings',
      description: 'Manage user settings',
      scope: ['private'],
      adminOnly: false,
      enabled: true,
    },
    // Add more commands here as needed
  ],
  
  // Command aliases
  aliases: {
    'mulai': 'start',
    'bantuan': 'help',
    'statistik': 'stats',
  },
};