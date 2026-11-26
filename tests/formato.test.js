const {
  formatearNombre,
  formatearCreditos,
  formatearCiclo,
  formatearTipo,
  resumenCurso,
  totalCreditos,
  agruparPorCiclo,
  ordenarPorCreditos,
  listaRequisitos,
} = require('../src/util/formato');

describe('formatearNombre', () => {
  test('capitaliza cada palabra', () => {
    expect(formatearNombre('programacion orientada objetos')).toBe('Programacion Orientada Objetos');
  });

  test('maneja entrada ya en mayúsculas', () => {
    expect(formatearNombre('CALCULO')).toBe('Calculo');
  });

  test('maneja una sola palabra', () => {
    expect(formatearNombre('algebra')).toBe('Algebra');
  });
});

describe('formatearCreditos', () => {
  test('formatea con un decimal', () => {
    expect(formatearCreditos(3)).toBe('3.0 créditos');
  });

  test('mantiene decimal existente', () => {
    expect(formatearCreditos(4.5)).toBe('4.5 créditos');
  });

  test('formatea string numérico', () => {
    expect(formatearCreditos('2')).toBe('2.0 créditos');
  });
});

describe('formatearCiclo', () => {
  test('null devuelve Electivo', () => {
    expect(formatearCiclo(null)).toBe('Electivo');
  });

  test('undefined devuelve Electivo', () => {
    expect(formatearCiclo(undefined)).toBe('Electivo');
  });

  test('número devuelve Ciclo N', () => {
    expect(formatearCiclo(5)).toBe('Ciclo 5');
  });

  test('ciclo 10', () => {
    expect(formatearCiclo(10)).toBe('Ciclo 10');
  });
});

describe('formatearTipo', () => {
  test('obligatorio devuelve Obligatorio', () => {
    expect(formatearTipo('obligatorio')).toBe('Obligatorio');
  });

  test('cualquier otro valor devuelve Electivo', () => {
    expect(formatearTipo('electivo')).toBe('Electivo');
  });

  test('tipo desconocido devuelve Electivo', () => {
    expect(formatearTipo('otro')).toBe('Electivo');
  });
});

describe('resumenCurso', () => {
  test('devuelve formato id · name · X.X créditos', () => {
    const curso = { id: '1INF25', name: 'Introducción', credits: 4 };
    expect(resumenCurso(curso)).toBe('1INF25 · Introducción · 4.0 créditos');
  });

  test('con créditos decimales', () => {
    const curso = { id: '1MAT01', name: 'Cálculo', credits: 3.5 };
    expect(resumenCurso(curso)).toBe('1MAT01 · Cálculo · 3.5 créditos');
  });
});

describe('totalCreditos', () => {
  test('suma correctamente los créditos', () => {
    const cursos = [{ credits: 3 }, { credits: 4 }, { credits: 2 }];
    expect(totalCreditos(cursos)).toBe(9);
  });

  test('arreglo vacío devuelve 0', () => {
    expect(totalCreditos([])).toBe(0);
  });

  test('un solo curso', () => {
    expect(totalCreditos([{ credits: 5 }])).toBe(5);
  });
});

describe('agruparPorCiclo', () => {
  test('agrupa cursos por ciclo', () => {
    const cursos = [
      { id: 'A', credits: 3, cycle: 5 },
      { id: 'B', credits: 4, cycle: 6 },
      { id: 'C', credits: 2, cycle: 5 },
    ];
    const grupos = agruparPorCiclo(cursos);
    expect(Object.keys(grupos)).toContain('Ciclo 5');
    expect(Object.keys(grupos)).toContain('Ciclo 6');
    expect(grupos['Ciclo 5'].length).toBe(2);
    expect(grupos['Ciclo 6'].length).toBe(1);
  });

  test('cursos sin ciclo se agrupan como Electivo', () => {
    const cursos = [
      { id: 'X', credits: 3, cycle: null },
      { id: 'Y', credits: 4, cycle: undefined },
    ];
    const grupos = agruparPorCiclo(cursos);
    expect(grupos['Electivo'].length).toBe(2);
  });

  test('cada grupo está ordenado por id', () => {
    const cursos = [
      { id: 'C', credits: 3, cycle: 5 },
      { id: 'A', credits: 4, cycle: 5 },
      { id: 'B', credits: 2, cycle: 5 },
    ];
    const grupos = agruparPorCiclo(cursos);
    const ids = grupos['Ciclo 5'].map((c) => c.id);
    expect(ids).toEqual(['A', 'B', 'C']);
  });
});

describe('ordenarPorCreditos', () => {
  test('ordena por créditos descendente', () => {
    const cursos = [
      { id: 'A', credits: 2 },
      { id: 'B', credits: 5 },
      { id: 'C', credits: 3 },
    ];
    const ordenados = ordenarPorCreditos(cursos);
    expect(ordenados[0].credits).toBe(5);
    expect(ordenados[2].credits).toBe(2);
  });

  test('con créditos iguales, ordena por id ascendente', () => {
    const cursos = [
      { id: 'C', credits: 4 },
      { id: 'A', credits: 4 },
      { id: 'B', credits: 4 },
    ];
    const ordenados = ordenarPorCreditos(cursos);
    expect(ordenados.map((c) => c.id)).toEqual(['A', 'B', 'C']);
  });

  test('arreglo vacío devuelve arreglo vacío', () => {
    expect(ordenarPorCreditos([])).toEqual([]);
  });
});

describe('listaRequisitos', () => {
  test('arreglo vacío devuelve Sin requisitos', () => {
    expect(listaRequisitos([])).toBe('Sin requisitos');
  });

  test('un código devuelve ese código', () => {
    expect(listaRequisitos(['1INF25'])).toBe('1INF25');
  });

  test('múltiples códigos se ordenan y se unen con coma', () => {
    expect(listaRequisitos(['1INF30', '1INF25', '1INF27'])).toBe('1INF25, 1INF27, 1INF30');
  });

  test('null/undefined devuelve Sin requisitos', () => {
    expect(listaRequisitos(null)).toBe('Sin requisitos');
  });
});
