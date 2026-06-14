// ChessOS — Hash-based SPA Router

export class Router {
  constructor() {
    this.routes = {};
    this.currentRoute = null;
    this.currentParams = {};
    this.beforeHooks = [];
    this.afterHooks = [];
    
    window.addEventListener('hashchange', () => this._resolve());
  }

  // Register route
  route(path, handler) {
    this.routes[path] = handler;
    return this;
  }

  // Navigate
  navigate(path) {
    window.location.hash = '#' + path;
  }

  // Get current path
  currentPath() {
    return window.location.hash.slice(1) || '/';
  }

  // Before/after hooks
  before(fn) { this.beforeHooks.push(fn); return this; }
  after(fn) { this.afterHooks.push(fn); return this; }

  // Start router
  start() {
    this._resolve();
  }

  // Resolve current route
  _resolve() {
    const path = this.currentPath();
    
    // Run before hooks
    for (const hook of this.beforeHooks) {
      if (hook(path) === false) return;
    }

    // Find matching route
    let handler = null;
    let params = {};

    for (const [pattern, h] of Object.entries(this.routes)) {
      const match = this._match(pattern, path);
      if (match) {
        handler = h;
        params = match;
        break;
      }
    }

    if (!handler && this.routes['*']) {
      handler = this.routes['*'];
    }

    if (handler) {
      this.currentRoute = path;
      this.currentParams = params;
      handler(params);
    }

    // Run after hooks
    for (const hook of this.afterHooks) {
      hook(path, params);
    }
  }

  // Pattern matching with params
  _match(pattern, path) {
    const patternParts = pattern.split('/').filter(Boolean);
    const pathParts = path.split('/').filter(Boolean);

    if (patternParts.length !== pathParts.length) return null;

    const params = {};
    for (let i = 0; i < patternParts.length; i++) {
      if (patternParts[i].startsWith(':')) {
        params[patternParts[i].slice(1)] = decodeURIComponent(pathParts[i]);
      } else if (patternParts[i] !== pathParts[i]) {
        return null;
      }
    }
    return params;
  }
}

export default Router;
