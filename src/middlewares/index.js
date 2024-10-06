import {
  // authenticationHandler,
  errorHandler,
  proxyHandler,
} from './index.js';

export default function middleware(app, callback) {
  // app.use(proxyHandler);
  // app.use(authenticationHandler);
  callback();
  app.use(errorHandler);
}

export * from './proxy.handler.js';
// export * from './authentication.handler.js';
export * from './error.handler.js';
