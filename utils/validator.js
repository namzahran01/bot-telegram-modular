// utils/validator.js - Validation Utility

class Validator {
  // Validate email
  isEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }
  
  // Validate phone number (international format)
  isPhoneNumber(phone) {
    const regex = /^\+?[1-9]\d{1,14}$/;
    return regex.test(phone.replace(/[\s-]/g, ''));
  }
  
  // Validate URL
  isUrl(url) {
    try {
      new URL(url);
      return true;
    } catch (_) {
      return false;
    }
  }
  
  // Validate Telegram username
  isUsername(username) {
    const regex = /^[a-zA-Z0-9_]{5,32}$/;
    return regex.test(username);
  }
  
  // Validate number
  isNumber(value) {
    return !isNaN(parseFloat(value)) && isFinite(value);
  }
  
  // Validate integer
  isInteger(value) {
    return Number.isInteger(Number(value));
  }
  
  // Validate positive number
  isPositive(value) {
    return this.isNumber(value) && Number(value) > 0;
  }
  
  // Validate range
  inRange(value, min, max) {
    const num = Number(value);
    return this.isNumber(value) && num >= min && num <= max;
  }
  
  // Validate string length
  hasLength(str, min, max = Infinity) {
    const length = String(str).length;
    return length >= min && length <= max;
  }
  
  // Validate required field
  isRequired(value) {
    if (value === null || value === undefined) return false;
    if (typeof value === 'string') return value.trim().length > 0;
    return true;
  }
  
  // Validate array
  isArray(value) {
    return Array.isArray(value);
  }
  
  // Validate non-empty array
  isNonEmptyArray(value) {
    return Array.isArray(value) && value.length > 0;
  }
  
  // Validate object
  isObject(value) {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
  }
  
  // Validate date
  isDate(value) {
    const date = new Date(value);
    return date instanceof Date && !isNaN(date);
  }
  
  // Validate future date
  isFutureDate(value) {
    const date = new Date(value);
    return this.isDate(value) && date > new Date();
  }
  
  // Validate past date
  isPastDate(value) {
    const date = new Date(value);
    return this.isDate(value) && date < new Date();
  }
  
  // Validate JSON string
  isJSON(str) {
    try {
      JSON.parse(str);
      return true;
    } catch (_) {
      return false;
    }
  }
  
  // Validate alpha (letters only)
  isAlpha(str) {
    const regex = /^[a-zA-Z]+$/;
    return regex.test(str);
  }
  
  // Validate alphanumeric
  isAlphanumeric(str) {
    const regex = /^[a-zA-Z0-9]+$/;
    return regex.test(str);
  }
  
  // Custom validation with error message
  validate(value, rules) {
    const errors = [];
    
    if (rules.required && !this.isRequired(value)) {
      errors.push('This field is required');
      return { valid: false, errors };
    }
    
    if (rules.email && !this.isEmail(value)) {
      errors.push('Invalid email format');
    }
    
    if (rules.url && !this.isUrl(value)) {
      errors.push('Invalid URL format');
    }
    
    if (rules.phone && !this.isPhoneNumber(value)) {
      errors.push('Invalid phone number format');
    }
    
    if (rules.username && !this.isUsername(value)) {
      errors.push('Invalid username format');
    }
    
    if (rules.number && !this.isNumber(value)) {
      errors.push('Must be a number');
    }
    
    if (rules.integer && !this.isInteger(value)) {
      errors.push('Must be an integer');
    }
    
    if (rules.positive && !this.isPositive(value)) {
      errors.push('Must be a positive number');
    }
    
    if (rules.min !== undefined && Number(value) < rules.min) {
      errors.push(`Minimum value is ${rules.min}`);
    }
    
    if (rules.max !== undefined && Number(value) > rules.max) {
      errors.push(`Maximum value is ${rules.max}`);
    }
    
    if (rules.minLength !== undefined && !this.hasLength(value, rules.minLength)) {
      errors.push(`Minimum length is ${rules.minLength}`);
    }
    
    if (rules.maxLength !== undefined && String(value).length > rules.maxLength) {
      errors.push(`Maximum length is ${rules.maxLength}`);
    }
    
    if (rules.pattern && !rules.pattern.test(value)) {
      errors.push(rules.patternMessage || 'Invalid format');
    }
    
    if (rules.custom && typeof rules.custom === 'function') {
      const customResult = rules.custom(value);
      if (customResult !== true) {
        errors.push(customResult || 'Validation failed');
      }
    }
    
    return {
      valid: errors.length === 0,
      errors,
    };
  }
}

module.exports = new Validator();