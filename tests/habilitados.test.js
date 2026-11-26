const request = require('supertest');
const app = require('../src/app');

describe('POST /habilitados — error middleware', () => {
  test('invalid JSON body returns 400 with JSON inválido', async () => {
    const res = await request(app)
      .post('/habilitados')
      .set('Content-Type', 'application/json')
      .send('{invalid json}');

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'JSON inválido' });
  });

  test('body exceeding 10 kb returns 413 with el cuerpo excede el tamaño permitido', async () => {
    // 5000 valid-format codes × ~9 bytes each ≈ 45 kb — well above the 10 kb limit
    const codes = Array.from({ length: 5000 }, () => '1INF25');
    const res = await request(app)
      .post('/habilitados')
      .set('Content-Type', 'application/json')
      .send(JSON.stringify({ aprobados: codes }));

    expect(res.status).toBe(413);
    expect(res.body).toEqual({ error: 'el cuerpo excede el tamaño permitido' });
  });
});
