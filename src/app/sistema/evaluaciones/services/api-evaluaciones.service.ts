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

    obtenerTipoPreguntas() {
        return this.http.get(
            `${this.baseUrlApi}/evaluaciones/tipo-preguntas/obtenerTipoPreguntas`
        )
    }

    guardarActualizarPreguntaConAlternativas(data) {
        return this.http.post(
            `${this.baseUrlApi}/evaluaciones/banco-preguntas/guardarActualizarPreguntaConAlternativas`,
            data
        )
    }

    generarWordByPreguntasIds(baseParams) {
        const url = `${this.baseUrl}/generarWordBancoPreguntasSeleccionadas`
        const params = new URLSearchParams({ ...baseParams })
        const fullUrl = `${url}?${params.toString()}`
        window.open(fullUrl, '_blank')
    }

    eliminarPreguntaById(id) {
        return this.http.delete(
            `${this.baseUrlApi}/evaluaciones/banco-preguntas/eliminarBancoPreguntasById/${id}`
        )
    }

    actualizarBancoPreguntas(data) {
        return this.http.patch(
            `${this.baseUrlApi}/evaluaciones/banco-preguntas/actualizarBancoPreguntas`,
            data
        )
    }

    guardarActualizarAlternativa(data) {
        return this.http.post(
            `${this.baseUrlApi}/evaluaciones/alternativas/guardarActualizarAlternativa`,
            data
        )
    }

    eliminarAlternativaById(id) {
        return this.http.delete(
            `${this.baseUrlApi}/evaluaciones/alternativas/eliminarAlternativaById/${id}`
        )
    }

    obtenerAlternativaByPreguntaId(id) {
        return this.http
            .get(
                `${this.baseUrlApi}/evaluaciones/alternativas/obtenerAlternativaByPreguntaId/${id}`
            )
            .pipe(
                map((resp: unknown) => {
                    resp['data'].map((item) => {
                        item.bAlternativaCorrecta = parseInt(
                            item.bAlternativaCorrecta,
                            10
                        )
                    })
                    return resp
                })
            )
    }

    // encabezados preguntas

    guardarActualizarPreguntas(data) {
        return this.http.post(
            `${this.baseUrlApi}/evaluaciones/encabezado-preguntas/guardarActualizarEncabezadoPregunta`,
            data
        )
    }

    obtenerEncabezadosPreguntas(params) {
        return this.http.get(
            `${this.baseUrlApi}/evaluaciones/banco-preguntas/obtenerEncabezadosPreguntas`,
            { params }
        )
    }

    eliminarEncabezadoPreguntaById(id) {
        return this.http.delete(
            `${this.baseUrlApi}/evaluaciones/encabezado-preguntas/eliminarEncabezadoPreguntaById/${id}`
        )
    }
}
