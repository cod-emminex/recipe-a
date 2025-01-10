// frontend/js/utils/state.js

class StateManager {
  constructor() {
    this.state = {
      user: null,
      recipes: [],
      categories: [],
      notifications: [],
      currentRecipe: null,
      filters: {
        category: null,
        difficulty: null,
        cookingTime: null,
        sort: "latest",
      },
      ui: {
        darkMode: false,
        sidebarOpen: false,
        loading: false,
        currentModal: null,
      },
    };
    this.listeners = new Map();
    this.loadPersistedState();
  }
  loadPersistedState() {
    try {
      const persistedState = localStorage.getItem("app_state");
      if (persistedState) {
        const parsedState = JSON.parse(persistedState);
        this.state = { ...this.state, ...parsedState };
      }

      // Load theme preference
      const theme = localStorage.getItem("theme");
      if (theme) {
        this.state.ui.darkMode = theme === "dark";
        document.body.classList.toggle("dark-theme", this.state.ui.darkMode);
      }
    } catch (error) {
      console.error("Failed to load persisted state:", error);
    }
  }

  subscribe(key, callback) {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set());
    }
    this.listeners.get(key).add(callback);

    // Return unsubscribe function
    return () => {
      const listeners = this.listeners.get(key);
      if (listeners) {
        listeners.delete(callback);
      }
    };
  }

  notify(key) {
    const listeners = this.listeners.get(key);
    if (listeners) {
      listeners.forEach((callback) => callback(this.state[key]));
    }
  }

  setState(key, value) {
    if (typeof value === "function") {
      this.state[key] = value(this.state[key]);
    } else {
      this.state[key] = value;
    }
    this.notify(key);
    this.persistState();
  }

  getState(key) {
    return this.state[key];
  }

  persistState() {
    try {
      const persistedState = {
        filters: this.state.filters,
        ui: {
          darkMode: this.state.ui.darkMode,
        },
      };
      localStorage.setItem("app_state", JSON.stringify(persistedState));
    } catch (error) {
      console.error("Failed to persist state:", error);
    }
  }
}

export const state = new StateManager();
