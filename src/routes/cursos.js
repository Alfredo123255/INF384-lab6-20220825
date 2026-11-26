const express = require('express');
const repositorio = require('../data/repositorio');

const router = express.Router();

router.get('/', (req, res) => {
  const { ciclo } = req.query;

  if (ciclo !== undefined) {
    const n = Number(ciclo);
    if (!Number.isInteger(n) || n < 5 || n > 10) {
      return res.status(400).json({ error: 'ciclo debe ser un entero entre 5 y 10' });
    }
    return res.json(repositorio.listarPorCiclo(n));
  }

  return res.json(repositorio.listar());
});

router.get('/:codigo', (req, res) => {
  const curso = repositorio.obtener(req.params.codigo);

  if (!curso) {
    return res.status(404).json({ error: 'curso no encontrado' });
  }

  const prerequisites = (curso.prerequisites || []).map((id) => {
    const req = repositorio.obtener(id);
    return { id, name: req ? req.name : id };
  });

  return res.json({
    id: curso.id,
    name: curso.name,
    credits: curso.credits,
    cycle: curso.cycle,
    type: curso.type,
    prerequisites,
  });
});

module.exports = router;
