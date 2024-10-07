import { environment } from '@/environments/environment.template'
import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { map, Observable, tap } from 'rxjs'
import { mapData } from '../../evaluaciones/sub-evaluaciones/banco-preguntas/models/pregunta-data-transformer'
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
                map((data) => {
                    return data.map((item) => {
                        const alternativas = item.alternativas?.map((alt) => {
                            return {
                                iAlternativaId: alt.iBancoAltId,
                                cAlternativaDescripcion:
                                    alt.cBancoAltDescripcion,
                                cAlternativaLetra: alt.cBancoAltLetra,
                                bAlternativaCorrecta: alt.bBancoAltRptaCorrecta,
                                cAlternativaExplicacion:
                                    alt.cBancoAltExplicacionRpta,
                            }
                        })
                        return {
                            iPreguntaId: item.iBancoId,
                            cPregunta: item.cBancoPregunta,
                            iCursoId: item.iCursoId,
                            iDocenteId: item.iDocenteId,
                            iTipoPregId: item.iTipoPregId,
                            iEncabPregId: item.idEncabPregId,
                            iPreguntaPeso: item.nBancoPuntaje,
                            cEncabPregTitulo: item.cEncabPregTitulo,
                            cEncabPregContenido: item.cTipoPregDescripcion,
                            alternativas: alternativas,
                            iHoras: item.iHoras,
                            iMinutos: item.iMinutos,
                            iSegundos: item.iSegundos,
                            cPreguntaTextoAyuda: item.cBancoTextoAyuda,
                            cTipoPregDescripcion: item.cTipoPregDescripcion,
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
