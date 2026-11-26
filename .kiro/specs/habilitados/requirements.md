# Requirements Document

## Introduction

This feature adds a `POST /habilitados` endpoint to the Malla INF service. Given a list of course IDs that a student has already passed, the endpoint returns all courses in `data/cursos.json` that the student is now eligible to enroll in: courses whose every prerequisite appears in the approved list and that are not themselves already approved. The endpoint must reject malformed, oversized, or type-incorrect input, and must never expose internal server details in error responses.

## Glossary

- **API**: The Express 4 HTTP service defined in `src/app.js`.
- **Repositorio**: The module `src/data/repositorio.js` that loads `data/cursos.json` once and exposes in-memory query functions.
- **Curso**: A course object with fields `id`, `name`, `credits`, `cycle`, `type`, and `prerequisites` as defined in `data/cursos.json`.
- **Habilitado**: A Curso whose every prerequisite ID appears in the `aprobados` list and whose own ID does not appear in the `aprobados` list.
- **aprobados**: The JSON array of course ID strings sent by the client in the request body field `aprobados`.
- **Código**: A course ID string matching `^[0-9A-Z]{6}$` (exactly 6 characters: digits 0–9 and uppercase letters A–Z).
- **Validador**: The input-validation logic executed before the habilitados query runs.
- **Calculador**: The logic that computes the list of Habilitados given a validated `aprobados` list.

---

## Requirements

### Requirement 1: Compute habilitados from approved courses

**User Story:** As a student, I want to submit the list of courses I have already passed, so that I receive the complete list of courses I am now eligible to enroll in.

#### Acceptance Criteria

1. WHEN a POST request is made to `/habilitados` with a JSON body `{ "aprobados": [] }`, THE Calculador SHALL return HTTP 200 with a JSON array containing every Curso whose `prerequisites` array is empty.
2. WHEN a POST request is made to `/habilitados` with a JSON body `{ "aprobados": ["1INF25", "1INF27", "1INF49"] }`, THE Calculador SHALL return HTTP 200 with a JSON array of exactly 27 Cursos, including `1INF29`, `1INF30`, `1INF31`, and `1INF32`.
3. WHEN a POST request is made to `/habilitados` with a valid `aprobados` list, THE Calculador SHALL exclude every Curso whose `id` appears in the `aprobados` list from the response array.
4. WHEN a POST request is made to `/habilitados` with a valid `aprobados` list, THE Calculador SHALL exclude every Curso that has at least one prerequisite ID not present in the `aprobados` list from the response array.
5. WHEN a POST request is made to `/habilitados` with a valid `aprobados` list, THE API SHALL return HTTP 200 and each element in the response array SHALL include at minimum the fields `id`, `name`, `credits`, `cycle`, `type`, and `prerequisites`.

### Requirement 2: Validate that aprobados is a JSON array

**User Story:** As a developer integrating the API, I want the endpoint to reject non-array values for `aprobados`, so that type confusion does not produce silently incorrect results.

#### Acceptance Criteria

1. WHEN a POST request is made to `/habilitados` with a body where `aprobados` is a string (e.g., `{ "aprobados": "1INF25" }`), THE Validador SHALL return HTTP 400 with a JSON body `{ "error": "aprobados debe ser un arreglo" }`.
2. WHEN a POST request is made to `/habilitados` with a body where `aprobados` is a number, THE Validador SHALL return HTTP 400 with a JSON body `{ "error": "aprobados debe ser un arreglo" }`.
3. WHEN a POST request is made to `/habilitados` with a body where `aprobados` is a boolean, THE Validador SHALL return HTTP 400 with a JSON body `{ "error": "aprobados debe ser un arreglo" }`.
4. WHEN a POST request is made to `/habilitados` with a body where the `aprobados` field is absent, THE Validador SHALL return HTTP 400 with a JSON body `{ "error": "aprobados debe ser un arreglo" }`.
5. WHEN a POST request is made to `/habilitados` with an `aprobados` array that contains at least one element that is not a string (e.g., `[123]` or `[null]`), THE Validador SHALL return HTTP 400 with a JSON body `{ "error": "cada elemento de aprobados debe ser un string" }`.
6. WHEN a POST request is made to `/habilitados` with a body that is not valid JSON, THE API SHALL return HTTP 400 with a JSON body `{ "error": "JSON inválido" }`.

