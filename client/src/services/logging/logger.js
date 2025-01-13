// client/src/services/logging/logger.js
import * as Sentry from '@sentry/browser';
import config from '../../config/config';

class Logger {
  constructor() {
    this.initialized = false;
    this.environment = process.env.NODE_ENV;
    this.logs = [];
    this.maxLogsInMemory = 1000;
  }

  initialize() {
    if (this.initialized) return;

    if (config.SENTRY_DSN) {
      Sentry.init({
        dsn: config.SENTRY_DSN,
        environment: this.environment,
        release: config.APP_VERSION,
        tracesSampleRate: 1.0,
      });
    }

    this.initialized = true;
    window.onerror = (message, source, lineno, colno, error) => {
      this.error('Window Error', { message, source, lineno, colno, error });
    };

    window.onunhandledrejection = (event) => {
      this.error('Unhandled Promise Rejection', {
        reason: event.reason,
      });
    };
  }

  log(level, message, data = {}) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
      url: window.location.href,
      userAgent: navigator.userAgent,
    };

    this.addToMemory(logEntry);

    if (this.environment === 'development') {
      console.log(`[${level.toUpperCase()}] ${message}`, data);
    }

    if (level === 'error') {
      Sentry.captureException(data.error || new Error(message), {
        extra: data,
      });
    }

    // Send to backend if needed
    if (level === 'error' || level === 'warn') {
      this.sendToServer(logEntry);
    }
  }

  addToMemory(logEntry) {
    this.logs.push(logEntry);
    if (this.logs.length > this.maxLogsInMemory) {
      this.logs.shift();
    }
  }

  async sendToServer(logEntry) {
    try {
      await fetch('/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(logEntry),
      });
    } catch (error) {
      console.error('Failed to send log to server:', error);
    }
  }

  debug(message, data) {
    this.log('debug', message, data);
  }

  info(message, data) {
    this.log('info', message, data);
  }

  warn(message, data) {
    this.log('warn', message, data);
  }

  error(message, data) {
    this.log('error', message, data);
  }

  getRecentLogs() {
    return [...this.logs];
  }

  clearLogs() {
    this.logs = [];
  }
}

export const logger = new Logger();
