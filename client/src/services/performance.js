// client/src/services/performance.js
class PerformanceMonitor {
  constructor() {
    this.metrics = new Map();
    this.enabled = process.env.NODE_ENV !== "production";
  }

  startTimer(label) {
    if (!this.enabled) return;
    this.metrics.set(label, {
      start: performance.now(),
      end: null,
      duration: null,
    });
  }

  endTimer(label) {
    if (!this.enabled) return;
    const metric = this.metrics.get(label);
    if (metric) {
      metric.end = performance.now();
      metric.duration = metric.end - metric.start;
      console.log(`Performance [${label}]: ${metric.duration.toFixed(2)}ms`);
    }
  }

  measure(label, callback) {
    if (!this.enabled) return callback();

    this.startTimer(label);
    const result = callback();

    if (result instanceof Promise) {
      return result.finally(() => this.endTimer(label));
    }

    this.endTimer(label);
    return result;
  }

  async measureAsync(label, promise) {
    if (!this.enabled) return promise;

    this.startTimer(label);
    try {
      return await promise;
    } finally {
      this.endTimer(label);
    }
  }

  getMetrics() {
    const results = {};
    this.metrics.forEach((value, key) => {
      results[key] = {
        duration: value.duration,
        timestamp: value.end,
      };
    });
    return results;
  }

  clearMetrics() {
    this.metrics.clear();
  }
}

export default new PerformanceMonitor();
