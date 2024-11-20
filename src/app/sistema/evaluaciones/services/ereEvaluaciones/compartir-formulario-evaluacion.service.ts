import { Injectable } from '@angular/core'

@Injectable({
    providedIn: 'root',
})
export class CompartirFormularioEvaluacionService {
    private _cEvaluacionNombre = '' // Nombre de la evaluacion

    set iEvaluacionId(cEvaluacionNombre: string) {
        this._cEvaluacionNombre = cEvaluacionNombre
    }

    get iEvaluacionId() {
        return this._cEvaluacionNombre
    }
    constructor() {}
}
