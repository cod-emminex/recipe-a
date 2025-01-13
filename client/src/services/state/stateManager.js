// client/src/services/state/stateManager.js
import { eventBus } from "../eventBus";
import { storage } from "../../utils/storage";

class StateManager {
  constructor() {
    this.state = new Map();
    this.persistentKeys = new Set();
    this.subscribers = new Map();
    this.loadPersistedState();
  }

  loadPersistedState() {
    const persistedState = storage.get("persistedState", {});
    Object.entries(persistedState).forEach(([key, value]) => {
      this.state.set(key, value);
      this.persistentKeys.add(key);
    });
  }

  savePersistedState() {
    const persistedState = {};
    this.persistentKeys.forEach((key) => {
      persistedState[key] = this.state.get(key);
    });
    storage.set("persistedState", persistedState);
  }

  get(key, defaultValue = null) {
    return this.state.has(key) ? this.state.get(key) : defaultValue;
  }

  set(key, value, options = { persist: false }) {
    const oldValue = this.state.get(key);
    this.state.set(key, value);

    if (options.persist) {
      this.persistentKeys.add(key);
      this.savePersistedState();
    }

    if (oldValue !== value) {
      this.notifySubscribers(key, value, oldValue);
    }
  }

  subscribe(key, callback) {
    if (!this.subscribers.has(key)) {
      this.subscribers.set(key, new Set());
    }
    this.subscribers.get(key).add(callback);

    return () => this.unsubscribe(key, callback);
  }

  unsubscribe(key, callback) {
    if (this.subscribers.has(key)) {
      this.subscribers.get(key).delete(callback);
    }
  }

  notifySubscribers(key, newValue, oldValue) {
    if (this.subscribers.has(key)) {
      this.subscribers.get(key).forEach((callback) => {
        try {
          callback(newValue, oldValue);
        } catch (error) {
          console.error(`Error in state subscriber for key ${key}:`, error);
        }
      });
    }

    // Emit global state change event
    eventBus.emit("state:change", { key, newValue, oldValue });
  }

  batch(updates) {
    const oldValues = new Map();
    updates.forEach(([key, value]) => {
      oldValues.set(key, this.state.get(key));
      this.state.set(key, value);
    });

    updates.forEach(([key, value]) => {
      this.notifySubscribers(key, value, oldValues.get(key));
    });

    this.savePersistedState();
  }

  reset(keys = []) {
    if (keys.length === 0) {
      this.state.clear();
      this.persistentKeys.clear();
      this.savePersistedState();
    } else {
      keys.forEach((key) => {
        this.state.delete(key);
        this.persistentKeys.delete(key);
      });
      this.savePersistedState();
    }
  }
}

export const stateManager = new StateManager();
