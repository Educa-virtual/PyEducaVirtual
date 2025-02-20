import { FormGroup, Validators, FormControl } from '@angular/forms'
const iCredId = null

export const storeCargaNoLectivas: any = new FormGroup({
    opcion: new FormControl('', Validators.required),
    valorBusqueda: new FormControl(''),

    iCargaNoLectivaId: new FormControl(''),
    iSemAcadId: new FormControl(''),
    iYAcadId: new FormControl(''),
    iDocenteId: new FormControl(''),
    iEstado: new FormControl(''),
    iSesionId: new FormControl(''),
    dtCreado: new FormControl(''),
    dtActualizado: new FormControl(''),

    iCredId: new FormControl(iCredId),
})

export const updateCargaNoLectivas: any = new FormGroup({
    opcion: new FormControl('', Validators.required),
    valorBusqueda: new FormControl(''),

    iCargaNoLectivaId: new FormControl('', Validators.required),
    iSemAcadId: new FormControl(''),
    iYAcadId: new FormControl(''),
    iDocenteId: new FormControl(''),
    iEstado: new FormControl(''),
    iSesionId: new FormControl(''),
    dtCreado: new FormControl(''),
    dtActualizado: new FormControl(''),

    iCredId: new FormControl(iCredId),
})

export const listCargaNoLectivas: any = new FormGroup({
    opcion: new FormControl('CONSULTAR', Validators.required),
    valorBusqueda: new FormControl(''),

    iCargaNoLectivaId: new FormControl(''),
    iSemAcadId: new FormControl(''),
    iYAcadId: new FormControl(''),
    iDocenteId: new FormControl(''),
    iEstado: new FormControl(''),
    iSesionId: new FormControl(''),
    dtCreado: new FormControl(''),
    dtActualizado: new FormControl(''),

    iCredId: new FormControl(iCredId),
})
