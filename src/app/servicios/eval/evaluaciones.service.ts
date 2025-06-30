import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { environment } from '@/environments/environment'
import { Observable } from 'rxjs'

const baseUrl = environment.backendApi

@Injectable({
    providedIn: 'root',
})
export class EvaluacionesService {
    constructor(private http: HttpClient) {}

    guardarEvaluaciones(data): Observable<any> {
        return this.http.post(`${baseUrl}/evaluaciones/evaluaciones`, data)
    }

    obtenerEvaluacionesxiEvaluacionId(
        iEvaluacionId: string | number,
        params
    ): Observable<any> {
        return this.http.get(
            `${baseUrl}/evaluaciones/evaluaciones/${iEvaluacionId}`,
            {
                params,
            }
        )
    }

    actualizarEvaluacionesxiEvaluacionId(
        iEvaluacionId: string | number,
        params
    ): Observable<any> {
        return this.http.put(
            `${baseUrl}/evaluaciones/evaluaciones/${iEvaluacionId}`,
            params
        )
    }

    eliminarEvaluacionesxiEvaluacionId(
        iEvaluacionId: string | number,
        params
    ): Observable<any> {
        return this.http.delete(
            `${baseUrl}/evaluaciones/evaluaciones/${iEvaluacionId}`,
            {
                params,
            }
        )
    }

    obtenerReporteEstudiantesRetroalimentacion(params: {
        iIeCursoId
        iYAcadId
        iSedeId
        iSeccionId
        iNivelGradoId
        iEvaluacionId
    }) {
        return this.http.post(
            `${baseUrl}/evaluaciones/evaluaciones/obtenerReporteEstudiantesRetroalimentacion`,
            params
        )
    }
}
