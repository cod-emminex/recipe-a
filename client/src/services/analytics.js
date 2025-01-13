// client/src/services/analytics.js
class AnalyticsService {
  constructor() {
    this.events = [];
    this.batchSize = 10;
    this.flushInterval = 30000; // 30 seconds
    this.initializeFlushInterval();
  }

  initializeFlushInterval() {
    setInterval(() => {
      this.flush();
    }, this.flushInterval);
  }

  track(eventName, data = {}) {
    const event = {
      eventName,
      timestamp: new Date().toISOString(),
      data: {
        ...data,
        url: window.location.pathname,
        userAgent: navigator.userAgent,
      },
    };

    this.events.push(event);

    if (this.events.length >= this.batchSize) {
      this.flush();
    }
  }

  async flush() {
    if (this.events.length === 0) return;

    const eventsToSend = [...this.events];
    this.events = [];

    try {
      await fetch("/api/analytics/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ events: eventsToSend }),
      });
    } catch (error) {
      console.error("Error sending analytics:", error);
      // Add events back to the queue
      this.events = [...eventsToSend, ...this.events];
    }
  }

  pageView(pageName, metadata = {}) {
    this.track("PAGE_VIEW", { pageName, ...metadata });
  }

  recipeView(recipeId, recipeTitle) {
    this.track("RECIPE_VIEW", { recipeId, recipeTitle });
  }

  userAction(action, metadata = {}) {
    this.track("USER_ACTION", { action, ...metadata });
  }

  error(error, metadata = {}) {
    this.track("ERROR", {
      message: error.message,
      stack: error.stack,
      ...metadata,
    });
  }
}

export default new AnalyticsService();
