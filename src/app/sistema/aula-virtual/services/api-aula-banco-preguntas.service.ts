import { environment } from '@/environments/environment'
import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { map, Observable } from 'rxjs'
import {
    mapData,
    mapItemsBancoToEre,
} from '../../evaluaciones/sub-evaluaciones/banco-preguntas/models/pregunta-data-transformer'
import { iPreguntaAula } from '../../evaluaciones/sub-evaluaciones/banco-preguntas/models/pregunta-aula.model'

@Injectable({
    providedIn: 'root',
})
export class ApiAulaBancoPreguntasService {
    private baseUrlApi = environment.backendApi
    private _http = inject(HttpClient)

    constructor() {}

    obtenerTipoPreguntas(params?) {
        return this._http
            .get(
                `${this.baseUrlApi}/evaluaciones/tipo-preguntas/obtenerTipoPreguntas`,
                { params }
            )
            .pipe(map((resp) => resp['data']))
    }

    obtenerBancoPreguntas(params): Observable<iPreguntaAula[]> {
        return this._http
            .get(
                `${this.baseUrlApi}/evaluaciones/banco-preguntas/obtenerBancoPreguntas`,
                { params }
            )
            .pipe(
                map((resp) => resp['data']),
                // map((data) => {
                //     return mapItemsBancoToEre(data)
                // }),
                map((data) => mapData(data))
            )
    }

    // encabezados
    obtenerEncabezadosPreguntas(params) {
        return this._http
            .get(
                `${this.baseUrlApi}/evaluaciones/banco-preguntas/obtenerEncabezadosPreguntas`,
                { params }
            )
            .pipe(
                map((resp) => resp['data']),
                map((data) => {
                    return data.map((item) => {
                        return {
                            iEncabPregId: item.idEncabPregId,
                            cEncabPregTitulo: item.cEncabPregTitulo,
                            cEncabPregContenido: item.cEncabPregContenido,
                        }
                    })
                })
            )
    }

    guardarActualizarPregunta(data) {
        return this._http.post(
            `${this.baseUrlApi}/evaluaciones/banco-preguntas/guardarActualizarPregunta`,
            data
        )
    }

    // preguntas
    guardarActualizarPreguntaConAlternativas(data) {
        return this._http
            .post(
                `${this.baseUrlApi}/evaluaciones/banco-preguntas/guardarActualizarPreguntaConAlternativas`,
                data
            )
            .pipe(
                map((resp) => resp['data']),
                map((data) => {
                    return mapItemsBancoToEre(data)
                }),
                map((data) => mapData(data))
            )
    }

    eliminarPreguntaById(id) {
        return this._http.delete(
            `${this.baseUrlApi}/evaluaciones/banco-preguntas/eliminarBancoPreguntasById/${id}`
        )
    }
}
