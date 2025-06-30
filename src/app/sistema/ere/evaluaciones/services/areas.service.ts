import { inject, Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { environment } from '@/environments/environment'
import { map, Observable } from 'rxjs'

@Injectable({
    providedIn: 'root',
})
export class AreasService {
    private urlBackendApi = environment.backendApi
    //private urlBackend = environment.backend
    private http = inject(HttpClient)
    constructor() {}

    obtenerAreasPorEvaluacion(iEvaluacionId): Observable<any> {
        return this.http
            .get(
                `${this.urlBackendApi}/ere/evaluaciones/${iEvaluacionId}/areas`
            )
            .pipe(map((resp) => resp['data']))
    }
}
