// client/src/services/eventBus.js
class EventBus {
  constructor() {
    this.listeners = new Map();
    this.history = new Map();
    this.maxHistoryLength = 100;
  }

  on(event, callback, options = {}) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }

    const listener = { callback, options };
    this.listeners.get(event).add(listener);

    // If replay option is set, emit last event immediately
    if (options.replay && this.history.has(event)) {
      const lastEvent = this.history.get(event);
      callback(lastEvent);
    }

    return () => this.off(event, callback);
  }

  off(event, callback) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach((listener) => {
        if (listener.callback === callback) {
          this.listeners.get(event).delete(listener);
        }
      });
    }
  }

  emit(event, data) {
    // Store in history
    this.history.set(event, data);
    if (this.history.size > this.maxHistoryLength) {
      const firstKey = this.history.keys().next().value;
      this.history.delete(firstKey);
    }

    // Notify listeners
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach((listener) => {
        try {
          listener.callback(data);
        } catch (error) {
          console.error(`Error in event listener for ${event}:`, error);
        }
      });
    }
  }

  once(event, callback) {
    const wrapper = (data) => {
      this.off(event, wrapper);
      callback(data);
    };
    return this.on(event, wrapper);
  }

  clear() {
    this.listeners.clear();
    this.history.clear();
  }
}

export default new EventBus();
