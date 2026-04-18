/**
 * localStorage utility functions
 * These wrap get/set operations with JSON parsing and error handling
 */

// Get a value from localStorage (returns defaultValue if not found or on error)
export const getFromStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
};

// Save a value to localStorage
export const saveToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error('localStorage write error:', err);
  }
};

// Remove a key from localStorage
export const removeFromStorage = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (err) {
    console.error('localStorage remove error:', err);
  }
};

// Storage keys used throughout the app
export const STORAGE_KEYS = {
  USER: 'dlms_user',
  FAVORITES: 'dlms_favorites',
  BORROWED: 'dlms_borrowed',
  THEME: 'dlms_theme',
  POINTS: 'dlms_points',
  BADGES: 'dlms_badges',
};
