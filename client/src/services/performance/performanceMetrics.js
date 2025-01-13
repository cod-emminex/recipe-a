// client/src/services/performance/performanceMetrics.js
class PerformanceMetrics {
  constructor() {
    this.metrics = new Map();
    this.observers = new Map();
    this.initialize();
  }

  initialize() {
    this.observeResourceTiming();
    this.observeLongTasks();
    this.observeFirstPaint();
    this.trackMemoryUsage();
  }

  observeResourceTiming() {
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        this.recordMetric("resource", {
          name: entry.name,
          duration: entry.duration,
          transferSize: entry.transferSize,
        });
      });
    });

    observer.observe({ entryTypes: ["resource"] });
    this.observers.set("resource", observer);
  }

  observeLongTasks() {
    if ("PerformanceLongTaskTiming" in window) {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          this.recordMetric("longTask", {
            duration: entry.duration,
            startTime: entry.startTime,
          });
        });
      });

      observer.observe({ entryTypes: ["longtask"] });
      this.observers.set("longTask", observer);
    }
  }

  trackMemoryUsage() {
    if (performance.memory) {
      setInterval(() => {
        this.recordMetric("memory", {
          usedJSHeapSize: performance.memory.usedJSHeapSize,
          totalJSHeapSize: performance.memory.totalJSHeapSize,
        });
      }, 10000);
    }
  }

  recordMetric(type, data) {
    if (!this.metrics.has(type)) {
      this.metrics.set(type, []);
    }
    this.metrics.get(type).push({
      timestamp: Date.now(),
      ...data,
    });
  }

  getMetrics(type) {
    return this.metrics.get(type) || [];
  }

  clearMetrics() {
    this.metrics.clear();
  }
}

export const performanceMetrics = new PerformanceMetrics();
