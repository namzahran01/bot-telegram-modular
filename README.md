# Telegram Bot Template

A comprehensive, scalable, and production-ready Telegram bot template built with Telegraf and JavaScript. This template provides a solid foundation for building powerful Telegram bots with modular architecture and best practices.

## 🚀 Features

### Core Features
- ✅ **Modular Architecture** - Clean separation of concerns with organized folder structure
- ✅ **JSON Database** - Built-in JSON database with auto-save and backup functionality
- ✅ **Caching System** - In-memory cache with TTL and automatic cleanup
- ✅ **Rate Limiting** - Per-user and per-command rate limiting with configurable limits
- ✅ **Anti-Spam** - Automatic spam detection and temporary bans
- ✅ **User Management** - Auto-registration, roles, and user tracking
- ✅ **Group Management** - Group registration and settings storage
- ✅ **Comprehensive Logging** - File-based logging with multiple levels
- ✅ **Error Handling** - Global error handler with graceful error recovery
- ✅ **Button Management** - Keyboard builder with inline and reply keyboards
- ✅ **Callback Routing** - Organized callback query handling
- ✅ **Command System** - Auto-loading commands with configuration-based registration
- ✅ **Middleware System** - Authentication, authorization, logging, and more

### Built-in Commands
- `/start` - Welcome message with inline keyboard
- `/help` - Display available commands based on user role
- `/stats` - Bot statistics (admin only)

## 📁 Project Structure

```
bot/
├── index.js                    # Entry point
├── config/
│   ├── bot.config.js          # Bot configuration
│   └── commands.config.js     # Commands configuration
├── database/
│   ├── db.js                  # Database manager
│   ├── data/                  # JSON data files
│   │   ├── users.json
│   │   ├── groups.json
│   │   ├── settings.json
│   │   └── stats.json
│   └── backups/               # Automatic backups
├── cache/
│   └── cache.js               # Cache manager
├── middlewares/
│   ├── auth.js                # Authentication & authorization
│   ├── rateLimit.js           # Rate limiting
│   ├── logger.js              # Logging middleware
│   └── antiSpam.js            # Anti-spam protection
├── handlers/
│   ├── commandHandler.js      # Command routing
│   ├── messageHandler.js      # Message handling
│   ├── callbackHandler.js     # Callback query handling
│   └── errorHandler.js        # Error handling
├── commands/
│   ├── start.js               # Start command
│   ├── help.js                # Help command
│   └── stats.js               # Statistics command
├── utils/
│   ├── keyboard.js            # Keyboard builder
│   ├── logger.js              # Logger utility
│   ├── helpers.js             # Helper functions
│   └── validator.js           # Validation utility
├── logs/                      # Log files (auto-generated)
├── .env                       # Environment variables
├── .env.example               # Example environment file
├── package.json
└── README.md
```

## 🛠️ Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd telegram-bot-template
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
cp .env.example .env
```

Edit `.env` file and add your bot token:
```env
BOT_TOKEN=your_bot_token_here
NODE_ENV=development
ADMIN_IDS=your_telegram_user_id
```

4. **Start the bot**
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

## 📖 Usage Guide

### Adding a New Command

1. Create a new file in `commands/` folder (e.g., `ping.js`):

```javascript
// commands/ping.js
module.exports = async (ctx) => {
  const start = Date.now();
  const message = await ctx.reply('Pinging...');
  const latency = Date.now() - start;
  
  await ctx.telegram.editMessageText(
    ctx.chat.id,
    message.message_id,
    null,
    `🏓 Pong! Latency: ${latency}ms`
  );
};
```

2. Add command configuration in `config/commands.config.js`:

```javascript
{
  command: 'ping',
  description: 'Check bot response time',
  scope: ['private', 'group'],
  adminOnly: false,
  enabled: true,
}
```

The command will be automatically loaded on bot restart!

### Adding Middleware

Create a new middleware in `middlewares/` folder:

```javascript
// middlewares/myMiddleware.js
module.exports = async (ctx, next) => {
  // Your logic here
  console.log('Processing update...');
  
  // Call next middleware
  await next();
};
```

Register it in `index.js`:

```javascript
const myMiddleware = require('./middlewares/myMiddleware');
bot.use(myMiddleware);
```

### Working with Database

```javascript
const db = require('./database/db');

// User operations
const user = db.getUser(userId);
db.createUser(userId, { username: 'john' });
db.updateUser(userId, { role: 'admin' });
db.deleteUser(userId);

// Query users
const admins = db.findUsers({ role: 'admin' });

