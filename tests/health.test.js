const request = require('supertest');
const app = require('../src/app');

describe('GET /health', () => {
  test('responde 200 con estado ok y la cantidad de cursos', async () => {
    const res = await request(app).get('/health');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok', cursos: 87 });
  });
});
