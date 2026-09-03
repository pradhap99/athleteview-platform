/**
 * Smoke tests for the gateway route modules.
 *
 * These mount each router on a throwaway Express app and assert it responds.
 * src/index.js is deliberately not imported: it calls server.listen() at module
 * scope, which would bind a port and leave an open handle in the test run.
 */
const express = require('express');

const ROUTERS = ['athletes', 'apikeys', 'highlights', 'streams'];

describe('gateway route modules', () => {
  test.each(ROUTERS)('%s router loads and mounts', (name) => {
    const router = require(`../src/routes/${name}`);
    expect(typeof router).toBe('function');

    const app = express();
    app.use(express.json());
    expect(() => app.use(`/api/v1/${name}`, router)).not.toThrow();
  });
});
