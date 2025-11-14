import {
  columnasAdminIndicadorAsistencia,
  columnasAdminIndicadorBajoRendimiento,
  columnasAdminIndicadorDesempeno,
  columnasAdminIndicadorDeserciones,
  columnasAdminIndicadorMatriculas,
  columnasAdminIndicadorVacantes,
  columnasDirectorIndicadorAsistencia,
  columnasDirectorIndicadorBajoRendimiento,
  columnasDirectorIndicadorDesempeno,
  columnasDirectorIndicadorDeserciones,
  columnasDirectorIndicadorMatriculas,
  columnasDirectorIndicadorVacantes,
  columnasIndicadorDesercionesxiNivelGradoId,
  columnasIndicadorMatriculadosxiNivelGradoId,
  indicadorBajoRendimiento,
  indicadorDesempeno,
  indicadorDeserciones,
  indicadorFaltasTardanzas,
  indicadorMatriculas,
  indicadorVacantes,
} from './constantes-indicadores';

export const MAPEO_COLUMNAS = {
  [indicadorMatriculas]: {
    admin: columnasAdminIndicadorMatriculas,
    director: columnasDirectorIndicadorMatriculas,
    nivelGrado: columnasIndicadorMatriculadosxiNivelGradoId,
  },
  [indicadorDeserciones]: {
    admin: columnasAdminIndicadorDeserciones,
    director: columnasDirectorIndicadorDeserciones,
    nivelGrado: columnasIndicadorDesercionesxiNivelGradoId,
  },
  [indicadorFaltasTardanzas]: {
    admin: columnasAdminIndicadorAsistencia,
    director: columnasDirectorIndicadorAsistencia,
  },
  [indicadorDesempeno]: {
    admin: columnasAdminIndicadorDesempeno,
    director: columnasDirectorIndicadorDesempeno,
  },
  [indicadorBajoRendimiento]: {
    admin: columnasAdminIndicadorBajoRendimiento,
    director: columnasDirectorIndicadorBajoRendimiento,
  },
  [indicadorVacantes]: {
    admin: columnasAdminIndicadorVacantes,
    director: columnasDirectorIndicadorVacantes,
  },
};

export const CAMPOS_INDICADOR = {
  [indicadorMatriculas]: ['En proceso', 'Definitivo', 'Traslado', 'Abandono'],
  [indicadorDeserciones]: ['Otro', 'Definitiva', 'Temporal'],
  [indicadorFaltasTardanzas]: [
    'Tardanza',
    'Inasistencia',
    'Inasistencia justificada',
    'Tardanza justificada',
    'Sin registro',
  ],
  [indicadorDesempeno]: ['Excelente', 'Bueno', 'Regular'],
  [indicadorBajoRendimiento]: ['Deficiente'],
  [indicadorVacantes]: ['NEE', 'Regular'],
};

export const COLORES_BASE = [
  '#42A5F5',
  '#66BB6A',
  '#FFA726',
  '#AB47BC',
  '#FF7043',
  '#26C6DA',
  '#7E57C2',
  '#EC407A',
];
