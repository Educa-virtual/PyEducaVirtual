import { inject, Injectable } from '@angular/core'
import { environment } from '@/environments/environment.template'
import { HttpClient } from '@angular/common/http'
import { map, Observable } from 'rxjs' //catchError, , tap, throwError
//import { mapData } from '../sub-evaluaciones/banco-preguntas/models/pregunta-data-transformer'

@Injectable({
    providedIn: 'root',
})
export class ApiEspecialistasService {
    private urlBackendApi = environment.backendApi
    private urlBackend = environment.backend
    private http = inject(HttpClient)
    constructor() {}

    obtenerAreasPorEvaluacionyEspecialista(
        iEvaluacionId,
        iEspecialistaId
    ): Observable<any> {
        return this.http
            .get(
                `${this.urlBackendApi}/ere/evaluaciones/${iEvaluacionId}/especialistas/${iEspecialistaId}/areas`
            )
            .pipe(map((resp) => resp['data']))
    }
}
