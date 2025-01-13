// client/src/services/security/securityService.js
class SecurityService {
  constructor() {
    this.csrfToken = null;
    this.securityHeaders = new Map();
    this.initialize();
  }

  initialize() {
    this.updateCsrfToken();
    this.setupSecurityHeaders();
    this.initializeContentSecurity();
  }

  setupSecurityHeaders() {
    this.securityHeaders.set("X-Content-Type-Options", "nosniff");
    this.securityHeaders.set("X-Frame-Options", "DENY");
    this.securityHeaders.set("X-XSS-Protection", "1; mode=block");
  }

  getSecurityHeaders() {
    const headers = {};
    this.securityHeaders.forEach((value, key) => {
      headers[key] = value;
    });
    return headers;
  }

  updateCsrfToken() {
    this.csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;
  }

  sanitizeInput(input) {
    if (typeof input !== "string") return input;
    return input
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#x27;");
  }

  validateUrl(url) {
    try {
      const parsedUrl = new URL(url);
      return parsedUrl.protocol === "https:" || parsedUrl.protocol === "http:";
    } catch {
      return false;
    }
  }
}

export const securityService = new SecurityService();
