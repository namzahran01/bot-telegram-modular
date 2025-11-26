<div align="center">

# 🤖 Telegram Bot Template

### *Production-Ready • Scalable • Modern*

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen.svg)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Telegraf](https://img.shields.io/badge/Telegraf-4.x-blue.svg)](https://telegraf.js.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

**Build powerful Telegram bots in minutes with this comprehensive template featuring modular architecture, built-in security, and production-ready features.**

[Getting Started](#-quick-start) • [Features](#-features) • [Documentation](#-documentation) • [Examples](#-usage-examples)

<img src="https://raw.githubusercontent.com/telegram-bot-sdk/artwork/master/images/telegram-bot-php.png" width="200" alt="Telegram Bot">

---

</div>

## ✨ Features

<table>
<tr>
<td width="50%">

### 🏗️ **Architecture**
- 📦 Modular & Scalable Structure
- 🔄 Auto-loading Command System
- 🎯 Clean Separation of Concerns
- 🔌 Extensible Middleware Pipeline
- 📝 TypeScript-Ready Foundation

</td>
<td width="50%">

### 🔐 **Security**
- 🛡️ Rate Limiting (Global & Per-Command)
- 🚫 Advanced Anti-Spam Protection
- 👥 Role-Based Access Control
- ✅ Input Validation & Sanitization
- 🔒 Environment-based Configuration

</td>
</tr>
<tr>
<td width="50%">

### 💾 **Data Management**
- 📊 JSON Database with Auto-save
- 💨 In-Memory Caching with TTL
- 🔄 Automatic Backups
- 📈 Built-in Analytics
- 🗃️ Session Management

</td>
<td width="50%">

### 🛠️ **Developer Experience**
- 📝 Comprehensive Logging System
- 🐛 Global Error Handling
- 🔥 Hot Reload Support
- 📚 Extensive Documentation
- 🎨 Beautiful Keyboard Builders

</td>
</tr>
</table>

---

## 🚀 Quick Start

<details open>
<summary><b>⚡ Get up and running in 3 minutes</b></summary>

### 1️⃣ Clone & Install

```bash
# Clone the repository
git clone https://github.com/yourusername/telegram-bot-template.git
cd telegram-bot-template

# Install dependencies
npm install
```

### 2️⃣ Configure

```bash
# Copy environment file
cp .env.example .env

# Edit with your credentials
nano .env
```

Add your bot token from [@BotFather](https://t.me/botfather):

```env
BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
ADMIN_IDS=123456789
NODE_ENV=development
```

### 3️⃣ Launch

```bash
# Development mode with hot reload
npm run dev

# Production mode
npm start
```

<div align="center">

**🎉 Your bot is now live! Send `/start` to begin.**

</div>

</details>

---

## 📖 Documentation

<details>
<summary><b>🗂️ Project Structure</b></summary>

```
telegram-bot-template/
│
├── 📂 config/              # Configuration files
│   ├── bot.config.js       # Bot settings
│   └── commands.config.js  # Command definitions
│
├── 📂 database/            # Data persistence
│   ├── db.js              # Database manager
│   ├── data/              # JSON data files
│   └── backups/           # Auto backups
│
├── 📂 cache/              # Caching system
│   └── cache.js           # Cache manager
│
├── 📂 middlewares/        # Request processing
│   ├── auth.js            # Authentication
│   ├── rateLimit.js       # Rate limiting
│   ├── antiSpam.js        # Spam protection
│   └── logger.js          # Logging
│
├── 📂 handlers/           # Event handlers
│   ├── commandHandler.js  # Command routing
│   ├── messageHandler.js  # Message handling
│   ├── callbackHandler.js # Button callbacks
│   └── errorHandler.js    # Error handling
│
├── 📂 commands/           # Bot commands
│   ├── start.js           # /start command
│   ├── help.js            # /help command
│   └── stats.js           # /stats command
│
├── 📂 utils/              # Utilities
│   ├── keyboard.js        # Keyboard builder
│   ├── logger.js          # Logger utility
│   ├── helpers.js         # Helper functions
│   └── validator.js       # Validation
│
├── 📂 logs/               # Log files
│
├── 📄 index.js            # Entry point
├── 📄 package.json
└── 📄 .env                # Environment vars
```

</details>

<details>
<summary><b>🎮 Usage Examples</b></summary>

### Creating a New Command

```javascript
// commands/weather.js
const axios = require('axios');

module.exports = async (ctx) => {
  const city = ctx.message.text.split(' ')[1];
  
  if (!city) {
    return ctx.reply('❌ Please provide a city name!\nUsage: /weather <city>');
  }
  
  try {
    // Your weather API logic here
    const weather = await fetchWeather(city);
    
    await ctx.reply(
      `🌤️ Weather in ${city}\n\n` +
      `Temperature: ${weather.temp}°C\n` +
      `Condition: ${weather.condition}\n` +
      `Humidity: ${weather.humidity}%`
    );
  } catch (error) {
    await ctx.reply('❌ Failed to fetch weather data');
  }
};
```

**Register in `config/commands.config.js`:**

```javascript
{
  command: 'weather',
  description: 'Get weather information',
  scope: ['private', 'group'],
  adminOnly: false,
  enabled: true,
}
```

### Building Interactive Keyboards

```javascript
const keyboard = require('./utils/keyboard');

// Inline buttons
const menu = keyboard.inline([
  [
    { text: '📊 Stats', callback_data: 'stats' },
    { text: '⚙️ Settings', callback_data: 'settings' }
  ],
  [
    { text: '📖 Help', callback_data: 'help' },
    { text: '❌ Close', callback_data: 'close' }
  ]
]);

await ctx.reply('Choose an option:', menu);

// Quick buttons
const options = keyboard.quickInline(
  ['Option 1', 'Option 2', 'Option 3'],
  'select'
);

// Confirmation
const confirm = keyboard.confirmation('confirm_action', 'cancel_action');
```

### Database Operations

```javascript
const db = require('./database/db');

// User management
db.createUser(userId, {
  username: 'john_doe',
  role: 'user',
  createdAt: Date.now()
});

const user = db.getUser(userId);
db.updateUser(userId, { role: 'vip' });

// Find users
const vipUsers = db.findUsers({ role: 'vip' });

// Settings
db.setSetting('maintenance', false);
const isDown = db.getSetting('maintenance');

// Statistics
db.incrementStat('totalCommands');
const stats = db.getStats();
```

### Caching System

```javascript
const cache = require('./cache/cache');

// Basic cache
cache.set('user:123:data', userData, 60000); // 60s TTL
const data = cache.get('user:123:data');

// User-specific cache
cache.setUserCache(userId, 'preferences', prefs, 3600000);
const prefs = cache.getUserCache(userId, 'preferences');

// Session management
cache.setSession(userId, { step: 1, formData: {} });
const session = cache.getSession(userId);
cache.clearSession(userId);
```

</details>

<details>
<summary><b>⚙️ Configuration</b></summary>

### Bot Configuration

Edit `config/bot.config.js`:

```javascript
module.exports = {
  // Environment
  mode: process.env.NODE_ENV || 'development',
  
  // Rate Limiting
  rateLimit: {
    global: {
      window: 60000,  // 1 minute
      max: 30         // 30 requests
    },
    perCommand: {
      window: 60000,
      max: 10
    }
  },
  
  // Anti-Spam
  antiSpam: {
    enabled: true,
    messageWindow: 5000,   // 5 seconds
    maxMessages: 5,        // 5 messages
    banDuration: 300000    // 5 minutes
  },
  
  // Cache Settings
  cache: {
    defaultTTL: 3600000,      // 1 hour
    cleanupInterval: 300000   // 5 minutes
  },
  
  // Database
  database: {
    autoSave: true,
    autoSaveInterval: 60000,    // 1 minute
    backupEnabled: true,
    backupInterval: 3600000,    // 1 hour
    maxBackups: 5
  }
};
```

### Environment Variables

```env
# Bot Token from @BotFather
BOT_TOKEN=your_bot_token_here

# Admin User IDs (comma-separated)
ADMIN_IDS=123456789,987654321

# Environment
NODE_ENV=development

# Webhook (Production)
WEBHOOK_DOMAIN=https://yourdomain.com
PORT=3000
```

</details>

<details>
<summary><b>🔐 Security & Permissions</b></summary>

### User Roles

| Role | Description | Permissions |
|------|-------------|-------------|
| 🔴 **admin** | Full access | All commands, bypass limits |
| 🟡 **vip** | Premium user | Bypass rate limits |
| 🟢 **user** | Default role | Standard access |
| ⚫ **banned** | Restricted | No access |

### Setting Roles

```javascript
// Programmatically
db.updateUser(userId, { role: 'admin' });

// Via environment (.env)
ADMIN_IDS=123456789,987654321
```

### Command Permissions

```javascript
// config/commands.config.js
{
  command: 'broadcast',
  description: 'Send message to all users',
  scope: ['private'],
  adminOnly: true,      // ⚠️ Admin-only command
  enabled: true
}
```

</details>

---

## 🎨 Advanced Features

<details>
<summary><b>📊 Analytics & Logging</b></summary>

### Built-in Statistics

```javascript
const stats = db.getStats();

console.log({
  totalUsers: stats.totalUsers,
  totalGroups: stats.totalGroups,
  totalMessages: stats.totalMessages,
  activeUsers24h: stats.activeUsers24h,
  uptime: process.uptime()
});
```

### Logging System

```javascript
const logger = require('./utils/logger');

logger.debug('Debug information');
logger.info('General information');
logger.warn('Warning message');
logger.error('Error occurred', { error });
logger.success('Operation successful');
```

**Logs are saved to:** `logs/bot-YYYY-MM-DD.log`

</details>

<details>
<summary><b>🚀 Production Deployment</b></summary>

### Using PM2

```bash
# Install PM2
npm install -g pm2

# Start bot
pm2 start index.js --name telegram-bot

# Save configuration
pm2 save

# Setup auto-start on system boot
pm2 startup

# Monitor
pm2 monit

# View logs
pm2 logs telegram-bot
```

### Docker Deployment

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

CMD ["node", "index.js"]
```

```bash
# Build image
docker build -t telegram-bot .

# Run container
docker run -d --name bot \
  --env-file .env \
  -v $(pwd)/database/data:/app/database/data \
  -v $(pwd)/logs:/app/logs \
  telegram-bot
```

### Webhook Mode

```javascript
// index.js
if (process.env.NODE_ENV === 'production') {
  bot.launch({
    webhook: {
      domain: process.env.WEBHOOK_DOMAIN,
      port: process.env.PORT
    }
  });
} else {
  bot.launch();
}
```

</details>

---

## 🤝 Contributing

<div align="center">

We love contributions! 💙

[![Contributors](https://img.shields.io/github/contributors/yourusername/telegram-bot-template?style=for-the-badge)](https://github.com/yourusername/telegram-bot-template/graphs/contributors)

</div>

### How to Contribute

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

### Development Setup

```bash
# Clone your fork
git clone https://github.com/yourusername/telegram-bot-template.git

# Create a branch
git checkout -b feature/my-feature

# Make changes and test
npm run dev

# Commit with clear message
git commit -m "feat: add awesome feature"
```

---

## 📜 License

<div align="center">

**MIT License** - see [LICENSE](LICENSE) file for details

Copyright © 2024 Your Name

</div>

---

## 💖 Support

<div align="center">

If you find this template helpful, please consider:

⭐ **Starring** the repository

🐛 **Reporting** bugs and issues

💡 **Suggesting** new features

📖 **Improving** documentation

---

### 🌟 Star History

[![Star History Chart](https://api.star-history.com/svg?repos=yourusername/telegram-bot-template&type=Date)](https://star-history.com/#yourusername/telegram-bot-template&Date)

---

**Made with ❤️ by developers, for developers**

[⬆ Back to Top](#-telegram-bot-template)

</div>
