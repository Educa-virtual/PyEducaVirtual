import { inject, Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { environment } from '@/environments/environment'
import { map, Observable } from 'rxjs'
//import { map, Observable, catchError, tap, throwError } from 'rxjs' //catchError, , tap, throwError

//import { mapData } from '@/app/sistema/evaluaciones/sub-evaluaciones/banco-preguntas/models/pregunta-data-transformer'

@Injectable({
    providedIn: 'root',
})
export class PreguntasEreService {
    private urlBackendApi = environment.backendApi
    //private urlBackend = environment.backend
    private http = inject(HttpClient)
    constructor() {}

    eliminarPreguntaSimple(data: {
        iPreguntaId: number
        //iEncabPregId: number,
        iEvaluacionId: string
    }): Observable<any> {
        return this.http
            .delete(`${this.urlBackendApi}/ere/preguntas/simples`, {
                body: data,
            })
            .pipe(map((resp) => resp))
    }

    eliminarPreguntaMultiple(data: {
        iEncabPregId: number
        iEvaluacionId: string
    }): Observable<any> {
        return this.http
            .delete(`${this.urlBackendApi}/ere/preguntas/multiples`, {
                body: data,
            })
            .pipe(map((resp) => resp))
    }
}
