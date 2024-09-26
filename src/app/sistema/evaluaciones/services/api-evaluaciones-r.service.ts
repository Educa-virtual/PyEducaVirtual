import { inject, Injectable } from '@angular/core'
import { environment } from '@/environments/environment.template'
import { HttpClient } from '@angular/common/http'

@Injectable({
    providedIn: 'root',
})
export class ApiEvaluacionesRService {
    private baseUrl = environment.backendApi
    private http = inject(HttpClient)
    constructor() {}

    obtenerEvaluacion(params) {
        return this.http.get(
            `${this.baseUrl}/ere/Evaluaciones/obtenerEvaluaciones`,
            { params }
        )
    }

    obtenerIE(params) {
        return this.http.get(`${this.baseUrl}/ere/ie/obtenerIE`, { params })
    }
    obtenerNivelTipo(params) {
        return this.http.get(`${this.baseUrl}/ere/nivelTipo/obtenerNivelTipo`, {
            params,
        })
    }
    obtenerTipoEvaluacion(params) {
        return this.http.get(
            `${this.baseUrl}/ere/tipoEvaluacion/obtenerTipoEvaluacion`,
            { params }
        )
    }
    obtenerNivelEvaluacion(params) {
        return this.http.get(
            `${this.baseUrl}/ere/nivelEvaluacion/obtenerNivelEvaluacion`,
            { params }
        )
    }
}
