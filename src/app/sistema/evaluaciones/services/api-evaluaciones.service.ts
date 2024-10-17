import { environment } from '@/environments/environment.template'
import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { map } from 'rxjs'

@Injectable({
    providedIn: 'root',
})
export class ApiEvaluacionesService {
    private baseUrlApi = environment.backendApi
    private baseUrl = environment.backend
    private http = inject(HttpClient)
    constructor() {}

    obtenerTipoEvaluaciones() {
        return this.http
            .get<any>(`${this.baseUrlApi}/evaluaciones/tipo-evaluaciones`)
            .pipe(map((resp) => resp.data))
    }

    guardarActualizarEvaluacion(data) {
        return this.http
            .post<any>(
                `${this.baseUrlApi}/evaluaciones/evaluacion/guardarActualizarEvaluacion`,
                data
            )
            .pipe(map((resp) => resp.data))
    }

    guardarActualizarPreguntasEvaluacion(data) {
        return this.http.post<any>(
            `${this.baseUrlApi}/evaluaciones/evaluacion/guardarActualizarPreguntasEvaluacion`,
            data
        )
    }
}
