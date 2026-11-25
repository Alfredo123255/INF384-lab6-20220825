# Malla INF

Servicio web que expone los cursos de los ciclos 5 a 10 del plan 2026-1 de Ingeniería Informática (PUCP) y sus requisitos.
Incluye una API REST en Express y una página mínima para consultarla.

> Datos simplificados para el laboratorio: solo requisitos de tipo 'haber aprobado' entre cursos de ciclos 5 a 10. No incluye requisitos simultáneos, de nota, especiales, de créditos ni cursos de Estudios Generales.

## Cómo correrlo

Requiere Node.js 22 o superior.

```bash
npm ci
npm test
npm start
```

Abre http://localhost:3000.

## Estructura del repo

Ver [`.kiro/steering/structure.md`](.kiro/steering/structure.md).

## Reglas del lab

- Haz commit y push después de cada fase del spec (requirements, design, tasks) y después de cada tarea implementada.
- En Kiro usa el modelo **Auto**.
- Si se acaban los créditos de Kiro, continúa con Copilot trabajando sobre los archivos de `.kiro/specs/`, o a mano.

## Documentación de herramientas

- npm audit: https://docs.npmjs.com/cli/commands/npm-audit
- gitleaks: https://github.com/gitleaks/gitleaks
- Jest coverage: https://jestjs.io/docs/configuration#coveragethreshold-object
- GitHub Actions: https://docs.github.com/actions
