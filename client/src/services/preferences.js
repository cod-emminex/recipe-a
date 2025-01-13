// client/src/services/preferences.js
import { storage } from "../utils/storage";

class PreferencesService {
  constructor() {
    this.preferences = this.loadPreferences();
    this.listeners = new Set();
  }

  loadPreferences() {
    return {
      theme: storage.get("theme", "light"),
      fontSize: storage.get("fontSize", "medium"),
      measurementUnit: storage.get("measurementUnit", "metric"),
      notifications: storage.get("notifications", {
        email: true,
        push: true,
        newsletter: false,
      }),
      privacy: storage.get("privacy", {
        shareRecipes: true,
        showProfile: true,
        allowComments: true,
      }),
      accessibility: storage.get("accessibility", {
        reduceMotion: false,
        highContrast: false,
        largeText: false,
      }),
      ...storage.get("customPreferences", {}),
    };
  }

  async savePreferences(newPreferences) {
    this.preferences = {
      ...this.preferences,
      ...newPreferences,
    };

    // Save to local storage
    Object.entries(newPreferences).forEach(([key, value]) => {
      storage.set(key, value);
    });

    // Sync with server
    try {
      await fetch("/api/users/preferences", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPreferences),
      });

      this.notifyListeners();
    } catch (error) {
      console.error("Error saving preferences:", error);
      throw error;
    }
  }

  get(key) {
    return this.preferences[key];
  }

  async set(key, value) {
    await this.savePreferences({ [key]: value });
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notifyListeners() {
    this.listeners.forEach((listener) => {
      try {
        listener(this.preferences);
      } catch (error) {
        console.error("Error in preference listener:", error);
      }
    });
  }

  resetToDefaults() {
    const defaultPreferences = {
      theme: "light",
      fontSize: "medium",
      measurementUnit: "metric",
      notifications: {
        email: true,
        push: true,
        newsletter: false,
      },
      privacy: {
        shareRecipes: true,
        showProfile: true,
        allowComments: true,
      },
      accessibility: {
        reduceMotion: false,
        highContrast: false,
        largeText: false,
      },
    };

    return this.savePreferences(defaultPreferences);
  }
}

export default new PreferencesService();
