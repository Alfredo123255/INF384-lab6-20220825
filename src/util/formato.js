const _ = require('lodash');

// Funciones auxiliares para presentar cursos como texto.

function formatearNombre(nombre) {
  return _.toLower(nombre).split(' ').map(_.capitalize).join(' ');
}

function formatearCreditos(creditos) {
  return `${Number(creditos).toFixed(1)} créditos`;
}

function formatearCiclo(ciclo) {
  if (ciclo === null || ciclo === undefined) {
    return 'Electivo';
  }
  return `Ciclo ${ciclo}`;
}

function formatearTipo(tipo) {
  if (tipo === 'obligatorio') {
    return 'Obligatorio';
  }
  return 'Electivo';
}

function resumenCurso(curso) {
  return `${curso.id} · ${curso.name} · ${formatearCreditos(curso.credits)}`;
}

function totalCreditos(cursos) {
  return _.sumBy(cursos, 'credits');
}

function agruparPorCiclo(cursos) {
  const grupos = _.groupBy(cursos, (curso) => formatearCiclo(curso.cycle));
  return _.mapValues(grupos, (lista) => _.sortBy(lista, 'id'));
}

function ordenarPorCreditos(cursos) {
  return _.orderBy(cursos, ['credits', 'id'], ['desc', 'asc']);
}

function listaRequisitos(codigos) {
  if (_.isEmpty(codigos)) {
    return 'Sin requisitos';
  }
  return _.join(_.sortBy(codigos), ', ');
}

module.exports = {
  formatearNombre,
  formatearCreditos,
  formatearCiclo,
  formatearTipo,
  resumenCurso,
  totalCreditos,
  agruparPorCiclo,
  ordenarPorCreditos,
  listaRequisitos,
};
