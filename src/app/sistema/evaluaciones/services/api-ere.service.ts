import { inject, Injectable } from '@angular/core'
import { environment } from '@/environments/environment'
import { HttpClient } from '@angular/common/http'

@Injectable({
    providedIn: 'root',
})
export class ApiEreService {
    private baseUrl = environment.backendApi
    private http = inject(HttpClient)
    constructor() {}

    actualizarMatrizPreguntas(data) {
        return this.http.patch(
            `${this.baseUrl}/ere/banco-preguntas/actualizarMatrizPreguntas`,
            data
        )
    }

    obtenerBancoPreguntas(params) {
        return this.http.get(
            `${this.baseUrl}/ere/banco-preguntas/obtenerBancoPreguntas`,
            { params }
        )
    }

    obtenerCompetencias(params) {
        return this.http.get(
            `${this.baseUrl}/ere/competencias/obtenerCompetencias`,
            { params }
        )
    }

    obtenerCapacidades(params) {
        return this.http.get(
            `${this.baseUrl}/ere/capacidades/obtenerCapacidades`,
            { params }
        )
    }
}