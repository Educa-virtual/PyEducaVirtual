import { FormGroup, Validators, FormControl } from '@angular/forms'
const iCredId = null

export const listTiposCargaNoLectivas: any = new FormGroup({
    opcion: new FormControl('CONSULTAR', Validators.required),
    valorBusqueda: new FormControl(''),

    iTipoCargaNoLectId: new FormControl(''),
    cTipoCargaNoLectNombre: new FormControl(''),
    cTipoCargaNoLectDescripcion: new FormControl(''),

    iCredId: new FormControl(iCredId),
})
