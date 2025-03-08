import { inject, Injectable } from '@angular/core'
import { HttpClient, HttpParams } from '@angular/common/http'
import { environment } from '@/environments/environment'
import { map, Observable } from 'rxjs'

@Injectable({
    providedIn: 'root',
})
export class PreguntasReutilizablesService {
    private urlBackendApi = environment.backendApi
    private urlBackend = environment.backend
    private http = inject(HttpClient)
    constructor() {}

    obtenerPreguntas(
        iEvaluacionId,
        iCursosNivelGradId,
        params: HttpParams
    ): Observable<any> {
        return this.http
            .get(
                `${this.urlBackendApi}/ere/evaluaciones/${iEvaluacionId}/areas/${iCursosNivelGradId}/preguntas-reutilizables`,
                { params }
            )
            .pipe(map((resp) => resp['data']))
    }

    obtenerDetallePregunta(iPreguntaId: string, params): Observable<any> {
        return this.http
            .get(
                `${this.urlBackendApi}/ere/preguntas/obtenerBancoPreguntas?iPreguntaId=${iPreguntaId}`,
                params
            )
            .pipe(map((resp) => resp['data'][0]))
    }

    //{{local_url}}/ere/preguntas/obtenerBancoPreguntas?iPreguntaId=281
}
