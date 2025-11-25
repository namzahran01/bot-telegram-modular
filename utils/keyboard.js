// utils/keyboard.js - Keyboard Builder Utility
const { Markup } = require('telegraf');

class KeyboardBuilder {
  // Create inline keyboard
  inline(buttons, options = {}) {
    return Markup.inlineKeyboard(buttons, options);
  }
  
  // Create reply keyboard
  reply(buttons, options = {}) {
    return Markup.keyboard(buttons, {
      resize_keyboard: true,
      one_time_keyboard: false,
      ...options,
    });
  }
  
  // Remove keyboard
  remove() {
    return Markup.removeKeyboard();
  }
  
  // Create paginated inline keyboard
  paginated(items, currentPage, itemsPerPage, callbackPrefix) {
    const totalPages = Math.ceil(items.length / itemsPerPage);
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageItems = items.slice(start, end);
    
    const buttons = [];
    
    // Item buttons
    pageItems.forEach(item => {
      buttons.push([{
        text: item.text,
        callback_data: item.callback_data,
      }]);
    });
    
    // Navigation buttons
    const navButtons = [];
    
    if (currentPage > 1) {
      navButtons.push({
        text: '⬅️ Previous',
        callback_data: `${callbackPrefix}:${currentPage - 1}`,
      });
    }
    
    navButtons.push({
      text: `${currentPage}/${totalPages}`,
      callback_data: 'noop',
    });
    
    if (currentPage < totalPages) {
      navButtons.push({
        text: 'Next ➡️',
        callback_data: `${callbackPrefix}:${currentPage + 1}`,
      });
    }
    
    if (navButtons.length > 0) {
      buttons.push(navButtons);
    }
    
    return this.inline(buttons);
  }
  
  // Create URL button
  url(text, url) {
    return { text, url };
  }
  
  // Create callback button
  callback(text, data) {
    return { text, callback_data: data };
  }
  
  // Create button grid (auto-arrange in rows)
  grid(buttons, columns = 2) {
    const rows = [];
    for (let i = 0; i < buttons.length; i += columns) {
      rows.push(buttons.slice(i, i + columns));
    }
    return rows;
  }
  
  // Quick inline keyboard from array of texts
  quickInline(texts, callbackPrefix = '') {
    const buttons = texts.map((text, index) => [{
      text,
      callback_data: callbackPrefix ? `${callbackPrefix}:${index}` : `btn_${index}`,
    }]);
    return this.inline(buttons);
  }
  
  // Quick reply keyboard from array of texts
  quickReply(texts, columns = 2) {
    const buttons = this.grid(texts.map(text => ({ text })), columns);
    return this.reply(buttons);
  }
  
  // Confirmation keyboard (Yes/No)
  confirmation(yesCallback, noCallback, yesText = '✅ Yes', noText = '❌ No') {
    return this.inline([
      [
        { text: yesText, callback_data: yesCallback },
        { text: noText, callback_data: noCallback },
      ],
    ]);
  }
  
  // Build keyboard from config
  fromConfig(config) {
    const buttons = config.buttons.map(row => {
      return row.map(btn => {
        if (btn.url) return { text: btn.text, url: btn.url };
        if (btn.callback_data) return { text: btn.text, callback_data: btn.callback_data };
        return { text: btn.text };
      });
    });
    
    if (config.type === 'inline') {
      return this.inline(buttons);
    } else {
      return this.reply(buttons, config.options || {});
    }
  }
}

module.exports = new KeyboardBuilder();