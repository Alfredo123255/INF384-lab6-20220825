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

describe('POST /habilitados — Validador', () => {
  // Req 2.1 — aprobados is a string
  test('aprobados is a string returns 400 aprobados debe ser un arreglo', async () => {
    const res = await request(app)
      .post('/habilitados')
      .send({ aprobados: '1INF25' });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'aprobados debe ser un arreglo' });
  });

  // Req 2.2 — aprobados is a number
  test('aprobados is a number returns 400 aprobados debe ser un arreglo', async () => {
    const res = await request(app)
      .post('/habilitados')
      .send({ aprobados: 42 });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'aprobados debe ser un arreglo' });
  });

  // Req 2.3 — aprobados is a boolean
  test('aprobados is a boolean returns 400 aprobados debe ser un arreglo', async () => {
    const res = await request(app)
      .post('/habilitados')
      .send({ aprobados: true });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'aprobados debe ser un arreglo' });
  });

  // Req 2.4 — aprobados is absent
  test('aprobados absent returns 400 aprobados debe ser un arreglo', async () => {
    const res = await request(app)
      .post('/habilitados')
      .send({});
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'aprobados debe ser un arreglo' });
  });

  // Req 2.5 — array contains a non-string element
  test('array with non-string element returns 400 cada elemento de aprobados debe ser un string', async () => {
    const res = await request(app)
      .post('/habilitados')
      .send({ aprobados: [123] });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'cada elemento de aprobados debe ser un string' });
  });

  // Req 2.5 — null element
  test('array with null element returns 400 cada elemento de aprobados debe ser un string', async () => {
    const res = await request(app)
      .post('/habilitados')
      .send({ aprobados: [null] });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'cada elemento de aprobados debe ser un string' });
  });

  // Req 3.1 — 101 elements
  test('101 elements returns 400 aprobados excede el maximo permitido', async () => {
    const codes = Array.from({ length: 101 }, () => '1INF25');
    const res = await request(app)
      .post('/habilitados')
      .send({ aprobados: codes });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'aprobados excede el máximo permitido de 100 elementos' });
  });

  // Req 3.2 — exactly 100 elements passes through
  test('exactly 100 elements returns 200', async () => {
    const codes = Array.from({ length: 100 }, () => '1INF25');
    const res = await request(app)
      .post('/habilitados')
      .send({ aprobados: codes });
    expect(res.status).toBe(200);
  });

  // Req 4.1 — invalid code with special characters
  test('code with special characters returns 400 codigo invalido en aprobados', async () => {
    const res = await request(app)
      .post('/habilitados')
      .send({ aprobados: ['1INF30<script>'] });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'código inválido en aprobados' });
  });

  // Req 4.1 — lowercase code
  test('lowercase code returns 400 codigo invalido en aprobados', async () => {
    const res = await request(app)
      .post('/habilitados')
      .send({ aprobados: ['1inf30'] });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'código inválido en aprobados' });
  });

  // Req 4.1 — too-short code
  test('short code ABC returns 400 codigo invalido en aprobados', async () => {
    const res = await request(app)
      .post('/habilitados')
      .send({ aprobados: ['ABC'] });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'código inválido en aprobados' });
  });

  // Req 4.2 — error body has only the error field
  test('400 error body contains only the error field', async () => {
    const res = await request(app)
      .post('/habilitados')
      .send({ aprobados: ['1inf30'] });
    expect(res.status).toBe(400);
    expect(Object.keys(res.body)).toEqual(['error']);
  });

  // Req 4.3 — valid codes pass validation
  test('valid codes pass validation and return 200', async () => {
    const res = await request(app)
      .post('/habilitados')
      .send({ aprobados: ['1INF25', '1INF27', '1INF49'] });
    expect(res.status).toBe(200);
  });
});
