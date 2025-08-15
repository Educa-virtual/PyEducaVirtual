export interface Horario {
  iBloque: number;
  iDiaId: number; // 1=Lunes … 5=Viernes
  cDiaNombre: string; // "LUNES", …
  tHoraInicio: string; // "08:00:00.0000000"
  tHoraFin: string; // "08:45:00.0000000"
  cCursoNombre: string;
  cNombreDocente: string; // ya viene nombre completo
}
