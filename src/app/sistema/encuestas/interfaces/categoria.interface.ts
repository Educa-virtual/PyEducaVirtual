export interface ICategoria {
  iCateId: number;
  bCatePermisoDirector: boolean;
  bCatePermisoDremo: boolean;
  bCatePermisoUgel: boolean;
  cCateDescripcion: string;
  cCateImagenNombre?: string;
  cCateNombre?: string;
  cCateSubtitulo?: string;
  iTotalEncuestas?: number;
  btnItems: any;
}
