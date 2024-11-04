import { inject, Injectable } from '@angular/core'
import { environment } from '@/environments/environment.template'
import { HttpClient } from '@angular/common/http'
import { map, Observable } from 'rxjs'
import { mapData } from '../sub-evaluaciones/banco-preguntas/models/pregunta-data-transformer'

@Injectable({
    providedIn: 'root',
})
export class ApiEvaluacionesRService {
    private baseUrl = environment.backendApi
    private baseUrlBackend = environment.backend
    private http = inject(HttpClient)
    constructor() {}

    // obtenerEvaluacion(params) {
    //     return this.http.get(
    //         `${this.baseUrl}/ere/Evaluaciones/obtenerEvaluaciones`,
    //         { params }
    //     )
    // }
    obtenerEvaluacion(params) {
        return this.http.get(
            `${this.baseUrl}/ere/Evaluaciones/ereObtenerEvaluacion`,
            {
                params,
            }
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
    // insert_Code_New
    guardarEvaluacion(data: any) {
        return this.http.post(`${this.baseUrl}/ere/Evaluaciones/guardar`, data)
    }

    //Top
    guardarActualizarPreguntaConAlternativas(data) {
        return this.http.post(
            `${this.baseUrl}/ere/preguntas/guardarActualizarPreguntaConAlternativas`,
            data
        )
    }
    guardarParticipacion(data) {
        return this.http.post(
            `${this.baseUrl}/ere/Evaluaciones/guardarParticipacion`,
            data
        )
    }
    // eliminarParticipacion(data: any) {
    //     return this.http.delete(
    //         `${this.baseUrl}/ere/Evaluaciones/eliminarParticipacion`,
    //         data
    //     )
    // }
    eliminarParticipacion(id: any): Observable<any> {
        return this.http.delete(
            `${this.baseUrl}/ere/Evaluaciones/eliminarParticipacion/${id}`
        )
    }
    IEparticipanall(data) {
        return this.http.post(
            `${this.baseUrl}/ere/Evaluaciones/IEparticipanall`,
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

    actualizarMatrizPreguntas(data) {
        return this.http.patch(
            `${this.baseUrl}/ere/preguntas/actualizarMatrizPreguntas`,
            data
        )
    }

    obtenerBancoPreguntas(params) {
        return this.http
            .get(`${this.baseUrl}/ere/preguntas/obtenerBancoPreguntas`, {
                params,
            })
            .pipe(
                map((resp) => resp['data']),
                map((data) => mapData(data))
            )
    }

    obtenerCompetencias(params) {
        return this.http
            .get(`${this.baseUrl}/ere/competencias/obtenerCompetencias`, {
                params,
            })
            .pipe(map((resp) => resp['data']))
    }

    obtenerCapacidades(params) {
        return this.http.get(
            `${this.baseUrl}/ere/capacidades/obtenerCapacidades`,
            { params }
        )
    }

    obtenerDesempenos(params) {
        return this.http
            .get(`${this.baseUrl}/ere/desempenos/obtenerDesempenos`, { params })
            .pipe(map((resp) => resp['data']))
    }
}
