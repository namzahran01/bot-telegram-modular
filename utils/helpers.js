// utils/helpers.js - Helper Functions

// Format number with thousand separators
function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Format duration (ms) to human readable
function formatDuration(ms) {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) {
    return `${days}d ${hours % 24}h ${minutes % 60}m`;
  }
  if (hours > 0) {
    return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  }
  return `${seconds}s`;
}

// Format date to readable string
function formatDate(timestamp, includeTime = true) {
  const date = new Date(timestamp);
  
  if (includeTime) {
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
  
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

// Format file size
function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// Escape HTML special characters
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  
  return text.replace(/[&<>"']/g, m => map[m]);
}

// Truncate text with ellipsis
function truncate(text, maxLength, suffix = '...') {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - suffix.length) + suffix;
}

// Sleep function
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Chunk array into smaller arrays
function chunkArray(array, size) {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

// Get random element from array
function randomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

// Generate random string
function randomString(length = 10) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Parse command arguments
function parseArgs(text) {
  const parts = text.trim().split(/\s+/);
  const command = parts[0];
  const args = parts.slice(1);
  
  return { command, args };
}

// Deep clone object
function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

// Check if string is valid URL
function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

// Extract URLs from text
function extractUrls(text) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.match(urlRegex) || [];
}

// Format mention (for HTML parse mode)
function mention(userId, name) {
  return `<a href="tg://user?id=${userId}">${escapeHtml(name)}</a>`;
}

// Format bold text (for HTML parse mode)
function bold(text) {
  return `<b>${escapeHtml(text)}</b>`;
}

// Format italic text (for HTML parse mode)
function italic(text) {
  return `<i>${escapeHtml(text)}</i>`;
}

// Format code text (for HTML parse mode)
function code(text) {
  return `<code>${escapeHtml(text)}</code>`;
}

// Format pre-formatted text (for HTML parse mode)
function pre(text, language = '') {
  return `<pre><code class="language-${language}">${escapeHtml(text)}</code></pre>`;
}

// Calculate percentage
function percentage(value, total) {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
}

// Retry function with exponential backoff
async function retry(fn, maxAttempts = 3, delay = 1000) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === maxAttempts) throw error;
      await sleep(delay * Math.pow(2, attempt - 1));
    }
  }
}

module.exports = {
  formatNumber,
  formatDuration,
  formatDate,
  formatFileSize,
  escapeHtml,
  truncate,
  sleep,
  chunkArray,
  randomElement,
  randomString,
  parseArgs,
  deepClone,
  isValidUrl,
  extractUrls,
  mention,
  bold,
  italic,
  code,
  pre,
  percentage,
  retry,
};