# Implementation Plan: Habilitados

## Overview

Adds `POST /habilitados` to the Malla INF service. The work splits into four small commits: (1) adjust `app.js` to add the body size limit and update the error middleware; (2) create the route with the Validador; (3) add the Calculador logic and wire the route into `app.js`; (4) enforce the coverage gate in `jest.config.js`.

## Tasks

- [x] 1. Update error middleware and body size limit in `src/app.js`
  - Replace `app.use(express.json())` with `app.use(express.json({ limit: '10kb' }))`
  - Extend the global error handler to return 400 for `SyntaxError` with `{ "error": "JSON inválido" }` and 413 for `entity.too.large` with `{ "error": "el cuerpo excede el tamaño permitido" }`
  - Add tests in `tests/habilitados.test.js` for invalid JSON body (400) and body > 10 kb (413)
  - _Requisitos: 2.6, 3.3_

- [ ] 2. Create `src/routes/habilitados.js` with the Validador
  - Register `router.post('/', handler)` using Express Router
  - Implement the five guard clauses in order: array check → length ≤ 100 → all strings → all match `^[0-9A-Z]{6}$`
  - Return `res.status(400).json({ error: '...' })` with the exact messages from the HTTP contract
  - Mount `app.use('/habilitados', require('./routes/habilitados'))` in `src/app.js` after the `/cursos` mount
  - Add tests covering each validation error (2.1–2.5, 3.1, 4.1–4.2)
  - _Requisitos: 2.1, 2.2, 2.3, 2.4, 2.5, 3.1, 3.2, 4.1, 4.2, 4.3_

- [ ] 3. Implement the Calculador
  - Build `aprobadosSet = new Set(aprobados)` and filter `repositorio.listar()` in one pass: skip courses whose `id` is in the set, include courses whose every prerequisite is in the set
  - Add tests for `aprobados: []` (all zero-prereq courses), `aprobados: ["1INF25","1INF27","1INF49"]` (27 results, includes 1INF29/30/31/32), unknown valid-format ID (`"ZZZZZZ"`), and exactly 100 elements (200 OK)
  - _Requisitos: 1.1, 1.2, 1.3, 1.4, 1.5, 5.1, 5.2_

- [ ] 4. Add coverage gate to `jest.config.js`
  - Add `coverageThreshold: { global: { lines: 80 } }` and `collectCoverage: true` to `jest.config.js`
  - Do NOT verify that `npm test` passes; it is expected to fail because `src/util/formato.js` has 0 % coverage at this point
  - _Requisitos: 6.1, 6.2_

- [ ] 5. Create `tests/formato.test.js` to cover `src/util/formato.js`
  - Write tests for every exported function in `src/util/formato.js` to bring global line coverage to 80 % or above
  - Run `npm test -- --coverage` and confirm it exits 0
  - _Requisitos: 6.1, 6.2_

## Notes

- Tests marked within each task are mandatory; they ship in the same commit as the implementation.
- Tasks run in order: 1 → 2 → 3 → 4 → 5. Task 2 mounts the route so its supertest tests can reach the endpoint. Task 4 is expected to fail the coverage gate; task 5 fixes it by covering `src/util/formato.js`.

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1"] },
    { "id": 1, "tasks": ["2"] },
    { "id": 2, "tasks": ["3"] },
    { "id": 3, "tasks": ["4"] },
    { "id": 4, "tasks": ["5"] }
  ]
}
```
