import { environment } from '@/environments/environment'
import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { map, Observable } from 'rxjs'

@Injectable({
    providedIn: 'root',
})
export class HorasAreasService {
    private urlBackendApi = environment.backendApi
    private http = inject(HttpClient)
    constructor() {}

    obtenerHorasAreasPorEvaluacionDirectorIe(params: {
        iEvaluacionIdHashed: string
        iieeId: string
        iPersId: string
    }): Observable<any> {
        return this.http
            .get(
                `${this.urlBackendApi}/ere/evaluaciones/${params.iEvaluacionIdHashed}/instituciones-educativas/${params.iieeId}/directores/${params.iPersId}/areas/horas`
            )
            .pipe(map((resp) => resp['data']))
    }

    registrarHorasAreasPorEvaluacionDirectorIe(
        params: {
            iEvaluacionIdHashed: string
            iieeId: string
            iPersId: string
        },
        formulario: any
    ) {
        return this.http.post(
            `${this.urlBackendApi}/ere/evaluaciones/${params.iEvaluacionIdHashed}/instituciones-educativas/${params.iieeId}/directores/${params.iPersId}/areas/horas`,
            { formulario: formulario }
        )
    }
}
