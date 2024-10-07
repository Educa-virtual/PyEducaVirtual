import { environment } from '@/environments/environment.template'
import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { map, Observable, tap } from 'rxjs'
import { mapData } from '../../evaluaciones/sub-evaluaciones/banco-preguntas/models/pregunta-data-transformer'
import { iPreguntaAula } from '../../evaluaciones/sub-evaluaciones/banco-preguntas/models/pregunta-aula.model'
import {
    mapAlternativa,
    mapEncabezado,
    mapPregunta,
} from '../utils/map-pregunta'

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
                map((data) => {
                    return data.map((item) => {
                        if (item.idEncabPregId == -1) {
                            const alternativas = item.alternativas?.map(
                                (alt) => {
                                    return mapAlternativa(alt)
                                }
                            )
                            return mapPregunta(item, alternativas)
                        } else {
                            return mapEncabezado(item)
                        }
                    })
                }),
                tap((data) => console.log(data)),
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
        return this._http.post(
            `${this.baseUrlApi}/evaluaciones/banco-preguntas/guardarActualizarPreguntaConAlternativas`,
            data
        )
    }

    eliminarPreguntaById(id) {
        return this._http.delete(
            `${this.baseUrlApi}/evaluaciones/banco-preguntas/eliminarBancoPreguntasById/${id}`
        )
    }
}
