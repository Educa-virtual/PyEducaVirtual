import { inject, Injectable } from '@angular/core'
import { environment } from '@/environments/environment.template'
import { HttpClient } from '@angular/common/http'
import { map } from 'rxjs'

@Injectable({
    providedIn: 'root',
})
export class ApiEvaluacionesRService {
    private baseUrl = environment.backendApi
    private baseUrlBackend = environment.backend
    private http = inject(HttpClient)
    constructor() {}

    obtenerEvaluacion(params) {
        return this.http.get(
            `${this.baseUrl}/ere/Evaluaciones/obtenerEvaluaciones`,
            { params }
        )
    }

    obtenerTipoPreguntas() {
        return this.http
            .get(
                `${this.baseUrl}/evaluaciones/tipo-preguntas/obtenerTipoPreguntas`
            )
            .pipe(map((resp) => resp['data']))
    }

    obtenerUgeles(params) {
        return this.http.get(`${this.baseUrl}/ere/Ugeles/obtenerUgeles`, {
            params,
        })
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

    guardarActualizarPreguntaConAlternativas(data) {
        return this.http.post(
            `${this.baseUrl}/ere/preguntas/guardarActualizarPreguntaConAlternativas`,
            data
        )
    }

    generarWordByPreguntasIds(baseParams) {
        const url = `${this.baseUrlBackend}/generarWordBancoPreguntasSeleccionadas`
        const params = new URLSearchParams({ ...baseParams })
        const fullUrl = `${url}?${params.toString()}`
        window.open(fullUrl, '_blank')
    }

    eliminarPreguntaById(id) {
        return this.http.delete(
            `${this.baseUrl}/ere/preguntas/eliminarBancoPreguntasById/${id}`
        )
    }

    actualizarBancoPreguntas(data) {
        return this.http.patch(
            `${this.baseUrl}/ere/preguntas/actualizarBancoPreguntas`,
            data
        )
    }

    guardarActualizarAlternativa(data) {
        return this.http.post(
            `${this.baseUrl}/ere/alternativas/guardarActualizarAlternativa`,
            data
        )
    }

    eliminarAlternativaById(id) {
        return this.http.delete(
            `${this.baseUrl}/ere/alternativas/eliminarAlternativaById/${id}`
        )
    }

    obtenerAlternativaByPreguntaId(id) {
        return this.http
            .get(
                `${this.baseUrl}/ere/alternativas/obtenerAlternativaByPreguntaId/${id}`
            )
            .pipe(map((resp) => resp['data']))
    }

    // encabezados preguntas

    guardarActualizarPreguntas(data) {
        return this.http.post(
            `${this.baseUrl}/ere/encabezado-preguntas/guardarActualizarEncabezadoPregunta`,
            data
        )
    }

    obtenerEncabezadosPreguntas(params) {
        return this.http
            .get(`${this.baseUrl}/ere/preguntas/obtenerEncabezadosPreguntas`, {
                params,
            })
            .pipe(map((resp) => resp['data']))
    }

    eliminarEncabezadoPreguntaById(id) {
        return this.http.delete(
            `${this.baseUrl}/ere/encabezado-preguntas/eliminarEncabezadoPreguntaById/${id}`
        )
    }
}
