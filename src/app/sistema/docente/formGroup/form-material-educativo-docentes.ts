import { FormGroup, Validators, FormControl } from '@angular/forms';
const iCredId = null;

export const storeMaterialEducativoDocentes = (): FormGroup => {
  return new FormGroup({
    opcion: new FormControl('', Validators.required),
    iDocenteId: new FormControl(''),
    cMatEducativoTitulo: new FormControl('', Validators.required),
    cMatEducativoDescripcion: new FormControl('', Validators.required),
    iCursosNivelGradId: new FormControl(''),
    cMatEducativoUrl: new FormControl(''),
    iCredEntPerfId: new FormControl(''),
  });
};

export const updateMaterialEducativoDocentes = (): FormGroup => {
  return new FormGroup({
    opcion: new FormControl('', Validators.required),
    iMatEducativoId: new FormControl('', Validators.required),
    iDocenteId: new FormControl(''),
    cMatEducativoTitulo: new FormControl(''),
    cMatEducativoDescripcion: new FormControl(''),
    iCursosNivelGradId: new FormControl(''),
    cMatEducativoUrl: new FormControl(''),
    iCredEntPerfId: new FormControl(''),
  });
};

export const listMaterialEducativoDocentes: any = new FormGroup({
  opcion: new FormControl('CONSULTAR', Validators.required),
  valorBusqueda: new FormControl(''),

  iMatEducativoId: new FormControl(''),
  iDocenteId: new FormControl(''),
  cMatEducativoTitulo: new FormControl(''),
  cMatEducativoDescripcion: new FormControl(''),
  dtMatEducativo: new FormControl(''),
  iEstado: new FormControl(''),
  iSesionId: new FormControl(''),
  dtCreado: new FormControl(''),
  dtActualizado: new FormControl(''),
  iCursosNivelGradId: new FormControl(''),
  cMatEducativoUrl: new FormControl(''),

  iCredId: new FormControl(iCredId),
});
