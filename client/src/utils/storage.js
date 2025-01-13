// client/src/utils/storage.js
const PREFIX = "recipe_app_";

export const storage = {
  set: (key, value) => {
    try {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(PREFIX + key, serializedValue);
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  },

  get: (key, defaultValue = null) => {
    try {
      const serializedValue = localStorage.getItem(PREFIX + key);
      return serializedValue ? JSON.parse(serializedValue) : defaultValue;
    } catch (error) {
      console.error("Error reading from localStorage:", error);
      return defaultValue;
    }
  },

  remove: (key) => {
    try {
      localStorage.removeItem(PREFIX + key);
    } catch (error) {
      console.error("Error removing from localStorage:", error);
    }
  },

  clear: () => {
    try {
      Object.keys(localStorage)
        .filter((key) => key.startsWith(PREFIX))
        .forEach((key) => localStorage.removeItem(key));
    } catch (error) {
      console.error("Error clearing localStorage:", error);
    }
  },
};
