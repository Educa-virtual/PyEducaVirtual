import { ApiResponse } from '@/app/shared/interfaces/api-response.model'
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

    // evaluacion contenido aula

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

    quitarPreguntaEvaluacion(ids) {
        return this.http.delete<any>(
            `${this.baseUrlApi}/evaluaciones/evaluacion/eliminarPreguntaEvulacion/${ids}`
        )
    }

    // Rubricas

    obtenerRubricas(params) {
        return this.http
            .get<ApiResponse>(
                `${this.baseUrlApi}/evaluaciones/instrumento-evaluaciones/rubrica`,
                { params }
            )
            .pipe(map((resp) => resp.data))
    }

    guardarActualizarRubrica(data) {
        return this.http
            .post<ApiResponse>(
                `${this.baseUrlApi}/evaluaciones/instrumento-evaluaciones/rubrica`,
                data
            )
            .pipe(map((resp) => resp.data))
    }

    eliminarRubrica({
        id,
        tipo,
    }: {
        id: number
        tipo: 'INSTRUMENTO' | 'CRITERIO' | 'NIVEL'
    }) {
        return this.http
            .delete<ApiResponse>(
                `${this.baseUrlApi}/evaluaciones/instrumento-evaluaciones/rubrica/${id}`,
                { params: { cTipo: tipo } }
            )
            .pipe(map((resp) => resp.data))
    }

    // escala calificaciones

    obtenerEscalaCalificaciones() {
        return this.http
            .get<any>(`${this.baseUrlApi}/evaluaciones/escala-calificaciones`)
            .pipe(map((resp) => resp.data))
    }

    // logros
    obtenerLogros(params) {
        return this.http
            .get<ApiResponse>(
                `${this.baseUrlApi}/evaluaciones/evaluacion/logros`,
                { params }
            )
            .pipe(map((resp) => resp.data))
    }

    guardarActualizarLogros(data) {
        return this.http
            .post<ApiResponse>(
                `${this.baseUrlApi}/evaluaciones/evaluacion/logros`,
                data
            )
            .pipe(map((resp) => resp.data))
    }
    eliminarLogroPregunta(id) {
        return this.http
            .delete<ApiResponse>(
                `${this.baseUrlApi}/evaluaciones/evaluacion/logros/${id}`
            )
            .pipe(map((resp) => resp.data))
    }

    publicarEvaluacion(data) {
        return this.http.post<ApiResponse>(
            `${this.baseUrlApi}/evaluaciones/evaluacion/publicar`,
            data
        )
    }
}
