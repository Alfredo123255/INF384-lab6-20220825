# Estructura del repositorio

```
data/cursos.json              Datos de la malla (solo lectura)
src/server.js                 Arranque del servidor HTTP
src/app.js                    Creación de la app Express y registro de rutas
src/data/repositorio.js       Carga de cursos.json y consultas en memoria
src/routes/                   Un archivo por recurso (cursos.js, …)
src/util/                     Funciones auxiliares
public/index.html             Página mínima que consume la API
tests/                        Pruebas Jest, un archivo por módulo o ruta
.kiro/specs/<funcionalidad>/  requirements.md, design.md, tasks.md
.github/workflows/ci.yml      Pipeline de integración continua
TRAZABILIDAD.md               Requisito → gate → evidencia
```

- Las rutas no leen el JSON directamente: usan `src/data/repositorio.js`.
- Los tests de rutas usan supertest sobre `src/app.js`, sin levantar el servidor.
