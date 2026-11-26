const express = require('express');
const router = express.Router();

const CODIGO_RE = /^[0-9A-Z]{6}$/;

router.post('/', (req, res, next) => {
  try {
    const { aprobados } = req.body;

    // Guard 1: aprobados must be present and be an array
    if (!Array.isArray(aprobados)) {
      return res.status(400).json({ error: 'aprobados debe ser un arreglo' });
    }

    // Guard 2: array length must not exceed 100
    if (aprobados.length > 100) {
      return res.status(400).json({ error: 'aprobados excede el máximo permitido de 100 elementos' });
    }

    // Guard 3: every element must be a string
    if (!aprobados.every(e => typeof e === 'string')) {
      return res.status(400).json({ error: 'cada elemento de aprobados debe ser un string' });
    }

    // Guard 4: every element must match ^[0-9A-Z]{6}$
    if (!aprobados.every(e => CODIGO_RE.test(e))) {
      return res.status(400).json({ error: 'código inválido en aprobados' });
    }

    // Calculador will be implemented in Task 3; return placeholder for now
    return res.json([]);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
