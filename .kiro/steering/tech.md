# Stack y convenciones

- Node.js 22, CommonJS (`require`), sin TypeScript.
- Express 4 para la API.
- Jest y supertest para pruebas. Cada criterio de aceptación tiene al menos un test.
- Sin dependencias nuevas salvo que la tarea lo exija; si se agrega una, se justifica en `design.md`.
- Respuestas JSON. Errores con la forma `{ "error": "<mensaje>" }`.
- Códigos HTTP: 200 éxito, 400 entrada inválida, 404 recurso inexistente, 500 error no controlado.
- Comandos: `npm test` corre todas las pruebas; `npm start` levanta el servidor en el puerto 3000 (variable `PORT` opcional).
- Commits en formato Conventional Commits (`feat:`, `fix:`, `test:`, `docs:`, `ci:`).
