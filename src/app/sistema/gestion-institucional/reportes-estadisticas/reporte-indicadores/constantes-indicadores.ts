export const indicadorMatriculas = 'indicadorMatriculas';
export const indicadorDeserciones = 'indicadorDeserciones';
export const indicadorFaltasTardanzas = 'indicadorFaltasTardanzas';
export const indicadorDesempeno = 'indicadorDesempeno';
export const indicadorBajoRendimiento = 'indicadorBajoRendimiento';
export const indicadorVacantes = 'indicadorVacantes';

export const reportes = [
  { key: 'resumen-matriculados', titulo: 'REPORTE DE MATRICULADOS', color: '#e30052' },
  { key: 'resumen-deserciones', titulo: 'REPORTE DE DESERCIONES', color: '#e53935' },
  { key: 'resumen-asistencia', titulo: 'REPORTE DE ASISTENCIA', color: '#1e88e5' },
  { key: 'resumen-desempenio', titulo: 'REPORTE DE DESEMPEÑO', color: '#43a047' },
  { key: 'resumen-bajo-rendimiento', titulo: 'REPORTE DE BAJO RENDIMIENTO', color: '#fbc02d' },
  { key: 'resumen-vacantes', titulo: 'REPORTE DE VACANTES', color: '#8e24aa' },
];

export const columnaIndex = {
  type: 'item',
  width: '0.5rem',
  field: 'index',
  header: 'Nro',
  text_header: 'center',
  text: 'center',
};

export const columnaDetalle = {
  type: 'text',
  width: '3rem',
  field: 'Detalle',
  header: 'Detalle',
  text_header: 'left',
  text: 'left',
};

export const columnaPorcentaje = {
  type: 'text',
  width: '3rem',
  field: 'Porcentaje',
  header: 'Porcentaje',
  text_header: 'center',
  text: 'center',
};
export const columnaCantidad = {
  type: 'text',
  width: '3rem',
  field: 'Cantidad',
  header: 'Total',
  text_header: 'center',
  text: 'center',
};

export const columnaAbandono = {
  type: 'text',
  width: '3rem',
  field: 'Abandono',
  header: 'Abandono',
  text_header: 'center',
  text: 'center',
};
export const columnaDefinitivo = {
  type: 'text',
  width: '3rem',
  field: 'Definitivo',
  header: 'Definitivo',
  text_header: 'center',
  text: 'center',
};
export const columnaEnProceso = {
  type: 'text',
  width: '3rem',
  field: 'En proceso',
  header: 'En proceso',
  text_header: 'center',
  text: 'center',
};
export const columnaTraslado = {
  type: 'text',
  width: '3rem',
  field: 'Traslado',
  header: 'Traslado',
  text_header: 'center',
  text: 'center',
};

export const columnaAsistencia = {
  type: 'text',
  width: '3rem',
  field: 'Asistencia',
  header: 'Asistencia',
  text_header: 'center',
  text: 'center',
};
export const columnaTardanza = {
  type: 'text',
  width: '3rem',
  field: 'Tardanza',
  header: 'Tardanza',
  text_header: 'center',
  text: 'center',
};
export const columnaInasistencia = {
  type: 'text',
  width: '3rem',
  field: 'Inasistencia',
  header: 'Inasistencia',
  text_header: 'center',
  text: 'center',
};

export const columnaExcelente = {
  type: 'text',
  width: '3rem',
  field: 'Excelente',
  header: 'Excelente',
  text_header: 'center',
  text: 'center',
};
export const columnaBueno = {
  type: 'text',
  width: '3rem',
  field: 'Bueno',
  header: 'Bueno',
  text_header: 'center',
  text: 'center',
};
export const columnaRegular = {
  type: 'text',
  width: '3rem',
  field: 'Regular',
  header: 'Regular',
  text_header: 'center',
  text: 'center',
};
export const columnaDeficiente = {
  type: 'text',
  width: '3rem',
  field: 'Deficiente',
  header: 'Deficiente',
  text_header: 'center',
  text: 'center',
};

export const columnaOtro = {
  type: 'text',
  width: '3rem',
  field: 'Otro',
  header: 'Otro',
  text_header: 'center',
  text: 'center',
};
export const columnaDefinitiva = {
  type: 'text',
  width: '3rem',
  field: 'Definitiva',
  header: 'Definitiva',
  text_header: 'center',
  text: 'center',
};
export const columnaTemporal = {
  type: 'text',
  width: '3rem',
  field: 'Temporal',
  header: 'Temporal',
  text_header: 'center',
  text: 'center',
};

export const columnaNEE = {
  type: 'text',
  width: '3rem',
  field: 'NEE',
  header: 'NEE',
  text_header: 'center',
  text: 'center',
};

export const columnasIndicadorMatriculas = [
  columnaIndex,
  columnaDetalle,
  columnaPorcentaje,
  columnaCantidad,
  columnaEnProceso,
  columnaDefinitivo,
  columnaTraslado,
  columnaAbandono,
];

export const columnasIndicadorDeserciones = [
  columnaIndex,
  columnaDetalle,
  columnaPorcentaje,
  columnaCantidad,
  columnaOtro,
  columnaDefinitiva,
  columnaTemporal,
];

export const columnasIndicadorAsistencia = [
  columnaIndex,
  columnaDetalle,
  columnaPorcentaje,
  columnaCantidad,
  columnaAsistencia,
  columnaTardanza,
  columnaInasistencia,
];

export const columnasIndicadorDesempeno = [
  columnaIndex,
  columnaDetalle,
  columnaPorcentaje,
  columnaCantidad,
  columnaExcelente,
  columnaBueno,
  columnaRegular,
];

export const columnasIndicadorBajoRendimiento = [
  columnaIndex,
  columnaDetalle,
  columnaPorcentaje,
  columnaCantidad,
  columnaDeficiente,
];

export const columnasIndicadorVacantes = [
  columnaIndex,
  columnaDetalle,
  columnaPorcentaje,
  columnaCantidad,
  columnaNEE,
  columnaRegular,
];

// ============================
// 🔹 Aliases por rol (si se requiere)
// ============================
export const columnasAdminIndicadorMatriculas = columnasIndicadorMatriculas;
export const columnasDirectorIndicadorMatriculas = columnasIndicadorMatriculas;

export const columnasAdminIndicadorDeserciones = columnasIndicadorDeserciones;
export const columnasDirectorIndicadorDeserciones = columnasIndicadorDeserciones;

export const columnasAdminIndicadorAsistencia = columnasIndicadorAsistencia;
export const columnasDirectorIndicadorAsistencia = columnasIndicadorAsistencia;

export const columnasAdminIndicadorDesempeno = columnasIndicadorDesempeno;
export const columnasDirectorIndicadorDesempeno = columnasIndicadorDesempeno;

export const columnasAdminIndicadorBajoRendimiento = columnasIndicadorBajoRendimiento;
export const columnasDirectorIndicadorBajoRendimiento = columnasIndicadorBajoRendimiento;

export const columnasAdminIndicadorVacantes = columnasIndicadorVacantes;
export const columnasDirectorIndicadorVacantes = columnasIndicadorVacantes;

// ============================
// 🔹 Versiones extendidas por nivel/grado
// ============================
export const columnasIndicadorMatriculadosxiNivelGradoId = columnasIndicadorMatriculas;
export const columnasIndicadorDesercionesxiNivelGradoId = columnasIndicadorDeserciones;