### Requirement 3: Reject oversized input to prevent denial of service

**User Story:** As an operator, I want the endpoint to reject requests with excessively large course lists, so that a single client cannot exhaust server resources.

#### Acceptance Criteria

1. WHEN a POST request is made to `/habilitados` with a body that does not exceed 10 kb and the `aprobados` array contains more than 100 elements (e.g. 101 elements), THE Validador SHALL return HTTP 400 with a JSON body `{ "error": "aprobados excede el máximo permitido de 100 elementos" }`.
2. WHEN a POST request is made to `/habilitados` with an `aprobados` array containing exactly 100 elements, THE Validador SHALL allow the request to proceed to the Calculador without returning an error.
3. IF the request body exceeds 10 kb in size (e.g. `aprobados` with 5000 valid-format codes, as observed in security finding 1), THEN THE API SHALL return HTTP 413 with a JSON body `{ "error": "el cuerpo excede el tamaño permitido" }` without exposing any stack trace or server-internal detail in the response body.

### Requirement 4: Reject course IDs with invalid characters

**User Story:** As an operator, I want the endpoint to reject course IDs that do not match the expected format, so that injection payloads cannot reach the response or trigger internal errors.

#### Acceptance Criteria

1. WHEN a POST request is made to `/habilitados` with an `aprobados` array that contains at least one element that does not match `^[0-9A-Z]{6}$` — including `"1INF30<script>"` (special characters), `"1inf30"` (lowercase), or `"ABC"` (fewer than 6 characters) — THE Validador SHALL return HTTP 400 with a JSON body `{ "error": "código inválido en aprobados" }` without including any file path, stack trace, or server-internal detail in the response body.
2. WHEN a POST request is made to `/habilitados` and the Validador returns HTTP 400 for an invalid Código, THE API SHALL return a response body that contains only the field `error` and no additional fields exposing server internals.
3. WHEN a POST request is made to `/habilitados` with an `aprobados` array where every element matches `^[0-9A-Z]{6}$`, THE Validador SHALL allow the request to proceed to the Calculador.

### Requirement 5: Handle unrecognized course IDs gracefully

**User Story:** As a student, I want the endpoint to ignore course IDs in `aprobados` that do not exist in the catalog, so that unknown codes do not cause server errors.

#### Acceptance Criteria

1. WHEN a POST request is made to `/habilitados` with an `aprobados` array that contains a valid-format ID not present in `data/cursos.json` (e.g., `"ZZZZZZ"`), THE Calculador SHALL return HTTP 200 and treat the unknown ID as a course with no effect on prerequisite matching.
2. WHEN a POST request is made to `/habilitados` with an `aprobados` array consisting entirely of unrecognized but valid-format IDs, THE Calculador SHALL return HTTP 200 with the array of all Cursos whose `prerequisites` array is empty.

### Requirement 6: Maintain line coverage gate

**User Story:** As a developer, I want the test suite to enforce a minimum line coverage threshold for the habilitados module, so that regressions in untested paths are caught by CI.

#### Acceptance Criteria

1. THE test suite SHALL be configured with `coverageThreshold: { global: { lines: 80 } }` in `jest.config.js`, so that `npm test -- --coverage` exits with a non-zero code when global line coverage falls below 80 %.
2. IF the global line coverage reported by Jest is below 80 %, THEN the CI job defined in `.github/workflows/ci.yml` SHALL fail and block the pipeline.
