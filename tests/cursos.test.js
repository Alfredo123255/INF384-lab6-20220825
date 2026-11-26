const request = require('supertest');
const app = require('../src/app');

describe('GET /cursos', () => {
  // 1.1 — devuelve todos los cursos con los campos requeridos
  test('1.1 devuelve 200 con todos los cursos', async () => {
    const res = await request(app).get('/cursos');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);

    const curso = res.body[0];
    expect(curso).toHaveProperty('id');
    expect(curso).toHaveProperty('name');
    expect(curso).toHaveProperty('credits');
    expect(curso).toHaveProperty('cycle');
    expect(curso).toHaveProperty('type');
  });

  test('1.1 devuelve los 87 cursos en total', async () => {
    const res = await request(app).get('/cursos');

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(87);
  });

  // 1.2 — filtro por ciclo válido
  test('1.2 devuelve solo los cursos del ciclo indicado', async () => {
    const res = await request(app).get('/cursos?ciclo=6');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    res.body.forEach((curso) => expect(curso.cycle).toBe(6));
  });

  test('1.2 ciclo=5 devuelve solo cursos del ciclo 5', async () => {
    const res = await request(app).get('/cursos?ciclo=5');

    expect(res.status).toBe(200);
    res.body.forEach((curso) => expect(curso.cycle).toBe(5));
  });

  test('1.2 ciclo=10 devuelve solo cursos del ciclo 10', async () => {
    const res = await request(app).get('/cursos?ciclo=10');

    expect(res.status).toBe(200);
    res.body.forEach((curso) => expect(curso.cycle).toBe(10));
  });

  // 1.3 — ciclo fuera de rango o no entero → 400
  test('1.3 ciclo=4 responde 400 con mensaje de error', async () => {
    const res = await request(app).get('/cursos?ciclo=4');

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'ciclo debe ser un entero entre 5 y 10' });
  });

  test('1.3 ciclo=11 responde 400 con mensaje de error', async () => {
    const res = await request(app).get('/cursos?ciclo=11');

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'ciclo debe ser un entero entre 5 y 10' });
  });

  test('1.3 ciclo=abc responde 400 con mensaje de error', async () => {
    const res = await request(app).get('/cursos?ciclo=abc');

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'ciclo debe ser un entero entre 5 y 10' });
  });

  test('1.3 ciclo=5.5 responde 400 con mensaje de error', async () => {
    const res = await request(app).get('/cursos?ciclo=5.5');

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'ciclo debe ser un entero entre 5 y 10' });
  });
});

describe('GET /cursos/:codigo', () => {
  // 2.1 — devuelve el detalle con requisitos resueltos
  test('2.1 devuelve 200 con los campos correctos para un código existente', async () => {
    const res = await request(app).get('/cursos/1INF30');

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      id: '1INF30',
      name: expect.any(String),
      credits: expect.any(Number),
      cycle: expect.any(Number),
      type: expect.any(String),
    });
    expect(Array.isArray(res.body.prerequisites)).toBe(true);
  });

  test('2.1 cada prerequisito tiene id y name', async () => {
    // 1CON27 tiene un prerequisito (1IND90)
    const res = await request(app).get('/cursos/1CON27');

    expect(res.status).toBe(200);
    expect(res.body.prerequisites.length).toBeGreaterThan(0);
    res.body.prerequisites.forEach((prereq) => {
      expect(prereq).toHaveProperty('id');
      expect(prereq).toHaveProperty('name');
      expect(typeof prereq.id).toBe('string');
      expect(typeof prereq.name).toBe('string');
    });
  });

  test('2.1 el nombre del prerequisito está resuelto correctamente', async () => {
    const res = await request(app).get('/cursos/1CON27');

    expect(res.status).toBe(200);
    const prereq = res.body.prerequisites.find((p) => p.id === '1IND90');
    expect(prereq).toBeDefined();
    expect(prereq.name).toBe('Empresa y su Entorno');
  });

  // 2.2 — código inexistente → 404
  test('2.2 devuelve 404 con mensaje de error para código inexistente', async () => {
    const res = await request(app).get('/cursos/NOEXISTE');

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'curso no encontrado' });
  });
});
