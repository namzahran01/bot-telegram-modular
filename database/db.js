// database/db.js - JSON Database Manager
const fs = require('fs').promises;
const path = require('path');
const logger = require('../utils/logger');
const config = require('../config/bot.config');

class Database {
  constructor() {
    this.data = {
      users: {},
      groups: {},
      settings: {},
      stats: {
        totalUsers: 0,
        totalGroups: 0,
        totalMessages: 0,
        startTime: Date.now(),
      },
    };
    
    this.dataDir = path.join(__dirname, 'data');
    this.backupDir = path.join(__dirname, 'backups');
    this.initialized = false;
    this.saveTimer = null;
    this.backupTimer = null;
  }
  
  // Initialize database
  async init() {
    try {
      await this.ensureDirectories();
      await this.load();
      
      if (config.database.autoSave) {
        this.startAutoSave();
      }
      
      if (config.database.backupEnabled) {
        this.startAutoBackup();
      }
      
      this.initialized = true;
      logger.success('Database initialized');
    } catch (error) {
      logger.error('Database initialization failed:', error);
      throw error;
    }
  }
  
  // Ensure directories exist
  async ensureDirectories() {
    await fs.mkdir(this.dataDir, { recursive: true });
    await fs.mkdir(this.backupDir, { recursive: true });
  }
  
  // Load data from files
  async load() {
    const files = ['users.json', 'groups.json', 'settings.json', 'stats.json'];
    
    for (const file of files) {
      const filePath = path.join(this.dataDir, file);
      const key = file.replace('.json', '');
      
      try {
        const content = await fs.readFile(filePath, 'utf8');
        this.data[key] = JSON.parse(content);
        logger.info(`Loaded ${key} data`);
      } catch (error) {
        if (error.code === 'ENOENT') {
          logger.warn(`${file} not found, using default data`);
          await this.saveFile(key);
        } else {
          logger.error(`Error loading ${file}:`, error);
        }
      }
    }
  }
  
  // Save all data
  async save() {
    if (!this.initialized) return;
    
    try {
      for (const key in this.data) {
        await this.saveFile(key);
      }
      logger.info('Database saved');
    } catch (error) {
      logger.error('Error saving database:', error);
    }
  }
  
  // Save specific file
  async saveFile(key) {
    const filePath = path.join(this.dataDir, `${key}.json`);
    await fs.writeFile(filePath, JSON.stringify(this.data[key], null, 2));
  }
  
  // Create backup
  async createBackup() {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupPath = path.join(this.backupDir, `backup-${timestamp}.json`);
      
      await fs.writeFile(backupPath, JSON.stringify(this.data, null, 2));
      logger.info(`Backup created: ${backupPath}`);
      
      await this.cleanOldBackups();
    } catch (error) {
      logger.error('Error creating backup:', error);
    }
  }
  
  // Clean old backups
  async cleanOldBackups() {
    try {
      const files = await fs.readdir(this.backupDir);
      const backups = files.filter(f => f.startsWith('backup-')).sort().reverse();
      
      if (backups.length > config.database.maxBackups) {
        const toDelete = backups.slice(config.database.maxBackups);
        for (const file of toDelete) {
          await fs.unlink(path.join(this.backupDir, file));
          logger.info(`Deleted old backup: ${file}`);
        }
      }
    } catch (error) {
      logger.error('Error cleaning old backups:', error);
    }
  }
  
  // Start auto-save
  startAutoSave() {
    this.saveTimer = setInterval(() => {
      this.save();
    }, config.database.autoSaveInterval);
  }
  
  // Start auto-backup
  startAutoBackup() {
    this.backupTimer = setInterval(() => {
      this.createBackup();
    }, config.database.backupInterval);
  }
  
  // User operations
  getUser(userId) {
    return this.data.users[userId] || null;
  }
  
  createUser(userId, userData = {}) {
    this.data.users[userId] = {
      id: userId,
      role: config.roles.USER,
      registered: Date.now(),
      lastActive: Date.now(),
      messageCount: 0,
      preferences: {},
      ...userData,
    };
    this.data.stats.totalUsers++;
    return this.data.users[userId];
  }
  
  updateUser(userId, updates) {
    if (!this.data.users[userId]) return null;
    this.data.users[userId] = { ...this.data.users[userId], ...updates };
    return this.data.users[userId];
  }
  
  deleteUser(userId) {
    if (this.data.users[userId]) {
      delete this.data.users[userId];
      this.data.stats.totalUsers--;
      return true;
    }
    return false;
  }
  
  getAllUsers() {
    return Object.values(this.data.users);
  }
  
  // Group operations
  getGroup(groupId) {
    return this.data.groups[groupId] || null;
  }
  
  createGroup(groupId, groupData = {}) {
    this.data.groups[groupId] = {
      id: groupId,
      registered: Date.now(),
      settings: {},
      ...groupData,
    };
    this.data.stats.totalGroups++;
    return this.data.groups[groupId];
  }
  
  updateGroup(groupId, updates) {
    if (!this.data.groups[groupId]) return null;
    this.data.groups[groupId] = { ...this.data.groups[groupId], ...updates };
    return this.data.groups[groupId];
  }
  
  deleteGroup(groupId) {
    if (this.data.groups[groupId]) {
      delete this.data.groups[groupId];
      this.data.stats.totalGroups--;
      return true;
    }
    return false;
  }
  
  // Settings operations
  getSetting(key) {
    return this.data.settings[key];
  }
  
  setSetting(key, value) {
    this.data.settings[key] = value;
  }
  
  // Stats operations
  getStats() {
    return this.data.stats;
  }
  
  incrementStat(key) {
    if (this.data.stats[key] !== undefined) {
      this.data.stats[key]++;
    }
  }
  
  // Query helpers
  findUsers(query) {
    return Object.values(this.data.users).filter(user => {
      return Object.keys(query).every(key => user[key] === query[key]);
    });
  }
  
  findGroups(query) {
    return Object.values(this.data.groups).filter(group => {
      return Object.keys(query).every(key => group[key] === query[key]);
    });
  }
  
  // Cleanup
  cleanup() {
    if (this.saveTimer) clearInterval(this.saveTimer);
    if (this.backupTimer) clearInterval(this.backupTimer);
    this.save();
  }
}

module.exports = new Database();