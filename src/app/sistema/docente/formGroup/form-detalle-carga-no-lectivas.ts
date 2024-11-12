import { FormGroup, Validators, FormControl } from '@angular/forms'
const iCredId = null

export const storeDetalleCargaNoLectivas: any = new FormGroup({
    opcion: new FormControl('', Validators.required),
    valorBusqueda: new FormControl(''),

    iDetCargaNoLectId: new FormControl(''),
    iCargaNoLectivaId: new FormControl(''),
    iTipoCargaNoLectId: new FormControl('', Validators.required),
    nDetCargaNoLectHoras: new FormControl('', Validators.required),
    cDetCargaNoLectEvidencias: new FormControl(''),

    iCredId: new FormControl(iCredId),
})

export const updateDetalleCargaNoLectivas: any = new FormGroup({
    opcion: new FormControl('', Validators.required),
    valorBusqueda: new FormControl(''),

    iDetCargaNoLectId: new FormControl('', Validators.required),
    iCargaNoLectivaId: new FormControl(''),
    iTipoCargaNoLectId: new FormControl(''),
    nDetCargaNoLectHoras: new FormControl(''),
    cDetCargaNoLectEvidencias: new FormControl(''),

    iCredId: new FormControl(iCredId),
})

export const listDetalleCargaNoLectivas: any = new FormGroup({
    opcion: new FormControl('CONSULTAR', Validators.required),
    valorBusqueda: new FormControl(''),

    iDetCargaNoLectId: new FormControl(''),
    iCargaNoLectivaId: new FormControl(''),
    iTipoCargaNoLectId: new FormControl(''),
    nDetCargaNoLectHoras: new FormControl(''),
    cDetCargaNoLectEvidencias: new FormControl(''),

    iCredId: new FormControl(iCredId),
})
