# Producto: Malla INF

Servicio web que expone los cursos de los ciclos 5 a 10 del plan 2026-1 de Ingeniería Informática (PUCP) y sus requisitos, para que un alumno pueda consultar la malla y planificar su matrícula.

## Usuarios

- Alumno de Ingeniería Informática que consulta cursos y requisitos.

## Alcance cerrado

- Fuente de datos única: `data/cursos.json`. Es de solo lectura; el servicio no lo modifica.
- Solo existe un tipo de requisito: haber aprobado el curso. Cada curso lista en `prerequisites` los códigos de los cursos que deben estar aprobados.
- Fuera de alcance: requisitos simultáneos, de nota, especiales y de créditos mínimos; cursos de Estudios Generales (ciclos 1 a 4); autenticación; base de datos; persistencia de datos del alumno; frameworks de frontend.
- Toda decisión que amplíe este alcance se registra en `design.md` con su justificación.

## Modelo de datos

```json
{
  "id": "1INF30",
  "name": "Programación 3",
  "credits": 5.0,
  "cycle": 6,
  "type": "obligatorio",
  "prerequisites": ["1INF25"]
}
```

- `cycle` es un entero de 5 a 10, o `null` para electivos.
- `type` es `obligatorio` o `electivo`.
