// client/src/services/router/routerUtils.js
import { storage } from '../../utils/storage';
import { authService } from '../auth/authService';
import { logger } from '../logging/logger';

export class RouterUtils {
  constructor() {
    this.routes = new Map();
    this.beforeEachGuards = [];
    this.afterEachHooks = [];
  }

  registerRoute(path, options = {}) {
    this.routes.set(path, {
      auth: options.requiresAuth || false,
      roles: options.roles || [],
      meta: options.meta || {},
    });
  }

  beforeEach(guard) {
    this.beforeEachGuards.push(guard);
  }

  afterEach(hook) {
    this.afterEachHooks.push(hook);
  }

  async canAccess(path) {
    const route = this.routes.get(path);
    if (!route) return true;

    if (route.auth && !authService.isAuthenticated()) {
      return false;
    }

    if (route.roles?.length > 0) {
      const user = authService.getUser();
      if (!user || !route.roles.some(role => user.roles.includes(role))) {
        return false;
      }
    }

    return true;
  }

  saveLastRoute() {
    storage.set('lastRoute', window.location.pathname);
  }

  getLastRoute() {
    return storage.get('lastRoute', '/');
  }

  buildQueryString(params) {
    return Object.entries(params)
      .filter(([_, value]) => value !== undefined && value !== null)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');
  }

  parseQueryString(queryString) {
    if (!queryString) return {};
    return Object.fromEntries(
      queryString
        .substring(1)
        .split('&')
        .map(param => {
          const [key, value] = param.split('=');
          return [decodeURIComponent(key), decodeURIComponent(value)];
        })
    );
  }

  async handleNavigation(to, from) {
    try {
      // Run before guards
      for (const guard of this.beforeEachGuards) {
        const result = await guard(to, from);
        if (result === false) {
          return false;
        }
      }

      // Check access
      const hasAccess = await this.canAccess(to.path);
      if (!hasAccess) {
        return '/login?redirect=' + encodeURIComponent(to.path);
      }

      // Run after hooks
      this.afterEachHooks.forEach(hook => {
        try {
          hook(to, from);
        } catch (error) {
          logger.error('Error in router after hook:', error);
        }
      });

      return true;
    } catch (error) {
      logger.error('Navigation error:', error);
      return '/error';
    }
  }
}

export const routerUtils = new RouterUtils();

// Register common routes
routerUtils.registerRoute('/profile', { requiresAuth: true });
routerUtils.registerRoute('/admin', { requiresAuth: true, roles: ['admin'] });

// Add common navigation guards
routerUtils.beforeEach(async (to, from) => {
  logger.info('Navigation:', { from: from.path, to: to.path });
});

routerUtils.afterEach((to, from) => {
  // Track page view
  if (to.path !== from.path) {
    analytics.pageView(to.path);
  }
});
