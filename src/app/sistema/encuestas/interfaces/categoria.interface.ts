export interface ICategoria {
  iCatEncId: number;
  bCatEncPermisoDirector: boolean;
  bCatEncPermisoDremo: boolean;
  bCatEncPermisoUgel: boolean;
  cCatEncDescripcion: string;
  cCatEncImagenNombre?: string;
  cCatEncNombre?: string;
  iTotalEncuestas?: number;
}
