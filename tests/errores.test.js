const request = require('supertest');
const express = require('express');

// Build a minimal Express app that replicates only the error middleware,
// with a route that deliberately throws, to test the middleware in isolation.
function buildTestApp() {
  const app = express();

  app.get('/boom', (req, res, next) => {
    next(new Error('fallo inesperado'));
  });

  // Same error handler as src/app.js
  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'internal server error' });
  });

  return app;
}

describe('Middleware de manejo de errores (3.1)', () => {
  test('responde 500 con JSON genérico ante un error no controlado', async () => {
    const app = buildTestApp();
    const res = await request(app).get('/boom');

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: 'internal server error' });
  });
});
