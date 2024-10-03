import { environment } from '@/environments/environment.template'
import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { map, Observable } from 'rxjs'
import { mapData } from '../../evaluaciones/sub-evaluaciones/banco-preguntas/models/pregunta-data-transformer'
import { iPreguntaAula } from '../../evaluaciones/sub-evaluaciones/banco-preguntas/models/pregunta-aula.model'

@Injectable({
    providedIn: 'root',
})
export class ApiAulaBancoPreguntasService {
    private baseUrlApi = environment.backendApi
    private _http = inject(HttpClient)

    constructor() {}

    obtenerBancoPreguntas(params): Observable<iPreguntaAula[]> {
        return this._http
            .get(
                `${this.baseUrlApi}/evaluaciones/banco-preguntas/obtenerBancoPreguntas`,
                { params }
            )
            .pipe(
                map((resp) => resp['data']),
                map((data) => mapData(data)),
                map((data) => {
                    return data.map((item) => {
                        return {
                            iPreguntaId: item.iBancoId,
                            cPregunta: item.cBancoPregunta,
                            iCursoId: item.iCursoId,
                            iDocenteId: item.iDocenteId,
                            iTipoPregId: item.iTipoPregId,
                            iEncabPregId: item.idEncabPregId,
                            iPreguntaPeso: item.nBancoPuntaje,
                        } as iPreguntaAula
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
}