// Settings
db.setSetting('maintenance', false);
const maintenance = db.getSetting('maintenance');

// Stats
const stats = db.getStats();
db.incrementStat('totalMessages');
```

### Using Cache

```javascript
const cache = require('./cache/cache');

// Basic cache operations
cache.set('key', 'value', 60000); // TTL: 60 seconds
const value = cache.get('key');
cache.delete('key');

// User-specific cache
cache.setUserCache(userId, 'lastAction', 'command', 3600000);
const lastAction = cache.getUserCache(userId, 'lastAction');

// Session management
cache.setSession(userId, { step: 1, data: {} });
const session = cache.getSession(userId);
```

### Creating Keyboards

```javascript
const keyboard = require('./utils/keyboard');

// Inline keyboard
const buttons = keyboard.inline([
  [
    { text: 'Button 1', callback_data: 'btn1' },
    { text: 'Button 2', callback_data: 'btn2' },
  ],
  [
    { text: 'URL Button', url: 'https://example.com' },
  ],
]);

await ctx.reply('Choose an option:', buttons);

// Quick inline keyboard
const quickButtons = keyboard.quickInline(
  ['Option 1', 'Option 2', 'Option 3'],
  'option'
);

// Paginated keyboard
const items = [/* your items */];
const paginated = keyboard.paginated(items, 1, 5, 'page');

// Confirmation keyboard
const confirm = keyboard.confirmation('yes', 'no');
```

### Handling Callbacks

Register callbacks in `handlers/callbackHandler.js`:

```javascript
const callbackHandler = require('./handlers/callbackHandler');

// Register a callback
callbackHandler.add('mybutton', async (ctx) => {
  await ctx.answerCbQuery('Button clicked!');
  await ctx.editMessageText('You clicked the button!');
});

// Register with regex pattern
callbackHandler.add(/^item:(\d+)$/, async (ctx) => {
  const itemId = ctx.callbackQuery.data.match(/^item:(\d+)$/)[1];
  await ctx.editMessageText(`Item ${itemId} selected`);
});
```

## ⚙️ Configuration

### Bot Configuration (`config/bot.config.js`)

```javascript
module.exports = {
  mode: 'development', // or 'production'
  rateLimit: {
    global: { window: 60000, max: 30 },
    perCommand: { window: 60000, max: 10 },
  },
  antiSpam: {
    enabled: true,
    messageWindow: 5000,
    maxMessages: 5,
    banDuration: 300000,
  },
  cache: {
    defaultTTL: 3600000,
    cleanupInterval: 300000,
  },
  database: {
    autoSave: true,
    autoSaveInterval: 60000,
    backupEnabled: true,
    backupInterval: 3600000,
    maxBackups: 5,
  },
};
```

## 🔒 User Roles

The template supports multiple user roles:

- **admin** - Full access to all commands
- **vip** - Bypass rate limits and anti-spam
- **user** - Default role for all users
- **banned** - Restricted from using the bot

Admins can be configured in `.env` file or assigned programmatically:

```javascript
db.updateUser(userId, { role: 'admin' });
```

## 📊 Built-in Statistics

The bot tracks:
- Total users and groups
- Total messages processed
- Active users (24h)
- Cache statistics
- System uptime and memory usage

View statistics with `/stats` command (admin only).

## 🛡️ Security Features

- **Rate Limiting** - Prevents abuse with configurable limits
- **Anti-Spam** - Automatic detection and temporary bans
- **Role-Based Access** - Control who can use specific commands
- **Input Validation** - Comprehensive validation utilities
- **Error Handling** - Graceful error recovery without crashes

## 📝 Logging

Logs are automatically saved to `logs/` directory with daily rotation:

```javascript
const logger = require('./utils/logger');

logger.debug('Debug message');
logger.info('Info message');
logger.warn('Warning message');
logger.error('Error message');
logger.success('Success message');
```

## 🚀 Production Deployment

1. Set environment to production:
```env
NODE_ENV=production
```

2. Configure webhook (recommended for production):
```env
WEBHOOK_DOMAIN=https://yourdomain.com
PORT=3000
```

3. Use process manager (PM2):
```bash
npm install -g pm2
pm2 start index.js --name telegram-bot
pm2 save
pm2 startup
```

## 🤝 Contributing

Contributions are welcome! Feel free to submit issues and pull requests.

## 📄 License

MIT License - feel free to use this template for your projects!

## 🙏 Support

If you find this template helpful, please give it a ⭐ star on GitHub!

---

**Happy Bot Building! 🤖**