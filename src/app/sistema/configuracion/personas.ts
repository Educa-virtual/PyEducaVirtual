import { FormGroup, Validators, FormControl } from '@angular/forms'
const iCredId = null

export const getPersonas = new FormGroup({
    opcion: new FormControl('', Validators.required),
    valorBusqueda: new FormControl(''),

    iPersId: new FormControl(''),
    iEstado: new FormControl(''),
    iCredId: new FormControl(iCredId, Validators.required),
})

export const storePersonas = new FormGroup({
    opcion: new FormControl('', Validators.required),
    valorBusqueda: new FormControl(''),

    iPersId: new FormControl(''),
    iTipoPersId: new FormControl(''),
    iTipoIdenId: new FormControl('', Validators.required),
    iTipoEstaCiviId: new FormControl(''),

    iNaciId: new FormControl(''),
    iPaisId: new FormControl(''),
    iRegiId: new FormControl(''),
    iPrvnId: new FormControl(''),
    iDsttId: new FormControl(''),
    cPersDocumento: new FormControl('', [
        Validators.required,
        Validators.pattern('[0-9]*'),
        Validators.minLength(8),
    ]),
    cPersPaterno: new FormControl(''),
    cPersMaterno: new FormControl(''),
    cPersNombre: new FormControl('', Validators.required),

    cPersDireccion: new FormControl('', Validators.required),
    cPersTelefono: new FormControl('', Validators.required),
    cPersCorreo: new FormControl('', [Validators.required, Validators.email]),

    iEstado: new FormControl(''),
    bHabilitado: new FormControl(''),
    iCredId: new FormControl(iCredId, Validators.required),
})
