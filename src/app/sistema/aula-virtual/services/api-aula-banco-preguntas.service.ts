import { environment } from '@/environments/environment.template'
import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'

@Injectable({
    providedIn: 'root',
})
export class ApiAulaBancoPreguntasService {
    private baseUrlApi = environment.backendApi
    private _http = inject(HttpClient)

    constructor() {}

    obtenerBancoPreguntas(params) {
        return this._http.get(
            `${this.baseUrlApi}/evaluaciones/banco-preguntas/obtenerBancoPreguntas`,
            { params }
        )
    }

    guardarActualizarPregunta(data) {
        return this._http.post(
            `${this.baseUrlApi}/evaluaciones/banco-preguntas/guardarActualizarPregunta`,
            data
        )
    }
}
