import { FormGroup, Validators, FormControl } from '@angular/forms'
const iCredId = null

export const storeMaterialEducativoDocentes: any = new FormGroup({
    opcion: new FormControl('GUARDAR', Validators.required),
    valorBusqueda: new FormControl(''),

    iMatEduDocId: new FormControl(''),
    iDocenteId: new FormControl(''),
    iCursosNivelGradId: new FormControl(''),
    cMatEduTitulo: new FormControl('', Validators.required),
    cMatEduDescripcion: new FormControl('', Validators.required),
    cMatEduUrl: new FormControl(''),
    iEstado: new FormControl(''),
    iSesionId: new FormControl(''),
    dtCreado: new FormControl(''),
    dtActualizado: new FormControl(''),

    iCredId: new FormControl(iCredId),
})

export const updateMaterialEducativoDocentes: any = new FormGroup({
    opcion: new FormControl('ACTUALIZAR', Validators.required),
    valorBusqueda: new FormControl(''),

    iMatEduDocId: new FormControl('', Validators.required),
    iDocenteId: new FormControl(''),
    iCursosNivelGradId: new FormControl(''),
    cMatEduTitulo: new FormControl(''),
    cMatEduDescripcion: new FormControl(''),
    cMatEduUrl: new FormControl(''),
    iEstado: new FormControl(''),
    iSesionId: new FormControl(''),
    dtCreado: new FormControl(''),
    dtActualizado: new FormControl(''),

    iCredId: new FormControl(iCredId),
})

export const listMaterialEducativoDocentes: any = new FormGroup({
    opcion: new FormControl('CONSULTAR', Validators.required),
    valorBusqueda: new FormControl(''),

    iMatEduDocId: new FormControl(''),
    iDocenteId: new FormControl(''),
    iCursosNivelGradId: new FormControl(''),
    cMatEduTitulo: new FormControl(''),
    cMatEduDescripcion: new FormControl(''),
    cMatEduUrl: new FormControl(''),
    iEstado: new FormControl(''),
    iSesionId: new FormControl(''),
    dtCreado: new FormControl(''),
    dtActualizado: new FormControl(''),

    iCredId: new FormControl(iCredId),
})
