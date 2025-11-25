// utils/logger.js - Logger Utility
const fs = require('fs');
const path = require('path');

class Logger {
  constructor() {
    this.logDir = path.join(__dirname, '../logs');
    this.ensureLogDir();
    
    this.levels = {
      DEBUG: 'DEBUG',
      INFO: 'INFO',
      WARN: 'WARN',
      ERROR: 'ERROR',
      SUCCESS: 'SUCCESS',
    };
    
    this.colors = {
      DEBUG: '\x1b[36m',   // Cyan
      INFO: '\x1b[34m',    // Blue
      WARN: '\x1b[33m',    // Yellow
      ERROR: '\x1b[31m',   // Red
      SUCCESS: '\x1b[32m', // Green
      RESET: '\x1b[0m',
    };
  }
  
  ensureLogDir() {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }
  
  getTimestamp() {
    return new Date().toISOString();
  }
  
  getLogFileName() {
    const date = new Date().toISOString().split('T')[0];
    return path.join(this.logDir, `${date}.log`);
  }
  
  formatMessage(level, ...args) {
    const timestamp = this.getTimestamp();
    const message = args.map(arg => {
      if (typeof arg === 'object') {
        return JSON.stringify(arg, null, 2);
      }
      return String(arg);
    }).join(' ');
    
    return `[${timestamp}] [${level}] ${message}`;
  }
  
  writeToFile(message) {
    try {
      const logFile = this.getLogFileName();
      fs.appendFileSync(logFile, message + '\n');
    } catch (error) {
      console.error('Failed to write to log file:', error);
    }
  }
  
  log(level, ...args) {
    const message = this.formatMessage(level, ...args);
    const color = this.colors[level] || this.colors.RESET;
    
    // Console output with color
    console.log(`${color}${message}${this.colors.RESET}`);
    
    // File output without color
    this.writeToFile(message);
  }
  
  debug(...args) {
    if (process.env.NODE_ENV === 'development') {
      this.log(this.levels.DEBUG, ...args);
    }
  }
  
  info(...args) {
    this.log(this.levels.INFO, ...args);
  }
  
  warn(...args) {
    this.log(this.levels.WARN, ...args);
  }
  
  error(...args) {
    this.log(this.levels.ERROR, ...args);
  }
  
  success(...args) {
    this.log(this.levels.SUCCESS, ...args);
  }
}

module.exports = new Logger();