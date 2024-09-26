import { environment } from '@/environments/environment'
import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { map } from 'rxjs'

@Injectable({
    providedIn: 'root',
})
export class ApiEvaluacionesService {
    private baseUrl = environment.backendApi
    private http = inject(HttpClient)
    constructor() {}

    obtenerTipoPreguntas() {
        return this.http.get(
            `${this.baseUrl}/evaluaciones/tipo-preguntas/obtenerTipoPreguntas`
        )
    }

    guardarActualizarPreguntaConAlternativas(data) {
        return this.http.post(
            `${this.baseUrl}/evaluaciones/banco-preguntas/guardarActualizarPreguntaConAlternativas`,
            data
        )
    }

    guardarPreguntaConAlternativas(data) {
        return this.http.post(
            `${this.baseUrl}/evaluaciones/banco-preguntas/guardarPreguntaConAlternativas`,
            data
        )
    }

    eliminarPreguntaById(id) {
        return this.http.delete(
            `${this.baseUrl}/evaluaciones/banco-preguntas/eliminarBancoPreguntasById/${id}`
        )
    }

    actualizarBancoPreguntas(data) {
        return this.http.patch(
            `${this.baseUrl}/evaluaciones/banco-preguntas/actualizarBancoPreguntas`,
            data
        )
    }

    guardarActualizarAlternativa(data) {
        return this.http.post(
            `${this.baseUrl}/evaluaciones/alternativas/guardarActualizarAlternativa`,
            data
        )
    }

    eliminarAlternativaById(id) {
        return this.http.delete(
            `${this.baseUrl}/evaluaciones/alternativas/eliminarAlternativaById/${id}`
        )
    }

    obtenerAlternativaByPreguntaId(id) {
        return this.http
            .get(
                `${this.baseUrl}/evaluaciones/alternativas/obtenerAlternativaByPreguntaId/${id}`
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
}
